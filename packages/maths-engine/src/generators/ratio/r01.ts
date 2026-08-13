/**
 * R1 - Change freely between related standard units and compound units.
 */
import { boardsFor, decimalValue, defineGenerator, draft, intValue, pickUntil, slot, text } from '../kit.js';

export const r1SpeedUnitConversion = defineGenerator(
  {
    id: 'R1.km-per-hour-to-metres-per-second',
    ref: 'R1',
    title: 'Convert a speed between kilometres per hour and metres per second',
    strand: 'ratio',
    tiers: ['F+'],
    ao: 'AO1',
    marks: 3,
    calculator: 'either',
    boards: boardsFor('R1'),
  },
  (rng) => {
    const kmh = pickUntil(
      rng,
      (r) => r.int(3, 40) * 3,
      (v) => ((v * 1000) / 3600) % 0.5 === 0,
    );
    const metres = kmh * 1000;
    const ms = metres / 3600;

    return draft({
      params: { kmh, metres, ms },
      content: [
        text(`A car travels at a constant speed of ${kmh} km/h.`),
        text('Convert this speed to metres per second.'),
        slot('answer', { suffix: 'm/s' }),
      ],
      answer: decimalValue(ms),
      answerSlot: { units: 'm/s' },
      steps: [
        { id: 'm1', type: 'M', values: [intValue(metres)], note: 'kilometres converted to metres' },
        {
          id: 'm2',
          type: 'M',
          values: [decimalValue(ms)],
          dependsOn: ['m1'],
          note: 'their metres divided by 3600',
        },
        { id: 'a1', type: 'A', values: [decimalValue(ms)] },
      ],
      specialCases: [
        {
          marks: 1,
          values: [decimalValue(Number((metres / 60).toFixed(6)))],
          misconception: 'divided-by-minutes-not-seconds',
        },
      ],
    });
  },
);

export default [r1SpeedUnitConversion];
