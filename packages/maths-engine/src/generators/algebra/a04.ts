/**
 * A4 - Simplify and manipulate algebraic expressions: expanding, factorising, and the laws
 * of indices. Split into three generators because the statement spans genuinely different
 * skills across the tiers.
 */
import { boardsFor, defineGenerator, draft, expr, math, num, pickUntil, slot, text } from '../kit.js';

export const a4ExpandTwoBinomials = defineGenerator(
  {
    id: 'A4.expand-two-binomials',
    ref: 'A4',
    title: 'Expand and simplify the product of two binomials',
    strand: 'algebra',
    tiers: ['F+'],
    ao: 'AO1',
    marks: 2,
    calculator: 'non-calc',
    boards: boardsFor('A4'),
  },
  (rng) => {
    const { p, q } = pickUntil(
      rng,
      (r) => ({ p: r.intNonZero(-8, 8), q: r.intNonZero(-8, 8) }),
      // p + q = 0 is the difference of two squares, where the "forgot the cross terms"
      // distractor would coincide with the correct answer.
      ({ p: a, q: b2 }) => a + b2 !== 0,
    );
    const b = p + q;
    const c = p * q;
    const sign = (v: number): string => (v < 0 ? `- ${-v}` : `+ ${v}`);

    return draft({
      params: { p, q, b, c },
      content: [
        text('Expand and simplify'),
        math(`(x ${sign(p)})(x ${sign(q)})`, true),
        slot('answer'),
      ],
      answer: expr(`x^2+${b}*x+${c}`),
      steps: [
        {
          id: 'm1',
          type: 'M',
          values: [expr(`x^2+${p}*x+${q}*x+${c}`)],
          note: 'three of the four terms correct',
        },
        { id: 'a1', type: 'A', values: [expr(`x^2+${b}*x+${c}`)] },
      ],
      specialCases: [
        {
          marks: 0,
          values: [expr(`x^2+${c}`)],
          misconception: 'binomial-expansion-misses-cross-terms',
        },
      ],
    });
  },
);

export const a4FactoriseCommonFactor = defineGenerator(
  {
    id: 'A4.factorise-common-factor',
    ref: 'A4',
    title: 'Factorise fully by taking out the highest common factor',
    strand: 'algebra',
    tiers: ['F'],
    ao: 'AO1',
    marks: 2,
    calculator: 'non-calc',
    boards: boardsFor('A4'),
  },
  (rng) => {
    const factor = rng.int(2, 9);
    const a = rng.int(2, 8);
    const b = rng.intNonZero(-9, 9);
    const first = factor * a;
    const second = factor * b;
    const sign = (v: number): string => (v < 0 ? `- ${-v}x` : `+ ${v}x`);

    return draft({
      params: { factor, a, b, first, second },
      content: [
        text('Factorise fully'),
        math(`${first}x^2 ${sign(second)}`, true),
        slot('answer'),
      ],
      answer: expr(`${factor}*x*(${a}*x+${b})`),
      steps: [
        {
          id: 'b1',
          type: 'B',
          values: [expr(`${factor}*(${a}*x^2+${b}*x)`), expr(`x*(${first}*x+${second})`)],
          note: 'a partial factorisation',
        },
        {
          id: 'b2',
          type: 'B',
          values: [expr(`${factor}*x*(${a}*x+${b})`)],
          target: 'answer',
          note: 'fully factorised',
        },
      ],
      guidance: ['A partial factorisation such as taking out only the number scores B1.'],
    });
  },
);

export const a4FactoriseHarderQuadratic = defineGenerator(
  {
    id: 'A4.factorise-quadratic-with-lead-coefficient',
    ref: 'A4',
    title: 'Factorise a quadratic of the form ax^2 + bx + c',
    strand: 'algebra',
    tiers: ['H'],
    ao: 'AO1',
    marks: 2,
    calculator: 'non-calc',
    boards: boardsFor('A4'),
  },
  (rng) => {
    const { a, b, c, d, e, g } = num.factorisableQuadraticWithLead(rng);
    const sign = (v: number, suffix = ''): string => (v < 0 ? `- ${-v}${suffix}` : `+ ${v}${suffix}`);

    return draft({
      params: { a, b, c, d, e, g },
      content: [
        text('Factorise'),
        math(`${a}x^2 ${sign(b, 'x')} ${sign(c)}`, true),
        slot('answer'),
      ],
      answer: expr(`(${d}*x+${e})*(x+${g})`),
      steps: [
        {
          id: 'm1',
          type: 'M',
          values: [expr(`${a}*x^2+${d * g}*x+${e}*x+${c}`)],
          note: 'the middle term split correctly, or one correct bracket seen',
        },
        { id: 'a1', type: 'A', values: [expr(`(${d}*x+${e})*(x+${g})`)] },
      ],
    });
  },
);

export default [a4ExpandTwoBinomials, a4FactoriseCommonFactor, a4FactoriseHarderQuadratic];
