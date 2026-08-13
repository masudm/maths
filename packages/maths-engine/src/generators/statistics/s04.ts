/**
 * S4 - Compare distributions using an average and a measure of spread.
 *
 * Both marks are AO2: the comparison must be in context, not a restatement of the figures.
 */
import { boardsFor, defineGenerator, draft, fig, figure, pickUntil, reason, slot, text } from '../kit.js';

export const s4CompareDistributions = defineGenerator(
  {
    id: 'S4.compare-distributions',
    ref: 'S4',
    title: 'Compare two distributions by average and by spread',
    strand: 'statistics',
    tiers: ['H'],
    ao: 'AO2',
    marks: 2,
    calculator: 'non-calc',
    boards: boardsFor('S4'),
  },
  (rng) => {
    const { medianA, iqrA, medianB, iqrB } = pickUntil(
      rng,
      (r) => ({
        medianA: r.int(40, 80),
        iqrA: r.int(4, 20),
        medianB: r.int(40, 80),
        iqrB: r.int(4, 20),
      }),
      ({ medianA: ma, iqrA: ia, medianB: mb, iqrB: ib }) =>
        Math.abs(ma - mb) >= 3 && Math.abs(ia - ib) >= 3,
    );
    const higher = medianA > medianB ? 'A' : 'B';
    const consistent = iqrA < iqrB ? 'A' : 'B';

    return draft({
      params: { medianA, iqrA, medianB, iqrB, higher, consistent },
      content: [
        text('Two classes took the same test. The results are summarised below.'),
        figure(
          fig.table(
            ['Class', 'Median', 'Interquartile range'],
            [
              ['A', `${medianA}`, `${iqrA}`],
              ['B', `${medianB}`, `${iqrB}`],
            ],
          ),
        ),
        text('(a) Compare the averages of the two classes.'),
        slot('average'),
        text('(b) Compare the spread of the two classes.'),
        slot('spread'),
      ],
      slots: [
        {
          id: 'average',
          label: 'averages',
          expect: reason(`class ${higher} has the higher median, so it scored higher on average`),
          policy: { keywordGroups: [['median', higher.toLowerCase()], ['higher', higher.toLowerCase()]] },
        },
        {
          id: 'spread',
          label: 'spread',
          expect: reason(
            `class ${consistent} has the smaller interquartile range, so its scores are more consistent`,
          ),
          policy: {
            keywordGroups: [
              ['interquartile', consistent.toLowerCase()],
              ['iqr', consistent.toLowerCase()],
              ['consistent', consistent.toLowerCase()],
            ],
          },
        },
      ],
      steps: [
        {
          id: 'b1',
          type: 'B',
          values: [reason(`median ${higher}`)],
          target: { slot: 'average' },
          policy: { keywordGroups: [['median', higher.toLowerCase()], ['higher', higher.toLowerCase()]] },
          note: 'a comparison of medians in context',
        },
        {
          id: 'b2',
          type: 'B',
          values: [reason(`iqr ${consistent}`)],
          target: { slot: 'spread' },
          policy: {
            keywordGroups: [
              ['interquartile', consistent.toLowerCase()],
              ['iqr', consistent.toLowerCase()],
              ['consistent', consistent.toLowerCase()],
            ],
          },
          note: 'a comparison of spread in context',
        },
      ],
      guidance: [
        'Quoting the figures without comparing them, or comparing without reference to the context, scores at most one mark.',
      ],
    });
  },
);

export default [s4CompareDistributions];
