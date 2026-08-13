/** P5 - Empirical samples tend towards the theoretical distribution as the sample grows. */
import { boardsFor, defineGenerator, draft, pickUntil, reason, slot, text } from '../kit.js';

export const p5SampleSizeComment = defineGenerator(
  {
    id: 'P5.sample-size-comment',
    ref: 'P5',
    title: 'Comment on a bias claim made from a small sample',
    strand: 'probability',
    tiers: ['F+'],
    ao: 'AO2',
    marks: 1,
    calculator: 'non-calc',
    boards: boardsFor('P5'),
  },
  (rng) => {
    const { rolls, sixes } = pickUntil(
      rng,
      (r) => ({ rolls: r.int(10, 30), sixes: r.int(3, 9) }),
      ({ rolls: n, sixes: s }) => s / n > 1 / 6 && s < n / 2,
    );

    return draft({
      params: { rolls, sixes },
      content: [
        text(`A dice is rolled ${rolls} times and gives ${sixes} sixes.`),
        text('Sam says the dice must be biased.'),
        text('Comment on Sam’s claim.'),
        slot('answer'),
      ],
      answer: reason('the sample is too small to conclude bias, so more trials are needed'),
      answerSlot: {
        policy: {
          keywordGroups: [
            ['too small'],
            ['not enough', 'trials'],
            ['more trials'],
            ['more rolls'],
            ['small sample'],
          ],
        },
      },
      steps: [
        {
          id: 'b1',
          type: 'B',
          values: [reason('the sample is too small')],
          target: 'answer',
          policy: {
            keywordGroups: [
              ['too small'],
              ['not enough', 'trials'],
              ['more trials'],
              ['more rolls'],
              ['small sample'],
            ],
          },
        },
      ],
      guidance: ['Accept any answer identifying the sample size as the problem.'],
    });
  },
);

export default [p5SampleSizeComment];
