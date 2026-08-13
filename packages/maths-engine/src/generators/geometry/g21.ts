/** G21 - The exact values of sin, cos and tan for the standard angles. */
import { boardsFor, defineGenerator, draft, Exact, exactValue, math, rat, slot, text } from '../kit.js';

const EXACT_VALUES = [
  { fn: 'sin', angle: 0, value: () => Exact.int(0) },
  { fn: 'sin', angle: 30, value: () => Exact.rational(rat(1, 2)) },
  { fn: 'sin', angle: 45, value: () => Exact.surd(rat(1, 2), 2n) },
  { fn: 'sin', angle: 60, value: () => Exact.surd(rat(1, 2), 3n) },
  { fn: 'sin', angle: 90, value: () => Exact.int(1) },
  { fn: 'cos', angle: 0, value: () => Exact.int(1) },
  { fn: 'cos', angle: 30, value: () => Exact.surd(rat(1, 2), 3n) },
  { fn: 'cos', angle: 45, value: () => Exact.surd(rat(1, 2), 2n) },
  { fn: 'cos', angle: 60, value: () => Exact.rational(rat(1, 2)) },
  { fn: 'cos', angle: 90, value: () => Exact.int(0) },
  { fn: 'tan', angle: 0, value: () => Exact.int(0) },
  { fn: 'tan', angle: 30, value: () => Exact.surd(rat(1, 3), 3n) },
  { fn: 'tan', angle: 45, value: () => Exact.int(1) },
  { fn: 'tan', angle: 60, value: () => Exact.surd(rat(1), 3n) },
] as const;

export const g21ExactTrigValue = defineGenerator(
  {
    id: 'G21.exact-trig-value',
    ref: 'G21',
    title: 'Recall an exact trigonometric value',
    strand: 'geometry',
    tiers: ['H'],
    ao: 'AO1',
    marks: 1,
    calculator: 'non-calc',
    boards: boardsFor('G21'),
  },
  (rng) => {
    const entry = rng.pick(EXACT_VALUES);
    const value = entry.value();

    return draft({
      params: { fn: entry.fn, angle: entry.angle, value: value.toString() },
      content: [
        text('Write down the exact value of'),
        math(`\\${entry.fn} ${entry.angle}^\\circ`, true),
        slot('answer'),
      ],
      answer: exactValue(value),
      steps: [{ id: 'b1', type: 'B', values: [exactValue(value)], target: 'answer' }],
      guidance: [
        'A decimal approximation scores zero: the question demands the exact value.',
      ],
    });
  },
);

export default [g21ExactTrigValue];
