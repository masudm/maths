/** P2 - Calculate expected outcomes of multiple future experiments. */
import { boardsFor, defineGenerator, draft, Exact, exactValue, intValue, pickUntil, rat, slot, text } from '../kit.js';

export const p2ExpectedOutcomes = defineGenerator(
  {
    id: 'P2.expected-frequency',
    ref: 'P2',
    title: 'Work out an expected frequency from a theoretical probability',
    strand: 'probability',
    tiers: ['F'],
    ao: 'AO1',
    marks: 2,
    calculator: 'either',
    boards: boardsFor('P2'),
  },
  (rng) => {
    const { sections, red, trials } = pickUntil(
      rng,
      (r) => ({ sections: r.int(4, 10), red: r.int(1, 5), trials: r.int(4, 40) * 25 }),
      ({ sections: s, red: k, trials: t }) => k < s && ((k * t) / s) % 1 === 0,
    );
    const expected = (red * trials) / sections;

    return draft({
      params: { sections, red, trials, expected },
      content: [
        text(
          `A fair spinner has ${sections} equal sections, ${red} of which are red. ` +
            `The spinner is spun ${trials} times.`,
        ),
        text('Work out how many times you would expect it to land on red.'),
        slot('answer'),
      ],
      answer: intValue(expected),
      steps: [
        {
          id: 'm1',
          type: 'M',
          values: [exactValue(Exact.rational(rat(red, sections))), intValue(expected)],
          note: 'the probability of red used as a multiplier',
        },
        { id: 'a1', type: 'A', values: [intValue(expected)] },
      ],
    });
  },
);

export default [p2ExpectedOutcomes];
