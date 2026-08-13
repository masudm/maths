/** P9 - Conditional probability through expected frequencies and diagrams. */
import { boardsFor, defineGenerator, draft, Exact, exactValue, pickUntil, rat, slot, text } from '../kit.js';

export const p9ConditionalProbability = defineGenerator(
  {
    id: 'P9.conditional-probability',
    ref: 'P9',
    title: 'Find a conditional probability after one item has been removed',
    strand: 'probability',
    tiers: ['H'],
    ao: 'AO2',
    marks: 2,
    calculator: 'non-calc',
    boards: boardsFor('P9'),
  },
  (rng) => {
    const { milk, dark } = pickUntil(
      rng,
      (r) => ({ milk: r.int(4, 12), dark: r.int(2, 9) }),
      ({ milk: m, dark: d }) => m + d >= 8 && m + d <= 20 && rat(d, m + d - 1).d !== 1n,
    );
    const total = milk + dark;
    const answer = rat(dark, total - 1);
    const unconditional = rat(dark, total);

    return draft({
      params: { milk, dark, total, answer: answer.toString() },
      content: [
        text(`A box contains ${milk} milk chocolates and ${dark} dark chocolates.`),
        text('One chocolate is eaten, and then another is taken at random.'),
        text('Given that the first chocolate was a milk chocolate, work out the probability that the second is dark.'),
        slot('answer'),
      ],
      answer: exactValue(Exact.rational(answer)),
      answerSlot: { policy: { rejectRatio: true } },
      steps: [
        {
          id: 'm1',
          type: 'M',
          values: [exactValue(Exact.rational(rat(1, total - 1)))],
          note: `recognising that ${total - 1} chocolates remain`,
        },
        {
          id: 'a1',
          type: 'A',
          values: [exactValue(Exact.rational(answer))],
          policy: { rejectRatio: true },
        },
      ],
      specialCases: [
        {
          marks: 0,
          values: [exactValue(Exact.rational(unconditional))],
          misconception: 'condition-ignored-original-total-used',
        },
      ],
    });
  },
);

export default [p9ConditionalProbability];
