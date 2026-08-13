/**
 * N11 - Identify and work with fractions in ratio problems.
 */
import { boardsFor, defineGenerator, draft, math, num, pickUntil, ratioValue, slot, text } from '../kit.js';

export const n11FractionToRatio = defineGenerator(
  {
    id: 'N11.fraction-to-ratio',
    ref: 'N11',
    title: 'Turn a fraction of a whole into a part-to-part ratio',
    strand: 'number',
    tiers: ['F+'],
    ao: 'AO2',
    marks: 2,
    calculator: 'non-calc',
    boards: boardsFor('N11'),
  },
  (rng) => {
    const { p, q } = pickUntil(
      rng,
      (r) => {
        const denominator = r.pick([5, 6, 8, 9, 10, 12]);
        return { p: r.int(1, denominator - 1), q: denominator };
      },
      ({ p: a, q: b }) => num.gcd(a, b) === 1 && a !== b - a,
    );
    const rest = q - p;
    const g = num.gcd(p, rest);

    return draft({
      params: { p, q, rest, ratio: [p / g, rest / g] },
      content: [
        text('In a class,'),
        math(`\\frac{${p}}{${q}}`),
        text('of the students are left-handed and the rest are right-handed.'),
        text('Write the ratio of left-handed students to right-handed students in its simplest form.'),
        slot('answer'),
      ],
      answer: ratioValue(p / g, rest / g),
      answerSlot: { policy: { requireSimplified: true } },
      steps: [
        {
          id: 'm1',
          type: 'M',
          values: [ratioValue(p, rest)],
          note: 'the right-handed fraction or the unsimplified ratio',
        },
        {
          id: 'a1',
          type: 'A',
          values: [ratioValue(p / g, rest / g)],
          policy: { requireSimplified: true },
        },
      ],
      specialCases: [
        {
          marks: 0,
          values: [ratioValue(p, q)],
          misconception: 'ratio-written-as-part-to-whole',
        },
      ],
    });
  },
);

export default [n11FractionToRatio];
