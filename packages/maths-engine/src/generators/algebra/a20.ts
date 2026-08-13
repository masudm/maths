/**
 * A20 - Find approximate solutions to equations numerically using iteration.
 */
import { boardsFor, decimalValue, defineGenerator, draft, math, pickUntil, slot, text } from '../kit.js';

export const a20Iteration = defineGenerator(
  {
    id: 'A20.iterative-sequence',
    ref: 'A20',
    title: 'Apply an iterative formula to find a later term',
    strand: 'algebra',
    tiers: ['H'],
    ao: 'AO1',
    marks: 3,
    calculator: 'calc',
    boards: boardsFor('A20'),
  },
  (rng) => {
    const { k, m, x0 } = pickUntil(
      rng,
      (r) => ({ k: r.int(2, 6), m: r.int(1, 9), x0: r.int(2, 5) }),
      ({ k: a, m: b, x0: s }) => {
        const one = Math.sqrt(a * s + b);
        const two = Math.sqrt(a * one + b);
        return Number.isFinite(two) && two > 1 && Math.abs(one - two) > 0.05;
      },
    );
    const x1 = Math.sqrt(k * x0 + m);
    const x2 = Math.sqrt(k * x1 + m);

    return draft({
      params: { k, m, x0, x1, x2 },
      content: [
        math(`x_{n+1} = \\sqrt{${k}x_n + ${m}}`, true),
        text(`Starting with x_0 = ${x0}, work out the value of x_2.`),
        text('Give your answer to 3 decimal places.'),
        slot('answer', { prefix: 'x₂ =' }),
      ],
      answer: decimalValue(Number(x2.toFixed(3))),
      answerSlot: { policy: { accuracy: { type: 'dp', digits: 3 }, tolerance: 0.0005 } },
      steps: [
        {
          id: 'm1',
          type: 'M',
          values: [decimalValue(Number(x1.toFixed(4)))],
          policy: { tolerance: 0.005 },
          note: 'x_1 evaluated',
        },
        {
          id: 'm2',
          type: 'M',
          values: [decimalValue(Number(x2.toFixed(4)))],
          dependsOn: ['m1'],
          policy: { tolerance: 0.005 },
          note: 'their x_1 substituted back',
        },
        {
          id: 'a1',
          type: 'A',
          values: [decimalValue(Number(x2.toFixed(3)))],
          policy: { tolerance: 0.0005 },
        },
      ],
      guidance: [
        'Rounding x_1 before substituting it back is premature approximation: penalise one mark if it changes the answer.',
      ],
    });
  },
);

export default [a20Iteration];
