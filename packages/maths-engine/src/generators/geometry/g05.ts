/**
 * G5 - The basic congruence criteria for triangles: SSS, SAS, ASA, RHS.
 */
import { boardsFor, choiceValue, defineGenerator, draft, slot, text } from '../kit.js';

const CASES = [
  {
    criterion: 'SAS',
    description: 'AB = PQ, BC = QR and the angle at B equals the angle at Q',
  },
  {
    criterion: 'SSS',
    description: 'AB = PQ, BC = QR and CA = RP',
  },
  {
    criterion: 'ASA',
    description: 'the angle at A equals the angle at P, AB = PQ and the angle at B equals the angle at Q',
  },
  {
    criterion: 'RHS',
    description: 'both triangles have a right angle, the hypotenuses are equal and AB = PQ',
  },
] as const;

export const g5CongruenceCriterion = defineGenerator(
  {
    id: 'G5.congruence-criterion',
    ref: 'G5',
    title: 'Name the congruence criterion that proves two triangles congruent',
    strand: 'geometry',
    tiers: ['F+'],
    ao: 'AO2',
    marks: 1,
    calculator: 'non-calc',
    boards: boardsFor('G5'),
  },
  (rng) => {
    const chosen = rng.pick(CASES);

    return draft({
      params: { criterion: chosen.criterion },
      content: [
        text(`In triangles ABC and PQR, ${chosen.description}.`),
        text('Write down the congruence criterion that proves the two triangles are congruent.'),
        slot('answer'),
      ],
      answer: choiceValue(chosen.criterion),
      steps: [
        { id: 'b1', type: 'B', values: [choiceValue(chosen.criterion)], target: 'answer' },
      ],
      guidance: [
        'The criterion must be named precisely: "two sides and an angle" does not identify SAS.',
      ],
    });
  },
);

export default [g5CongruenceCriterion];
