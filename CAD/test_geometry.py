#!/usr/bin/env python3
"""Geometric checks on the rendered roller blind guide.

Renders the segment variants with OpenSCAD and checks that each one is a
sensible printable solid, and that a male tab actually drops into the female
socket of the next segment without interference.

Usage: python3 test_geometry.py
"""

import math
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

import trimesh

HERE = Path(__file__).resolve().parent
SCAD = HERE / "roller_blind_guide.scad"

# Must match the defaults in the .scad file.
WALL_THICKNESS = 8.0
CHANNEL_WIDTH = 25.0
SEGMENT_LENGTH = 200.0
PROFILE_DEPTH = 25.0
BACK_THICKNESS = 4.0
MAGNET_DIAMETER = 6.0
MAGNET_DEPTH = 3.2
MAGNET_SPACING = 40.0
MAGNET_END_MARGIN = 20.0
JOINT_DEPTH = 12.0
JOINT_CLEARANCE = 0.2

OVERALL_WIDTH = 2 * WALL_THICKNESS + CHANNEL_WIDTH

failures = []
checks = 0


def check(condition, message):
    global checks
    checks += 1
    if condition:
        print(f"  ok   {message}")
    else:
        print(f"  FAIL {message}")
        failures.append(message)


def render(out_dir, name, **overrides):
    """Render the .scad to an STL and load it."""
    out = Path(out_dir) / f"{name}.stl"
    cmd = ["openscad", "-o", str(out)]
    for key, value in overrides.items():
        if isinstance(value, bool):
            literal = "true" if value else "false"
        elif isinstance(value, str):
            literal = f'"{value}"'
        else:
            literal = str(value)
        cmd += ["-D", f"{key}={literal}"]
    cmd.append(str(SCAD))

    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        raise SystemExit(f"openscad failed for {name}:\n{result.stderr}")
    if "WARNING" in result.stderr or "ERROR" in result.stderr:
        offending = [
            line for line in result.stderr.splitlines()
            if "WARNING" in line or "ERROR" in line
        ]
        check(False, f"{name} rendered without warnings (got: {offending})")
    return trimesh.load_mesh(out)


def main():
    with tempfile.TemporaryDirectory() as tmp:
        print("Rendering variants...")
        start = render(tmp, "start", joint_start="none", joint_end="male")
        middle = render(tmp, "middle", joint_start="female", joint_end="male")
        end = render(tmp, "end", joint_start="female", joint_end="none")
        plain = render(tmp, "plain", joint_start="none", joint_end="none")
        no_magnets = render(tmp, "no_magnets", joint_start="none",
                            joint_end="none", magnets_enabled=False)

        print("\nSolidity:")
        for name, mesh in [("start", start), ("middle", middle),
                           ("end", end), ("plain", plain)]:
            check(mesh.is_watertight, f"{name} is watertight")
            check(mesh.is_volume, f"{name} is a valid volume")
            check(mesh.body_count == 1, f"{name} is a single connected body")
            check(mesh.volume > 0, f"{name} has positive volume")

        print("\nOverall dimensions:")
        ext = plain.extents
        check(math.isclose(ext[0], OVERALL_WIDTH, abs_tol=0.01),
              f"plain width is 2*wall+channel = {OVERALL_WIDTH} (got {ext[0]:.2f})")
        check(math.isclose(ext[1], SEGMENT_LENGTH, abs_tol=0.01),
              f"plain length is segment_length = {SEGMENT_LENGTH} (got {ext[1]:.2f})")
        check(math.isclose(ext[2], PROFILE_DEPTH, abs_tol=0.01),
              f"plain depth is profile_depth = {PROFILE_DEPTH} (got {ext[2]:.2f})")

        check(math.isclose(middle.extents[1], SEGMENT_LENGTH + JOINT_DEPTH, abs_tol=0.01),
              f"a middle segment occupies segment_length + joint_depth on the bed "
              f"(got {middle.extents[1]:.2f})")

        print("\nPrint orientation:")
        check(math.isclose(plain.bounds[0][2], 0.0, abs_tol=0.01),
              "the flat back sits on the bed at z=0")

        print("\nMagnet pockets:")
        expected_count = 2 * (math.floor(
            (SEGMENT_LENGTH - 2 * MAGNET_END_MARGIN) / MAGNET_SPACING) + 1)
        pocket_volume = no_magnets.volume - plain.volume
        cylinder_volume = expected_count * math.pi * (MAGNET_DIAMETER / 2) ** 2 * MAGNET_DEPTH
        check(pocket_volume > 0, "enabling magnets removes material")
        # The teardrop point adds a little over a plain cylinder.
        check(cylinder_volume <= pocket_volume <= cylinder_volume * 1.5,
              f"removed volume matches {expected_count} pockets "
              f"({pocket_volume:.0f} mm3 vs {cylinder_volume:.0f} mm3 of plain cylinder)")

        # If only one wall had been pocketed, the part would no longer be
        # symmetric about the centre of the channel.
        mirrored = plain.copy()
        mirrored.apply_translation([-OVERALL_WIDTH / 2, 0, 0])
        mirrored.apply_scale([-1, 1, 1])
        mirrored.apply_translation([OVERALL_WIDTH / 2, 0, 0])
        symmetric = trimesh.boolean.intersection([plain, mirrored], engine="manifold")
        check(math.isclose(symmetric.volume, plain.volume, rel_tol=1e-4),
              "pockets are cut into both walls (the part is left-right symmetric)")

        pocket_bounds_ok = MAGNET_DEPTH < WALL_THICKNESS
        check(pocket_bounds_ok, "pockets stay inside the walls at default sizes")

        print("\nJoint mating (a start segment feeding into an end segment):")
        # Assembled pitch is segment_length: the tab of one segment fills the
        # socket of the next, so the pair spans exactly two segment lengths.
        mated = end.copy()
        mated.apply_translation([0, SEGMENT_LENGTH, 0])
        overlap = trimesh.boolean.intersection([start, mated], engine="manifold")
        check(overlap.volume < 1.0,
              f"tab and socket do not interfere when assembled "
              f"(overlap {overlap.volume:.3f} mm3)")

        combined = trimesh.boolean.union([start, mated], engine="manifold")
        check(math.isclose(combined.extents[1], 2 * SEGMENT_LENGTH, abs_tol=0.05),
              f"an assembled pair spans exactly two segment lengths "
              f"(got {combined.extents[1]:.2f})")
        check(combined.body_count == 1,
              "the assembled pair is one interlocked body, not two loose pieces")

        # The fit should be snug: pushing the segments 0.5mm closer than
        # nominal must collide, or the socket is far too loose.
        too_close = end.copy()
        too_close.apply_translation([0, SEGMENT_LENGTH - 0.5, 0])
        collision = trimesh.boolean.intersection([start, too_close], engine="manifold")
        check(collision.volume > 1.0,
              f"the joint is snug - a 0.5mm overshoot collides "
              f"(overlap {collision.volume:.1f} mm3)")

        print("\nParametric behaviour:")
        wide = render(tmp, "wide", channel_width=40, segment_length=120,
                      magnets_enabled=False, joint_start="none", joint_end="none")
        check(math.isclose(wide.extents[0], 2 * WALL_THICKNESS + 40, abs_tol=0.01),
              f"channel_width=40 widens the part (got {wide.extents[0]:.2f})")
        check(math.isclose(wide.extents[1], 120, abs_tol=0.01),
              f"segment_length=120 shortens the part (got {wide.extents[1]:.2f})")

    print(f"\n{checks - len(failures)}/{checks} checks passed")
    if failures:
        print("FAILURES:")
        for failure in failures:
            print(f"  - {failure}")
        return 1
    return 0


if __name__ == "__main__":
    if shutil.which("openscad") is None:
        raise SystemExit("openscad not found on PATH")
    sys.exit(main())
