/** G20 - Pythagoras' theorem and the trigonometric ratios in right-angled triangles. */
import { boardsFor, decimalValue, defineGenerator, draft, fig, figure, intValue, num, slot, text } from '../kit.js';

export const g20PythagorasShorterSide = defineGenerator(
  {
    id: 'G20.pythagoras-shorter-side',
    ref: 'G20',
    title: 'Find a shorter side of a right-angled triangle using Pythagoras',
    strand: 'geometry',
    tiers: ['F+'],
    ao: 'AO1',
    marks: 3,
    calculator: 'either',
    boards: boardsFor('G20'),
  },
  (rng) => {
    const [a, b, c] = num.pythagoreanTriple(rng);
    const known = rng.bool() ? a : b;
    const answer = known === a ? b : a;
    const addedError = Math.sqrt(c * c + known * known);

    return draft({
      params: { a, b, c, known, answer },
      content: [
        text(
          `A right-angled triangle has a hypotenuse of ${c} cm and one other side of ${known} cm.`,
        ),
        figure(fig.rightTriangle(known, answer, { hypotenuse: `${c} cm`, base: `${known} cm` })),
        text('Work out the length of the third side.'),
        slot('answer', { suffix: 'cm' }),
      ],
      answer: intValue(answer),
      answerSlot: { units: 'cm' },
      steps: [
        {
          id: 'm1',
          type: 'M',
          values: [intValue(c * c - known * known)],
          note: 'subtracting the squares, not adding them',
        },
        {
          id: 'm2',
          type: 'M',
          values: [intValue(answer)],
          dependsOn: ['m1'],
          note: 'the square root of their difference',
        },
        { id: 'a1', type: 'A', values: [intValue(answer)] },
      ],
      specialCases: [
        {
          marks: 0,
          values: [decimalValue(Number(addedError.toFixed(3)))],
          misconception: 'squares-added-instead-of-subtracted',
        },
      ],
      guidance: [
        "Pythagoras' theorem must be recalled: AQA Appendix group 1 and OCR statement 6.02d.",
      ],
    });
  },
);

export default [g20PythagorasShorterSide];
