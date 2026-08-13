/**
 * A10 - Identify and interpret gradients and intercepts of linear functions.
 */
import { boardsFor, defineGenerator, draft, intValue, math, slot, text } from '../kit.js';

export const a10GradientAndIntercept = defineGenerator(
  {
    id: 'A10.gradient-and-intercept',
    ref: 'A10',
    title: 'Read the gradient and intercept from an equation that needs rearranging',
    strand: 'algebra',
    tiers: ['F+'],
    ao: 'AO1',
    marks: 3,
    calculator: 'non-calc',
    boards: boardsFor('A10'),
  },
  (rng) => {
    const k = rng.int(2, 5);
    const m = rng.intNonZero(-6, 6);
    const c = rng.intNonZero(-9, 9);
    const shownM = k * m;
    const shownC = k * c;

    return draft({
      params: { k, m, c, shownM, shownC },
      content: [
        text('A straight line has equation'),
        math(`${k}y = ${shownM}x ${shownC < 0 ? `- ${-shownC}` : `+ ${shownC}`}`, true),
        text('(a) Write down the gradient of the line.'),
        slot('gradient'),
        text('(b) Write down the y-coordinate of the point where the line crosses the y-axis.'),
        slot('intercept'),
      ],
      slots: [
        { id: 'gradient', label: 'gradient', expect: intValue(m) },
        { id: 'intercept', label: 'y-intercept', expect: intValue(c) },
      ],
      steps: [
        {
          id: 'm1',
          type: 'M',
          values: [intValue(m), intValue(c)],
          note: 'the equation rearranged into the form y = mx + c',
        },
        { id: 'a1', type: 'A', values: [intValue(m)], target: { slot: 'gradient' } },
        { id: 'a2', type: 'A', values: [intValue(c)], target: { slot: 'intercept' } },
      ],
      specialCases: [
        {
          marks: 0,
          values: [intValue(shownM)],
          misconception: 'gradient-read-without-rearranging',
        },
      ],
    });
  },
);

export default [a10GradientAndIntercept];
