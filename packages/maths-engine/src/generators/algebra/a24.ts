/**
 * A24 - Recognise and use special sequences, including Fibonacci-type sequences.
 */
import { boardsFor, defineGenerator, draft, intValue, math, setValue, slot, text } from '../kit.js';

export const a24FibonacciType = defineGenerator(
  {
    id: 'A24.fibonacci-type-sequence',
    ref: 'A24',
    title: 'Continue a Fibonacci-type sequence',
    strand: 'algebra',
    tiers: ['F+'],
    ao: 'AO1',
    marks: 2,
    calculator: 'non-calc',
    boards: boardsFor('A24'),
  },
  (rng) => {
    const first = rng.int(1, 9);
    const second = rng.int(2, 12);
    const terms = [first, second];
    for (let i = 2; i < 6; i++) terms.push(terms[i - 1]! + terms[i - 2]!);
    const shown = terms.slice(0, 4);
    const next = terms.slice(4);

    return draft({
      params: { first, second, shown, next },
      content: [
        text('Here are the first four terms of a Fibonacci-type sequence.'),
        math(shown.join(' \\qquad '), true),
        text('Write down the next two terms.'),
        slot('answer'),
      ],
      answer: setValue(next.map((t) => intValue(t)), true),
      steps: [
        { id: 'b1', type: 'B', values: [intValue(next[0]!)], note: 'the fifth term' },
        {
          id: 'b2',
          type: 'B',
          values: [setValue(next.map((t) => intValue(t)), true)],
          target: 'answer',
          note: 'ft their fifth term added to the fourth',
        },
      ],
    });
  },
);

export default [a24FibonacciType];
