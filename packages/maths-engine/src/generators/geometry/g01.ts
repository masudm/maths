/**
 * G1 - Conventional terms and notation, including reflection and rotation symmetry.
 */
import { boardsFor, defineGenerator, draft, fig, figure, intValue, slot, text } from '../kit.js';

const POLYGONS = [
  { sides: 3, name: 'equilateral triangle' },
  { sides: 4, name: 'square' },
  { sides: 5, name: 'regular pentagon' },
  { sides: 6, name: 'regular hexagon' },
  { sides: 8, name: 'regular octagon' },
  { sides: 10, name: 'regular decagon' },
] as const;

export const g1Symmetry = defineGenerator(
  {
    id: 'G1.symmetry-of-regular-polygon',
    ref: 'G1',
    title: 'State the lines of symmetry and rotational symmetry order of a regular polygon',
    strand: 'geometry',
    tiers: ['F'],
    ao: 'AO1',
    marks: 2,
    calculator: 'non-calc',
    boards: boardsFor('G1'),
  },
  (rng) => {
    const polygon = rng.pick(POLYGONS);

    return draft({
      params: { sides: polygon.sides, name: polygon.name },
      content: [
        text(`Here is a ${polygon.name}.`),
        figure(fig.regularPolygon(polygon.sides)),
        text('(a) Write down the number of lines of symmetry.'),
        slot('lines'),
        text('(b) Write down the order of rotational symmetry.'),
        slot('order'),
      ],
      slots: [
        { id: 'lines', label: 'lines of symmetry', expect: intValue(polygon.sides) },
        { id: 'order', label: 'order of rotational symmetry', expect: intValue(polygon.sides) },
      ],
      steps: [
        { id: 'b1', type: 'B', values: [intValue(polygon.sides)], target: { slot: 'lines' } },
        { id: 'b2', type: 'B', values: [intValue(polygon.sides)], target: { slot: 'order' } },
      ],
    });
  },
);

export default [g1Symmetry];
