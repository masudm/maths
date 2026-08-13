/**
 * G12 - Properties of the faces, surfaces, edges and vertices of 3D solids.
 */
import { boardsFor, defineGenerator, draft, intValue, slot, text } from '../kit.js';

const SOLIDS = [
  { name: 'cube', faces: 6, edges: 12, vertices: 8 },
  { name: 'cuboid', faces: 6, edges: 12, vertices: 8 },
  { name: 'square-based pyramid', faces: 5, edges: 8, vertices: 5 },
  { name: 'triangular prism', faces: 5, edges: 9, vertices: 6 },
  { name: 'triangular-based pyramid', faces: 4, edges: 6, vertices: 4 },
  { name: 'hexagonal prism', faces: 8, edges: 18, vertices: 12 },
] as const;

export const g12SolidProperties = defineGenerator(
  {
    id: 'G12.faces-edges-vertices',
    ref: 'G12',
    title: 'State the number of faces, edges and vertices of a solid',
    strand: 'geometry',
    tiers: ['F'],
    ao: 'AO1',
    marks: 3,
    calculator: 'non-calc',
    boards: boardsFor('G12'),
  },
  (rng) => {
    const solid = rng.pick(SOLIDS);

    return draft({
      params: { ...solid },
      content: [
        text(`Here is a ${solid.name}.`),
        text('Write down the number of:'),
        text('(a) faces'),
        slot('faces'),
        text('(b) edges'),
        slot('edges'),
        text('(c) vertices'),
        slot('vertices'),
      ],
      slots: [
        { id: 'faces', label: 'faces', expect: intValue(solid.faces) },
        { id: 'edges', label: 'edges', expect: intValue(solid.edges) },
        { id: 'vertices', label: 'vertices', expect: intValue(solid.vertices) },
      ],
      steps: [
        { id: 'b1', type: 'B', values: [intValue(solid.faces)], target: { slot: 'faces' } },
        { id: 'b2', type: 'B', values: [intValue(solid.edges)], target: { slot: 'edges' } },
        { id: 'b3', type: 'B', values: [intValue(solid.vertices)], target: { slot: 'vertices' } },
      ],
    });
  },
);

export default [g12SolidProperties];
