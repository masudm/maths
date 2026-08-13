/**
 * R13 - Construct and interpret equations describing direct and inverse proportion.
 */
import { boardsFor, decimalValue, defineGenerator, draft, intValue, pickUntil, slot, text } from '../kit.js';

export const r13InverseProportionEquation = defineGenerator(
  {
    id: 'R13.inverse-proportion-equation',
    ref: 'R13',
    title: 'Use an inverse square proportion relationship',
    strand: 'ratio',
    tiers: ['H'],
    ao: 'AO1',
    marks: 3,
    calculator: 'either',
    boards: boardsFor('R13'),
  },
  (rng) => {
    const { x1, y1, x2 } = pickUntil(
      rng,
      (r) => ({ x1: r.int(2, 6), y1: r.int(2, 40), x2: r.int(2, 12) }),
      ({ x1: a, y1: b, x2: c }) => {
        const k = b * a * a;
        const answer = k / (c * c);
        return a !== c && Number.isInteger(answer) && answer > 0;
      },
    );
    const k = y1 * x1 * x1;
    const answer = k / (x2 * x2);

    return draft({
      params: { x1, y1, x2, k, answer },
      content: [
        text('y is inversely proportional to the square of x.'),
        text(`When x = ${x1}, y = ${y1}.`),
        text(`Work out the value of y when x = ${x2}.`),
        slot('answer', { prefix: 'y =' }),
      ],
      answer: intValue(answer),
      steps: [
        {
          id: 'm1',
          type: 'M',
          values: [intValue(k)],
          note: 'the constant of proportionality found from y = k / x^2',
        },
        {
          id: 'm2',
          type: 'M',
          values: [intValue(answer)],
          dependsOn: ['m1'],
          note: 'their constant divided by the new x squared',
        },
        { id: 'a1', type: 'A', values: [intValue(answer)] },
      ],
      specialCases: [
        {
          marks: 1,
          values: [decimalValue(Number(((y1 * x1) / x2).toFixed(6)))],
          misconception: 'inverse-proportion-not-squared',
        },
      ],
    });
  },
);

export default [r13InverseProportionEquation];
