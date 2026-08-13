/**
 * R12 - Compare lengths, areas and volumes using ratio notation and scale factors.
 */
import { boardsFor, defineGenerator, draft, pickUntil, ratioValue, slot, text } from '../kit.js';

export const r12AreaToVolumeRatio = defineGenerator(
  {
    id: 'R12.area-ratio-to-volume-ratio',
    ref: 'R12',
    title: 'Convert a ratio of surface areas into a ratio of volumes',
    strand: 'ratio',
    tiers: ['H'],
    ao: 'AO2',
    marks: 2,
    calculator: 'non-calc',
    boards: boardsFor('R12'),
  },
  (rng) => {
    const { a, b } = pickUntil(
      rng,
      (r) => ({ a: r.int(2, 7), b: r.int(2, 9) }),
      ({ a: p, b: q }) => p !== q,
    );

    return draft({
      params: { a, b, areaRatio: [a * a, b * b], volumeRatio: [a ** 3, b ** 3] },
      content: [
        text(
          `Two solids are mathematically similar. Their surface areas are in the ratio ${a * a} : ${b * b}.`,
        ),
        text('Work out the ratio of their volumes.'),
        slot('answer'),
      ],
      answer: ratioValue(a ** 3, b ** 3),
      steps: [
        {
          id: 'm1',
          type: 'M',
          values: [ratioValue(a, b)],
          note: 'the ratio of lengths found by square rooting',
        },
        { id: 'a1', type: 'A', values: [ratioValue(a ** 3, b ** 3)] },
      ],
      specialCases: [
        {
          marks: 0,
          values: [ratioValue(a ** 6, b ** 6)],
          misconception: 'area-ratio-cubed-without-taking-the-root',
          note: 'the given area ratio cubed directly',
        },
      ],
    });
  },
);

export default [r12AreaToVolumeRatio];
