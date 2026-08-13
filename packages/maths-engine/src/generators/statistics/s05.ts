/** S5 - Apply statistics to describe a population. */
import { boardsFor, decimalValue, defineGenerator, draft, pickUntil, slot, text } from '../kit.js';

export const s5NewMean = defineGenerator(
  {
    id: 'S5.mean-after-an-extra-value',
    ref: 'S5',
    title: 'Recalculate a mean when one more value is added',
    strand: 'statistics',
    tiers: ['F+'],
    ao: 'AO3',
    marks: 3,
    calculator: 'either',
    boards: boardsFor('S5'),
  },
  (rng) => {
    const { count, meanTenths, extraTenths } = pickUntil(
      rng,
      (r) => ({
        count: r.int(8, 40),
        meanTenths: r.int(120, 200),
        extraTenths: r.int(140, 210),
      }),
      ({ meanTenths: m, extraTenths: e }) => Math.abs(m - e) >= 10,
    );
    const mean = meanTenths / 100;
    const extra = extraTenths / 100;
    const total = Number(((count * meanTenths) / 100).toFixed(4));
    const newMean = (total + extra) / (count + 1);

    return draft({
      params: { count, mean, extra, total, newMean },
      content: [
        text(`${count} students have a mean height of ${mean.toFixed(2)} m.`),
        text(`A student of height ${extra.toFixed(2)} m joins the group.`),
        text('Work out the new mean height. Give your answer to 3 significant figures.'),
        slot('answer', { suffix: 'm' }),
      ],
      answer: decimalValue(Number(newMean.toPrecision(3))),
      answerSlot: { units: 'm', policy: { accuracy: { type: 'sf', digits: 3 } } },
      steps: [
        {
          id: 'm1',
          type: 'M',
          values: [decimalValue(total)],
          policy: { tolerance: 0.005 },
          note: 'the total height of the original group',
        },
        {
          id: 'm2',
          type: 'M',
          values: [decimalValue(Number(newMean.toPrecision(6)))],
          dependsOn: ['m1'],
          policy: { accuracy: { type: 'sf', digits: 3 } },
          note: 'their total plus the extra value, divided by the new count',
        },
        {
          id: 'a1',
          type: 'A',
          values: [decimalValue(Number(newMean.toPrecision(3)))],
          policy: { accuracy: { type: 'sf', digits: 3 } },
        },
      ],
      specialCases: [
        {
          marks: 0,
          values: [decimalValue(Number(((mean + extra) / 2).toPrecision(3)))],
          misconception: 'mean-of-two-means-taken',
        },
      ],
    });
  },
);

export default [s5NewMean];
