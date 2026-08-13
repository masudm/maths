/**
 * A21 - Translate a situation into an equation, solve it, and interpret the solution.
 * Modelled on the OCR J560/04 rulers-and-crayons item.
 */
import { boardsFor, decimalValue, defineGenerator, draft, intValue, pickUntil, slot, text } from '../kit.js';

export const a21DeriveAndSolve = defineGenerator(
  {
    id: 'A21.derive-and-solve-from-context',
    ref: 'A21',
    title: 'Form and solve equations from a purchasing context',
    strand: 'algebra',
    tiers: ['F+'],
    ao: 'AO3',
    marks: 5,
    calculator: 'either',
    boards: boardsFor('A21'),
  },
  (rng) => {
    const { rulers, crayons, difference, crayonPence } = pickUntil(
      rng,
      (r) => {
        const rl = r.int(3, 9);
        const cr = r.int(8, 18);
        const diff = r.int(5, 25);
        const cp = r.int(10, 60);
        return { rulers: rl, crayons: cr, difference: diff, crayonPence: cp };
      },
      ({ rulers: rl, crayons: cr, difference: d, crayonPence: cp }) => {
        const total = rl * (cp + d) + cr * cp;
        return total % 10 === 0 && total > 200 && total < 2000;
      },
    );
    const rulerPence = crayonPence + difference;
    const totalPence = rulers * rulerPence + crayons * crayonPence;
    const pounds = (totalPence / 100).toFixed(2);

    return draft({
      params: { rulers, crayons, difference, crayonPence, rulerPence, totalPence },
      content: [
        text(
          `${rulers} rulers and ${crayons} crayons cost £${pounds} in total. ` +
            `A ruler costs ${difference}p more than a crayon.`,
        ),
        text('Work out the cost of one crayon.'),
        slot('answer', { suffix: 'p' }),
      ],
      answer: decimalValue(crayonPence),
      answerSlot: {
        // OCR's scheme for this item accepts "28 or [£]0.28": the same answer in either unit.
        alsoAccept: [decimalValue(crayonPence / 100)],
        alternativeForms: [`£${(crayonPence / 100).toFixed(2)}`],
      },
      steps: [
        {
          id: 'b1',
          type: 'B',
          values: [intValue(totalPence)],
          note: 'a correct equation formed, e.g. 7r + 15c = 700',
        },
        {
          id: 'm1',
          type: 'M',
          values: [intValue(rulers * difference)],
          note: 'substituting r = c + d into the total',
        },
        {
          id: 'm2',
          type: 'M',
          values: [intValue(rulers + crayons)],
          dependsOn: ['m1'],
          note: 'brackets removed and like terms collected',
        },
        {
          id: 'm3',
          type: 'M',
          values: [intValue(totalPence - rulers * difference)],
          dependsOn: ['m2'],
          note: 'rearranged ready to divide',
        },
        { id: 'a1', type: 'A', values: [decimalValue(crayonPence)] },
      ],
      guidance: [
        'Allow any pair of letters, and allow the working in pence or in pounds throughout.',
        'Trial and improvement scores 0 or 5 only.',
      ],
    });
  },
);

export default [a21DeriveAndSolve];
