// Parametric Roller Blind Guide
//
// A U-channel that captures the edge of a roller blind: it blocks the light
// that bleeds down the sides of the blind, and stops the fabric flapping when
// the window is open.
//
// The matching top cover (pelmet) hides the roller mechanism and plugs into
// the top of the guides with the same joint. Pick which part to print with the
// "part" setting at the top.
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

/* [Part] */

// Which piece to print. The guide runs up the sides; the pelmet covers the mechanism at the top
part = "guide";  // [guide, pelmet side, cover]

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
// Relief drilled into the socket corners, which a round nozzle cannot reach. Roughly one nozzle width
joint_corner_relief = 0.5;      // [0:0.05:2]
// Extra gap over the first few layers, where squash makes the tab fatter and the socket tighter
joint_first_layer_relief = 0.2; // [0:0.05:1]
// How far up that extra gap goes - two or three layers
joint_first_layer_height = 0.6; // [0:0.1:2]
// Print a short pair of test joints instead of the guide, to dial in the clearances
fit_test_piece = false;

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

/* [Top cover - shape] */

// Front profile of the pelmet
top_style = "straight";   // [straight, angled, curved]
// Depth of the blind mechanism, back to front - the clear space inside (sketch: A).
// Negative reverses the pelmet, so it reaches out the other side of the guide
internal_depth = 50;      // [-300:1:300]
// Height of the blind mechanism - the clear space inside (sketch: B)
internal_height = 100;    // [20:1:300]
// Angled only: slope of the face, measured from horizontal. Shallower reaches further forward
top_angle = 45;           // [15:1:80]
// Curved only: arc radius. 0 works out the smallest radius that clears the mechanism
curve_radius = 0;         // [0:1:400]
// Where the pelmet's face starts, measured from the front of the guide. The rib is
// cut off here, clear of the brackets holding the mechanism to the window head
pelmet_cut_offset = 0;    // [-60:0.5:60]
// Which end of the window this rib is for. The groove is on one face, so the two are a pair
rib_hand = "left";        // [left, right]

/* [Top cover - build] */

// Material outside the cover on the side ribs
rib_width = 8;            // [3:0.5:30]
// Thickness of the side ribs, across the window
rib_thickness = 8;        // [3:0.5:30]
// How far the rib sits down over the guide below it
foot_length = 25;         // [10:1:100]
// Thickness of the cover panel itself
cover_thickness = 4;      // [1.5:0.1:12]
// Length of one printed section of cover, across the window
cover_section_width = 180; // [40:1:400]
// How far the lip reaches back towards the window, to screw into the top lining
lip_depth = 25;           // [0:1:100]
// End of the cover section nearest the origin
cover_start = "tongue";   // [tongue, female, male, plain]
// Far end of the cover section
cover_end = "male";       // [tongue, female, male, plain]
// Waist of the cover's tab. Wider than the guide's, so the joint reaches the whole profile
cover_neck_fraction = 0.60;  // [0.2:0.01:0.9]
// Widest part of the cover's tab
cover_head_fraction = 0.92;  // [0.3:0.01:0.98]

/* [Top cover - groove] */

// Thickness of the tongue on the end of the cover, and so of the groove it sits in
groove_width = 2.4;       // [1:0.1:8]
// How far the tongue reaches into the rib
groove_depth = 6;         // [2:0.5:20]
// Slack around the tongue. Same idea as the joint clearance
groove_clearance = 0.2;   // [0:0.05:1]

/* [Quality] */

// Facets per circle. Raise for a smoother render, lower for a faster one
resolution = 64;             // [16:8:128]
// Your printer's bed, used only to warn when a part will not fit
bed_size = 220;              // [100:10:600]

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

// Top cover ---------------------------------------------------------------

// The front profile has to pass outside the front top corner of the clear
// rectangle, so anything other than a square profile needs a bigger envelope
// to hold the same mechanism. Both are worked out from the clear size rather
// than asked for, so the mechanism always fits whatever style is chosen.
// The sign of internal_depth says which side of the guide the pelmet reaches
// out to; the size of it is what the profile has to clear. Everything below is
// built reaching forwards and mirrored at the end, so there is only one shape
// to reason about.
clear_depth = abs(internal_depth);

auto_radius = sqrt(clear_depth * clear_depth + internal_height * internal_height);
cover_radius = curve_radius <= 0 ? auto_radius : curve_radius;

envelope_depth =
    top_style == "angled" ? clear_depth + internal_height / tan(top_angle) :
    top_style == "curved" ? cover_radius :
                            clear_depth;
envelope_height =
    top_style == "angled" ? internal_height + clear_depth * tan(top_angle) :
    top_style == "curved" ? cover_radius :
                            internal_height;

// The mechanism hangs from the window head, so its brackets sit above the
// guide. The rib is cut off at this depth and the space behind it left open,
// which puts the pelmet in front of the blind rather than around it.
cut_x = overall_width + pelmet_cut_offset;

// Both mirrors are taken about the centre of the guide, which the U profile
// and the dovetail are both symmetric about - so the foot and the tab come
// through unchanged and still mate. The cover follows the pelmet's direction
// only; the rib also flips for the far end of the window, where the groove has
// to face the other way.
cover_reversed = internal_depth < 0;
rib_reversed = cover_reversed != (rib_hand == "right");

// The cover occupies the band from the clear profile out to cover_thickness;
// the rib covers that same band and carries rib_width more outside it.
rib_band = cover_thickness + rib_width;
// The tongue is centred in the cover's thickness.
tongue_inset = (cover_thickness - groove_width) / 2;

// Top of the cover, and so the face that meets the window lining. An angled
// profile is cut off square at the back, which reaches a little higher than
// the panel is thick.
cover_top_y = envelope_height +
    (top_style == "angled" ? cover_thickness / cos(top_angle) : cover_thickness);
// How far the cover's cross-section reaches from the window, used as the span
// of its jigsaw joint.
cover_span = envelope_depth + cover_thickness;

// Bounding size of each pelmet part, for the bed warnings.
rib_bed_depth = envelope_depth + rib_band;
rib_bed_height = envelope_height + rib_band + foot_length + joint_depth;

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
if (joint_corner_relief >= joint_neck / 2)
    echo("WARNING: joint_corner_relief is large next to the tab waist - the relief circles will eat into the lock.");
if (joint_first_layer_height >= joint_depth)
    echo("WARNING: joint_first_layer_height is as tall as the joint is deep - the extra gap applies to the whole socket.");
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

if (part != "guide" && envelope_depth + rib_band < overall_width)
    echo("WARNING: the pelmet is shallower than the guide is wide - its foot will overhang the bottom leg.");
if (part != "guide" && foot_length < rib_band)
    echo("WARNING: foot_length is shorter than the rib is wide - there is nothing for the joint to hold on to.");
if (part != "guide" && groove_width >= cover_thickness)
    echo("WARNING: groove_width is at least cover_thickness - there is no shoulder left to butt against the rib.");
if (part != "guide" && groove_depth >= rib_thickness)
    echo("WARNING: groove_depth is at least rib_thickness - the groove will cut straight through the rib.");
if (part != "guide" && envelope_depth + rib_band <= cut_x)
    echo("WARNING: the cut is past the front of the pelmet - there is no face left. Lower pelmet_cut_offset.");
if (part != "guide" && clear_depth <= cut_x)
    echo("WARNING: internal_depth does not reach past the cut - the pelmet's face would sit behind the mechanism.");
if (part == "cover" && rib_hand == "right")
    echo("NOTE: rib_hand only applies to the ribs. The cover is the same part either way; use a negative internal_depth to reverse it.");
if (part != "guide" && lip_depth > envelope_depth)
    echo("WARNING: lip_depth reaches past the front of the pelmet.");
if (part == "pelmet side" && max(rib_bed_depth, rib_bed_height) > bed_size)
    echo(str("WARNING: a rib needs ", rib_bed_depth, " x ", rib_bed_height,
             "mm of bed. Use a steeper top_angle or a smaller mechanism."));
if (part == "cover" && max(cover_section_width, cover_top_y) > bed_size)
    echo(str("WARNING: a cover section needs ", cover_span, " x ", cover_top_y,
             "mm of bed and stands ", cover_section_width, "mm tall."));

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

// Corners of the jigsaw tab, drawn flat: across span, starting at y and
// reaching joint_depth further on. The waist near the base is what stops a
// joined pair pulling apart lengthways. Taking the span and the two fractions
// as arguments lets the guide and the pelmet cover share one tab shape at
// their own very different widths.
function joint_points(span, y, neck_f, head_f) =
    let (c = span / 2, neck = span * neck_f / 2, head = span * head_f / 2)
    [
        [c - neck, y],
        [c - neck, y + joint_depth * 0.25],
        [c - head, y + joint_depth * 0.55],
        [c - head * 0.85, y + joint_depth],
        [c + head * 0.85, y + joint_depth],
        [c + head, y + joint_depth * 0.55],
        [c + neck, y + joint_depth * 0.25],
        [c + neck, y]
    ];

// The tab outline itself.
module joint_profile_2d(span, y, neck_f, head_f) {
    polygon(joint_points(span, y, neck_f, head_f));
}

// The socket outline: the tab grown by gap on every face, with a relief circle
// dropped on each corner. A printer lays plastic down with a round nozzle, so
// it cannot cut a sharp inside corner - it leaves a fillet of material exactly
// where the tab's corners need to go, and the joint stands proud. The relief
// circles clear that material out, the same trick as a dogbone in CNC joinery.
module socket_profile_2d(span, gap, neck_f, head_f) {
    union() {
        offset(delta = gap) joint_profile_2d(span, -gap, neck_f, head_f);
        if (joint_corner_relief > 0)
            for (p = joint_points(span, 0, neck_f, head_f))
                translate(p) circle(r = joint_corner_relief + gap);
    }
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
module flip(len = segment_length) {
    translate([0, len, 0]) mirror([0, 1, 0]) children();
}

// The tab that sticks out past the far end face. It is trimmed to the U
// profile, so the tab carries the same walls and back as the rest of the guide.
module joint_tab_at_finish(len = segment_length) {
    intersection() {
        profile_solid(len - eps, joint_depth + eps);
        translate([0, 0, -eps])
            linear_extrude(height = profile_depth + 2 * eps)
                joint_profile_2d(overall_width, len - eps,
                                 joint_neck_fraction, joint_head_fraction);
    }
}

// The socket the tab drops into, at the near end. Cut through the full depth
// of the profile, because segments are assembled by lowering one onto the
// other rather than sliding them together lengthways - a waisted tab cannot
// slide in. All of the clearance lives here, so the tab always prints at its
// nominal size and only one half of the pair has to be tuned.
module joint_socket_at_start() {
    translate([0, 0, -eps])
        linear_extrude(height = profile_depth + 2 * eps)
            socket_profile_2d(overall_width, joint_clearance,
                              joint_neck_fraction, joint_head_fraction);

    // The first layers of a print squash outwards, which makes the bottom of
    // the tab fatter and the bottom of the socket tighter at the same time.
    // Opening the socket up over the same height absorbs both, and doubles as
    // a lead-in when the tab is lowered in.
    if (joint_first_layer_relief > 0 && joint_first_layer_height > 0)
        translate([0, 0, -eps])
            linear_extrude(height = joint_first_layer_height + eps)
                socket_profile_2d(overall_width,
                                  joint_clearance + joint_first_layer_relief,
                                  joint_neck_fraction, joint_head_fraction);
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

// A screw hole drilled along +Z through t of material, countersunk at the far
// end so the head finishes flush there. Shared by the guide's back and the
// pelmet's lip, so both get the same screw settings.
module countersunk_hole(t) {
    translate([0, 0, -eps])
        cylinder(h = t + 2 * eps, d = screw_hole_diameter);
    translate([0, 0, t - countersink_depth])
        cylinder(h = countersink_depth + eps,
                 d1 = screw_hole_diameter,
                 d2 = screw_head_diameter);
}

// Countersunk screw holes down the centre of the channel floor, plus the
// optional tape recess in the back face.
module mounting_cuts(len = segment_length) {
    if (screw_holes_enabled)
        for (i = [0 : screw_count - 1])
            translate([centre_x, screw_first_y + i * screw_spacing, 0])
                countersunk_hole(back_thickness);

    if (tape_recess_enabled)
        translate([centre_x - tape_recess_width / 2, -joint_depth - eps, -eps])
            cube([tape_recess_width,
                  len + 2 * joint_depth + 2 * eps,
                  tape_recess_depth + eps]);
}

// The finished part. The arguments let the fit test print short stubs of the
// same geometry; everything else uses the defaults straight from the UI.
module guide(len = segment_length,
             start_joint = joint_start,
             end_joint = joint_end,
             with_magnets = magnets_enabled,
             with_mounting = true) {
    difference() {
        union() {
            profile_solid(0, len);
            if (end_joint == "male") joint_tab_at_finish(len);
            if (start_joint == "male") flip(len) joint_tab_at_finish(len);
        }
        if (start_joint == "female") joint_socket_at_start();
        if (end_joint == "female") flip(len) joint_socket_at_start();
        if (with_magnets) magnet_pockets();
        if (with_mounting) mounting_cuts(len);
    }
}

// A short male stub and a matching female stub, side by side. Print this
// first: it takes minutes rather than hours, and it is the only honest way to
// find the clearance your printer needs before committing to a whole window.
module fit_test() {
    len = max(joint_depth * 2, 20);
    guide(len = len, start_joint = "none", end_joint = "male",
          with_magnets = false, with_mounting = false);
    translate([overall_width + 10, 0, 0])
        guide(len = len, start_joint = "female", end_joint = "none",
              with_magnets = false, with_mounting = false);
}


// Top cover ---------------------------------------------------------------
//
// Everything below is drawn in a frame whose origin is the back bottom inside
// corner of the pelmet: X runs from the window forwards into the room, Y runs
// up, and Z runs across the window. Those are the same axes the guide uses, so
// a tab made by joint_tab_at_finish() points straight down into the guide's
// socket without any further work.

// The space the mechanism needs, closed off by the window at the back, the
// bottom of the mechanism, and the chosen front profile. Nothing may intrude.
module pelmet_clear_region_2d() {
    if (top_style == "curved")
        intersection() {
            circle(r = cover_radius);
            square([cover_radius + 1, cover_radius + 1]);
        }
    else if (top_style == "angled")
        polygon([[0, 0], [0, envelope_height], [envelope_depth, 0]]);
    else
        square([clear_depth, internal_height]);
}

// A band of material following the front profile, between two offsets of that
// clear region. Clipping to the quadrant keeps the band on the profile itself
// rather than wrapping round the open back and underside.
//
// The offsets are rounded rather than mitred. A mitre would run the sharp nose
// of an angled profile out to a long spike, well past the size the part is
// supposed to be; rounding keeps every style exactly its offset larger than
// the space it has to clear, and gives a nose that prints.
module pelmet_offset_2d(amount) {
    if (amount > 0) offset(r = amount) pelmet_clear_region_2d();
    else pelmet_clear_region_2d();
}

module pelmet_band_2d(inner, outer) {
    big = envelope_depth + envelope_height + rib_band + 10;
    difference() {
        intersection() {
            pelmet_offset_2d(outer);
            square([big, big]);
        }
        pelmet_offset_2d(inner);
    }
}

// The mechanism is screwed to the window head, so its brackets are directly
// above the guide - exactly where a rib reaching back over the top would land.
// The rib is cut off at cut_x and everything on the window side of that line
// dropped, leaving an L: a leg along the bottom back to the guide, and the
// face itself. These two clip whatever they are given to one side of that cut.
module ahead_of_cut() {
    big = envelope_depth + envelope_height + rib_band + 10;
    intersection() {
        children();
        translate([cut_x, -big]) square([2 * big, 2 * big]);
    }
}

module behind_cut() {
    big = envelope_depth + envelope_height + rib_band + 10;
    intersection() {
        children();
        translate([cut_x - 2 * big, -big]) square([2 * big, 2 * big]);
    }
}

// Mirrors the pelmet about the centre of the guide. The guide's U profile and
// the dovetail are both symmetric about that line, so the foot and the tab are
// untouched by it and still mate either way round.
module pelmet_mirror(on) {
    if (on) translate([overall_width, 0, 0]) mirror([1, 0, 0]) children();
    else children();
}

// The tongue on the end of the cover, and so the shape of the groove that
// receives it: a thinner band running down the middle of the cover's own,
// and only as far back as the rib goes.
module cover_tongue_2d() {
    ahead_of_cut() pelmet_band_2d(tongue_inset, tongue_inset + groove_width);
}

// The end of a cover section where it meets a rib. The cover keeps its top run
// and lip - nothing is fixed above it out in the middle of the window - so the
// two parts are different shapes and the end has to suit both: ahead of the cut
// it steps down to the tongue and slides into the groove, behind the cut it
// stays full thickness and passes the rib by.
module cover_end_2d() {
    union() {
        cover_tongue_2d();
        behind_cut() cover_profile_2d();
    }
}

// The cover's cross-section: the panel itself, plus the lip that reaches back
// over the window lining to be screwed or taped to it.
module cover_profile_2d() {
    union() {
        pelmet_band_2d(0, cover_thickness);
        if (lip_depth > 0)
            translate([0, cover_top_y - cover_thickness])
                square([lip_depth, cover_thickness]);
    }
}

// The side rib: a band following the same profile, a leg along the bottom
// reaching back to the guide, and a stub of the guide's own cross-section for
// the joint to be cut from.
module pelmet_rib() {
    difference() {
        union() {
            // The band, and the bottom leg that carries it back to the guide.
            linear_extrude(height = rib_thickness)
                union() {
                    // The face, cut off clear of the mechanism's brackets.
                    ahead_of_cut() pelmet_band_2d(0, rib_band);
                    // The bottom leg is not cut: it is what carries the face
                    // back to the guide and the joint.
                    translate([0, -rib_band])
                        square([envelope_depth + rib_band, rib_band]);
                }
            // A length of real guide profile, so the tab below is trimmed to
            // exactly the shape the guide's socket expects.
            profile_solid(-foot_length, foot_length);
            translate([0, -foot_length, 0])
                flip(foot_length) joint_tab_at_finish(foot_length);
        }
        // The groove the cover slides into, cut in the face that looks across
        // the window. All of the slack is here, so the tongue prints nominal.
        translate([0, 0, rib_thickness - groove_depth])
            linear_extrude(height = groove_depth + eps)
                offset(delta = groove_clearance)
                    cover_tongue_2d();
    }
}

// Mirrors a cover feature from one end of the section to the other.
module cover_flip(w) {
    translate([0, 0, w]) mirror([0, 0, 1]) children();
}

// The cover's jigsaw, drawn across the depth of its cross-section and reaching
// along the window. It uses the same tab shape as the guide, but a wider head:
// the tab has to take in the front face as well as the top run, and a head
// sized for the guide would only ever catch the middle.
module cover_tab(w) {
    intersection() {
        // The panel only. The lip is left out of the joint: where the profile
        // slopes away from it the two are separate islands in cross-section,
        // and a tab spanning both would leave part of itself floating.
        translate([0, 0, w - eps])
            linear_extrude(height = joint_depth + eps)
                pelmet_band_2d(0, cover_thickness);
        cover_joint_prism()
            joint_profile_2d(cover_span, w - eps,
                             cover_neck_fraction, cover_head_fraction);
    }
}

module cover_socket() {
    intersection() {
        translate([0, 0, -eps])
            linear_extrude(height = joint_depth + 2 * eps)
                pelmet_band_2d(0, cover_thickness);
        cover_joint_prism()
            socket_profile_2d(cover_span, joint_clearance,
                              cover_neck_fraction, cover_head_fraction);
    }
}

// Stands a joint outline up out of the X-Z plane and runs it through the whole
// height of the cover, the same way profile_solid() runs the guide's
// cross-section along its length.
module cover_joint_prism() {
    y_hi = cover_top_y + 1;
    translate([0, y_hi, 0])
        rotate([90, 0, 0])
            linear_extrude(height = y_hi + 1)
                children();
}

// Screw holes and tape recess in the lip, laid out along the window exactly as
// the guide lays them out along its length.
module cover_mounting_cuts(w) {
    lip_x = min(lip_depth, envelope_depth) / 2;
    span = w - 2 * screw_end_margin;
    count = span < 0 ? 1 : floor(span / screw_spacing) + 1;
    first = (w - (count - 1) * screw_spacing) / 2;

    if (screw_holes_enabled && lip_depth > 0)
        for (i = [0 : count - 1])
            translate([lip_x, cover_top_y + eps, first + i * screw_spacing])
                rotate([90, 0, 0])
                    countersunk_hole(cover_thickness + 2 * eps);

    if (tape_recess_enabled && lip_depth > 0)
        translate([lip_x - tape_recess_width / 2,
                   cover_top_y - tape_recess_depth,
                   -eps])
            cube([tape_recess_width, tape_recess_depth + eps, w + 2 * eps]);
}

// One printed length of cover. Each end is either a tongue that slides into a
// rib, half of a jigsaw joining it to the next section, or left plain.
module cover_section(w = cover_section_width,
                     start_end = cover_start,
                     finish_end = cover_end) {
    z0 = start_end == "tongue" ? groove_depth : 0;
    z1 = w - (finish_end == "tongue" ? groove_depth : 0);
    difference() {
        union() {
            translate([0, 0, z0])
                linear_extrude(height = z1 - z0)
                    cover_profile_2d();
            if (start_end == "tongue")
                linear_extrude(height = z0 + eps) cover_end_2d();
            if (finish_end == "tongue")
                translate([0, 0, z1 - eps])
                    linear_extrude(height = w - z1 + eps) cover_end_2d();
            if (finish_end == "male") cover_tab(w);
            if (start_end == "male") cover_flip(w) cover_tab(w);
        }
        if (start_end == "female") cover_socket();
        if (finish_end == "female") cover_flip(w) cover_socket();
        cover_mounting_cuts(w);
    }
}

// MakerWorld output -------------------------------------------------------

module mw_plate_1() {
    if (fit_test_piece) fit_test();
    else if (part == "pelmet side")
        // Dropped so the whole rib sits at or above the bed.
        translate([0, foot_length + joint_depth, 0])
            pelmet_mirror(rib_reversed) pelmet_rib();
    else if (part == "cover")
        pelmet_mirror(cover_reversed) cover_section();
    else
        guide();
}

mw_plate_1();
