/**
 * A19 - Solve two simultaneous equations in two variables algebraically.
 */
import { boardsFor, defineGenerator, draft, intValue, math, pickUntil, signed, slot, text } from '../kit.js';

export const a19SimultaneousEquations = defineGenerator(
  {
    id: 'A19.simultaneous-linear-equations',
    ref: 'A19',
    title: 'Solve a pair of simultaneous linear equations',
    strand: 'algebra',
    tiers: ['F+'],
    ao: 'AO1',
    marks: 3,
    calculator: 'non-calc',
    boards: boardsFor('A19'),
  },
  (rng) => {
    const { a, b, c, d, x, y } = pickUntil(
      rng,
      (r) => ({
        a: r.int(1, 5),
        b: r.intNonZero(-5, 5),
        c: r.int(1, 5),
        d: r.intNonZero(-5, 5),
        x: r.intNonZero(-8, 8),
        y: r.intNonZero(-8, 8),
      }),
      // A non-zero determinant guarantees a unique solution.
      ({ a: p, b: q, c: u, d: v }) => p * v - q * u !== 0,
    );
    const e = a * x + b * y;
    const f = c * x + d * y;

    return draft({
      params: { a, b, c, d, e, f, x, y },
      content: [
        text('Solve the simultaneous equations'),
        math(`${a}x ${signed(b, 'y')} = ${e}`, true),
        math(`${c}x ${signed(d, 'y')} = ${f}`, true),
        slot('x', { prefix: 'x =' }),
        slot('y', { prefix: 'y =' }),
      ],
      slots: [
        { id: 'x', label: 'x', expect: intValue(x) },
        { id: 'y', label: 'y', expect: intValue(y) },
      ],
      steps: [
        {
          id: 'm1',
          type: 'M',
          values: [intValue(x), intValue(y)],
          note: 'a correct method to eliminate one variable',
        },
        { id: 'a1', type: 'A', values: [intValue(x)], target: { slot: 'x' } },
        {
          id: 'a2',
          type: 'A',
          values: [intValue(y)],
          target: { slot: 'y' },
          note: 'ft their x substituted correctly',
        },
      ],
      guidance: ['Trial and improvement scores zero or full marks only.'],
    });
  },
);

export default [a19SimultaneousEquations];
