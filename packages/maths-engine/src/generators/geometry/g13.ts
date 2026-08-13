/**
 * G13 - Construct and interpret plans and elevations of 3D shapes.
 */
import { boardsFor, choiceValue, defineGenerator, draft, slot, text } from '../kit.js';

const SOLIDS = [
  { name: 'cylinder standing on its circular base', plan: 'circle', elevation: 'rectangle' },
  { name: 'cone standing on its circular base', plan: 'circle', elevation: 'triangle' },
  { name: 'square-based pyramid standing on its base', plan: 'square', elevation: 'triangle' },
  { name: 'cube', plan: 'square', elevation: 'square' },
  { name: 'sphere', plan: 'circle', elevation: 'circle' },
] as const;

export const g13PlanAndElevation = defineGenerator(
  {
    id: 'G13.plan-and-elevation',
    ref: 'G13',
    title: 'State the plan and front elevation of a solid',
    strand: 'geometry',
    tiers: ['F'],
    ao: 'AO1',
    marks: 2,
    calculator: 'non-calc',
    boards: boardsFor('G13'),
  },
  (rng) => {
    const solid = rng.pick(SOLIDS);

    return draft({
      params: { ...solid },
      content: [
        text(`A solid is a ${solid.name}.`),
        text('(a) Write down the shape of the plan view.'),
        slot('plan'),
        text('(b) Write down the shape of the front elevation.'),
        slot('elevation'),
      ],
      slots: [
        { id: 'plan', label: 'plan', expect: choiceValue(solid.plan) },
        { id: 'elevation', label: 'front elevation', expect: choiceValue(solid.elevation) },
      ],
      steps: [
        { id: 'b1', type: 'B', values: [choiceValue(solid.plan)], target: { slot: 'plan' } },
        {
          id: 'b2',
          type: 'B',
          values: [choiceValue(solid.elevation)],
          target: { slot: 'elevation' },
        },
      ],
    });
  },
);

export default [g13PlanAndElevation];
