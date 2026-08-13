/**
 * R2 - Use scale factors, scale diagrams and maps.
 */
import { boardsFor, decimalValue, defineGenerator, draft, intValue, slot, text } from '../kit.js';

export const r2MapScale = defineGenerator(
  {
    id: 'R2.map-scale',
    ref: 'R2',
    title: 'Convert a map distance to a real distance using a ratio scale',
    strand: 'ratio',
    tiers: ['F'],
    ao: 'AO3',
    marks: 2,
    calculator: 'either',
    boards: boardsFor('R2'),
  },
  (rng) => {
    const scale = rng.pick([10000, 20000, 25000, 50000]);
    const mapCm = rng.int(2, 18);
    const realCm = mapCm * scale;
    const realKm = realCm / 100000;

    return draft({
      params: { scale, mapCm, realCm, realKm },
      content: [
        text(`A map has a scale of 1 : ${scale.toLocaleString('en-GB')}.`),
        text(`Two towns are ${mapCm} cm apart on the map.`),
        text('Work out the real distance between the towns in kilometres.'),
        slot('answer', { suffix: 'km' }),
      ],
      answer: decimalValue(realKm),
      answerSlot: { units: 'km' },
      steps: [
        {
          id: 'm1',
          type: 'M',
          values: [intValue(realCm)],
          note: 'the real distance in centimetres',
        },
        { id: 'a1', type: 'A', values: [decimalValue(realKm)] },
      ],
      specialCases: [
        {
          marks: 1,
          values: [decimalValue(realCm / 1000)],
          misconception: 'centimetres-converted-to-metres-not-kilometres',
        },
      ],
    });
  },
);

export default [r2MapScale];
