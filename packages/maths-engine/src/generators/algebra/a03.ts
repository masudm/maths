/**
 * A3 - The vocabulary of expressions, equations, formulae, inequalities, terms and factors,
 * including identities.
 */
import { boardsFor, choiceValue, defineGenerator, draft, math, slot, text } from '../kit.js';

export const a3IdentifyIdentity = defineGenerator(
  {
    id: 'A3.identify-the-identity',
    ref: 'A3',
    title: 'Distinguish an identity from an equation, formula and expression',
    strand: 'algebra',
    tiers: ['F+'],
    ao: 'AO2',
    marks: 1,
    calculator: 'non-calc',
    boards: boardsFor('A3'),
  },
  (rng) => {
    const k = rng.int(2, 6);
    const c = rng.int(2, 9);
    const identity = `${k}(x + ${c}) \\equiv ${k}x + ${k * c}`;
    const equation = `${k}x + ${c} = ${k * c + 1}`;
    const formula = 'A = \\pi r^2';
    const expression = `${k}y - ${c}`;

    const options = rng.shuffle([
      { latex: identity, label: 'identity' },
      { latex: equation, label: 'equation' },
      { latex: formula, label: 'formula' },
      { latex: expression, label: 'expression' },
    ]);
    const answerIndex = options.findIndex((o) => o.label === 'identity');
    const letters = ['A', 'B', 'C', 'D'];

    return draft({
      params: { options: options.map((o) => o.label), answer: letters[answerIndex] },
      content: [
        text('Here are four statements.'),
        ...options.map((o, i) => math(`\\text{${letters[i]}} \\quad ${o.latex}`, true)),
        text('Write down the letter of the statement that is an identity.'),
        slot('answer'),
      ],
      answer: choiceValue(letters[answerIndex]!),
      steps: [
        { id: 'b1', type: 'B', values: [choiceValue(letters[answerIndex]!)], target: 'answer' },
      ],
      guidance: ['The identity is the only statement true for every value of the variable.'],
    });
  },
);

export default [a3IdentifyIdentity];
