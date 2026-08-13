/** G16 - Formulae for the area of triangles, parallelograms and trapezia, and prism volumes. */
import { boardsFor, decimalValue, defineGenerator, draft, fig, figure, intValue, slot, text } from '../kit.js';

export const g16TrapeziumArea = defineGenerator(
  {
    id: 'G16.area-of-trapezium',
    ref: 'G16',
    title: 'Calculate the area of a trapezium',
    strand: 'geometry',
    tiers: ['F+'],
    ao: 'AO1',
    marks: 2,
    calculator: 'either',
    boards: boardsFor('G16'),
  },
  (rng) => {
    const a = rng.int(3, 14);
    const b = rng.int(a + 1, a + 12);
    const h = rng.int(2, 12);
    const area = ((a + b) / 2) * h;

    return draft({
      params: { a, b, h, area },
      content: [
        text(
          `A trapezium has parallel sides of length ${a} cm and ${b} cm, with a perpendicular height of ${h} cm.`,
        ),
        figure(
          fig.diagram(
            [
              {
                type: 'polygon',
                vertices: [fig.pt(0, 0), fig.pt(b, 0), fig.pt(b - 2, h), fig.pt(2, h)],
                sideLabels: [`${b} cm`, null, `${a} cm`, null],
              },
              { type: 'segment', from: fig.pt(2, 0), to: fig.pt(2, h), dashed: true, label: `${h} cm` },
            ],
            { width: b + 4, height: h + 4 },
          ),
        ),
        text('Work out the area of the trapezium.'),
        slot('answer', { suffix: 'cm²' }),
      ],
      answer: decimalValue(area),
      answerSlot: { units: 'cm2' },
      steps: [
        {
          id: 'm1',
          type: 'M',
          values: [intValue(a + b), decimalValue(area)],
          note: 'a correct substitution into the trapezium formula',
        },
        { id: 'a1', type: 'A', values: [decimalValue(area)] },
      ],
      specialCases: [
        {
          marks: 0,
          values: [intValue((a + b) * h)],
          misconception: 'halving-omitted-in-trapezium-area',
        },
      ],
      guidance: [
        'AQA places the trapezium formula in the group students must know or be able to derive; OCR would give it in the question.',
      ],
    });
  },
);

export default [g16TrapeziumArea];
