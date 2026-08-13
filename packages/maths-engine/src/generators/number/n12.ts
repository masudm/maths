/**
 * N12 - Interpret fractions and percentages as operators.
 */
import { boardsFor, decimalValue, defineGenerator, draft, intValue, pickUntil, slot, text } from '../kit.js';

export const n12PercentageOfAmount = defineGenerator(
  {
    id: 'N12.percentage-of-amount',
    ref: 'N12',
    title: 'Find a percentage of a quantity',
    strand: 'number',
    tiers: ['F'],
    ao: 'AO1',
    marks: 2,
    calculator: 'non-calc',
    boards: boardsFor('N12'),
  },
  (rng) => {
    const { percent, amount } = pickUntil(
      rng,
      (r) => ({
        percent: r.pick([5, 15, 25, 30, 35, 45, 60, 65, 80, 95]),
        amount: r.int(2, 30) * 20,
      }),
      ({ percent: p, amount: a }) => (p / 100) * a !== p,
    );
    const answer = (percent / 100) * amount;

    return draft({
      params: { percent, amount, answer },
      content: [text(`Work out ${percent}% of ${amount}`), slot('answer')],
      answer: decimalValue(answer),
      steps: [
        {
          id: 'm1',
          type: 'M',
          values: [decimalValue(amount / 10), decimalValue(amount / 100), decimalValue(answer)],
          note: '10% or 1% found, or a correct multiplier used',
        },
        { id: 'a1', type: 'A', values: [decimalValue(answer)] },
      ],
      specialCases: [
        {
          marks: 0,
          values: [intValue(percent)],
          misconception: 'percentage-restated-not-applied',
        },
      ],
    });
  },
);

export default [n12PercentageOfAmount];
