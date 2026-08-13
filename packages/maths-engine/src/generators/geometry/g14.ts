/** G14 - Standard units of measure and related concepts. */
import { boardsFor, defineGenerator, draft, intValue, slot, text } from '../kit.js';

export const g14CapacityConversion = defineGenerator(
  {
    id: 'G14.capacity-unit-conversion',
    ref: 'G14',
    title: 'Convert between litres and cubic centimetres',
    strand: 'geometry',
    tiers: ['F'],
    ao: 'AO1',
    marks: 1,
    calculator: 'non-calc',
    boards: boardsFor('G14'),
  },
  (rng) => {
    const litres = rng.int(5, 120) / 10;
    const cubicCentimetres = Math.round(litres * 1000);

    return draft({
      params: { litres, cubicCentimetres },
      content: [
        text(`A tank holds ${litres} litres of water.`),
        text('How many cubic centimetres is this?'),
        slot('answer', { suffix: 'cm³' }),
      ],
      answer: intValue(cubicCentimetres),
      answerSlot: { units: 'cm3' },
      steps: [{ id: 'b1', type: 'B', values: [intValue(cubicCentimetres)], target: 'answer' }],
    });
  },
);

export default [g14CapacityConversion];
