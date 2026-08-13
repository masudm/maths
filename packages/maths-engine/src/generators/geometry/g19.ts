/** G19 - Congruence and similarity, including lengths, areas and volumes in similar figures. */
import { boardsFor, decimalValue, defineGenerator, draft, pickUntil, slot, text } from '../kit.js';

export const g19SimilarVolumes = defineGenerator(
  {
    id: 'G19.similar-solids-volume',
    ref: 'G19',
    title: 'Find the volume of a similar solid using the cube of the length scale factor',
    strand: 'geometry',
    tiers: ['H'],
    ao: 'AO3',
    marks: 3,
    calculator: 'either',
    boards: boardsFor('G19'),
  },
  (rng) => {
    const { small, large, volume } = pickUntil(
      rng,
      (r) => ({ small: r.int(2, 8), large: r.int(3, 16), volume: r.int(2, 40) * 4 }),
      ({ small: s, large: l, volume: v }) => {
        if (l <= s) return false;
        const scale = l / s;
        const answer = v * scale ** 3;
        return Number.isInteger(answer) && answer < 100000;
      },
    );
    const scale = large / small;
    const answer = volume * scale ** 3;
    const linearError = volume * scale;

    return draft({
      params: { small, large, volume, scale, answer },
      content: [
        text(
          `Two cones are mathematically similar. Their heights are ${small} cm and ${large} cm.`,
        ),
        text(`The volume of the smaller cone is ${volume} cm³.`),
        text('Work out the volume of the larger cone.'),
        slot('answer', { suffix: 'cm³' }),
      ],
      answer: decimalValue(answer),
      answerSlot: { units: 'cm3' },
      steps: [
        {
          id: 'm1',
          type: 'M',
          values: [decimalValue(Number(scale.toFixed(6)))],
          note: 'the linear scale factor found',
        },
        {
          id: 'm2',
          type: 'M',
          values: [decimalValue(Number((scale ** 3).toFixed(6)))],
          dependsOn: ['m1'],
          note: 'their linear scale factor cubed',
        },
        { id: 'a1', type: 'A', values: [decimalValue(answer)] },
      ],
      specialCases: [
        {
          marks: 1,
          values: [decimalValue(Number(linearError.toFixed(6)))],
          misconception: 'linear-scale-factor-applied-to-volume',
        },
      ],
    });
  },
);

export default [g19SimilarVolumes];
