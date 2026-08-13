/**
 * A14 - Plot and interpret graphs in real contexts, including simple kinematics.
 */
import { boardsFor, decimalValue, defineGenerator, draft, fig, figure, pickUntil, slot, text } from '../kit.js';

export const a14AverageSpeedFromGraph = defineGenerator(
  {
    id: 'A14.average-speed-from-distance-time-graph',
    ref: 'A14',
    title: 'Find an average speed from a distance-time graph',
    strand: 'algebra',
    tiers: ['F'],
    ao: 'AO3',
    marks: 3,
    calculator: 'either',
    boards: boardsFor('A14'),
  },
  (rng) => {
    const { minutes, distance } = pickUntil(
      rng,
      (r) => ({ minutes: r.pick([15, 20, 30, 40, 45, 50, 75, 90]), distance: r.int(5, 60) }),
      ({ minutes: m, distance: d }) => {
        const speed = d / (m / 60);
        return Math.abs(speed * 10 - Math.round(speed * 10)) < 1e-9 && speed < 130;
      },
    );
    const hours = minutes / 60;
    const speed = Number((distance / hours).toFixed(6));

    return draft({
      params: { minutes, distance, hours, speed },
      content: [
        text(
          `The distance-time graph shows a journey of ${distance} km that takes ${minutes} minutes.`,
        ),
        figure(
          fig.axes({
            xMin: 0,
            xMax: minutes,
            yMin: 0,
            yMax: distance,
            xLabel: 'time (minutes)',
            yLabel: 'distance (km)',
            plots: [{ points: [fig.pt(0, 0), fig.pt(minutes, distance)] }],
          }),
        ),
        text('Work out the average speed for the journey in kilometres per hour.'),
        slot('answer', { suffix: 'km/h' }),
      ],
      answer: decimalValue(speed),
      answerSlot: { units: 'km/h' },
      steps: [
        {
          id: 'm1',
          type: 'M',
          values: [decimalValue(hours)],
          note: 'the time converted to hours',
        },
        {
          id: 'm2',
          type: 'M',
          values: [decimalValue(speed)],
          dependsOn: ['m1'],
          note: 'distance divided by their time in hours',
        },
        { id: 'a1', type: 'A', values: [decimalValue(speed)] },
      ],
      specialCases: [
        {
          marks: 1,
          values: [decimalValue(Number((distance / minutes).toFixed(6)))],
          misconception: 'speed-left-in-km-per-minute',
        },
      ],
    });
  },
);

export default [a14AverageSpeedFromGraph];
