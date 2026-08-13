/**
 * G4 - Properties and definitions of special quadrilaterals and triangles.
 */
import { boardsFor, defineGenerator, draft, reason, slot, text } from '../kit.js';

const PAIRS = [
  {
    shape: 'rhombus',
    other: 'parallelogram',
    keywords: [['four sides', 'equal'], ['all sides', 'equal'], ['diagonals', 'right angle'], ['perpendicular']],
    canonical: 'all four sides are equal in length',
  },
  {
    shape: 'square',
    other: 'rectangle',
    keywords: [['all sides', 'equal'], ['four sides', 'equal'], ['equal sides']],
    canonical: 'all four sides are equal in length',
  },
  {
    shape: 'kite',
    other: 'rhombus',
    keywords: [['one pair'], ['adjacent'], ['equal angles']],
    canonical: 'only one pair of opposite angles is equal',
  },
] as const;

export const g4DistinguishQuadrilaterals = defineGenerator(
  {
    id: 'G4.distinguish-quadrilaterals',
    ref: 'G4',
    title: 'Give a property that distinguishes one quadrilateral from another',
    strand: 'geometry',
    tiers: ['F'],
    ao: 'AO2',
    marks: 1,
    calculator: 'non-calc',
    boards: boardsFor('G4'),
  },
  (rng) => {
    const pair = rng.pick(PAIRS);

    return draft({
      params: { shape: pair.shape, other: pair.other },
      content: [
        text(
          `Give one property that a ${pair.shape} always has but a ${pair.other} does not necessarily have.`,
        ),
        slot('answer'),
      ],
      answer: reason(pair.canonical),
      answerSlot: { policy: { keywordGroups: pair.keywords.map((k) => [...k]) } },
      steps: [
        {
          id: 'b1',
          type: 'B',
          values: [reason(pair.canonical)],
          target: 'answer',
          policy: { keywordGroups: pair.keywords.map((k) => [...k]) },
        },
      ],
      guidance: ['Accept any correct distinguishing property.'],
    });
  },
);

export default [g4DistinguishQuadrilaterals];
