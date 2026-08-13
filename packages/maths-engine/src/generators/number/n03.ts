/**
 * N3 - Conventional notation for the priority of operations, including brackets and powers.
 */
import { boardsFor, defineGenerator, draft, intValue, math, slot, text } from '../kit.js';

export const n3OrderOfOperations = defineGenerator(
  {
    id: 'N3.priority-of-operations',
    ref: 'N3',
    title: 'Order of operations with brackets and a power',
    strand: 'number',
    tiers: ['F'],
    ao: 'AO1',
    marks: 2,
    calculator: 'non-calc',
    boards: boardsFor('N3'),
  },
  (rng) => {
    const a = rng.int(2, 9);
    const b = rng.int(2, 6);
    const inner = rng.int(2, 4);
    const c = rng.int(inner + 1, 9);
    const d = c - inner;

    const bracket = c - d;
    const squared = bracket * bracket;
    const answer = a + b * squared;
    // The wrong answer a student gets by working strictly left to right.
    const leftToRight = (a + b) * squared;

    return draft({
      params: { a, b, c, d, bracket, squared, answer },
      content: [
        text('Work out'),
        math(`${a} + ${b} \\times (${c} - ${d})^2`, true),
        slot('answer'),
      ],
      answer: intValue(answer),
      steps: [
        {
          id: 'm1',
          type: 'M',
          values: [intValue(squared), intValue(b * squared)],
          note: 'the bracket evaluated and squared, or the product that follows',
        },
        { id: 'a1', type: 'A', values: [intValue(answer)] },
      ],
      specialCases: [
        {
          marks: 0,
          values: [intValue(leftToRight)],
          misconception: 'evaluates-strictly-left-to-right',
        },
      ],
    });
  },
);

export default [n3OrderOfOperations];
