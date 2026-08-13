/**
 * G7 - Identify and describe congruent and similar shapes under transformations.
 *
 * "Describe fully" needs every component: naming two transformations scores zero.
 */
import { boardsFor, choiceValue, defineGenerator, draft, intValue, pointValue, rat, slot, text } from '../kit.js';

export const g7DescribeEnlargement = defineGenerator(
  {
    id: 'G7.describe-enlargement',
    ref: 'G7',
    title: 'Describe fully the enlargement that maps one shape onto another',
    strand: 'geometry',
    tiers: ['F+', 'H'],
    ao: 'AO2',
    marks: 3,
    calculator: 'non-calc',
    boards: boardsFor('G7'),
  },
  (rng) => {
    const negative = rng.bool(0.4);
    const magnitude = rng.pick([2, 3, 4]);
    const factor = negative ? -magnitude : magnitude;
    const cx = rng.int(-4, 4);
    const cy = rng.int(-4, 4);
    const vertices = [
      [1, 1],
      [3, 1],
      [1, 4],
    ] as const;
    const image = vertices.map(([x, y]) => [cx + factor * (x - cx), cy + factor * (y - cy)]);

    return draft({
      params: { factor, cx, cy, vertices, image },
      tier: negative ? 'H' : 'F+',
      content: [
        text(
          `Triangle A has vertices at ${vertices.map(([x, y]) => `(${x}, ${y})`).join(', ')}. ` +
            `Triangle B has vertices at ${image.map(([x, y]) => `(${x}, ${y})`).join(', ')}.`,
        ),
        text('Describe fully the single transformation that maps triangle A onto triangle B.'),
        text('(a) Type of transformation'),
        slot('type'),
        text('(b) Scale factor'),
        slot('factor'),
        text('(c) Centre'),
        slot('centre'),
      ],
      slots: [
        { id: 'type', label: 'transformation', expect: choiceValue('enlargement') },
        { id: 'factor', label: 'scale factor', expect: intValue(factor) },
        { id: 'centre', label: 'centre', expect: pointValue(rat(cx), rat(cy)) },
      ],
      steps: [
        { id: 'b1', type: 'B', values: [choiceValue('enlargement')], target: { slot: 'type' } },
        { id: 'b2', type: 'B', values: [intValue(factor)], target: { slot: 'factor' } },
        {
          id: 'b3',
          type: 'B',
          values: [pointValue(rat(cx), rat(cy))],
          target: { slot: 'centre' },
        },
      ],
      guidance: [
        'All three components are required for full marks. Naming two transformations scores zero.',
      ],
    });
  },
);

export default [g7DescribeEnlargement];
