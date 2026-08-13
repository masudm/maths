/** P4 - The probabilities of an exhaustive set of mutually exclusive events sum to 1. */
import { boardsFor, decimalValue, defineGenerator, draft, pickUntil, slot, text } from '../kit.js';

export const p4ExhaustiveProbabilities = defineGenerator(
  {
    id: 'P4.probabilities-sum-to-one',
    ref: 'P4',
    title: 'Find a missing probability using the total of 1',
    strand: 'probability',
    tiers: ['F'],
    ao: 'AO1',
    marks: 2,
    calculator: 'non-calc',
    boards: boardsFor('P4'),
  },
  (rng) => {
    const { red, blue } = pickUntil(
      rng,
      (r) => ({ red: r.int(5, 60) / 100, blue: r.int(5, 60) / 100 }),
      ({ red: a, blue: b }) => a + b < 0.95,
    );
    const green = Number((1 - red - blue).toFixed(2));

    return draft({
      params: { red, blue, green },
      content: [
        text('A bag contains red, blue and green counters only. One counter is taken at random.'),
        text(`P(red) = ${red} and P(blue) = ${blue}.`),
        text('Work out P(green).'),
        slot('answer'),
      ],
      answer: decimalValue(green),
      answerSlot: { policy: { rejectRatio: true } },
      steps: [
        {
          id: 'm1',
          type: 'M',
          values: [decimalValue(Number((red + blue).toFixed(2)))],
          note: 'the two given probabilities added, or 1 minus their sum attempted',
        },
        { id: 'a1', type: 'A', values: [decimalValue(green)], policy: { rejectRatio: true } },
      ],
    });
  },
);

export default [p4ExhaustiveProbabilities];
