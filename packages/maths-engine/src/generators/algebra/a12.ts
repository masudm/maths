/**
 * A12 - Recognise, sketch and interpret graphs of standard function families.
 */
import { boardsFor, choiceValue, defineGenerator, draft, math, slot, text } from '../kit.js';

const FAMILIES = [
  { name: 'linear', equation: (k: number) => `y = ${k}x + 1` },
  { name: 'quadratic', equation: (k: number) => `y = ${k}x^2 - 3` },
  { name: 'cubic', equation: (k: number) => `y = ${k}x^3 + 2` },
  { name: 'reciprocal', equation: (k: number) => `y = \\frac{${k}}{x}` },
  { name: 'exponential', equation: (k: number) => `y = ${k + 1}^x` },
] as const;

export const a12IdentifyGraphFamily = defineGenerator(
  {
    id: 'A12.identify-graph-family',
    ref: 'A12',
    title: 'Recognise the family a graph belongs to from its equation',
    strand: 'algebra',
    tiers: ['F+'],
    ao: 'AO1',
    marks: 1,
    calculator: 'non-calc',
    boards: boardsFor('A12'),
  },
  (rng) => {
    const family = rng.pick(FAMILIES);
    const k = rng.int(2, 5);

    return draft({
      params: { family: family.name, k },
      content: [
        text('Here is the equation of a graph.'),
        math(family.equation(k), true),
        text(
          'Write down the type of graph this equation represents: linear, quadratic, cubic, reciprocal or exponential.',
        ),
        slot('answer'),
      ],
      answer: choiceValue(family.name),
      steps: [{ id: 'b1', type: 'B', values: [choiceValue(family.name)], target: 'answer' }],
    });
  },
);

export default [a12IdentifyGraphFamily];
