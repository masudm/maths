/**
 * R6 - Express a multiplicative relationship between two quantities as a ratio or fraction.
 */
import { boardsFor, defineGenerator, draft, math, num, pickUntil, ratioValue, slot, text } from '../kit.js';

export const r6MultiplicativeRelationship = defineGenerator(
  {
    id: 'R6.multiplicative-relationship-as-ratio',
    ref: 'R6',
    title: 'Express a fractional relationship between two quantities as a ratio',
    strand: 'ratio',
    tiers: ['F'],
    ao: 'AO2',
    marks: 1,
    calculator: 'non-calc',
    boards: boardsFor('R6'),
  },
  (rng) => {
    const { p, q } = pickUntil(
      rng,
      (r) => ({ p: r.int(2, 9), q: r.int(3, 11) }),
      ({ p: a, q: b }) => a < b && num.gcd(a, b) === 1,
    );

    return draft({
      params: { p, q },
      content: [
        text('y is'),
        math(`\\frac{${p}}{${q}}`),
        text('of x. Write the ratio x : y in its simplest form.'),
        slot('answer'),
      ],
      answer: ratioValue(q, p),
      answerSlot: { policy: { requireSimplified: true } },
      steps: [
        {
          id: 'b1',
          type: 'B',
          values: [ratioValue(q, p)],
          target: 'answer',
          policy: { requireSimplified: true },
        },
      ],
      guidance: ['The ratio is x : y, so the denominator comes first.'],
    });
  },
);

export default [r6MultiplicativeRelationship];
