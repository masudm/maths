/**
 * N15 - Round to a given accuracy and use inequality notation for error intervals.
 */
import { boardsFor, decimalValue, defineGenerator, draft, slot, text } from '../kit.js';

export const n15ErrorInterval = defineGenerator(
  {
    id: 'N15.error-interval',
    ref: 'N15',
    title: 'State the error interval for a rounded measurement',
    strand: 'number',
    tiers: ['F+'],
    ao: 'AO1',
    marks: 2,
    calculator: 'non-calc',
    boards: boardsFor('N15'),
  },
  (rng) => {
    const roundedTo = rng.pick([1, 0.1, 10]);
    const stated =
      roundedTo === 0.1
        ? rng.int(50, 400) / 10
        : roundedTo === 10
          ? rng.int(3, 40) * 10
          : rng.int(8, 90);
    const half = roundedTo / 2;
    const lower = Number((stated - half).toFixed(4));
    const upper = Number((stated + half).toFixed(4));
    const unitName =
      roundedTo === 0.1 ? 'the nearest 0.1 cm' : roundedTo === 10 ? 'the nearest 10 cm' : 'the nearest cm';

    return draft({
      params: { stated, roundedTo, lower, upper },
      content: [
        text(`The length L of a rod is ${stated} cm, correct to ${unitName}.`),
        text('Complete the error interval for L.'),
        slot('lower', { suffix: '⩽ L <' }),
        slot('upper'),
      ],
      slots: [
        { id: 'lower', label: 'lower bound', expect: decimalValue(lower) },
        { id: 'upper', label: 'upper bound', expect: decimalValue(upper) },
      ],
      steps: [
        { id: 'b1', type: 'B', values: [decimalValue(lower)], target: { slot: 'lower' } },
        { id: 'b2', type: 'B', values: [decimalValue(upper)], target: { slot: 'upper' } },
      ],
      guidance: [
        'The upper bound is not attainable: a solution written with two non-strict signs loses the final mark in the written form of this question.',
      ],
    });
  },
);

export default [n15ErrorInterval];
