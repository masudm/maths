/**
 * A25 - Deduce expressions for the nth term of linear and quadratic sequences.
 */
import { boardsFor, defineGenerator, draft, expr, intValue, math, pickUntil, signed, slot, text } from '../kit.js';

export const a25QuadraticNthTerm = defineGenerator(
  {
    id: 'A25.quadratic-nth-term',
    ref: 'A25',
    title: 'Find the nth term of a quadratic sequence',
    strand: 'algebra',
    tiers: ['H'],
    ao: 'AO2',
    marks: 3,
    calculator: 'non-calc',
    boards: boardsFor('A25'),
  },
  (rng) => {
    const { a, b, c } = pickUntil(
      rng,
      (r) => ({ a: r.int(1, 3), b: r.int(-4, 6), c: r.int(-6, 8) }),
      ({ a: p, b: q, c: u }) => p !== 0 && (q !== 0 || u !== 0),
    );
    const terms = [1, 2, 3, 4, 5].map((n) => a * n * n + b * n + c);
    const secondDifference = 2 * a;

    return draft({
      params: { a, b, c, terms, secondDifference },
      content: [
        text('Here are the first five terms of a quadratic sequence.'),
        math(terms.join(' \\qquad '), true),
        text('Find an expression for the nth term.'),
        slot('answer'),
      ],
      answer: expr(`${a}*n^2+${b}*n+${c}`),
      steps: [
        {
          id: 'm1',
          type: 'M',
          values: [intValue(secondDifference), expr(`${a}*n^2`)],
          note: `the second difference of ${secondDifference} used to give the n^2 term`,
        },
        {
          id: 'm2',
          type: 'M',
          values: [expr(`${b}*n+${c}`)],
          dependsOn: ['m1'],
          note: 'the remaining linear sequence found after subtracting their n^2 term',
        },
        { id: 'a1', type: 'A', values: [expr(`${a}*n^2+${b}*n+${c}`)], note: 'oe' },
      ],
      specialCases: [
        {
          marks: 1,
          values: [expr(`${secondDifference}*n^2 ${signed(b, '*n')} ${signed(c)}`)],
          misconception: 'second-difference-used-directly-as-coefficient',
        },
      ],
    });
  },
);

export default [a25QuadraticNthTerm];
