/** P8 - Independent and dependent combined events, and when to add or multiply. */
import { boardsFor, defineGenerator, draft, Exact, exactValue, fig, figure, pickUntil, rat, slot, text } from '../kit.js';

export const p8WithoutReplacement = defineGenerator(
  {
    id: 'P8.two-counters-without-replacement',
    ref: 'P8',
    title: 'Find the probability of two dependent events without replacement',
    strand: 'probability',
    tiers: ['F+'],
    ao: 'AO3',
    marks: 2,
    calculator: 'non-calc',
    boards: boardsFor('P8'),
  },
  (rng) => {
    const { red, blue } = pickUntil(
      rng,
      (r) => ({ red: r.int(3, 9), blue: r.int(2, 8) }),
      ({ red: a, blue: b }) => a + b >= 6 && a + b <= 14,
    );
    const total = red + blue;
    const answer = rat(red, total).mul(rat(red - 1, total - 1));
    const withReplacement = rat(red, total).mul(rat(red, total));

    return draft({
      params: { red, blue, total, answer: answer.toString() },
      content: [
        text(`A bag contains ${red} red counters and ${blue} blue counters.`),
        text('Two counters are taken at random, without replacement.'),
        figure(
          fig.tree(
            'probability',
            fig.treeNode('bag', {
              children: [
                fig.treeNode('red', {
                  edgeLabel: `${red}/${total}`,
                  children: [
                    fig.treeNode('red', { edgeLabel: `${red - 1}/${total - 1}` }),
                    fig.treeNode('blue', { edgeLabel: `${blue}/${total - 1}` }),
                  ],
                }),
                fig.treeNode('blue', {
                  edgeLabel: `${blue}/${total}`,
                  children: [
                    fig.treeNode('red', { edgeLabel: `${red}/${total - 1}` }),
                    fig.treeNode('blue', { edgeLabel: `${blue - 1}/${total - 1}` }),
                  ],
                }),
              ],
            }),
          ),
        ),
        text('Work out the probability that both counters are red.'),
        slot('answer'),
      ],
      answer: exactValue(Exact.rational(answer)),
      answerSlot: { policy: { rejectRatio: true } },
      steps: [
        {
          id: 'm1',
          type: 'M',
          values: [exactValue(Exact.rational(rat(red - 1, total - 1)))],
          note: 'the second probability with both totals reduced',
        },
        {
          id: 'a1',
          type: 'A',
          values: [exactValue(Exact.rational(answer))],
          policy: { rejectRatio: true },
        },
      ],
      specialCases: [
        {
          marks: 0,
          values: [exactValue(Exact.rational(withReplacement))],
          misconception: 'dependence-ignored-treated-as-with-replacement',
        },
      ],
    });
  },
);

export default [p8WithoutReplacement];
