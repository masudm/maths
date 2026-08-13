/**
 * R5 - Divide a quantity in a given ratio and apply ratio to real contexts.
 */
import { boardsFor, decimalValue, defineGenerator, draft, intValue, pickUntil, slot, text } from '../kit.js';

export const r5ShareInRatio = defineGenerator(
  {
    id: 'R5.share-in-a-ratio-difference',
    ref: 'R5',
    title: 'Share an amount in a given ratio and find the difference between the shares',
    strand: 'ratio',
    tiers: ['F+'],
    ao: 'AO3',
    marks: 4,
    calculator: 'either',
    boards: boardsFor('R5'),
  },
  (rng) => {
    const { p, q, total } = pickUntil(
      rng,
      (r) => {
        const a = r.int(2, 7);
        const b = r.int(2, 9);
        const parts = a + b;
        return { p: a, q: b, total: parts * r.int(10, 60) };
      },
      // p = 2q would make the difference equal to one of the shares, so the "stopped at the
      // shares" distractor would coincide with the correct answer.
      ({ p: a, q: b }) => a !== b && a !== 2 * b && b !== 2 * a,
    );
    const parts = p + q;
    const unit = total / parts;
    const shareA = unit * p;
    const shareB = unit * q;
    const difference = Math.abs(shareB - shareA);

    return draft({
      params: { p, q, total, parts, unit, shareA, shareB, difference },
      content: [
        text(`£${total} is shared between Ann and Ben in the ratio ${p} : ${q}.`),
        text('How much more than Ann does Ben receive?'),
        slot('answer', { prefix: '£' }),
      ],
      answer: decimalValue(difference),
      answerSlot: { units: '£' },
      steps: [
        { id: 'm1', type: 'M', values: [intValue(parts)], note: 'the total number of parts' },
        {
          id: 'm2',
          type: 'M',
          values: [decimalValue(unit)],
          dependsOn: ['m1'],
          note: 'the value of one part',
        },
        {
          id: 'm3',
          type: 'M',
          values: [decimalValue(difference)],
          dependsOn: ['m2'],
          note: 'their one part multiplied by the difference in the ratio',
        },
        { id: 'a1', type: 'A', values: [decimalValue(difference)] },
      ],
      specialCases: [
        {
          marks: 2,
          values: [decimalValue(shareB)],
          misconception: 'shares-found-but-difference-not-taken',
        },
      ],
    });
  },
);

export default [r5ShareInRatio];
