/**
 * A1 - Use and interpret algebraic notation; answers are expected in their simplest form.
 */
import { boardsFor, defineGenerator, draft, expr, math, pickUntil, slot, text } from '../kit.js';

export const a1CollectLikeTerms = defineGenerator(
  {
    id: 'A1.collect-like-terms',
    ref: 'A1',
    title: 'Simplify an expression by collecting like terms',
    strand: 'algebra',
    tiers: ['F'],
    ao: 'AO1',
    marks: 2,
    calculator: 'non-calc',
    boards: boardsFor('A1'),
  },
  (rng) => {
    const { a1, a2, b1, b2 } = pickUntil(
      rng,
      (r) => ({ a1: r.int(2, 9), a2: r.intNonZero(-6, -1), b1: r.int(2, 9), b2: r.int(1, 8) }),
      ({ a1: p, a2: q, b1: u, b2: v }) => p + q > 0 && u + v > 0 && p + q !== u + v,
    );
    const a = a1 + a2;
    const b = b1 + b2;
    const shown = `${a1}a + ${b1}b ${a2 < 0 ? '-' : '+'} ${Math.abs(a2)}a + ${b2}b`;

    return draft({
      params: { a1, a2, b1, b2, a, b },
      content: [text('Simplify'), math(shown, true), slot('answer')],
      answer: expr(`${a}a+${b}b`),
      answerSlot: { alternativeForms: [`${b}b + ${a}a`] },
      steps: [
        {
          id: 'b1',
          type: 'B',
          values: [expr(`${a}a`), expr(`${b}b`)],
          note: 'one correct term',
        },
        { id: 'b2', type: 'B', values: [expr(`${a}a+${b}b`)], target: 'answer', note: 'fully correct' },
      ],
    });
  },
);

export default [a1CollectLikeTerms];
