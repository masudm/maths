/**
 * R16 - Growth and decay problems, including compound interest.
 */
import { boardsFor, decimalValue, defineGenerator, draft, slot, text } from '../kit.js';

export const r16CompoundInterest = defineGenerator(
  {
    id: 'R16.compound-interest',
    ref: 'R16',
    title: 'Calculate the value of an investment after compound interest',
    strand: 'ratio',
    tiers: ['F+'],
    ao: 'AO1',
    marks: 3,
    calculator: 'calc',
    boards: boardsFor('R16'),
  },
  (rng) => {
    const principal = rng.int(8, 90) * 100;
    const rateTenths = rng.int(10, 60);
    const rate = rateTenths / 10;
    const years = rng.int(3, 12);
    const multiplier = 1 + rate / 100;
    const value = Number((principal * multiplier ** years).toFixed(2));
    const simple = Number((principal * (1 + (rate / 100) * years)).toFixed(2));

    return draft({
      params: { principal, rate, years, multiplier, value, simple },
      content: [
        text(
          `£${principal} is invested at ${rate}% compound interest per year for ${years} years.`,
        ),
        text('Work out the value of the investment at the end of the period.'),
        text('Give your answer to the nearest penny.'),
        slot('answer', { prefix: '£' }),
      ],
      answer: decimalValue(value),
      answerSlot: { units: '£', policy: { tolerance: 0.005 } },
      steps: [
        {
          id: 'm1',
          type: 'M',
          values: [decimalValue(multiplier)],
          note: 'the correct multiplier identified',
        },
        {
          id: 'm2',
          type: 'M',
          values: [decimalValue(value)],
          dependsOn: ['m1'],
          policy: { tolerance: 0.005 },
          note: 'the principal multiplied by their multiplier to the power of the years',
        },
        { id: 'a1', type: 'A', values: [decimalValue(value)], policy: { tolerance: 0.005 } },
      ],
      specialCases: [
        {
          marks: 1,
          values: [decimalValue(simple)],
          misconception: 'simple-interest-used-instead-of-compound',
        },
      ],
      guidance: [
        'Year-by-year working is fully acceptable. AQA places the compound interest formula in the group students must know or be able to derive.',
      ],
    });
  },
);

export default [r16CompoundInterest];
