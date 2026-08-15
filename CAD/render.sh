#!/usr/bin/env bash
# Render the roller blind guide with the OpenSCAD command line.
#
#   ./render.sh                      # the three segment variants, into out/
#   ./render.sh -D channel_width=32  # any extra args are passed to openscad
#
# Anything you pass is appended to every render, so parameter overrides apply
# to all three variants at once.

set -euo pipefail

here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
scad="$here/roller_blind_guide.scad"
out="$here/out"
mkdir -p "$out"

render() {
    local name="$1" start="$2" end="$3"
    shift 3
    echo "rendering $name (start=$start, end=$end)"
    openscad -o "$out/guide_$name.stl" \
        -D "joint_start=\"$start\"" \
        -D "joint_end=\"$end\"" \
        "$@" "$scad"
}

# A full-height run is one start segment, as many middles as needed, one end.
render start  none   male "$@"
render middle female male "$@"
render end    female none "$@"

# The short pair of stubs for dialling in the joint clearance.
echo "rendering fit_test"
openscad -o "$out/guide_fit_test.stl" -D fit_test_piece=true "$@" "$scad"

echo "STLs written to $out"
