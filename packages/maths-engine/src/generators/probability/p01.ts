/**
 * P1 - Record, describe and analyse the frequency of outcomes using tables and frequency trees.
 */
import { boardsFor, defineGenerator, draft, fig, figure, intValue, pickUntil, slot, text } from '../kit.js';

export const p1FrequencyTree = defineGenerator(
  {
    id: 'P1.frequency-tree',
    ref: 'P1',
    title: 'Complete a frequency tree and read a missing value from it',
    strand: 'probability',
    tiers: ['F'],
    ao: 'AO2',
    marks: 3,
    calculator: 'either',
    boards: boardsFor('P1'),
  },
  (rng) => {
    const { total, females, femalePass, totalPass } = pickUntil(
      rng,
      (r) => {
        const t = r.int(6, 20) * 10;
        const f = r.int(2, 8) * 10;
        return {
          total: t,
          females: f,
          femalePass: r.int(1, Math.max(1, Math.floor(f / 5))) * 5,
          totalPass: r.int(3, 9) * 10,
        };
      },
      ({ total: t, females: f, femalePass: fp, totalPass: tp }) => {
        const males = t - f;
        const malePass = tp - fp;
        return f < t && fp <= f && malePass > 0 && malePass < males && males - malePass > 0;
      },
    );
    const males = total - females;
    const malePass = totalPass - femalePass;
    const maleFail = males - malePass;

    return draft({
      params: { total, females, males, femalePass, totalPass, malePass, maleFail },
      content: [
        text(
          `${total} people took a driving test. ${females} of them were female, and ${femalePass} of the females passed. ` +
            `Altogether ${totalPass} people passed.`,
        ),
        figure(
          fig.tree(
            'frequency',
            fig.treeNode(`${total}`, {
              children: [
                fig.treeNode(`${females}`, {
                  edgeLabel: 'female',
                  children: [
                    fig.treeNode(`${femalePass}`, { edgeLabel: 'pass' }),
                    fig.treeNode('', { edgeLabel: 'fail', blank: true }),
                  ],
                }),
                fig.treeNode('', {
                  edgeLabel: 'male',
                  blank: true,
                  children: [
                    fig.treeNode('', { edgeLabel: 'pass', blank: true }),
                    fig.treeNode('', { edgeLabel: 'fail', blank: true }),
                  ],
                }),
              ],
            }),
          ),
        ),
        text('Work out how many males failed the test.'),
        slot('answer'),
      ],
      answer: intValue(maleFail),
      steps: [
        { id: 'b1', type: 'B', values: [intValue(males)], note: 'the number of males' },
        { id: 'b2', type: 'B', values: [intValue(malePass)], note: 'the number of males who passed' },
        {
          id: 'b3',
          type: 'B',
          values: [intValue(maleFail)],
          target: 'answer',
          note: 'ft their values used consistently',
        },
      ],
    });
  },
);

export default [p1FrequencyTree];
