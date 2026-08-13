/** P6 - Enumerate sets and combinations systematically, using Venn diagrams. */
import { boardsFor, defineGenerator, draft, fig, figure, intValue, pickUntil, slot, text } from '../kit.js';

export const p6VennNeither = defineGenerator(
  {
    id: 'P6.venn-diagram-neither',
    ref: 'P6',
    title: 'Use a Venn diagram to find how many are in neither set',
    strand: 'probability',
    tiers: ['F'],
    ao: 'AO3',
    marks: 2,
    calculator: 'non-calc',
    boards: boardsFor('P6'),
  },
  (rng) => {
    const { french, german, both, total } = pickUntil(
      rng,
      (r) => ({
        french: r.int(8, 22),
        german: r.int(8, 22),
        both: r.int(2, 8),
        total: r.int(28, 45),
      }),
      ({ french: f, german: g, both: b, total: t }) => {
        const union = f + g - b;
        return b < Math.min(f, g) && union < t && t - union >= 2;
      },
    );
    const union = french + german - both;
    const neither = total - union;

    return draft({
      params: { french, german, both, total, union, neither },
      content: [
        text(
          `In a group of ${total} students, ${french} study French, ${german} study German and ${both} study both.`,
        ),
        figure(
          fig.venn(['French', 'German'], {
            A: `${french - both}`,
            AB: `${both}`,
            B: `${german - both}`,
            '': '?',
          }),
        ),
        text('Work out how many students study neither language.'),
        slot('answer'),
      ],
      answer: intValue(neither),
      steps: [
        {
          id: 'm1',
          type: 'M',
          values: [intValue(union)],
          note: 'the number studying at least one language',
        },
        { id: 'a1', type: 'A', values: [intValue(neither)] },
      ],
      specialCases: [
        {
          marks: 0,
          values: [intValue(total - french - german)],
          misconception: 'overlap-not-added-back-in-inclusion-exclusion',
        },
      ],
    });
  },
);

export default [p6VennNeither];
