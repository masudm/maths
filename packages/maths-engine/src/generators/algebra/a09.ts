/**
 * A9 - Straight-line graphs: find the equation of a line through two given points.
 */
import { boardsFor, defineGenerator, draft, expr, intValue, pickUntil, slot, text } from '../kit.js';

export const a9EquationThroughTwoPoints = defineGenerator(
  {
    id: 'A9.equation-through-two-points',
    ref: 'A9',
    title: 'Find the equation of the straight line through two points',
    strand: 'algebra',
    tiers: ['F+'],
    ao: 'AO1',
    marks: 3,
    calculator: 'non-calc',
    boards: boardsFor('A9'),
  },
  (rng) => {
    const { m, c, x1, x2 } = pickUntil(
      rng,
      (r) => ({
        m: r.intNonZero(-5, 6),
        c: r.intNonZero(-9, 9),
        x1: r.int(-4, 3),
        x2: r.int(-4, 6),
      }),
      ({ x1: p, x2: q }) => p !== q,
    );
    const y1 = m * x1 + c;
    const y2 = m * x2 + c;

    return draft({
      params: { m, c, x1, y1, x2, y2 },
      content: [
        text(`A straight line passes through the points (${x1}, ${y1}) and (${x2}, ${y2}).`),
        text('Find the equation of the line.'),
        slot('answer'),
      ],
      answer: expr(`y=${m}*x+${c}`),
      steps: [
        { id: 'm1', type: 'M', values: [intValue(m)], note: 'the gradient found' },
        {
          id: 'm2',
          type: 'M',
          values: [intValue(c)],
          dependsOn: ['m1'],
          note: 'a point substituted to find the intercept',
        },
        { id: 'a1', type: 'A', values: [expr(`y=${m}*x+${c}`)], note: 'oe' },
      ],
    });
  },
);

export default [a9EquationThroughTwoPoints];
