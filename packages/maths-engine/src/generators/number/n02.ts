/**
 * N2 - Apply the four operations to integers and decimals in context, including the
 * vocabulary of household finance (profit, cost price, selling price).
 */
import { boardsFor, decimalValue, defineGenerator, draft, num, slot, text } from '../kit.js';

export const n2Profit = defineGenerator(
  {
    id: 'N2.profit-in-context',
    ref: 'N2',
    title: 'Four operations in a profit and loss context',
    strand: 'number',
    tiers: ['F'],
    ao: 'AO3',
    marks: 4,
    calculator: 'either',
    boards: boardsFor('N2'),
  },
  (rng) => {
    const quantity = rng.int(12, 40);
    const costPence = rng.int(120, 600);
    const sellPence = costPence + rng.int(40, 350);

    const totalCost = (quantity * costPence) / 100;
    const totalRevenue = (quantity * sellPence) / 100;
    const profit = totalRevenue - totalCost;

    const money = (pence: number): string =>
      `£${Math.floor(pence / 100)}.${String(pence % 100).padStart(2, '0')}`;

    return draft({
      params: { quantity, costPence, sellPence, profitPence: quantity * (sellPence - costPence) },
      content: [
        text(
          `A shop buys ${quantity} identical mugs at a cost price of ${money(costPence)} each. ` +
            `The shop sells all of them at ${money(sellPence)} each.`,
        ),
        text('Work out the total profit.'),
        slot('answer', { prefix: '£' }),
      ],
      answer: decimalValue(num.roundDp(profit, 2)),
      answerSlot: { units: '£' },
      steps: [
        {
          id: 'm1',
          type: 'M',
          values: [decimalValue(num.roundDp(totalCost, 2))],
          note: 'total cost price',
        },
        {
          id: 'm2',
          type: 'M',
          values: [decimalValue(num.roundDp(totalRevenue, 2))],
          note: 'total selling price',
        },
        {
          id: 'm3',
          type: 'M',
          values: [decimalValue(num.roundDp(profit, 2))],
          dependsOn: ['m1', 'm2'],
          note: 'their selling price minus their cost price',
        },
        { id: 'a1', type: 'A', values: [decimalValue(num.roundDp(profit, 2))] },
      ],
      specialCases: [
        {
          marks: 2,
          values: [decimalValue(num.roundDp((sellPence - costPence) / 100, 2))],
          misconception: 'profit-per-item-not-total',
          note: 'profit on one item only',
        },
      ],
      guidance: ['Accept working in pounds or in pence throughout.'],
    });
  },
);

export default [n2Profit];
