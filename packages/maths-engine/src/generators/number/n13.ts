/**
 * N13 - Standard units and metric conversion factors, including area.
 */
import { boardsFor, decimalValue, defineGenerator, draft, intValue, slot, text } from '../kit.js';

export const n13AreaUnitConversion = defineGenerator(
  {
    id: 'N13.area-in-mixed-units',
    ref: 'N13',
    title: 'Work out an area when the two sides are given in different units',
    strand: 'number',
    tiers: ['F'],
    ao: 'AO3',
    marks: 3,
    calculator: 'either',
    boards: boardsFor('N13'),
  },
  (rng) => {
    const metreTenths = rng.int(10, 60);
    const metres = metreTenths / 10;
    const centimetres = rng.int(2, 9) * 10;
    const lengthCm = metreTenths * 10;
    const area = lengthCm * centimetres;

    return draft({
      params: { metres, metreTenths, centimetres, lengthCm, area },
      content: [
        text(`A rectangle measures ${metres} m by ${centimetres} cm.`),
        text('Work out its area. Give your answer in square centimetres.'),
        slot('answer', { suffix: 'cm²' }),
      ],
      answer: intValue(area),
      answerSlot: { units: 'cm2' },
      steps: [
        {
          id: 'm1',
          type: 'M',
          values: [intValue(lengthCm)],
          note: 'the length converted to centimetres',
        },
        {
          id: 'm2',
          type: 'M',
          values: [intValue(area)],
          dependsOn: ['m1'],
          note: 'their converted length multiplied by the width',
        },
        { id: 'a1', type: 'A', values: [intValue(area)] },
      ],
      specialCases: [
        {
          marks: 1,
          values: [decimalValue((metreTenths * centimetres) / 1000)],
          misconception: 'area-left-in-square-metres',
          note: 'the area in square metres, without converting to the demanded unit',
        },
      ],
      guidance: ['Answers in m² without the demanded unit conversion score the method marks only.'],
    });
  },
);

export default [n13AreaUnitConversion];
