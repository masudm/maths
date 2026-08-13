/**
 * G6 - Apply angle facts and triangle properties to derive results, giving reasons.
 *
 * The reason is an independent mark: a correct reason still earns it when the angle is wrong.
 */
import { boardsFor, decimalValue, defineGenerator, draft, fig, figure, reason, slot, text } from '../kit.js';

export const g6IsoscelesWithReason = defineGenerator(
  {
    id: 'G6.isosceles-angle-with-reason',
    ref: 'G6',
    title: 'Find a base angle of an isosceles triangle and justify it',
    strand: 'geometry',
    tiers: ['F+'],
    ao: 'AO2',
    marks: 3,
    calculator: 'non-calc',
    boards: boardsFor('G6'),
  },
  (rng) => {
    const apex = rng.int(10, 70) * 2;
    const base = (180 - apex) / 2;

    return draft({
      params: { apex, base },
      content: [
        text(`ABC is an isosceles triangle with AB = AC. Angle BAC = ${apex}°.`),
        figure(
          fig.diagram(
            fig.triangleFromSAS(80, (180 - apex) / 2, 80, ['A', 'B', 'C']).elements,
            { notToScale: true },
          ),
        ),
        text('(a) Work out the size of angle ABC.'),
        slot('angle', { suffix: '°' }),
        text('(b) Give a reason for your answer.'),
        slot('reason'),
      ],
      slots: [
        { id: 'angle', label: 'angle ABC', expect: decimalValue(base) },
        {
          id: 'reason',
          label: 'reason',
          expect: reason('base angles of an isosceles triangle are equal and angles in a triangle sum to 180°'),
          policy: {
            keywordGroups: [['isosceles'], ['base angles'], ['angles in a triangle']],
          },
        },
      ],
      steps: [
        {
          id: 'm1',
          type: 'M',
          values: [decimalValue(180 - apex)],
          note: '180 minus the apex angle',
        },
        { id: 'a1', type: 'A', values: [decimalValue(base)], target: { slot: 'angle' } },
        {
          id: 'b1',
          type: 'B',
          values: [reason('isosceles')],
          target: { slot: 'reason' },
          policy: { keywordGroups: [['isosceles'], ['base angles'], ['angles in a triangle']] },
          independent: true,
          note: 'a correct reason, awardable even with an incorrect angle',
        },
      ],
    });
  },
);

export default [g6IsoscelesWithReason];
