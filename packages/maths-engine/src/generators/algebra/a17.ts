/**
 * A17 - Solve linear equations in one unknown, including brackets and the unknown on both sides.
 */
import { boardsFor, defineGenerator, draft, intValue, math, pickUntil, signed, slot, text } from '../kit.js';

export const a17LinearEquation = defineGenerator(
  {
    id: 'A17.linear-equation-both-sides',
    ref: 'A17',
    title: 'Solve a linear equation with brackets and the unknown on both sides',
    strand: 'algebra',
    tiers: ['F+'],
    ao: 'AO1',
    marks: 3,
    calculator: 'non-calc',
    boards: boardsFor('A17'),
  },
  (rng) => {
    const { a, b, c, x } = pickUntil(
      rng,
      (r) => ({ a: r.int(2, 7), b: r.intNonZero(-8, 8), c: r.int(2, 6), x: r.int(2, 12) }),
      ({ a: p, b: q, c: u, x: v }) => p !== u && p * (v + q) === u * v + (p * (v + q) - u * v),
    );
    // a(x + b) = cx + d, constructed so that x is the stated solution.
    const d = a * (x + b) - c * x;
    const expanded = a * b;

    return draft({
      params: { a, b, c, d, x },
      content: [
        text('Solve'),
        math(`${a}(x ${signed(b)}) = ${c}x ${signed(d)}`, true),
        slot('answer', { prefix: 'x =' }),
      ],
      answer: intValue(x),
      steps: [
        {
          id: 'm1',
          type: 'M',
          values: [intValue(expanded)],
          note: 'the bracket expanded correctly',
        },
        {
          id: 'm2',
          type: 'M',
          values: [intValue(a - c), intValue(d - expanded)],
          dependsOn: ['m1'],
          note: 'terms collected correctly on each side',
        },
        { id: 'a1', type: 'A', values: [intValue(x)] },
      ],
    });
  },
);

export default [a17LinearEquation];
