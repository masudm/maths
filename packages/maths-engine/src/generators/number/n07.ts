/**
 * N7 - Calculate with roots and with integer indices; fractional indices at Higher.
 */
import { boardsFor, defineGenerator, draft, intValue, math, pickUntil, slot, text } from '../kit.js';

export const n7FractionalIndices = defineGenerator(
  {
    id: 'N7.fractional-indices',
    ref: 'N7',
    title: 'Evaluate a power with a fractional index',
    strand: 'number',
    tiers: ['H'],
    ao: 'AO1',
    marks: 2,
    calculator: 'non-calc',
    boards: boardsFor('N7'),
  },
  (rng) => {
    const { root, base, power } = pickUntil(
      rng,
      (r) => {
        const rt = r.int(2, 4);
        return {
          root: rt,
          base: r.int(2, rt === 4 ? 3 : rt === 3 ? 4 : 9),
          power: r.int(2, 3),
        };
      },
      // The "multiplied instead of rooted" distractor must not coincide with the answer,
      // or it would not be a wrong answer at all.
      ({ root: rt, base: b, power: pw }) => b ** rt * pw !== b ** pw,
    );
    const value = base ** root;
    const answer = base ** power;

    return draft({
      params: { value, root, power, base, answer },
      content: [
        text('Work out'),
        math(`${value}^{\\frac{${power}}{${root}}}`, true),
        slot('answer'),
      ],
      answer: intValue(answer),
      steps: [
        {
          id: 'm1',
          type: 'M',
          values: [intValue(base)],
          note: `the ${root}th root of ${value} found`,
        },
        { id: 'a1', type: 'A', values: [intValue(answer)] },
      ],
      specialCases: [
        {
          marks: 0,
          values: [intValue(value * power)],
          misconception: 'index-treated-as-multiplier',
        },
      ],
    });
  },
);

export default [n7FractionalIndices];
