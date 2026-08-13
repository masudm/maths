/**
 * N10 - Work interchangeably with terminating decimals and fractions; convert recurring
 * decimals to fractions at Higher.
 */
import { boardsFor, defineGenerator, draft, Exact, exactValue, intValue, math, num, pickUntil, rat, slot, text } from '../kit.js';

export const n10RecurringDecimal = defineGenerator(
  {
    id: 'N10.recurring-decimal-to-fraction',
    ref: 'N10',
    title: 'Convert a recurring decimal to a fraction in its simplest form',
    strand: 'number',
    tiers: ['H'],
    ao: 'AO2',
    marks: 3,
    calculator: 'non-calc',
    boards: boardsFor('N10'),
  },
  (rng) => {
    const repeat = pickUntil(
      rng,
      (r) => r.int(12, 97),
      (v) => v % 11 !== 0 && v % 10 !== 0,
    );
    const digits = String(repeat).padStart(2, '0');
    const value = rat(repeat, 99);
    const g = num.gcd(repeat, 99);

    return draft({
      params: { repeat, numerator: repeat / g, denominator: 99 / g },
      content: [
        text('Convert the recurring decimal'),
        math(`0.\\dot{${digits[0]}}\\dot{${digits[1]}}`, true),
        text('to a fraction in its simplest form. You must show your working.'),
        slot('answer'),
      ],
      answer: exactValue(Exact.rational(value)),
      requireWorking: true,
      steps: [
        {
          id: 'm1',
          type: 'M',
          values: [intValue(100)],
          note: 'multiplying by 100 so the recurring parts align',
        },
        {
          id: 'm2',
          type: 'M',
          values: [intValue(repeat), intValue(99)],
          dependsOn: ['m1'],
          note: '99x equal to the repeating block',
        },
        { id: 'a1', type: 'A', values: [exactValue(Exact.rational(value))], note: 'simplest form' },
      ],
      guidance: [
        'No working means no marks: the question demands the algebraic method, not a recalled result.',
      ],
    });
  },
);

export default [n10RecurringDecimal];
