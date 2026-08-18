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

# Pelmet defaults, likewise from the .scad.
INTERNAL_DEPTH = 50.0
INTERNAL_HEIGHT = 100.0
RIB_WIDTH = 8.0
RIB_THICKNESS = 8.0
FOOT_LENGTH = 25.0
COVER_THICKNESS = 4.0
GROOVE_DEPTH = 6.0
COVER_SECTION_WIDTH = 180.0
LIP_DEPTH = 25.0
TOP_ANGLE = 45.0
SCREW_SPACING = 100.0
SCREW_END_MARGIN = 20.0
PELMET_CUT_OFFSET = 0.0

RIB_BAND = COVER_THICKNESS + RIB_WIDTH
# mw_plate_1 lifts the rib clear of the bed, so the inside corner of the
# pelmet sits this far up the Y axis in the exported mesh.
RIB_ORIGIN_Y = FOOT_LENGTH + JOINT_DEPTH
# The rib is cut off here so it clears the brackets holding the mechanism to
# the window head: nothing of the face may survive on the window side of it.
CUT_X = OVERALL_WIDTH + PELMET_CUT_OFFSET


def envelope(style):
    """Depth and height the chosen profile needs to clear the mechanism."""
    if style == "angled":
        t = math.tan(math.radians(TOP_ANGLE))
        return INTERNAL_DEPTH + INTERNAL_HEIGHT / t, INTERNAL_HEIGHT + INTERNAL_DEPTH * t
    if style == "curved":
        r = math.hypot(INTERNAL_DEPTH, INTERNAL_HEIGHT)
        return r, r
    return INTERNAL_DEPTH, INTERNAL_HEIGHT


def rib_top(style):
    """Height of the rib's face, once the cut has taken the top off it.

    A straight profile keeps its top run, so the cut costs it no height. The
    other two are sliced partway down, so their top is wherever the outer edge
    of the band crosses the cut.
    """
    env_d, env_h = envelope(style)
    if style == "angled":
        t = math.radians(TOP_ANGLE)
        return env_h - CUT_X + RIB_BAND / math.cos(t)
    if style == "curved":
        return math.sqrt((env_h + RIB_BAND) ** 2 - CUT_X ** 2)
    return env_h + RIB_BAND


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


def slab_volume(mesh, z0, z1):
    """Volume of the mesh between two heights - a stand-in for cross-section area."""
    lo, hi = mesh.bounds
    box = trimesh.creation.box(
        extents=[hi[0] - lo[0] + 10, hi[1] - lo[1] + 10, z1 - z0])
    box.apply_translation([(lo[0] + hi[0]) / 2, (lo[1] + hi[1]) / 2, (z0 + z1) / 2])
    return trimesh.boolean.intersection([mesh, box], engine="manifold").volume


def section_volume(mesh, x0, x1, z0, z1):
    """Volume of the part of a mesh inside a window of x and z."""
    lo, hi = mesh.bounds
    box = trimesh.creation.box(extents=[x1 - x0, hi[1] - lo[1] + 10, z1 - z0])
    box.apply_translation([(x0 + x1) / 2, (lo[1] + hi[1]) / 2, (z0 + z1) / 2])
    return trimesh.boolean.intersection([mesh, box], engine="manifold").volume


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




def pelmet_checks(tmp):
    """The top cover: the ribs that plug into the guides, and the panel."""
    print("\nPelmet - every style:")
    ribs, covers = {}, {}
    for style in ("straight", "angled", "curved"):
        ribs[style] = render(tmp, f"rib_{style}", part="pelmet side", top_style=style)
        covers[style] = render(tmp, f"cover_{style}", part="cover", top_style=style)
        for name, mesh in ((f"{style} rib", ribs[style]), (f"{style} cover", covers[style])):
            check(mesh.is_watertight and mesh.body_count == 1,
                  f"{name} is one watertight solid")

        env_d, env_h = envelope(style)
        rib = ribs[style]
        check(math.isclose(rib.extents[0], env_d + RIB_BAND, abs_tol=0.05),
              f"{style} rib is as deep as the profile needs "
              f"({rib.extents[0]:.2f} vs {env_d + RIB_BAND:.2f})")
        # Curved is a touch under, because the arc is drawn as facets.
        expected_height = rib_top(style) + RIB_ORIGIN_Y
        check(math.isclose(rib.extents[1], expected_height, abs_tol=0.3),
              f"{style} rib is as tall as the profile needs once cut "
              f"({rib.extents[1]:.2f} vs {expected_height:.2f})")

        # The whole point of the part: the mechanism has to fit inside it.
        clear = trimesh.creation.box(
            extents=[INTERNAL_DEPTH, INTERNAL_HEIGHT, RIB_THICKNESS + 2])
        clear.apply_translation([INTERNAL_DEPTH / 2,
                                 RIB_ORIGIN_Y + INTERNAL_HEIGHT / 2,
                                 RIB_THICKNESS / 2])
        intruding = trimesh.boolean.intersection([rib, clear], engine="manifold")
        check(intruding.volume < 1.0,
              f"{style} rib leaves the {INTERNAL_DEPTH:.0f}x{INTERNAL_HEIGHT:.0f} "
              f"mechanism space clear (intrusion {intruding.volume:.2f} mm3)")

        check(math.isclose(rib.bounds[0][2], 0.0, abs_tol=0.01) and
              math.isclose(rib.extents[2], PROFILE_DEPTH, abs_tol=0.01),
              f"{style} rib lies flat on the bed, foot boss upwards")

    print("\nThe rib is cut clear of the mechanism's brackets:")
    for style in ("straight", "angled", "curved"):
        rib = ribs[style]
        # Everything on the window side of the cut, above the bottom leg, has
        # to be gone - that is the whole point of the change.
        above = trimesh.creation.box(extents=[CUT_X, 400, RIB_THICKNESS + 2])
        above.apply_translation([CUT_X / 2, RIB_ORIGIN_Y + 200, RIB_THICKNESS / 2])
        left_over = trimesh.boolean.intersection([rib, above], engine="manifold")
        check(left_over.volume < 1.0,
              f"{style} rib has nothing above the guide "
              f"({left_over.volume:.2f} mm3 left of the cut)")

        # The bottom leg does survive, or the face would not reach the joint.
        leg = trimesh.creation.box(extents=[CUT_X, RIB_BAND, RIB_THICKNESS])
        leg.apply_translation([CUT_X / 2, RIB_ORIGIN_Y - RIB_BAND / 2, RIB_THICKNESS / 2])
        check(trimesh.boolean.intersection([rib, leg], engine="manifold").volume > 100,
              f"{style} rib keeps its bottom leg back to the guide")

    # A straight rib is now an L with only the return the cut leaves behind.
    straight_return = INTERNAL_DEPTH + COVER_THICKNESS + RIB_WIDTH - CUT_X
    top = trimesh.creation.box(extents=[400, RIB_BAND, RIB_THICKNESS])
    top.apply_translation([200, RIB_ORIGIN_Y + INTERNAL_HEIGHT + RIB_BAND / 2,
                           RIB_THICKNESS / 2])
    run = trimesh.boolean.intersection([ribs["straight"], top], engine="manifold")
    check(math.isclose(run.extents[0], straight_return, abs_tol=0.05),
          f"the straight rib's top return is only what the cut leaves "
          f"({run.extents[0]:.2f} vs {straight_return:.2f}mm)")

    print("\nReversing and handedness:")
    reversed_rib = render(tmp, "rib_reversed", part="pelmet side", internal_depth=-INTERNAL_DEPTH)
    right_rib = render(tmp, "rib_right", part="pelmet side", rib_hand="right")
    plain_rib = ribs["straight"]

    check(math.isclose(reversed_rib.volume, plain_rib.volume, rel_tol=1e-6),
          "a reversed pelmet is the same part, mirrored")
    # Mirrored about the centre of the guide, which is what leaves the foot and
    # the dovetail untouched.
    check(math.isclose(reversed_rib.bounds[0][0], OVERALL_WIDTH - plain_rib.bounds[1][0],
                       abs_tol=0.01) and
          math.isclose(reversed_rib.bounds[1][0], OVERALL_WIDTH - plain_rib.bounds[0][0],
                       abs_tol=0.01),
          f"it is mirrored about the guide's centreline "
          f"(x {reversed_rib.bounds[0][0]:.2f}..{reversed_rib.bounds[1][0]:.2f})")

    # The two controls compose: they are the same mirror, named for the two
    # different reasons you would reach for it.
    check(math.isclose(right_rib.volume, reversed_rib.volume, rel_tol=1e-6) and
          all(math.isclose(a, b, abs_tol=0.01)
              for a, b in zip(right_rib.extents, reversed_rib.extents)),
          "a right-hand rib is congruent to a reversed left-hand one")

    reversed_cover = render(tmp, "cover_reversed", part="cover",
                            internal_depth=-INTERNAL_DEPTH)
    check(math.isclose(reversed_cover.volume, covers["straight"].volume, rel_tol=1e-6),
          "the cover reverses with the pelmet, so the pair still match")

    print("\nPelmet meets the guide:")
    # The top guide segment is printed with a socket at its far end; the rib's
    # tab drops into it. This is the check that the two halves of the system
    # actually fit each other.
    top_guide = render(tmp, "guide_topped", joint_start="female", joint_end="female")
    rib = ribs["straight"].copy()
    rib.apply_translation([0, SEGMENT_LENGTH - JOINT_DEPTH, 0])
    overlap = trimesh.boolean.intersection([top_guide, rib], engine="manifold")
    check(overlap.volume < 1.0,
          f"the rib's tab drops into the guide's socket without interference "
          f"(overlap {overlap.volume:.3f} mm3)")

    joined = trimesh.boolean.union([top_guide, rib], engine="manifold")
    check(joined.body_count == 1, "guide and rib make one interlocked assembly")

    tight = ribs["straight"].copy()
    tight.apply_translation([0, SEGMENT_LENGTH - JOINT_DEPTH - 0.5, 0])
    check(trimesh.boolean.intersection([top_guide, tight], engine="manifold").volume > 1.0,
          "that joint is snug too - a 0.5mm overshoot collides")

    # The right-hand rib is the mirror image, so its tab has to mate as well.
    right = right_rib.copy()
    right.apply_translation([0, SEGMENT_LENGTH - JOINT_DEPTH, 0])
    check(trimesh.boolean.intersection([top_guide, right], engine="manifold").volume < 1.0,
          "the right-hand rib's tab drops into the same guide socket")

    print("\nCover meets the rib:")
    for style in ("straight", "angled", "curved"):
        cover = covers[style].copy()
        # The tongue reaches into the groove, so the cover starts short of the
        # rib's inner face by the depth of the groove.
        cover.apply_translation([0, RIB_ORIGIN_Y, RIB_THICKNESS - GROOVE_DEPTH])
        clash = trimesh.boolean.intersection([ribs[style], cover], engine="manifold")
        check(clash.volume < 1.0,
              f"{style} cover's tongue slides into the rib's groove "
              f"(overlap {clash.volume:.3f} mm3)")
        seated = trimesh.boolean.union([ribs[style], cover], engine="manifold")
        check(seated.body_count == 1,
              f"{style} cover and rib touch - the shoulder butts the rib face")

    print("\nThe tongue is cut to suit both shapes:")
    cover = covers["straight"]
    # Behind the cut there is no rib, so the cover must stay full thickness
    # there - the same as it is out in the middle of the section.
    behind_end = section_volume(cover, 0, CUT_X, 1, GROOVE_DEPTH - 1)
    behind_mid = section_volume(cover, 0, CUT_X, 60, GROOVE_DEPTH - 1 + 59)
    check(math.isclose(behind_end, behind_mid, rel_tol=1e-3),
          f"behind the cut the cover's end is full thickness "
          f"({behind_end:.1f} vs {behind_mid:.1f} mm3)")

    ahead_end = section_volume(cover, CUT_X, 400, 1, GROOVE_DEPTH - 1)
    ahead_mid = section_volume(cover, CUT_X, 400, 60, GROOVE_DEPTH - 1 + 59)
    check(ahead_end < ahead_mid * 0.9,
          f"ahead of the cut it steps down to the tongue "
          f"({ahead_end:.1f} vs {ahead_mid:.1f} mm3)")

    print("\nCover sections join to each other:")
    left = render(tmp, "cover_left", part="cover",
                  cover_start="tongue", cover_end="male")
    right = render(tmp, "cover_right", part="cover",
                   cover_start="female", cover_end="tongue")
    check(math.isclose(left.extents[2], COVER_SECTION_WIDTH + JOINT_DEPTH, abs_tol=0.05),
          f"a male-ended section takes joint_depth more room than its width "
          f"({left.extents[2]:.2f})")

    mated = right.copy()
    mated.apply_translation([0, 0, COVER_SECTION_WIDTH])
    check(trimesh.boolean.intersection([left, mated], engine="manifold").volume < 1.0,
          "cover sections mate without interference")
    pair = trimesh.boolean.union([left, mated], engine="manifold")
    check(pair.body_count == 1, "joined cover sections are one body")
    check(math.isclose(pair.extents[2], 2 * COVER_SECTION_WIDTH, abs_tol=0.05),
          f"a joined pair spans exactly two section widths ({pair.extents[2]:.2f})")

    close = right.copy()
    close.apply_translation([0, 0, COVER_SECTION_WIDTH - 0.5])
    check(trimesh.boolean.intersection([left, close], engine="manifold").volume > 1.0,
          "the cover joint is snug - a 0.5mm overshoot collides")

    print("\nCover lip:")
    plain = render(tmp, "cover_plain", part="cover", cover_start="plain",
                   cover_end="plain")
    no_screws = render(tmp, "cover_no_screws", part="cover", cover_start="plain",
                       cover_end="plain", screw_holes_enabled=False)
    check(no_screws.volume > plain.volume, "the lip carries screw holes")

    expected = math.floor(
        (COVER_SECTION_WIDTH - 2 * SCREW_END_MARGIN) / SCREW_SPACING) + 1
    hole = math.pi * (4.2 / 2) ** 2 * COVER_THICKNESS
    removed = no_screws.volume - plain.volume
    check(hole * expected <= removed <= hole * expected * 2.5,
          f"the lip has {expected} countersunk holes "
          f"({removed:.0f} mm3 removed)")

    taped = render(tmp, "cover_taped", part="cover", cover_start="plain",
                   cover_end="plain", tape_recess_enabled=True)
    check(taped.volume < plain.volume,
          f"the same tape recess option works on the lip "
          f"({plain.volume - taped.volume:.0f} mm3 removed)")


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

        print("\nPrinter clearances:")
        # All of the gap belongs to the socket, so changing the clearance must
        # not alter the tab - otherwise both halves would need re-tuning.
        loose_tab = render(tmp, "loose_tab", joint_start="none", joint_end="male",
                           joint_clearance=0.6, joint_corner_relief=1.0)
        check(math.isclose(loose_tab.volume, start.volume, rel_tol=1e-6),
              "clearance settings leave the male tab untouched")

        sharp = render(tmp, "sharp", joint_start="female", joint_end="none",
                       joint_corner_relief=0, joint_first_layer_relief=0)
        no_corner = render(tmp, "no_corner", joint_start="female", joint_end="none",
                           joint_corner_relief=0)
        # sharp has both reliefs off; no_corner adds only the first-layer
        # relief; end (the default) adds the corner relief on top of that.
        check(no_corner.volume < sharp.volume,
              f"first-layer relief opens the bottom of the socket "
              f"({sharp.volume - no_corner.volume:.0f} mm3 removed)")
        check(end.volume < no_corner.volume,
              f"corner relief clears the inside corners "
              f"({no_corner.volume - end.volume:.0f} mm3 removed)")

        # The first-layer relief must reach the first layers and no further.
        # Comparing the same slab across two renders isolates it - comparing
        # two heights of one render would just measure the edge fillet.
        low_relieved = slab_volume(no_corner, 0.2, 0.4)
        low_sharp = slab_volume(sharp, 0.2, 0.4)
        high_relieved = slab_volume(no_corner, 2.9, 3.1)
        high_sharp = slab_volume(sharp, 2.9, 3.1)
        check(low_relieved < low_sharp,
              f"the relief opens up the first layers "
              f"({low_sharp - low_relieved:.2f} mm3 removed from the bottom slab)")
        check(math.isclose(high_relieved, high_sharp, rel_tol=1e-6),
              "the relief stops above the first layers, leaving the fit unchanged higher up")

        # A joint cut with sharp corners still has to mate, so the relief is
        # insurance rather than something the nominal geometry depends on.
        sharp_mated = sharp.copy()
        sharp_mated.apply_translation([0, SEGMENT_LENGTH, 0])
        sharp_overlap = trimesh.boolean.intersection([start, sharp_mated], engine="manifold")
        check(sharp_overlap.volume < 1.0,
              "the joint still mates with every relief switched off")

        print("\nFit test piece:")
        fit = render(tmp, "fit", fit_test_piece=True)
        check(fit.body_count == 2, "the fit test prints two separate stubs")
        check(math.isclose(fit.extents[0], 2 * OVERALL_WIDTH + 10, abs_tol=0.01),
              f"the two stubs sit side by side (got {fit.extents[0]:.2f} wide)")
        check(fit.extents[1] < SEGMENT_LENGTH / 2,
              f"the fit test is much shorter than a real segment "
              f"(got {fit.extents[1]:.2f}mm)")

        print("\nParametric behaviour:")
        wide = render(tmp, "wide", channel_width=40, segment_length=120,
                      magnets_enabled=False, joint_start="none", joint_end="none")
        check(math.isclose(wide.extents[0], 2 * WALL_THICKNESS + 40, abs_tol=0.01),
              f"channel_width=40 widens the part (got {wide.extents[0]:.2f})")
        check(math.isclose(wide.extents[1], 120, abs_tol=0.01),
              f"segment_length=120 shortens the part (got {wide.extents[1]:.2f})")

        pelmet_checks(tmp)

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
