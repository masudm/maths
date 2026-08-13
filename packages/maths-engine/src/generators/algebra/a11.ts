/**
 * A11 - Roots, intercepts and turning points of quadratic functions; completing the square.
 */
import { boardsFor, defineGenerator, draft, intValue, math, pointValue, rat, signed, slot, text } from '../kit.js';

export const a11TurningPointByCompletingSquare = defineGenerator(
  {
    id: 'A11.turning-point-by-completing-the-square',
    ref: 'A11',
    title: 'Find the turning point of a quadratic by completing the square',
    strand: 'algebra',
    tiers: ['H'],
    ao: 'AO1',
    marks: 3,
    calculator: 'non-calc',
    boards: boardsFor('A11'),
  },
  (rng) => {
    const p = rng.intNonZero(-7, 7);
    const q = rng.intNonZero(-9, 9);
    const b = -2 * p;
    const c = p * p + q;

    return draft({
      params: { p, q, b, c },
      content: [
        text('By completing the square, find the coordinates of the turning point of'),
        math(`y = x^2 ${signed(b, 'x')} ${signed(c)}`, true),
        slot('answer'),
      ],
      answer: pointValue(rat(p), rat(q)),
      steps: [
        { id: 'm1', type: 'M', values: [intValue(p)], note: `(x ${signed(-p)})^2 seen` },
        {
          id: 'm2',
          type: 'M',
          values: [intValue(q)],
          dependsOn: ['m1'],
          note: 'the completed square finished correctly',
        },
        { id: 'a1', type: 'A', values: [pointValue(rat(p), rat(q))] },
      ],
      specialCases: [
        {
          marks: 2,
          values: [pointValue(rat(-p), rat(q))],
          misconception: 'turning-point-x-sign-not-reversed',
        },
      ],
    });
  },
);

export default [a11TurningPointByCompletingSquare];
