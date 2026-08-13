/**
 * R4 - Use ratio notation, including reduction to its simplest form.
 */
import { boardsFor, defineGenerator, draft, math, num, pickUntil, ratioValue, slot, text } from '../kit.js';

export const r4SimplifyRatio = defineGenerator(
  {
    id: 'R4.simplify-three-part-ratio',
    ref: 'R4',
    title: 'Write a three-part ratio in its simplest form',
    strand: 'ratio',
    tiers: ['F'],
    ao: 'AO1',
    marks: 1,
    calculator: 'non-calc',
    boards: boardsFor('R4'),
  },
  (rng) => {
    const { a, b, c, k } = pickUntil(
      rng,
      (r) => ({ a: r.int(2, 9), b: r.int(2, 9), c: r.int(2, 9), k: r.int(3, 12) }),
      ({ a: p, b: q, c: u }) => num.gcd(num.gcd(p, q), u) === 1 && new Set([p, q, u]).size > 1,
    );

    return draft({
      params: { a, b, c, k },
      content: [
        text('Write this ratio in its simplest form.'),
        math(`${a * k} : ${b * k} : ${c * k}`, true),
        slot('answer'),
      ],
      answer: ratioValue(a, b, c),
      answerSlot: { policy: { requireSimplified: true } },
      steps: [
        {
          id: 'b1',
          type: 'B',
          values: [ratioValue(a, b, c)],
          target: 'answer',
          policy: { requireSimplified: true },
        },
      ],
    });
  },
);

export default [r4SimplifyRatio];
