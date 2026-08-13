/**
 * A16 - The equation of a circle centred at the origin, and the tangent at a given point.
 */
import { boardsFor, defineGenerator, draft, expr, intValue, math, num, slot, text } from '../kit.js';

export const a16TangentToCircle = defineGenerator(
  {
    id: 'A16.tangent-to-circle-at-a-point',
    ref: 'A16',
    title: 'Find the equation of the tangent to a circle at a given point',
    strand: 'algebra',
    tiers: ['H'],
    ao: 'AO3',
    marks: 4,
    calculator: 'non-calc',
    boards: boardsFor('A16'),
  },
  (rng) => {
    const [a, b, r] = num.pythagoreanTriple(rng);
    const [px, py] = rng.bool() ? [a, b] : [b, a];
    const rSquared = r * r;

    return draft({
      params: { px, py, r, rSquared, radiusGradient: `${py}/${px}` },
      content: [
        math(`x^2 + y^2 = ${rSquared}`, true),
        text(`The point P(${px}, ${py}) lies on this circle.`),
        text('Find the equation of the tangent to the circle at P.'),
        slot('answer'),
      ],
      answer: expr(`${px}*x+${py}*y=${rSquared}`),
      answerSlot: {
        alternativeForms: [`y = -${px}/${py}x + ${rSquared}/${py}`],
      },
      steps: [
        {
          id: 'm1',
          type: 'M',
          values: [expr(`${py}/${px}`)],
          note: 'the gradient of the radius',
        },
        {
          id: 'm2',
          type: 'M',
          values: [expr(`-${px}/${py}`)],
          dependsOn: ['m1'],
          note: 'the negative reciprocal taken for the tangent',
        },
        {
          id: 'm3',
          type: 'M',
          values: [intValue(rSquared)],
          dependsOn: ['m2'],
          note: 'the point substituted to find the intercept',
        },
        { id: 'a1', type: 'A', values: [expr(`${px}*x+${py}*y=${rSquared}`)], note: 'oe' },
      ],
      guidance: ['Accept any equivalent form of the equation of the line.'],
    });
  },
);

export default [a16TangentToCircle];
