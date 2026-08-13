/**
 * A2 - Substitute numerical values into formulae and expressions, including scientific formulae.
 */
import { boardsFor, defineGenerator, draft, intValue, math, pickUntil, slot, text } from '../kit.js';

export const a2Substitution = defineGenerator(
  {
    id: 'A2.substitute-into-formula',
    ref: 'A2',
    title: 'Substitute values, including negatives, into a kinematics formula',
    strand: 'algebra',
    tiers: ['F'],
    ao: 'AO1',
    marks: 2,
    calculator: 'non-calc',
    boards: boardsFor('A2'),
  },
  (rng) => {
    const { u, a, t } = pickUntil(
      rng,
      (r) => ({ u: r.int(4, 20), a: r.intNonZero(-6, 6), t: r.int(2, 8) }),
      // The left-to-right slip (u + a) * t must differ from the answer, and the answer
      // should not simply repeat u.
      ({ u: x, a: y, t: z }) => (x + y) * z !== x + y * z && y * z !== 0,
    );
    const answer = u + a * t;

    return draft({
      params: { u, a, t, answer },
      content: [
        math('v = u + at', true),
        text(`Work out the value of v when u = ${u}, a = ${a} and t = ${t}.`),
        slot('answer', { prefix: 'v =' }),
      ],
      answer: intValue(answer),
      steps: [
        {
          id: 'm1',
          type: 'M',
          values: [intValue(a * t)],
          note: 'the product at evaluated correctly, including its sign',
        },
        { id: 'a1', type: 'A', values: [intValue(answer)] },
      ],
      specialCases: [
        {
          marks: 0,
          values: [intValue((u + a) * t)],
          misconception: 'substitution-evaluated-left-to-right',
        },
      ],
    });
  },
);

export default [a2Substitution];
