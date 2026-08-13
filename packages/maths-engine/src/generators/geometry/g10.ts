/**
 * G10 - The circle theorems. OCR splits these into seven statements, each phrased
 * "apply and prove"; AQA gathers them into one. The reason mark requires the theorem to be
 * named, not gestured at.
 */
import { boardsFor, decimalValue, defineGenerator, draft, fig, figure, reason, slot, text } from '../kit.js';

const THEOREMS = [
  {
    id: 'cyclic-quadrilateral',
    setup: (given: number) => `A, B, C and D lie on a circle. Angle ABC = ${given}°.`,
    question: 'Work out the size of angle ADC.',
    answer: (given: number) => 180 - given,
    keywords: [['cyclic quadrilateral'], ['opposite angles', '180']],
    canonical: 'opposite angles in a cyclic quadrilateral sum to 180°',
  },
  {
    id: 'angle-at-centre',
    setup: (given: number) => `A, B and C lie on a circle with centre O. Angle ABC = ${given}°.`,
    question: 'Work out the size of the angle AOC at the centre.',
    answer: (given: number) => 2 * given,
    keywords: [['centre', 'twice'], ['double', 'circumference'], ['twice the angle']],
    canonical: 'the angle at the centre is twice the angle at the circumference',
  },
] as const;

export const g10CircleTheorem = defineGenerator(
  {
    id: 'G10.circle-theorem-with-reason',
    ref: 'G10',
    title: 'Apply a circle theorem and name it',
    strand: 'geometry',
    tiers: ['H'],
    ao: 'AO2',
    marks: 3,
    calculator: 'non-calc',
    boards: boardsFor('G10'),
  },
  (rng) => {
    const theorem = rng.pick(THEOREMS);
    const given = theorem.id === 'angle-at-centre' ? rng.int(20, 80) : rng.int(50, 130);
    const answer = theorem.answer(given);

    return draft({
      params: { theorem: theorem.id, given, answer },
      content: [
        text(theorem.setup(given)),
        figure(
          fig.circleWithPoints(
            [
              { degrees: 110, label: 'A' },
              { degrees: 190, label: 'B' },
              { degrees: 320, label: 'C' },
              { degrees: 40, label: 'D' },
            ],
            {
              showCentre: theorem.id === 'angle-at-centre',
              chords: [
                ['A', 'B'],
                ['B', 'C'],
                ['C', 'D'],
                ['D', 'A'],
              ],
            },
          ),
        ),
        text(`(a) ${theorem.question}`),
        slot('angle', { suffix: '°' }),
        text('(b) Give a reason for your answer.'),
        slot('reason'),
      ],
      slots: [
        { id: 'angle', label: 'angle', expect: decimalValue(answer) },
        {
          id: 'reason',
          label: 'reason',
          expect: reason(theorem.canonical),
          policy: { keywordGroups: theorem.keywords.map((k) => [...k]) },
        },
      ],
      steps: [
        {
          id: 'm1',
          type: 'M',
          values: [decimalValue(answer)],
          note: 'the correct theorem applied',
        },
        { id: 'a1', type: 'A', values: [decimalValue(answer)], target: { slot: 'angle' } },
        {
          id: 'b1',
          type: 'B',
          values: [reason(theorem.canonical)],
          target: { slot: 'reason' },
          policy: { keywordGroups: theorem.keywords.map((k) => [...k]) },
          independent: true,
          note: 'the theorem named correctly',
        },
      ],
      guidance: ['"Angles in a circle" is not a reason: the theorem must be named.'],
    });
  },
);

export default [g10CircleTheorem];
