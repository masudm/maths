/**
 * A23 - Generate terms of a sequence from a position-to-term or term-to-term rule.
 */
import { boardsFor, defineGenerator, draft, intValue, math, setValue, signed, slot, text } from '../kit.js';

export const a23GenerateTerms = defineGenerator(
  {
    id: 'A23.generate-terms-from-nth-term',
    ref: 'A23',
    title: 'Generate the first terms of a sequence from its nth term',
    strand: 'algebra',
    tiers: ['F'],
    ao: 'AO1',
    marks: 2,
    calculator: 'non-calc',
    boards: boardsFor('A23'),
  },
  (rng) => {
    const a = rng.intNonZero(-8, 9);
    const b = rng.intNonZero(-9, 9);
    const terms = [1, 2, 3].map((n) => a * n + b);

    return draft({
      params: { a, b, terms },
      content: [
        text('The nth term of a sequence is'),
        math(`${a}n ${signed(b)}`, true),
        text('Write down the first three terms of the sequence.'),
        slot('answer'),
      ],
      answer: setValue(terms.map((t) => intValue(t)), true),
      steps: [
        {
          id: 'b1',
          type: 'B',
          values: [intValue(terms[0]!), intValue(terms[1]!), intValue(terms[2]!)],
          note: 'any two terms correct',
        },
        {
          id: 'b2',
          type: 'B',
          values: [setValue(terms.map((t) => intValue(t)), true)],
          target: 'answer',
          note: 'all three correct',
        },
      ],
    });
  },
);

export default [a23GenerateTerms];
