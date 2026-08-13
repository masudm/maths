/** G15 - Measure lines and angles, interpret scale drawings, and use three-figure bearings. */
import { boardsFor, defineGenerator, draft, intValue, slot, text } from '../kit.js';

export const g15BackBearing = defineGenerator(
  {
    id: 'G15.back-bearing',
    ref: 'G15',
    title: 'Find the back bearing from a given three-figure bearing',
    strand: 'geometry',
    tiers: ['F+'],
    ao: 'AO2',
    marks: 2,
    calculator: 'non-calc',
    boards: boardsFor('G15'),
  },
  (rng) => {
    const bearing = rng.int(1, 35) * 10;
    const back = (bearing + 180) % 360;
    const pad = (v: number): string => String(v).padStart(3, '0');

    return draft({
      params: { bearing, back },
      content: [
        text(`The bearing of B from A is ${pad(bearing)}°.`),
        text('Work out the bearing of A from B. Give your answer as a three-figure bearing.'),
        slot('answer', { suffix: '°' }),
      ],
      answer: intValue(back),
      steps: [
        {
          id: 'm1',
          type: 'M',
          values: [intValue(bearing + 180), intValue(back)],
          note: '180 added to or subtracted from the given bearing',
        },
        { id: 'a1', type: 'A', values: [intValue(back)], note: 'as a three-figure bearing' },
      ],
      guidance: ['A bearing must be written with three figures.'],
    });
  },
);

export default [g15BackBearing];
