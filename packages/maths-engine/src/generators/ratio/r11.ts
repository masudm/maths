/**
 * R11 - Use compound units such as speed, rates of pay, unit pricing, density and pressure.
 */
import { boardsFor, decimalValue, defineGenerator, draft, pickUntil, slot, text } from '../kit.js';

export const r11Density = defineGenerator(
  {
    id: 'R11.density-from-mass-and-volume',
    ref: 'R11',
    title: 'Calculate a density from a mass and a volume',
    strand: 'ratio',
    tiers: ['F+'],
    ao: 'AO1',
    marks: 2,
    calculator: 'either',
    boards: boardsFor('R11'),
  },
  (rng) => {
    const { mass, volume } = pickUntil(
      rng,
      (r) => ({ mass: r.int(20, 900), volume: r.int(4, 60) }),
      ({ mass: m, volume: v }) => {
        const d = m / v;
        // A density of exactly 1 would make the inverted-formula distractor correct too.
        return Math.abs(d * 10 - Math.round(d * 10)) < 1e-9 && d >= 0.5 && d <= 25 && d !== 1;
      },
    );
    const density = Number((mass / volume).toFixed(4));

    return draft({
      params: { mass, volume, density },
      content: [
        text(`A block of metal has a mass of ${mass} g and a volume of ${volume} cm³.`),
        text('Work out the density of the metal.'),
        slot('answer', { suffix: 'g/cm³' }),
      ],
      answer: decimalValue(density),
      answerSlot: { units: 'g/cm3' },
      steps: [
        {
          id: 'm1',
          type: 'M',
          values: [decimalValue(density)],
          note: 'mass divided by volume',
        },
        { id: 'a1', type: 'A', values: [decimalValue(density)], note: 'with units' },
      ],
      specialCases: [
        {
          marks: 0,
          values: [decimalValue(Number((volume / mass).toFixed(6)))],
          misconception: 'density-formula-inverted',
        },
      ],
    });
  },
);

export default [r11Density];
