/**
 * G8 - Changes and invariance under combinations of rotations, reflections and translations.
 */
import { boardsFor, choiceValue, defineGenerator, draft, intValue, slot, text } from '../kit.js';

const COMBINATIONS = [
  {
    description: 'reflected in the x-axis and then reflected in the y-axis',
    result: 'rotation',
    detail: 180,
  },
  {
    description: 'rotated 90° clockwise about the origin and then rotated 90° clockwise about the origin again',
    result: 'rotation',
    detail: 180,
  },
  {
    description: 'rotated 180° about the origin and then rotated 180° about the origin again',
    result: 'rotation',
    detail: 360,
  },
] as const;

export const g8CombinedTransformations = defineGenerator(
  {
    id: 'G8.combined-transformations',
    ref: 'G8',
    title: 'Find the single transformation equivalent to a combination',
    strand: 'geometry',
    tiers: ['F+'],
    ao: 'AO2',
    marks: 2,
    calculator: 'non-calc',
    boards: boardsFor('G8'),
  },
  (rng) => {
    const chosen = rng.pick(COMBINATIONS);

    return draft({
      params: { description: chosen.description, result: chosen.result, detail: chosen.detail },
      content: [
        text(`Shape P is ${chosen.description}.`),
        text('Describe the single transformation that has the same effect.'),
        text('(a) Type of transformation'),
        slot('type'),
        text('(b) Angle, in degrees, about the origin'),
        slot('angle'),
      ],
      slots: [
        { id: 'type', label: 'transformation', expect: choiceValue(chosen.result) },
        { id: 'angle', label: 'angle', expect: intValue(chosen.detail) },
      ],
      steps: [
        { id: 'b1', type: 'B', values: [choiceValue(chosen.result)], target: { slot: 'type' } },
        { id: 'b2', type: 'B', values: [intValue(chosen.detail)], target: { slot: 'angle' } },
      ],
      guidance: ['A rotation of 360° leaves every point invariant.'],
    });
  },
);

export default [g8CombinedTransformations];
