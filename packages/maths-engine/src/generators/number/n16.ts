/**
 * N16 - Apply and interpret limits of accuracy, including upper and lower bounds.
 */
import { boardsFor, decimalValue, defineGenerator, draft, math, pickUntil, slot, text } from '../kit.js';

export const n16UpperBoundOfQuotient = defineGenerator(
  {
    id: 'N16.upper-bound-of-quotient',
    ref: 'N16',
    title: 'Calculate the upper bound of a quotient from values given to 1 d.p.',
    strand: 'number',
    tiers: ['H'],
    ao: 'AO3',
    marks: 3,
    calculator: 'calc',
    boards: boardsFor('N16'),
  },
  (rng) => {
    const { a, b } = pickUntil(
      rng,
      (r) => ({ a: r.int(30, 190) / 10, b: r.int(15, 60) / 10 }),
      ({ a: x, b: y }) => x / y > 1.2 && x / y < 12,
    );
    const aUpper = Number((a + 0.05).toFixed(4));
    const bLower = Number((b - 0.05).toFixed(4));
    const bound = aUpper / bLower;
    const wrongPairing = aUpper / Number((b + 0.05).toFixed(4));

    return draft({
      params: { a, b, aUpper, bLower, bound },
      content: [
        math(`a = ${a} \\qquad b = ${b}`, true),
        text('Both values are correct to 1 decimal place.'),
        text('Calculate the upper bound of a ÷ b. Give your answer to 3 significant figures.'),
        slot('answer'),
      ],
      answer: decimalValue(Number(bound.toPrecision(3))),
      answerSlot: { policy: { accuracy: { type: 'sf', digits: 3 } } },
      steps: [
        {
          id: 'm1',
          type: 'M',
          values: [decimalValue(aUpper), decimalValue(bLower)],
          note: 'the correct bound identified for either value',
        },
        {
          id: 'm2',
          type: 'M',
          values: [decimalValue(Number(bound.toPrecision(6)))],
          dependsOn: ['m1'],
          policy: { accuracy: { type: 'sf', digits: 3 } },
          note: 'upper divided by lower',
        },
        {
          id: 'a1',
          type: 'A',
          values: [decimalValue(Number(bound.toPrecision(3)))],
          policy: { accuracy: { type: 'sf', digits: 3 } },
        },
      ],
      specialCases: [
        {
          marks: 1,
          values: [decimalValue(Number(wrongPairing.toPrecision(3)))],
          misconception: 'upper-bound-divided-by-upper-bound',
        },
      ],
      guidance: ['Dividing by the upper bound of b instead of the lower bound scores M1 only.'],
    });
  },
);

export default [n16UpperBoundOfQuotient];
