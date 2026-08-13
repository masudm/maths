/** S2 - Interpret and construct tables, charts and diagrams. */
import { boardsFor, decimalValue, defineGenerator, draft, fig, figure, intValue, pickUntil, slot, text } from '../kit.js';

export const s2PieChartAngle = defineGenerator(
  {
    id: 'S2.pie-chart-angle',
    ref: 'S2',
    title: 'Work out the angle of a pie chart sector',
    strand: 'statistics',
    tiers: ['F'],
    ao: 'AO1',
    marks: 2,
    calculator: 'either',
    boards: boardsFor('S2'),
  },
  (rng) => {
    const { total, count } = pickUntil(
      rng,
      (r) => ({ total: r.pick([20, 24, 30, 36, 40, 45, 60, 72, 90]), count: r.int(2, 30) }),
      ({ total: t, count: c }) => c < t && ((c * 360) / t) % 1 === 0,
    );
    const angle = (count * 360) / total;
    const others = [
      Math.max(1, Math.floor((total - count) / 2)),
      total - count - Math.max(1, Math.floor((total - count) / 2)),
    ];

    return draft({
      params: { total, count, angle },
      content: [
        text(`${total} people were asked to name their favourite sport. ${count} chose football.`),
        figure(
          fig.statChart('pie', {
            categories: ['Football', 'Rugby', 'Other'],
            values: [count, others[0]!, others[1]!],
          }),
        ),
        text('The results are shown in a pie chart. Work out the angle of the football sector.'),
        slot('answer', { suffix: '°' }),
      ],
      answer: decimalValue(angle),
      steps: [
        {
          id: 'm1',
          type: 'M',
          values: [decimalValue(360 / total), intValue(count * 360)],
          note: 'the angle for one person, or a correct multiplication set up',
        },
        { id: 'a1', type: 'A', values: [decimalValue(angle)] },
      ],
    });
  },
);

export default [s2PieChartAngle];
