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

# The top cover: a rib for each side, and the cover sections that span between
# them. A one-section cover is tongued at both ends; longer runs need male and
# female ends in the middle, exactly as the guide does.
# The ribs are a chiral pair: the groove has to face the middle of the window
# at both ends, so one is mirrored.
for hand in left right; do
    echo "rendering pelmet_rib_$hand"
    openscad -o "$out/pelmet_rib_$hand.stl" -D 'part="pelmet side"' \
        -D "rib_hand=\"$hand\"" "$@" "$scad"
done

render_cover() {
    local name="$1" start="$2" finish="$3"
    shift 3
    echo "rendering $name (start=$start, end=$finish)"
    openscad -o "$out/$name.stl" -D 'part="cover"' \
        -D "cover_start=\"$start\"" \
        -D "cover_end=\"$finish\"" \
        "$@" "$scad"
}

render_cover cover_single tongue tongue "$@"
render_cover cover_left   tongue male   "$@"
render_cover cover_middle female male   "$@"
render_cover cover_right  female tongue "$@"

echo "STLs written to $out"
