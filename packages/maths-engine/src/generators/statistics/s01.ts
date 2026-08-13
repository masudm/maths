/** S1 - Infer properties of populations from a sample, knowing the limitations of sampling. */
import { boardsFor, defineGenerator, draft, reason, slot, text } from '../kit.js';

const SCENARIOS = [
  {
    place: 'leaving a gym',
    topic: 'how much exercise people do',
    keywords: [['gym'], ['more likely', 'exercise'], ['not representative'], ['biased']],
    canonical: 'people leaving a gym are more likely to exercise than the general population, so the sample is not representative',
  },
  {
    place: 'in a library',
    topic: 'how many books people read',
    keywords: [['library'], ['more likely', 'read'], ['not representative'], ['biased']],
    canonical: 'people in a library are more likely to read than the general population, so the sample is not representative',
  },
  {
    place: 'at a bus stop',
    topic: 'how people travel to work',
    keywords: [['bus'], ['more likely'], ['not representative'], ['biased']],
    canonical: 'people at a bus stop are more likely to travel by bus, so the sample is not representative',
  },
] as const;

export const s1SamplingBias = defineGenerator(
  {
    id: 'S1.sampling-bias',
    ref: 'S1',
    title: 'Identify why a sample is biased',
    strand: 'statistics',
    tiers: ['F+'],
    ao: 'AO2',
    marks: 1,
    calculator: 'non-calc',
    boards: boardsFor('S1'),
  },
  (rng) => {
    const scenario = rng.pick(SCENARIOS);
    const size = rng.int(15, 40);

    return draft({
      params: { place: scenario.place, topic: scenario.topic, size },
      content: [
        text(
          `A researcher surveys ${size} people ${scenario.place} to find out ${scenario.topic}.`,
        ),
        text('Give one reason why this sample may be biased.'),
        slot('answer'),
      ],
      answer: reason(scenario.canonical),
      answerSlot: { policy: { keywordGroups: scenario.keywords.map((k) => [...k]) } },
      steps: [
        {
          id: 'b1',
          type: 'B',
          values: [reason(scenario.canonical)],
          target: 'answer',
          policy: { keywordGroups: scenario.keywords.map((k) => [...k]) },
        },
      ],
      guidance: ['Accept any reason identifying that the sample is unrepresentative.'],
    });
  },
);

export default [s1SamplingBias];
