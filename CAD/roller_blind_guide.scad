// Parametric Roller Blind Guide
//
// A U-channel that captures the edge of a roller blind: it blocks the light
// that bleeds down the sides of the blind, and stops the fabric flapping when
// the window is open.
//
// The guide prints in segments that interlock with a jigsaw (dovetail) joint,
// so it can run the full height of a window on a small printer bed. Optional
// pockets on the inner walls take glued-in disc magnets, so the guide doubles
// as a magnetic strip.
//
// Print orientation: as modelled. The flat back sits on the bed and the
// channel opens upwards, so nothing needs supports.
//
// Written for OpenSCAD 2021.01 / MakerWorld Parametric Model Maker.
// Self-contained: no include<>, no use<>, no external libraries.

/* [Main dimensions] */

// Width of each side wall, seen from the front (sketch: A)
wall_thickness = 8;     // [2:0.5:30]
// Width of the slot the blind runs in - blind width plus a little slack (sketch: B)
channel_width = 25;     // [5:0.5:120]
// Length of one printed segment along the window height (sketch: C)
segment_length = 200;   // [40:1:400]
// How far the guide stands off the window - total depth of the walls (sketch: D)
profile_depth = 25;     // [5:0.5:80]
// Thickness of the flat back that the walls sit on (sketch: F)
back_thickness = 4;     // [1:0.2:20]
// Rounding on the outer edges. 0 = sharp corners
edge_fillet = 1;        // [0:0.2:5]

/* [Magnets] */

// Add magnet pockets to the inner faces of both walls
magnets_enabled = true;
// Magnet diameter - the pocket is cut to this size (sketch: H)
magnet_diameter = 6;    // [3:0.5:30]
// Magnet thickness - how deep the pocket is cut into the wall
magnet_depth = 3.2;     // [1:0.1:12]
// Distance between magnet centres along the guide (sketch: G)
magnet_spacing = 40;    // [10:1:200]
// Keep this much clear at each end before the first magnet
magnet_end_margin = 20; // [0:1:100]
// Point the top of each pocket so it prints without supports. Turn off for a plain round pocket
magnet_teardrop = true;

/* [Jigsaw joint] */

// Joint at the start of the segment (the y=0 end)
joint_start = "female";  // [none, female, male]
// Joint at the far end of the segment
joint_end = "male";      // [none, female, male]
// How far the tab reaches out of the end face
joint_depth = 12;        // [4:0.5:60]
// Waist of the tab, as a fraction of the full width - smaller locks harder
joint_neck_fraction = 0.45;  // [0.2:0.01:0.9]
// Widest part of the tab, as a fraction of the full width. Must exceed the neck
joint_head_fraction = 0.70;  // [0.3:0.01:0.95]
// Gap cut around the socket so the tab actually drops in. Raise it if the joint is tight
joint_clearance = 0.2;   // [0:0.05:1]

/* [Mounting] */

// Countersunk screw holes through the flat back
screw_holes_enabled = true;
// Clearance hole for the screw shank - 4.2 suits a 4mm screw
screw_hole_diameter = 4.2;   // [2:0.1:10]
// Screw head diameter - the countersink is cut to this
screw_head_diameter = 8.2;   // [3:0.1:20]
// Distance between screw holes along the guide
screw_spacing = 100;         // [20:1:400]
// Keep this much clear at each end, so no screw lands in a joint
screw_end_margin = 20;       // [0:1:100]
// Recess along the back for double-sided mounting tape
tape_recess_enabled = false;
// Width of the tape recess - 19 suits standard 19mm VHB tape
tape_recess_width = 19;      // [5:0.5:100]
// Depth of the tape recess. Keep it well under the back thickness
tape_recess_depth = 1;       // [0.2:0.1:5]

/* [Quality] */

// Facets per circle. Raise for a smoother render, lower for a faster one
resolution = 64;             // [16:8:128]

/* [Hidden] */

$fn = resolution;

// Small overlap used to keep boolean operations from leaving zero-thickness faces.
eps = 0.01;

// Derived geometry --------------------------------------------------------

overall_width = 2 * wall_thickness + channel_width;
channel_depth = profile_depth - back_thickness;
centre_x = overall_width / 2;

// Height at which magnets sit: centred on the exposed part of the wall.
magnet_z = back_thickness + channel_depth / 2;

// Magnet pockets are laid out from the end margin inwards. The count is
// clamped to at least one so a short segment still gets a magnet.
magnet_span = segment_length - 2 * magnet_end_margin;
magnet_count = magnet_span < 0 ? 1 : floor(magnet_span / magnet_spacing) + 1;
// Centre the row of magnets in whatever length is left over.
magnet_first_y = (segment_length - (magnet_count - 1) * magnet_spacing) / 2;

// Screw holes are laid out the same way.
screw_span = segment_length - 2 * screw_end_margin;
screw_count = screw_span < 0 ? 1 : floor(screw_span / screw_spacing) + 1;
screw_first_y = (segment_length - (screw_count - 1) * screw_spacing) / 2;
// A 90 degree countersink: the cone is as deep as the head is wider than the shank.
countersink_depth = (screw_head_diameter - screw_hole_diameter) / 2;

// The fillet is applied by shrinking and re-growing the 2D profile, so it can
// only be as large as the thinnest feature will tolerate.
fillet_limit = min(wall_thickness, back_thickness, channel_width) / 2;
fillet = min(edge_fillet, max(fillet_limit - eps, 0));

joint_neck = overall_width * joint_neck_fraction / 2;
joint_head = overall_width * joint_head_fraction / 2;

// Warnings ----------------------------------------------------------------
// echo() rather than assert(), so a bad combination still renders something
// in the MakerWorld customizer instead of failing outright.

if (back_thickness >= profile_depth)
    echo("WARNING: back_thickness must be less than profile_depth - there is no channel left for the blind.");
if (magnets_enabled && magnet_depth >= wall_thickness)
    echo("WARNING: magnet_depth is at least wall_thickness - the pockets will break through the outside of the walls.");
if (magnets_enabled && magnet_diameter >= magnet_spacing)
    echo("WARNING: magnet_diameter is at least magnet_spacing - the pockets will run into each other.");
if (magnets_enabled && magnet_diameter >= channel_depth)
    echo("WARNING: magnet_diameter is at least the channel depth - the pockets will break out of the top of the walls.");
if (joint_head_fraction <= joint_neck_fraction)
    echo("WARNING: joint_head_fraction must exceed joint_neck_fraction, or the joint will not lock.");
if (joint_depth >= segment_length / 2)
    echo("WARNING: joint_depth is at least half of segment_length - the joints will meet in the middle.");
if (screw_holes_enabled && countersink_depth >= back_thickness)
    echo("WARNING: the screw head is too much wider than the shank - the countersink is deeper than the back is thick.");
if (screw_holes_enabled && screw_head_diameter >= channel_width)
    echo("WARNING: screw_head_diameter is at least channel_width - the countersinks will cut into the walls.");
if (tape_recess_enabled && tape_recess_depth >= back_thickness)
    echo("WARNING: tape_recess_depth is at least back_thickness - the recess will cut straight through the back.");
if (tape_recess_enabled && tape_recess_width >= overall_width)
    echo("WARNING: tape_recess_width is at least the overall width - the recess will cut through the walls.");

// 2D profiles -------------------------------------------------------------

// The U cross-section, drawn in X (width) and Y (which becomes depth once the
// profile is stood up). Sharp corners; rounding is added separately.
module profile_square_2d() {
    polygon([
        [0, 0],
        [overall_width, 0],
        [overall_width, profile_depth],
        [overall_width - wall_thickness, profile_depth],
        [overall_width - wall_thickness, back_thickness],
        [wall_thickness, back_thickness],
        [wall_thickness, profile_depth],
        [0, profile_depth]
    ]);
}

// The same profile with every corner rounded: grow to round the inside
// corners, shrink to round the outside ones, then grow back to full size.
module profile_2d() {
    if (fillet > 0)
        offset(r = fillet) offset(r = -2 * fillet) offset(r = fillet) profile_square_2d();
    else
        profile_square_2d();
}

// The jigsaw tab outline, drawn flat in X (width) and Y (along the guide),
// starting at y and reaching joint_depth further on. The waist near the base
// is what stops a joined pair pulling apart lengthways.
module joint_profile_2d(y) {
    polygon([
        [centre_x - joint_neck, y],
        [centre_x - joint_neck, y + joint_depth * 0.25],
        [centre_x - joint_head, y + joint_depth * 0.55],
        [centre_x - joint_head * 0.85, y + joint_depth],
        [centre_x + joint_head * 0.85, y + joint_depth],
        [centre_x + joint_head, y + joint_depth * 0.55],
        [centre_x + joint_neck, y + joint_depth * 0.25],
        [centre_x + joint_neck, y]
    ]);
}

// A magnet pocket seen face-on: a circle, optionally drawn out to a point so
// that its upper edge is self-supporting when printed on a vertical wall.
// The point is drawn towards -X here; the pocket is rotated into place later.
module magnet_profile_2d() {
    r = magnet_diameter / 2;
    if (magnet_teardrop)
        hull() {
            circle(r = r);
            translate([-r * 1.4, 0]) circle(r = r * 0.05);
        }
    else
        circle(r = r);
}

// Solids ------------------------------------------------------------------

// The U profile stood upright and run along Y, from y for a length of len.
module profile_solid(y, len) {
    translate([0, y + len, 0])
        rotate([90, 0, 0])
            linear_extrude(height = len)
                profile_2d();
}

// Swaps a feature between the two ends by mirroring it along the length, so
// the tab and the socket only have to be modelled once each.
module flip() {
    translate([0, segment_length, 0]) mirror([0, 1, 0]) children();
}

// The tab that sticks out past the far end face. It is trimmed to the U
// profile, so the tab carries the same walls and back as the rest of the guide.
module joint_tab_at_finish() {
    intersection() {
        profile_solid(segment_length - eps, joint_depth + eps);
        translate([0, 0, -eps])
            linear_extrude(height = profile_depth + 2 * eps)
                joint_profile_2d(segment_length - eps);
    }
}

// The socket the tab drops into, at the near end. Cut through the full depth
// of the profile, because segments are assembled by lowering one onto the
// other rather than sliding them together lengthways - a waisted tab cannot
// slide in. The clearance is applied here only, so the tab prints at size.
module joint_socket_at_start() {
    translate([0, 0, -eps])
        linear_extrude(height = profile_depth + 2 * eps)
            offset(delta = joint_clearance)
                joint_profile_2d(-joint_clearance);
}

// Magnet pockets on the inner face of the left wall.
module magnet_pockets_left() {
    // Rotating the face-on profile about Y turns the extrusion into the wall
    // and stands the teardrop's point up, where the overhang would otherwise be.
    for (i = [0 : magnet_count - 1])
        translate([wall_thickness - magnet_depth,
                   magnet_first_y + i * magnet_spacing,
                   magnet_z])
            rotate([0, 90, 0])
                linear_extrude(height = magnet_depth + eps)
                    magnet_profile_2d();
}

// The same pockets on both walls: the right-hand set is the left-hand set
// mirrored across the centre of the channel, so the two always line up.
module magnet_pockets() {
    magnet_pockets_left();
    translate([overall_width, 0, 0]) mirror([1, 0, 0]) magnet_pockets_left();
}

// Countersunk screw holes down the centre of the channel floor, plus the
// optional tape recess in the back face.
module mounting_cuts() {
    if (screw_holes_enabled)
        for (i = [0 : screw_count - 1])
            translate([centre_x, screw_first_y + i * screw_spacing, 0]) {
                // Shank, all the way through the back.
                translate([0, 0, -eps])
                    cylinder(h = back_thickness + 2 * eps, d = screw_hole_diameter);
                // Countersink, opening out towards the inside of the channel
                // so the screw head finishes flush with the floor.
                translate([0, 0, back_thickness - countersink_depth])
                    cylinder(h = countersink_depth + eps,
                             d1 = screw_hole_diameter,
                             d2 = screw_head_diameter);
            }

    if (tape_recess_enabled)
        translate([centre_x - tape_recess_width / 2, -joint_depth - eps, -eps])
            cube([tape_recess_width,
                  segment_length + 2 * joint_depth + 2 * eps,
                  tape_recess_depth + eps]);
}

// The finished part.
module guide() {
    difference() {
        union() {
            profile_solid(0, segment_length);
            if (joint_end == "male") joint_tab_at_finish();
            if (joint_start == "male") flip() joint_tab_at_finish();
        }
        if (joint_start == "female") joint_socket_at_start();
        if (joint_end == "female") flip() joint_socket_at_start();
        if (magnets_enabled) magnet_pockets();
        mounting_cuts();
    }
}

// MakerWorld output -------------------------------------------------------

module mw_plate_1() {
    guide();
}

mw_plate_1();
