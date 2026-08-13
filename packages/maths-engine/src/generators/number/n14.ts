/**
 * N14 - Estimate answers; check calculations using approximation and estimation.
 */
import { boardsFor, decimalValue, defineGenerator, draft, math, pickUntil, slot, text } from '../kit.js';

export const n14Estimation = defineGenerator(
  {
    id: 'N14.estimate-a-calculation',
    ref: 'N14',
    title: 'Estimate the value of a calculation by rounding to one significant figure',
    strand: 'number',
    tiers: ['F'],
    ao: 'AO3',
    marks: 3,
    calculator: 'non-calc',
    boards: boardsFor('N14'),
  },
  (rng) => {
    const { a, b, c } = pickUntil(
      rng,
      (r) => ({
        a: r.int(180, 980) / 10,
        b: r.int(21, 89) / 10,
        c: r.int(2, 9) / 10,
      }),
      ({ a: x, b: y, c: z }) => {
        const exact = (x * y) / z;
        const estimate = (round1sf(x) * round1sf(y)) / round1sf(z);
        // The estimate must be clearly distinct from the exact value, or the question does
        // not test estimation at all.
        if (!Number.isFinite(estimate)) return false;
        // The estimate must itself be a value a student would produce by hand, and clearly
        // different from the exact value, or the question does not test estimation.
        const tidy = Math.abs(estimate * 100 - Math.round(estimate * 100)) < 1e-9;
        return tidy && Math.abs(exact - estimate) > 5;
      },
    );

    const ra = round1sf(a);
    const rb = round1sf(b);
    const rc = round1sf(c);
    const estimate = (ra * rb) / rc;

    return draft({
      params: { a, b, c, ra, rb, rc, estimate, exact: (a * b) / c },
      content: [
        text('Estimate the value of'),
        math(`\\frac{${a} \\times ${b}}{${c}}`, true),
        text('You must show your working.'),
        slot('answer'),
      ],
      answer: decimalValue(estimate),
      requireWorking: true,
      steps: [
        {
          id: 'm1',
          type: 'M',
          values: [decimalValue(ra), decimalValue(rb), decimalValue(rc)],
          note: 'at least one value rounded to one significant figure',
        },
        {
          id: 'm2',
          type: 'M',
          values: [decimalValue(ra * rb)],
          dependsOn: ['m1'],
          note: 'their rounded numerator',
        },
        { id: 'a1', type: 'A', values: [decimalValue(estimate)] },
      ],
      specialCases: [
        {
          marks: 0,
          values: [decimalValue(Number(((a * b) / c).toFixed(6)))],
          misconception: 'exact-value-given-when-estimate-asked',
        },
      ],
      guidance: ['The exact value is not creditworthy: the marks are for the rounding.'],
    });
  },
);

function round1sf(x: number): number {
  if (x === 0) return 0;
  const magnitude = Math.floor(Math.log10(Math.abs(x)));
  const factor = 10 ** magnitude;
  return Number((Math.round(x / factor) * factor).toFixed(6));
}

export default [n14Estimation];
