/**
 * R8 - Relate ratios to fractions and to linear functions.
 */
import { boardsFor, defineGenerator, draft, expr, pickUntil, slot, text } from '../kit.js';

export const r8RatioAsLinearFunction = defineGenerator(
  {
    id: 'R8.ratio-as-linear-function',
    ref: 'R8',
    title: 'Write y as a function of x given the ratio x : y',
    strand: 'ratio',
    tiers: ['F+'],
    ao: 'AO2',
    marks: 2,
    calculator: 'non-calc',
    boards: boardsFor('R8'),
  },
  (rng) => {
    const { a, b } = pickUntil(
      rng,
      (r) => ({ a: r.int(2, 9), b: r.int(2, 11) }),
      // a = b makes the function y = x, where the inverted-ratio distractor is also correct.
      ({ a: p, b: q }) => p !== q,
    );

    return draft({
      params: { a, b },
      content: [
        text(`The ratio x : y is ${a} : ${b}.`),
        text('Write y as a function of x.'),
        slot('answer', { prefix: 'y =' }),
      ],
      answer: expr(`y=${b}*x/${a}`),
      answerSlot: { alternativeForms: [`(${b}/${a})x`, `${b}x/${a}`] },
      steps: [
        {
          id: 'm1',
          type: 'M',
          values: [expr(`${b}/${a}`)],
          note: 'the multiplier y / x identified',
        },
        { id: 'a1', type: 'A', values: [expr(`y=${b}*x/${a}`)], note: 'oe' },
      ],
      specialCases: [
        {
          marks: 0,
          values: [expr(`y=${a}*x/${b}`)],
          misconception: 'ratio-inverted-when-forming-the-function',
        },
      ],
    });
  },
);

export default [r8RatioAsLinearFunction];
