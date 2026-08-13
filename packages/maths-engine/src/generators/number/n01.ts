/**
 * N1 - Order positive and negative integers, decimals and fractions; use the inequality symbols.
 */
import {
  boardsFor,
  defineGenerator,
  draft,
  exactValue,
  Exact,
  math,
  rat,
  setValue,
  slot,
  text,
  type Rational,
} from '../kit.js';

interface Candidate {
  display: string;
  value: Rational;
}

export const n1Ordering = defineGenerator(
  {
    id: 'N1.order-directed-numbers',
    ref: 'N1',
    title: 'Order a mixed list of integers, decimals and fractions',
    strand: 'number',
    tiers: ['F'],
    ao: 'AO1',
    marks: 1,
    calculator: 'non-calc',
    boards: boardsFor('N1'),
  },
  (rng) => {
    const fractions: Candidate[] = [
      { display: '\\frac{1}{2}', value: rat(1, 2) },
      { display: '-\\frac{1}{2}', value: rat(-1, 2) },
      { display: '\\frac{3}{4}', value: rat(3, 4) },
      { display: '-\\frac{1}{4}', value: rat(-1, 4) },
      { display: '\\frac{2}{5}', value: rat(2, 5) },
    ];

    const chosen: Candidate[] = [];
    const seen = new Set<string>();
    const push = (c: Candidate): void => {
      const key = c.value.toString();
      if (!seen.has(key)) {
        seen.add(key);
        chosen.push(c);
      }
    };

    push(rng.pick(fractions));
    while (chosen.length < 5) {
      if (rng.bool(0.5)) {
        const n = rng.intNonZero(-9, 9);
        push({ display: `${n}`, value: rat(n) });
      } else {
        const tenths = rng.intNonZero(-45, 45);
        push({ display: `${(tenths / 10).toFixed(1)}`, value: rat(tenths, 10) });
      }
    }

    const shown = rng.shuffle(chosen);
    const ascending = [...chosen].sort((a, b) => a.value.cmp(b.value));
    const answer = setValue(
      ascending.map((c) => exactValue(Exact.rational(c.value))),
      true,
    );

    return draft({
      params: {
        shown: shown.map((c) => c.value.toString()),
        ascending: ascending.map((c) => c.value.toString()),
      },
      content: [
        text('Write these numbers in order, starting with the smallest.'),
        math(shown.map((c) => c.display).join(' \\qquad '), true),
        slot('answer'),
      ],
      answer,
      answerSlot: {
        alternativeForms: [ascending.map((c) => c.value.toDecimalString() ?? c.value.toString()).join(', ')],
      },
      steps: [
        {
          type: 'B',
          marks: 1,
          values: [answer],
          target: 'answer',
          note: 'all five in the correct order',
        },
      ],
      specialCases: [
        {
          marks: 0,
          values: [
            setValue(
              [...ascending].reverse().map((c) => exactValue(Exact.rational(c.value))),
              true,
            ),
          ],
          misconception: 'ordering-descending-when-ascending-asked',
          note: 'correct order, reversed',
        },
      ],
      guidance: ['Ignore the direction of any inequality symbols the student adds.'],
    });
  },
);

export default [n1Ordering];
