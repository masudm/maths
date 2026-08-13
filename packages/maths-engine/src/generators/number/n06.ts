/**
 * N6 - Positive integer powers and associated real roots; estimating roots.
 */
import { boardsFor, defineGenerator, draft, intValue, math, rangeValue, slot, text } from '../kit.js';

export const n6EstimateRoot = defineGenerator(
  {
    id: 'N6.estimate-square-root',
    ref: 'N6',
    title: 'Estimate a square root using the square numbers either side',
    strand: 'number',
    tiers: ['F+'],
    ao: 'AO2',
    marks: 2,
    calculator: 'non-calc',
    boards: boardsFor('N6'),
  },
  (rng) => {
    const k = rng.int(4, 12);
    // Keep the value clear of both square numbers so a one-decimal-place estimate is sensible.
    const n = rng.int(k * k + 2, (k + 1) * (k + 1) - 2);
    const root = Math.sqrt(n);

    return draft({
      params: { n, k, lower: k * k, upper: (k + 1) * (k + 1), root },
      content: [
        text('Estimate the value of'),
        math(`\\sqrt{${n}}`, true),
        text('Give your answer to 1 decimal place and show the square numbers you used.'),
        slot('answer'),
      ],
      answer: rangeValue(root - 0.06, root + 0.06),
      steps: [
        {
          id: 'm1',
          type: 'M',
          values: [intValue(k * k), intValue((k + 1) * (k + 1))],
          note: 'either square number either side identified',
        },
        {
          id: 'a1',
          type: 'A',
          values: [rangeValue(root - 0.06, root + 0.06)],
        },
      ],
      guidance: [
        `Accept any value in the range [${(root - 0.06).toFixed(3)}, ${(root + 0.06).toFixed(3)}].`,
      ],
    });
  },
);

export default [n6EstimateRoot];
