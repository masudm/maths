/**
 * N4 - Primes, factors, multiples, prime factorisation in index form, HCF and LCM.
 */
import {
  boardsFor,
  defineGenerator,
  draft,
  expr,
  intValue,
  math,
  num,
  slot,
  text,
} from '../kit.js';

export const n4PrimeFactorisation = defineGenerator(
  {
    id: 'N4.prime-factorisation',
    ref: 'N4',
    title: 'Write a number as a product of its prime factors in index form',
    strand: 'number',
    tiers: ['F+'],
    ao: 'AO1',
    marks: 2,
    calculator: 'non-calc',
    boards: boardsFor('N4'),
  },
  (rng) => {
    const n = num.compositeForFactorisation(rng);
    const factors = num.primeFactors(n);
    const product = factors.map(([p, e]) => (e === 1 ? `${p}` : `${p}^${e}`)).join('*');

    return draft({
      params: { n, factors },
      content: [
        text(`Write ${n} as a product of its prime factors. Give your answer in index form.`),
        slot('answer'),
      ],
      answer: expr(product),
      answerSlot: {
        alternativeForms: [factors.flatMap(([p, e]) => Array(e).fill(`${p}`)).join('*')],
      },
      steps: [
        {
          id: 'b1',
          type: 'B',
          values: [expr(product)],
          target: 'answer',
          note: 'a correct factor tree or an answer one step away',
        },
        { id: 'b2', type: 'B', values: [expr(product)], target: 'answer', note: 'fully correct' },
      ],
      guidance: [
        'Accept the repeated-multiplication form as well as index form unless index form is demanded.',
      ],
    });
  },
);

export const n4HcfLcm = defineGenerator(
  {
    id: 'N4.hcf-and-lcm',
    ref: 'N4',
    title: 'Find the highest common factor and lowest common multiple of two numbers',
    strand: 'number',
    tiers: ['F+'],
    ao: 'AO1',
    marks: 3,
    calculator: 'non-calc',
    boards: boardsFor('N4'),
  },
  (rng) => {
    const [a, b] = num.hcfPair(rng, { minHcf: 3, max: 90 });
    const hcf = num.gcd(a, b);
    const lcm = num.lcm(a, b);

    return draft({
      params: { a, b, hcf, lcm },
      content: [
        math(`${a} \\qquad ${b}`, true),
        text('(a) Work out the highest common factor (HCF) of these two numbers.'),
        slot('hcf'),
        text('(b) Work out the lowest common multiple (LCM) of these two numbers.'),
        slot('lcm'),
      ],
      slots: [
        { id: 'hcf', label: 'HCF', expect: intValue(hcf) },
        { id: 'lcm', label: 'LCM', expect: intValue(lcm) },
      ],
      steps: [
        {
          id: 'b1',
          type: 'B',
          values: [intValue(hcf)],
          target: { slot: 'hcf' },
          note: 'HCF correct',
        },
        {
          id: 'm1',
          type: 'M',
          values: [intValue(a * b), intValue(lcm)],
          note: 'a correct method for the LCM, e.g. the product divided by the HCF',
        },
        {
          id: 'a1',
          type: 'A',
          values: [intValue(lcm)],
          target: { slot: 'lcm' },
        },
      ],
      specialCases: [
        {
          marks: 0,
          values: [intValue(a * b)],
          misconception: 'lcm-taken-as-product-without-dividing-by-hcf',
        },
      ],
    });
  },
);

export default [n4PrimeFactorisation, n4HcfLcm];
