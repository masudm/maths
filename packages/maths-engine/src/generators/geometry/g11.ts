/**
 * G11 - Solve geometrical problems on coordinate axes.
 */
import { boardsFor, decimalValue, defineGenerator, draft, fig, figure, intValue, slot, text } from '../kit.js';

export const g11AreaFromCoordinates = defineGenerator(
  {
    id: 'G11.area-of-triangle-from-coordinates',
    ref: 'G11',
    title: 'Find the area of a right-angled triangle given its vertices',
    strand: 'geometry',
    tiers: ['F+'],
    ao: 'AO3',
    marks: 2,
    calculator: 'non-calc',
    boards: boardsFor('G11'),
  },
  (rng) => {
    const x1 = rng.int(-6, 2);
    const y1 = rng.int(-6, 2);
    const base = rng.int(2, 8);
    const height = rng.int(2, 8);
    const area = (base * height) / 2;

    return draft({
      params: { x1, y1, base, height, area },
      content: [
        text(
          `A is (${x1}, ${y1}), B is (${x1 + base}, ${y1}) and C is (${x1 + base}, ${y1 + height}).`,
        ),
        figure(
          fig.axes({
            xMin: Math.min(x1, x1 + base) - 2,
            xMax: Math.max(x1, x1 + base) + 2,
            yMin: Math.min(y1, y1 + height) - 2,
            yMax: Math.max(y1, y1 + height) + 2,
            plots: [
              {
                points: [
                  fig.pt(x1, y1),
                  fig.pt(x1 + base, y1),
                  fig.pt(x1 + base, y1 + height),
                  fig.pt(x1, y1),
                ],
              },
            ],
            points: [
              { at: fig.pt(x1, y1), label: 'A' },
              { at: fig.pt(x1 + base, y1), label: 'B' },
              { at: fig.pt(x1 + base, y1 + height), label: 'C' },
            ],
          }),
        ),
        text('Work out the area of triangle ABC.'),
        slot('answer', { suffix: 'square units' }),
      ],
      answer: decimalValue(area),
      steps: [
        {
          id: 'm1',
          type: 'M',
          values: [intValue(base), intValue(height), intValue(base * height)],
          note: 'the base and height identified from the coordinates',
        },
        { id: 'a1', type: 'A', values: [decimalValue(area)] },
      ],
      specialCases: [
        {
          marks: 1,
          values: [intValue(base * height)],
          misconception: 'halving-omitted-in-triangle-area',
        },
      ],
    });
  },
);

export default [g11AreaFromCoordinates];
