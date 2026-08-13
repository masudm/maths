/**
 * R9 - Percentages, including percentage change and original value (reverse) problems.
 */
import { boardsFor, decimalValue, defineGenerator, draft, pickUntil, slot, text } from '../kit.js';

export const r9ReversePercentage = defineGenerator(
  {
    id: 'R9.reverse-percentage',
    ref: 'R9',
    title: 'Find the original value before a percentage decrease',
    strand: 'ratio',
    tiers: ['F+'],
    ao: 'AO3',
    marks: 3,
    calculator: 'either',
    boards: boardsFor('R9'),
  },
  (rng) => {
    const { percent, original } = pickUntil(
      rng,
      (r) => ({
        percent: r.pick([10, 15, 20, 25, 30, 35, 40]),
        original: r.int(4, 40) * 5,
      }),
      ({ percent: p, original: o }) => {
        const sale = o * (1 - p / 100);
        return Math.abs(sale * 100 - Math.round(sale * 100)) < 1e-9 && sale > 10;
      },
    );
    const multiplier = 1 - percent / 100;
    const salePrice = Number((original * multiplier).toFixed(2));
    // The classic error: adding the percentage back on instead of reversing the decrease.
    const additiveError = Number((salePrice * (1 + percent / 100)).toFixed(2));

    return draft({
      params: { percent, original, multiplier, salePrice },
      content: [
        text(`In a sale, all prices are reduced by ${percent}%.`),
        text(`The sale price of a coat is £${salePrice.toFixed(2)}.`),
        text('Work out the original price of the coat.'),
        slot('answer', { prefix: '£' }),
      ],
      answer: decimalValue(original),
      answerSlot: { units: '£' },
      steps: [
        {
          id: 'm1',
          type: 'M',
          values: [decimalValue(multiplier), decimalValue(100 - percent)],
          note: 'the multiplier identified, or the sale price recognised as a percentage of the original',
        },
        {
          id: 'm2',
          type: 'M',
          values: [decimalValue(original)],
          dependsOn: ['m1'],
          note: 'the sale price divided by their multiplier',
        },
        { id: 'a1', type: 'A', values: [decimalValue(original)] },
      ],
      specialCases: [
        {
          marks: 1,
          values: [decimalValue(additiveError)],
          misconception: 'reverse-percentage-treated-as-additive',
          note: 'the percentage added back on instead of the decrease reversed',
        },
      ],
      guidance: [
        'Adding the percentage back on is the single most common error on this question type.',
      ],
    });
  },
);

export default [r9ReversePercentage];
