/**
 * P3 - Relative frequency and the 0 to 1 probability scale.
 *
 * A probability written as a ratio scores zero even when the value is right, which is a rule
 * both boards state explicitly.
 */
import { boardsFor, defineGenerator, draft, Exact, exactValue, pickUntil, rat, slot, text } from '../kit.js';

export const p3RelativeFrequency = defineGenerator(
  {
    id: 'P3.relative-frequency',
    ref: 'P3',
    title: 'Estimate a probability from experimental results',
    strand: 'probability',
    tiers: ['F'],
    ao: 'AO1',
    marks: 1,
    calculator: 'either',
    boards: boardsFor('P3'),
  },
  (rng) => {
    const { trials, successes } = pickUntil(
      rng,
      (r) => ({ trials: r.int(4, 40) * 25, successes: r.int(10, 400) }),
      ({ trials: t, successes: s }) => s > 0 && s < t,
    );
    const probability = rat(successes, trials);

    return draft({
      params: { trials, successes, probability: probability.toString() },
      content: [
        text(`A biased coin is thrown ${trials} times. It lands on heads ${successes} times.`),
        text('Estimate the probability that the coin lands on heads.'),
        slot('answer'),
      ],
      answer: exactValue(Exact.rational(probability)),
      answerSlot: {
        policy: { rejectRatio: true },
        alternativeForms: [`${successes}/${trials}`],
      },
      steps: [
        {
          id: 'b1',
          type: 'B',
          values: [exactValue(Exact.rational(probability))],
          target: 'answer',
          policy: { rejectRatio: true },
          note: 'oe as a fraction, decimal or percentage',
        },
      ],
      guidance: [
        'Accept an unsimplified fraction and ignore a wrong simplification once the correct value is seen, but a ratio always scores zero.',
      ],
    });
  },
);

export default [p3RelativeFrequency];
