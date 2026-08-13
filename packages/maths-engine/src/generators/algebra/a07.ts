/**
 * A7 - Interpret expressions as functions; inverse and composite functions at Higher.
 */
import { boardsFor, defineGenerator, draft, intValue, math, pickUntil, slot, text } from '../kit.js';

export const a7CompositeFunction = defineGenerator(
  {
    id: 'A7.composite-function',
    ref: 'A7',
    title: 'Evaluate a composite function',
    strand: 'algebra',
    tiers: ['H'],
    ao: 'AO1',
    marks: 2,
    calculator: 'non-calc',
    boards: boardsFor('A7'),
  },
  (rng) => {
    const { a, b, x } = pickUntil(
      rng,
      (r) => ({ a: r.int(2, 6), b: r.intNonZero(-8, 8), x: r.int(2, 6) }),
      // fg(x) and gf(x) must differ, or the question cannot test the order of composition.
      ({ a: p, b: q, x: v }) => p * v * v + q !== (p * v + q) ** 2,
    );
    const inner = x * x;
    const answer = a * inner + b;
    const reversed = (a * x + b) ** 2;

    return draft({
      params: { a, b, x, inner, answer, reversed },
      content: [
        math(`f(x) = ${a}x ${b < 0 ? `- ${-b}` : `+ ${b}`} \\qquad g(x) = x^2`, true),
        text(`Work out fg(${x}).`),
        slot('answer'),
      ],
      answer: intValue(answer),
      steps: [
        { id: 'm1', type: 'M', values: [intValue(inner)], note: `g(${x}) evaluated first` },
        { id: 'a1', type: 'A', values: [intValue(answer)] },
      ],
      specialCases: [
        {
          marks: 0,
          values: [intValue(reversed)],
          misconception: 'composite-functions-applied-in-wrong-order',
        },
      ],
    });
  },
);

export default [a7CompositeFunction];
