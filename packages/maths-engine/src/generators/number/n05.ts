/**
 * N5 - Systematic listing strategies, including the product rule for counting.
 */
import { boardsFor, defineGenerator, draft, intValue, slot, text } from '../kit.js';

export const n5ProductRule = defineGenerator(
  {
    id: 'N5.product-rule-for-counting',
    ref: 'N5',
    title: 'Count arrangements using the product rule',
    strand: 'number',
    tiers: ['H'],
    ao: 'AO1',
    marks: 3,
    calculator: 'non-calc',
    boards: boardsFor('N5'),
  },
  (rng) => {
    const letters = rng.int(3, 5);
    const digits = rng.int(4, 7);
    const answer = letters * digits * (digits - 1);
    const withRepeats = letters * digits * digits;

    return draft({
      params: { letters, digits, answer },
      content: [
        text(
          `A code is made from one letter chosen from ${letters} different letters, followed by ` +
            `two different digits chosen from the digits 1 to ${digits}.`,
        ),
        text('Work out how many different codes are possible.'),
        slot('answer'),
      ],
      answer: intValue(answer),
      steps: [
        {
          id: 'm1',
          type: 'M',
          values: [intValue(digits * (digits - 1))],
          note: 'the two digits chosen without repetition',
        },
        {
          id: 'm2',
          type: 'M',
          values: [intValue(answer)],
          dependsOn: ['m1'],
          note: 'their digit count multiplied by the number of letters',
        },
        { id: 'a1', type: 'A', values: [intValue(answer)] },
      ],
      specialCases: [
        {
          marks: 1,
          values: [intValue(withRepeats)],
          misconception: 'counting-allows-repeated-digits',
        },
      ],
    });
  },
);

export default [n5ProductRule];
