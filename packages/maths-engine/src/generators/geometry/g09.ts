/**
 * G9 - Circle definitions and properties: centre, radius, chord, diameter, circumference,
 * tangent, arc, sector and segment.
 */
import { boardsFor, choiceValue, defineGenerator, draft, slot, text } from '../kit.js';

const PARTS = [
  { name: 'tangent', clue: 'the straight line that touches the circle at exactly one point' },
  { name: 'chord', clue: 'the straight line joining two points on the circumference' },
  { name: 'diameter', clue: 'the chord that passes through the centre of the circle' },
  { name: 'arc', clue: 'a part of the circumference of the circle' },
  { name: 'sector', clue: 'the region bounded by two radii and an arc' },
  { name: 'segment', clue: 'the region bounded by a chord and an arc' },
  { name: 'radius', clue: 'the distance from the centre of the circle to the circumference' },
] as const;

export const g9CirclePart = defineGenerator(
  {
    id: 'G9.name-the-circle-part',
    ref: 'G9',
    title: 'Name a part of a circle from its definition',
    strand: 'geometry',
    tiers: ['F+'],
    ao: 'AO1',
    marks: 1,
    calculator: 'non-calc',
    boards: boardsFor('G9'),
  },
  (rng) => {
    const part = rng.pick(PARTS);

    return draft({
      params: { part: part.name },
      content: [text(`Write down the name of ${part.clue}.`), slot('answer')],
      answer: choiceValue(part.name),
      steps: [{ id: 'b1', type: 'B', values: [choiceValue(part.name)], target: 'answer' }],
    });
  },
);

export default [g9CirclePart];
