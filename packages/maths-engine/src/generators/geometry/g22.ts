/** G22 - The sine rule and the cosine rule. */
import { boardsFor, decimalValue, defineGenerator, draft, fig, figure, pickUntil, reason, slot, text } from '../kit.js';

export const g22CosineRule = defineGenerator(
  {
    id: 'G22.cosine-rule',
    ref: 'G22',
    title: 'Use the cosine rule to find a side, and explain why the sine rule will not do',
    strand: 'geometry',
    tiers: ['H'],
    ao: 'AO3',
    marks: 4,
    calculator: 'calc',
    boards: boardsFor('G22'),
  },
  (rng) => {
    const { b, c, angle } = pickUntil(
      rng,
      (r) => ({ b: r.int(4, 20), c: r.int(4, 20), angle: r.pick([60, 45, 30, 100, 120, 75]) }),
      ({ b: p, c: q, angle: a }) => {
        const aSq = p * p + q * q - 2 * p * q * Math.cos((a * Math.PI) / 180);
        return aSq > 1 && p !== q;
      },
    );
    const aSquared = b * b + c * c - 2 * b * c * Math.cos((angle * Math.PI) / 180);
    const side = Math.sqrt(aSquared);

    return draft({
      params: { b, c, angle, aSquared, side },
      content: [
        text(`In triangle ABC, b = ${b} cm, c = ${c} cm and angle A = ${angle}°.`),
        figure(fig.diagram(fig.triangleFromSAS(b, angle, c).elements)),
        text('(a) Work out the length of a. Give your answer to 3 significant figures.'),
        slot('side', { suffix: 'cm' }),
        text('(b) Explain why the sine rule cannot be used to start this question.'),
        slot('why'),
      ],
      slots: [
        {
          id: 'side',
          label: 'a',
          expect: decimalValue(Number(side.toPrecision(3))),
          policy: { accuracy: { type: 'sf', digits: 3 } },
        },
        {
          id: 'why',
          label: 'reason',
          expect: reason('no side is paired with a known opposite angle'),
          policy: {
            keywordGroups: [['opposite'], ['no pair'], ['not enough'], ['two sides', 'angle between']],
          },
        },
      ],
      steps: [
        {
          id: 'm1',
          type: 'M',
          values: [decimalValue(Number(aSquared.toPrecision(6)))],
          policy: { accuracy: { type: 'sf', digits: 3 } },
          note: 'correct substitution into the cosine rule',
        },
        {
          id: 'm2',
          type: 'M',
          values: [decimalValue(Number(side.toPrecision(6)))],
          dependsOn: ['m1'],
          policy: { accuracy: { type: 'sf', digits: 3 } },
          note: 'the square root of their value',
        },
        {
          id: 'a1',
          type: 'A',
          values: [decimalValue(Number(side.toPrecision(3)))],
          target: { slot: 'side' },
          policy: { accuracy: { type: 'sf', digits: 3 } },
        },
        {
          id: 'b1',
          type: 'B',
          values: [reason('no side is paired with a known opposite angle')],
          target: { slot: 'why' },
          policy: {
            keywordGroups: [['opposite'], ['no pair'], ['not enough'], ['two sides', 'angle between']],
          },
          independent: true,
        },
      ],
      guidance: [
        'Both rules must be recalled: AQA Appendix group 1 and OCR statement 6.02d.',
      ],
    });
  },
);

export default [g22CosineRule];
