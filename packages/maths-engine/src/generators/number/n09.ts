/**
 * N9 - Calculate with and interpret standard form.
 */
import { boardsFor, defineGenerator, draft, decimalValue, expr, math, slot, text } from '../kit.js';

export const n9StandardFormProduct = defineGenerator(
  {
    id: 'N9.standard-form-product',
    ref: 'N9',
    title: 'Multiply two numbers in standard form',
    strand: 'number',
    tiers: ['F+'],
    ao: 'AO1',
    marks: 3,
    calculator: 'non-calc',
    boards: boardsFor('N9'),
  },
  (rng) => {
    // Choose mantissas whose product needs renormalising, which is where the marks are.
    const a = rng.int(20, 95) / 10;
    const b = rng.int(2, 9);
    const p = rng.int(3, 8);
    const q = rng.intNonZero(-5, 4);

    const rawMantissa = a * b;
    const exponentShift = Math.floor(Math.log10(rawMantissa));
    const mantissa = Number((rawMantissa / 10 ** exponentShift).toFixed(6));
    const exponent = p + q + exponentShift;

    return draft({
      params: { a, b, p, q, mantissa, exponent, rawMantissa },
      content: [
        text('Work out'),
        math(`(${a} \\times 10^{${p}}) \\times (${b} \\times 10^{${q}})`, true),
        text('Give your answer in standard form.'),
        slot('answer'),
      ],
      answer: expr(`${mantissa}*10^${exponent}`),
      answerSlot: { policy: { requireStandardForm: true } },
      steps: [
        {
          id: 'm1',
          type: 'M',
          values: [decimalValue(rawMantissa), decimalValue(p + q)],
          note: 'the mantissas multiplied, or the indices added',
        },
        {
          id: 'm2',
          type: 'M',
          values: [decimalValue(mantissa * 10 ** exponent)],
          dependsOn: ['m1'],
          note: 'a correct value before renormalising',
        },
        {
          id: 'a1',
          type: 'A',
          values: [expr(`${mantissa}*10^${exponent}`)],
          policy: { requireStandardForm: true },
          note: 'in standard form',
        },
      ],
      guidance: [
        'An answer with the correct value but a mantissa outside 1 <= A < 10 scores the method marks only.',
      ],
    });
  },
);

export default [n9StandardFormProduct];
