/** G23 - The area of a triangle as half ab sin C. */
import { boardsFor, decimalValue, defineGenerator, draft, fig, figure, slot, text } from '../kit.js';

export const g23AreaWithSine = defineGenerator(
  {
    id: 'G23.area-using-sine',
    ref: 'G23',
    title: 'Find the area of a triangle using half ab sin C',
    strand: 'geometry',
    tiers: ['H'],
    ao: 'AO1',
    marks: 2,
    calculator: 'calc',
    boards: boardsFor('G23'),
  },
  (rng) => {
    const a = rng.int(4, 20);
    const b = rng.int(4, 20);
    const angle = rng.pick([25, 40, 55, 70, 110, 130, 145]);
    const area = 0.5 * a * b * Math.sin((angle * Math.PI) / 180);

    return draft({
      params: { a, b, angle, area },
      content: [
        text(`A triangle has two sides of length ${a} cm and ${b} cm with an included angle of ${angle}°.`),
        figure(fig.diagram(fig.triangleFromSAS(a, angle, b).elements)),
        text('Work out the area of the triangle. Give your answer to 3 significant figures.'),
        slot('answer', { suffix: 'cm²' }),
      ],
      answer: decimalValue(Number(area.toPrecision(3))),
      answerSlot: { units: 'cm2', policy: { accuracy: { type: 'sf', digits: 3 } } },
      steps: [
        {
          id: 'm1',
          type: 'M',
          values: [decimalValue(Number(area.toPrecision(6)))],
          policy: { accuracy: { type: 'sf', digits: 3 } },
          note: 'correct substitution into half ab sin C',
        },
        {
          id: 'a1',
          type: 'A',
          values: [decimalValue(Number(area.toPrecision(3)))],
          policy: { accuracy: { type: 'sf', digits: 3 } },
        },
      ],
      specialCases: [
        {
          marks: 1,
          values: [decimalValue(Number((2 * area).toPrecision(3)))],
          misconception: 'halving-omitted-in-sine-area-formula',
        },
      ],
    });
  },
);

export default [g23AreaWithSine];
