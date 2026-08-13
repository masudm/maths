/**
 * A15 - Calculate or estimate areas under graphs and interpret the result.
 */
import { boardsFor, decimalValue, defineGenerator, draft, fig, figure, slot, text } from '../kit.js';

export const a15AreaUnderVelocityTimeGraph = defineGenerator(
  {
    id: 'A15.area-under-velocity-time-graph',
    ref: 'A15',
    title: 'Estimate distance travelled as the area under a velocity-time graph',
    strand: 'algebra',
    tiers: ['H'],
    ao: 'AO3',
    marks: 3,
    calculator: 'either',
    boards: boardsFor('A15'),
  },
  (rng) => {
    const speed = rng.int(4, 20) * 2;
    const rampSeconds = rng.int(3, 10);
    const holdSeconds = rng.int(5, 20);
    const triangle = 0.5 * rampSeconds * speed;
    const rectangle = holdSeconds * speed;
    const total = triangle + rectangle;

    return draft({
      params: { speed, rampSeconds, holdSeconds, triangle, rectangle, total },
      content: [
        text(
          `A velocity-time graph rises in a straight line from 0 to ${speed} m/s over ${rampSeconds} seconds, ` +
            `and then stays constant at ${speed} m/s for a further ${holdSeconds} seconds.`,
        ),
        figure(
          fig.axes({
            xMin: 0,
            xMax: rampSeconds + holdSeconds,
            yMin: 0,
            yMax: speed,
            xLabel: 'time (s)',
            yLabel: 'velocity (m/s)',
            plots: [
              {
                points: [
                  fig.pt(0, 0),
                  fig.pt(rampSeconds, speed),
                  fig.pt(rampSeconds + holdSeconds, speed),
                ],
              },
            ],
          }),
        ),
        text('Work out the total distance travelled.'),
        slot('answer', { suffix: 'm' }),
      ],
      answer: decimalValue(total),
      answerSlot: { units: 'm' },
      steps: [
        { id: 'm1', type: 'M', values: [decimalValue(triangle)], note: 'the area of the triangle' },
        { id: 'm2', type: 'M', values: [decimalValue(rectangle)], note: 'the area of the rectangle' },
        { id: 'a1', type: 'A', values: [decimalValue(total)] },
      ],
      specialCases: [
        {
          marks: 0,
          values: [decimalValue(Number((speed / rampSeconds).toFixed(6)))],
          misconception: 'gradient-found-instead-of-area',
        },
      ],
      guidance: ['Finding the acceleration instead of the distance scores zero.'],
    });
  },
);

export default [a15AreaUnderVelocityTimeGraph];
