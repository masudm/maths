/**
 * R7 - Understand and use proportion as equality of ratios.
 */
import { boardsFor, decimalValue, defineGenerator, draft, pickUntil, slot, text } from '../kit.js';

export const r7UnitaryMethod = defineGenerator(
  {
    id: 'R7.unitary-method',
    ref: 'R7',
    title: 'Use proportion to scale a price to a different quantity',
    strand: 'ratio',
    tiers: ['F'],
    ao: 'AO1',
    marks: 2,
    calculator: 'either',
    boards: boardsFor('R7'),
  },
  (rng) => {
    const { given, wanted, unitPence } = pickUntil(
      rng,
      (r) => ({ given: r.int(3, 12), wanted: r.int(4, 25), unitPence: r.int(15, 250) }),
      ({ given: g, wanted: w }) => g !== w,
    );
    const givenCost = (given * unitPence) / 100;
    const answer = (wanted * unitPence) / 100;

    return draft({
      params: { given, wanted, unitPence, givenCost, answer },
      content: [
        text(`${given} identical pens cost £${givenCost.toFixed(2)}.`),
        text(`Work out the cost of ${wanted} of these pens.`),
        slot('answer', { prefix: '£' }),
      ],
      answer: decimalValue(Number(answer.toFixed(2))),
      answerSlot: { units: '£' },
      steps: [
        {
          id: 'm1',
          type: 'M',
          values: [decimalValue(unitPence / 100)],
          note: 'the cost of one pen, or a correct scaling method',
        },
        { id: 'a1', type: 'A', values: [decimalValue(Number(answer.toFixed(2)))] },
      ],
    });
  },
);

export default [r7UnitaryMethod];
