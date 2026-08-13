/** G25 - Vector arithmetic, and vectors in geometric arguments and proofs. */
import { boardsFor, defineGenerator, draft, expr, math, slot, text } from '../kit.js';

export const g25VectorMidpoint = defineGenerator(
  {
    id: 'G25.vector-to-midpoint',
    ref: 'G25',
    title: 'Express a vector to a midpoint in terms of two given vectors',
    strand: 'geometry',
    tiers: ['H'],
    ao: 'AO2',
    marks: 3,
    calculator: 'non-calc',
    boards: boardsFor('G25'),
  },
  (rng) => {
    const along = rng.pick([
      { name: 'M', fraction: '1/2', label: 'the midpoint of AB' },
      { name: 'M', fraction: '1/3', label: 'the point one third of the way from A to B' },
      { name: 'M', fraction: '1/4', label: 'the point one quarter of the way from A to B' },
    ]);
    const f = along.fraction;

    return draft({
      params: { fraction: f },
      content: [
        math('\\vec{OA} = \\mathbf{a} \\qquad \\vec{OB} = \\mathbf{b}', true),
        text(`M is ${along.label}.`),
        text('Express OM in terms of a and b, giving your answer in its simplest form.'),
        slot('answer', { prefix: 'OM =' }),
      ],
      answer: expr(`a+(${f})*(b-a)`),
      answerSlot: {
        alternativeForms: [`(1-${f})*a+(${f})*b`],
      },
      steps: [
        { id: 'm1', type: 'M', values: [expr('b-a')], note: 'AB expressed as b - a' },
        {
          id: 'm2',
          type: 'M',
          values: [expr(`(${f})*(b-a)`)],
          dependsOn: ['m1'],
          note: 'the correct fraction of their AB',
        },
        { id: 'a1', type: 'A', values: [expr(`a+(${f})*(b-a)`)], note: 'oe, simplified' },
      ],
      // For the midpoint, a + (1/2)(b - a) really does equal (1/2)(a + b), so this is only a
      // misconception for the other fractions.
      specialCases:
        f === '1/2'
          ? []
          : [
              {
                marks: 0,
                values: [expr(`(${f})*(a+b)`)],
                misconception: 'vector-fraction-applied-to-sum-not-difference',
              },
            ],
    });
  },
);

export default [g25VectorMidpoint];
