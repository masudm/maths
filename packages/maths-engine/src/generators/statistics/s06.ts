/** S6 - Scatter graphs, correlation, and the distinction from causation. */
import { boardsFor, defineGenerator, draft, fig, figure, reason, slot, text } from '../kit.js';

const CONTEXTS = [
  { x: 'temperature', y: 'ice cream sales', claim: 'hot weather causes people to buy ice cream' },
  { x: 'hours of revision', y: 'test score', claim: 'revising causes a higher score' },
  { x: 'shoe size', y: 'reading age', claim: 'having bigger feet causes better reading' },
] as const;

export const s6CorrelationNotCausation = defineGenerator(
  {
    id: 'S6.correlation-not-causation',
    ref: 'S6',
    title: 'Comment on a causal claim made from a correlation',
    strand: 'statistics',
    tiers: ['F+'],
    ao: 'AO2',
    marks: 1,
    calculator: 'non-calc',
    boards: boardsFor('S6'),
  },
  (rng) => {
    const context = rng.pick(CONTEXTS);
    const points = Array.from({ length: 8 }, (_, i) => fig.pt(i + 1, i * 1.4 + rng.int(0, 3)));

    return draft({
      params: { x: context.x, y: context.y },
      content: [
        text(
          `A scatter graph shows ${context.y} against ${context.x}. It shows strong positive correlation.`,
        ),
        figure(
          fig.statChart('scatter', { xLabel: context.x, yLabel: context.y, points }),
        ),
        text(`Jo says that ${context.claim}.`),
        text('Comment on Jo’s statement.'),
        slot('answer'),
      ],
      answer: reason('correlation does not imply causation; another factor may explain the relationship'),
      answerSlot: {
        policy: {
          keywordGroups: [
            ['correlation', 'causation'],
            ['does not', 'cause'],
            ['another factor'],
            ['not', 'prove'],
          ],
          forbid: ['jo is correct', 'jo is right'],
        },
      },
      steps: [
        {
          id: 'b1',
          type: 'B',
          values: [reason('correlation does not imply causation')],
          target: 'answer',
          policy: {
            keywordGroups: [
              ['correlation', 'causation'],
              ['does not', 'cause'],
              ['another factor'],
              ['not', 'prove'],
            ],
          },
        },
      ],
      guidance: [
        'Restating that there is positive correlation scores zero: the mark is for the causation point.',
      ],
    });
  },
);

export default [s6CorrelationNotCausation];
