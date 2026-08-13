/**
 * N8 - Calculate exactly with surds; simplify surd expressions involving squares.
 */
import { boardsFor, defineGenerator, draft, Exact, exactValue, intValue, math, rat, slot, text } from '../kit.js';

export const n8SimplifySurd = defineGenerator(
  {
    id: 'N8.simplify-surd',
    ref: 'N8',
    title: 'Simplify a surd by extracting the square factor',
    strand: 'number',
    tiers: ['H'],
    ao: 'AO1',
    marks: 2,
    calculator: 'non-calc',
    boards: boardsFor('N8'),
  },
  (rng) => {
    const squareFactor = rng.pick([2, 3, 4, 5, 6]);
    const squarefree = rng.pick([2, 3, 5, 6, 7, 10, 11]);
    const radicand = squareFactor * squareFactor * squarefree;
    const answer = Exact.surd(rat(squareFactor), BigInt(squarefree));

    return draft({
      params: { radicand, squareFactor, squarefree },
      content: [
        text('Simplify fully'),
        math(`\\sqrt{${radicand}}`, true),
        slot('answer'),
      ],
      answer: exactValue(answer),
      answerSlot: {
        alternativeForms: [`${squareFactor}sqrt(${squarefree})`, `${squareFactor}root${squarefree}`],
      },
      steps: [
        {
          id: 'm1',
          type: 'M',
          values: [
            intValue(squareFactor * squareFactor),
            exactValue(Exact.surd(rat(1), BigInt(squareFactor * squareFactor))),
          ],
          note: 'the square factor identified',
        },
        { id: 'a1', type: 'A', values: [exactValue(answer)] },
      ],
      guidance: ['An unsimplified but correct surd such as root4 x root(k) scores M1 only.'],
    });
  },
);

export default [n8SimplifySurd];
