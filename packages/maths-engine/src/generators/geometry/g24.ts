/** G24 - Describe translations as 2D vectors. */
import { boardsFor, defineGenerator, draft, math, rat, slot, text, vectorValue } from '../kit.js';

export const g24TranslationVector = defineGenerator(
  {
    id: 'G24.translation-vector',
    ref: 'G24',
    title: 'Write the column vector for a described translation',
    strand: 'geometry',
    tiers: ['F'],
    ao: 'AO1',
    marks: 1,
    calculator: 'non-calc',
    boards: boardsFor('G24'),
  },
  (rng) => {
    const x = rng.intNonZero(-7, 7);
    const y = rng.intNonZero(-7, 7);
    const horizontal = `${Math.abs(x)} ${x > 0 ? 'right' : 'left'}`;
    const vertical = `${Math.abs(y)} ${y > 0 ? 'up' : 'down'}`;

    return draft({
      params: { x, y },
      content: [
        text(`Shape A is translated ${horizontal} and ${vertical} to give shape B.`),
        text('Write down the column vector for this translation.'),
        math('\\begin{pmatrix} x \\\\ y \\end{pmatrix}'),
        slot('answer'),
      ],
      answer: vectorValue(rat(x), rat(y)),
      steps: [{ id: 'b1', type: 'B', values: [vectorValue(rat(x), rat(y))], target: 'answer' }],
      guidance: ['Accept the vector written as (x, y) or as a column.'],
    });
  },
);

export default [g24TranslationVector];
