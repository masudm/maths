/**
 * R14 - Interpret the gradient of a straight-line graph as a rate of change.
 *
 * The interpretation mark is AO2: a bare number does not earn it.
 */
import { boardsFor, decimalValue, defineGenerator, draft, fig, figure, reason, slot, text } from '../kit.js';

export const r14GradientAsRate = defineGenerator(
  {
    id: 'R14.gradient-as-rate-of-change',
    ref: 'R14',
    title: 'Interpret the gradient of a cost graph as a rate of change',
    strand: 'ratio',
    tiers: ['F+'],
    ao: 'AO2',
    marks: 2,
    calculator: 'either',
    boards: boardsFor('R14'),
  },
  (rng) => {
    const fixed = rng.int(2, 30);
    const rate = rng.int(3, 25);
    const hours = rng.int(3, 8);
    const endCost = fixed + rate * hours;

    return draft({
      params: { fixed, rate, hours, endCost },
      content: [
        text(
          `The graph shows the cost of hiring a machine. It passes through (0, ${fixed}) and (${hours}, ${endCost}).`,
        ),
        figure(
          fig.axes({
            xMin: 0,
            xMax: hours,
            yMin: 0,
            yMax: endCost,
            xLabel: 'hours hired',
            yLabel: 'cost (£)',
            plots: [{ points: [fig.pt(0, fixed), fig.pt(hours, endCost)] }],
          }),
        ),
        text('(a) Work out the gradient of the line.'),
        slot('gradient'),
        text('(b) Explain what the gradient represents.'),
        slot('meaning'),
      ],
      slots: [
        { id: 'gradient', label: 'gradient', expect: decimalValue(rate) },
        {
          id: 'meaning',
          label: 'interpretation',
          expect: reason(`the cost of £${rate} for each extra hour of hire`),
          policy: {
            keywordGroups: [
              ['cost', 'hour'],
              ['per hour'],
              ['each hour'],
            ],
          },
        },
      ],
      steps: [
        { id: 'm1', type: 'M', values: [decimalValue(rate)], note: 'a correct gradient calculation' },
        {
          id: 'b1',
          type: 'B',
          values: [reason('cost per hour')],
          target: { slot: 'meaning' },
          policy: { keywordGroups: [['cost', 'hour'], ['per hour'], ['each hour']] },
          note: 'the rate interpreted in context',
        },
      ],
      guidance: ['A bare number with no interpretation scores the method mark only.'],
    });
  },
);

export default [r14GradientAsRate];
