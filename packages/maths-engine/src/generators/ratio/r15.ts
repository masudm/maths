/**
 * R15 - Average and instantaneous rates of change: gradients of chords and tangents.
 */
import { boardsFor, choiceValue, defineGenerator, draft, slot, text } from '../kit.js';

export const r15ChordVersusTangent = defineGenerator(
  {
    id: 'R15.chord-versus-tangent-gradient',
    ref: 'R15',
    title: 'Distinguish average and instantaneous rates of change on a curve',
    strand: 'ratio',
    tiers: ['H'],
    ao: 'AO2',
    marks: 2,
    calculator: 'non-calc',
    boards: boardsFor('R15'),
  },
  (rng) => {
    const context = rng.pick([
      { curve: 'distance-time', rate: 'speed' },
      { curve: 'volume-time', rate: 'rate of flow' },
    ] as const);

    return draft({
      params: { curve: context.curve, rate: context.rate },
      content: [
        text(`A curve on a ${context.curve} graph is used to model a journey.`),
        text(
          `For each of these, write down whether it gives the average ${context.rate} or the instantaneous ${context.rate}.`,
        ),
        text('(a) The gradient of a chord joining two points on the curve.'),
        slot('chord'),
        text('(b) The gradient of the tangent at a point on the curve.'),
        slot('tangent'),
      ],
      slots: [
        { id: 'chord', label: 'chord', expect: choiceValue('average') },
        { id: 'tangent', label: 'tangent', expect: choiceValue('instantaneous') },
      ],
      steps: [
        { id: 'b1', type: 'B', values: [choiceValue('average')], target: { slot: 'chord' } },
        { id: 'b2', type: 'B', values: [choiceValue('instantaneous')], target: { slot: 'tangent' } },
      ],
    });
  },
);

export default [r15ChordVersusTangent];
