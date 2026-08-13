/** P7 - Construct theoretical possibility spaces for combined experiments. */
import { boardsFor, defineGenerator, draft, Exact, exactValue, fig, figure, intValue, pickUntil, rat, slot, text } from '../kit.js';

export const p7PossibilitySpace = defineGenerator(
  {
    id: 'P7.possibility-space-dice-total',
    ref: 'P7',
    title: 'Use a possibility space to find the probability of a total',
    strand: 'probability',
    tiers: ['F'],
    ao: 'AO1',
    marks: 2,
    calculator: 'non-calc',
    boards: boardsFor('P7'),
  },
  (rng) => {
    const { faces, target } = pickUntil(
      rng,
      (r) => {
        const f = r.pick([4, 5, 6]);
        return { faces: f, target: r.int(3, 2 * f - 1) };
      },
      ({ faces: f, target: t }) => {
        let count = 0;
        for (let i = 1; i <= f; i++) for (let j = 1; j <= f; j++) if (i + j === t) count++;
        return count > 0 && count < f * f;
      },
    );
    let favourable = 0;
    const rows: string[][] = [];
    for (let i = 1; i <= faces; i++) {
      const row: string[] = [`${i}`];
      for (let j = 1; j <= faces; j++) {
        if (i + j === target) favourable++;
        row.push(`${i + j}`);
      }
      rows.push(row);
    }
    const outcomes = faces * faces;
    const probability = rat(favourable, outcomes);

    return draft({
      params: { faces, target, favourable, outcomes },
      content: [
        text(
          `Two fair ${faces}-sided dice, numbered 1 to ${faces}, are rolled and their scores are added.`,
        ),
        figure(
          fig.table(
            ['+', ...Array.from({ length: faces }, (_, i) => `${i + 1}`)],
            rows,
            { caption: 'Possibility space for the total' },
          ),
        ),
        text(`Work out the probability that the total is ${target}.`),
        slot('answer'),
      ],
      answer: exactValue(Exact.rational(probability)),
      answerSlot: {
        policy: { rejectRatio: true },
        alternativeForms: [`${favourable}/${outcomes}`],
      },
      steps: [
        {
          id: 'm1',
          type: 'M',
          values: [intValue(favourable), intValue(outcomes)],
          note: 'the favourable outcomes counted, or the size of the sample space',
        },
        {
          id: 'a1',
          type: 'A',
          values: [exactValue(Exact.rational(probability))],
          policy: { rejectRatio: true },
        },
      ],
    });
  },
);

export default [p7PossibilitySpace];
