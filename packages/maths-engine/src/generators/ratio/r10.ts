/**
 * R10 - Solve problems involving direct and inverse proportion.
 */
import { boardsFor, decimalValue, defineGenerator, draft, intValue, pickUntil, slot, text } from '../kit.js';

export const r10InverseProportion = defineGenerator(
  {
    id: 'R10.inverse-proportion-in-context',
    ref: 'R10',
    title: 'Solve an inverse proportion problem set in context',
    strand: 'ratio',
    tiers: ['F+'],
    ao: 'AO3',
    marks: 3,
    calculator: 'either',
    boards: boardsFor('R10'),
  },
  (rng) => {
    const { workers, days, newWorkers } = pickUntil(
      rng,
      (r) => ({ workers: r.int(3, 12), days: r.int(4, 30), newWorkers: r.int(2, 12) }),
      ({ workers: w, days: d, newWorkers: n }) => {
        if (n === w) return false;
        const answer = (w * d) / n;
        // A whole-number answer, and clearly different from the direct-proportion slip.
        return Number.isInteger(answer) && answer !== (d * n) / w;
      },
    );
    const workerDays = workers * days;
    const answer = workerDays / newWorkers;
    const directError = Number(((days * newWorkers) / workers).toFixed(4));

    return draft({
      params: { workers, days, newWorkers, workerDays, answer },
      content: [
        text(`${workers} workers build a wall in ${days} days.`),
        text(
          `Work out how long ${newWorkers} workers would take to build the same wall, working at the same rate.`,
        ),
        slot('answer', { suffix: 'days' }),
      ],
      answer: intValue(answer),
      answerSlot: { units: 'days' },
      steps: [
        {
          id: 'm1',
          type: 'M',
          values: [intValue(workerDays)],
          note: 'the total worker-days found',
        },
        {
          id: 'm2',
          type: 'M',
          values: [intValue(answer)],
          dependsOn: ['m1'],
          note: 'their total divided by the new number of workers',
        },
        { id: 'a1', type: 'A', values: [intValue(answer)] },
      ],
      specialCases: [
        {
          marks: 0,
          values: [decimalValue(directError)],
          misconception: 'inverse-proportion-treated-as-direct',
        },
      ],
    });
  },
);

export default [r10InverseProportion];
