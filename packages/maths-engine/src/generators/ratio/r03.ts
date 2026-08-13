/**
 * R3 - Express one quantity as a fraction of another.
 */
import { boardsFor, defineGenerator, draft, Exact, exactValue, num, pickUntil, rat, slot, text } from '../kit.js';

export const r3FractionOfAnother = defineGenerator(
  {
    id: 'R3.one-quantity-as-a-fraction-of-another',
    ref: 'R3',
    title: 'Write one time as a fraction of another in its simplest form',
    strand: 'ratio',
    tiers: ['F'],
    ao: 'AO1',
    marks: 2,
    calculator: 'non-calc',
    boards: boardsFor('R3'),
  },
  (rng) => {
    const { minutes, hours } = pickUntil(
      rng,
      (r) => ({ minutes: r.int(5, 110), hours: r.int(2, 4) }),
      ({ minutes: m, hours: h }) => m < h * 60 && num.gcd(m, h * 60) > 1,
    );
    const totalMinutes = hours * 60;
    const fraction = rat(minutes, totalMinutes);

    return draft({
      params: { minutes, hours, totalMinutes, fraction: fraction.toString() },
      content: [
        text(
          `Write ${minutes} minutes as a fraction of ${hours} hours. Give your answer in its simplest form.`,
        ),
        slot('answer'),
      ],
      answer: exactValue(Exact.rational(fraction)),
      steps: [
        {
          id: 'm1',
          type: 'M',
          values: [exactValue(Exact.rational(rat(minutes, totalMinutes)))],
          note: 'both quantities in the same units, as a fraction',
        },
        { id: 'a1', type: 'A', values: [exactValue(Exact.rational(fraction))], note: 'simplest form' },
      ],
      specialCases: [
        {
          marks: 0,
          values: [exactValue(Exact.rational(rat(minutes, hours)))],
          misconception: 'units-not-matched-before-forming-the-fraction',
        },
      ],
    });
  },
);

export default [r3FractionOfAnother];
