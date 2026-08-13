/**
 * A13 - Sketch translations and reflections of a given function.
 */
import { boardsFor, defineGenerator, draft, math, pointValue, rat, signed, slot, text } from '../kit.js';

export const a13TransformTurningPoint = defineGenerator(
  {
    id: 'A13.transformed-turning-point',
    ref: 'A13',
    title: 'State the turning point of a translated or reflected function',
    strand: 'algebra',
    tiers: ['H'],
    ao: 'AO2',
    marks: 1,
    calculator: 'non-calc',
    boards: boardsFor('A13'),
  },
  (rng) => {
    const x = rng.intNonZero(-6, 6);
    const y = rng.intNonZero(-6, 6);
    const shift = rng.intNonZero(-5, 5);
    const variant = rng.pick(['vertical', 'horizontal', 'reflect-x'] as const);

    const transformed =
      variant === 'vertical'
        ? { x, y: y + shift, latex: `y = f(x) ${signed(shift)}` }
        : variant === 'horizontal'
          ? { x: x - shift, y, latex: `y = f(x ${signed(shift)})` }
          : { x, y: -y, latex: 'y = -f(x)' };

    return draft({
      params: { x, y, shift, variant, image: [transformed.x, transformed.y] },
      content: [
        text(`The graph of y = f(x) has a turning point at (${x}, ${y}).`),
        text('Write down the coordinates of the turning point of'),
        math(transformed.latex, true),
        slot('answer'),
      ],
      answer: pointValue(rat(transformed.x), rat(transformed.y)),
      steps: [
        {
          id: 'b1',
          type: 'B',
          values: [pointValue(rat(transformed.x), rat(transformed.y))],
          target: 'answer',
        },
      ],
      guidance: [
        'A translation inside the bracket moves the graph the opposite way along the x-axis.',
      ],
    });
  },
);

export default [a13TransformTurningPoint];
