/**
 * G3 - Angle facts, including the angle sum of a polygon.
 */
import { boardsFor, decimalValue, defineGenerator, draft, fig, figure, intValue, slot, text } from '../kit.js';

export const g3InteriorAngle = defineGenerator(
  {
    id: 'G3.interior-angle-of-regular-polygon',
    ref: 'G3',
    title: 'Find the interior angle of a regular polygon',
    strand: 'geometry',
    tiers: ['F+'],
    ao: 'AO1',
    marks: 3,
    calculator: 'either',
    boards: boardsFor('G3'),
  },
  (rng) => {
    const sides = rng.pick([5, 6, 8, 9, 10, 12, 15, 18, 20]);
    const angleSum = (sides - 2) * 180;
    const interior = angleSum / sides;
    const exterior = 360 / sides;

    return draft({
      params: { sides, angleSum, interior, exterior },
      content: [
        text(`A regular polygon has ${sides} sides.`),
        figure(fig.regularPolygon(sides)),
        text('Work out the size of each interior angle.'),
        slot('answer', { suffix: '°' }),
      ],
      answer: decimalValue(interior),
      steps: [
        {
          id: 'm1',
          type: 'M',
          values: [intValue(angleSum), decimalValue(exterior)],
          note: 'the angle sum found, or the exterior angle found',
        },
        {
          id: 'm2',
          type: 'M',
          values: [decimalValue(interior)],
          dependsOn: ['m1'],
          note: 'their angle sum divided by the number of sides, or 180 minus their exterior angle',
        },
        { id: 'a1', type: 'A', values: [decimalValue(interior)] },
      ],
      specialCases: [
        {
          marks: 1,
          values: [decimalValue(exterior)],
          misconception: 'exterior-angle-given-instead-of-interior',
        },
      ],
    });
  },
);

export default [g3InteriorAngle];
