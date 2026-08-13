/** S3 - Histograms with unequal class intervals, and cumulative frequency graphs. */
import { boardsFor, defineGenerator, draft, fig, figure, intValue, pickUntil, slot, text } from '../kit.js';

export const s3HistogramFrequency = defineGenerator(
  {
    id: 'S3.histogram-frequency-from-density',
    ref: 'S3',
    title: 'Find a frequency from a histogram bar',
    strand: 'statistics',
    tiers: ['H'],
    ao: 'AO1',
    marks: 3,
    calculator: 'either',
    boards: boardsFor('S3'),
  },
  (rng) => {
    const { from, width, density } = pickUntil(
      rng,
      // `from` must be positive so that the preceding bar drawn for context has a width.
      (r) => ({ from: r.int(1, 30), width: r.int(5, 20), density: r.int(2, 12) }),
      ({ width: w, density: d }) => Number.isInteger(w * d) && w * d < 400,
    );
    const to = from + width;
    const frequency = width * density;

    return draft({
      params: { from, to, width, density, frequency },
      content: [
        text('A histogram has been drawn for some continuous data.'),
        figure(
          fig.statChart('histogram', {
            xLabel: 'value',
            yLabel: 'frequency density',
            bars: [
              { from: Math.max(0, from - width), to: from, height: Math.max(1, density - 1) },
              { from, to, height: density },
              { from: to, to: to + width, height: Math.max(1, density - 2) },
            ],
          }),
        ),
        text(
          `The bar covering ${from} ⩽ x < ${to} has a frequency density of ${density}.`,
        ),
        text('Work out how many data values are in this class.'),
        slot('answer'),
      ],
      answer: intValue(frequency),
      steps: [
        { id: 'm1', type: 'M', values: [intValue(width)], note: 'the class width found' },
        {
          id: 'm2',
          type: 'M',
          values: [intValue(frequency)],
          dependsOn: ['m1'],
          note: 'their class width multiplied by the frequency density',
        },
        { id: 'a1', type: 'A', values: [intValue(frequency)] },
      ],
      specialCases: [
        {
          marks: 0,
          values: [intValue(density)],
          misconception: 'frequency-density-read-as-frequency',
        },
      ],
    });
  },
);

export default [s3HistogramFrequency];
