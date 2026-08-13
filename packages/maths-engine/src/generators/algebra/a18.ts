/**
 * A18 - Solve quadratic equations, including by using the quadratic formula.
 */
import { boardsFor, decimalValue, defineGenerator, draft, intValue, math, pickUntil, setValue, signed, slot, text } from '../kit.js';

export const a18QuadraticFormula = defineGenerator(
  {
    id: 'A18.quadratic-formula',
    ref: 'A18',
    title: 'Solve a quadratic equation using the formula, to two decimal places',
    strand: 'algebra',
    tiers: ['H'],
    ao: 'AO1',
    marks: 4,
    calculator: 'calc',
    boards: boardsFor('A18'),
  },
  (rng) => {
    const { a, b, c } = pickUntil(
      rng,
      (r) => ({ a: r.int(1, 4), b: r.intNonZero(-9, 9), c: r.intNonZero(-9, 9) }),
      ({ a: p, b: q, c: u }) => {
        const disc = q * q - 4 * p * u;
        if (disc <= 0) return false;
        const root = Math.sqrt(disc);
        // A non-square discriminant is what forces the formula rather than factorising.
        return Math.abs(root - Math.round(root)) > 1e-6;
      },
    );
    const disc = b * b - 4 * a * c;
    const root = Math.sqrt(disc);
    const r1 = Number(((-b + root) / (2 * a)).toFixed(2));
    const r2 = Number(((-b - root) / (2 * a)).toFixed(2));

    return draft({
      params: { a, b, c, disc, r1, r2 },
      content: [
        text('Solve'),
        math(`${a === 1 ? '' : a}x^2 ${signed(b, 'x')} ${signed(c)} = 0`, true),
        text('Give your answers to 2 decimal places.'),
        slot('answer'),
      ],
      answer: setValue([decimalValue(r1), decimalValue(r2)], false),
      answerSlot: { policy: { accuracy: { type: 'dp', digits: 2 } } },
      steps: [
        {
          id: 'm1',
          type: 'M',
          values: [intValue(disc)],
          note: 'correct substitution into the quadratic formula',
        },
        {
          id: 'm2',
          type: 'M',
          values: [decimalValue(Number(root.toFixed(4)))],
          dependsOn: ['m1'],
          policy: { tolerance: 0.005 },
          note: 'the square root of their discriminant',
        },
        {
          id: 'a1',
          type: 'A',
          values: [decimalValue(r1)],
          policy: { tolerance: 0.005 },
          note: 'one root correct to 2 d.p.',
        },
        {
          id: 'a2',
          type: 'A',
          values: [setValue([decimalValue(r1), decimalValue(r2)], false)],
          policy: { tolerance: 0.005 },
          note: 'both roots correct to 2 d.p.',
        },
      ],
      guidance: [
        'The quadratic formula must be recalled: it is in AQA Appendix group 1 and OCR statement 6.02d.',
      ],
    });
  },
);

export default [a18QuadraticFormula];
