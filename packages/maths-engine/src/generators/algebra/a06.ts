/**
 * A6 - Argue mathematically to show expressions are equivalent; construct proofs.
 */
import { boardsFor, defineGenerator, draft, intValue, reason, slot, text } from '../kit.js';

export const a6ConsecutiveIntegerProof = defineGenerator(
  {
    id: 'A6.proof-consecutive-integers',
    ref: 'A6',
    title: 'Prove a result about consecutive integers algebraically',
    strand: 'algebra',
    tiers: ['F+'],
    ao: 'AO2',
    marks: 3,
    calculator: 'non-calc',
    boards: boardsFor('A6'),
  },
  (rng) => {
    const count = rng.pick([3, 5]);
    const offsetSum = (count * (count - 1)) / 2;

    return draft({
      params: { count, offsetSum },
      content: [
        text(`Prove that the sum of any ${count} consecutive integers is a multiple of ${count}.`),
        text('You must show your working.'),
        slot('answer'),
      ],
      answer: reason(`${count}n + ${offsetSum} = ${count}(n + ${offsetSum / count}), a multiple of ${count}`),
      answerSlot: {
        policy: {
          keywordGroups: [[`multiple of ${count}`], [`${count}(`]],
          forbid: ['not a multiple'],
        },
      },
      requireWorking: true,
      steps: [
        {
          id: 'm1',
          type: 'M',
          values: [intValue(count)],
          note: `the ${count} integers written algebraically, e.g. n, n + 1, ...`,
        },
        {
          id: 'm2',
          type: 'M',
          values: [intValue(offsetSum)],
          dependsOn: ['m1'],
          note: `the sum simplified to ${count}n + ${offsetSum}`,
        },
        {
          id: 'a1',
          type: 'A',
          values: [reason(`multiple of ${count}`)],
          policy: { keywordGroups: [[`multiple of ${count}`], [`${count}(`]] },
          note: 'factorised with a conclusion stated',
        },
      ],
      guidance: [
        'A numerical demonstration scores zero: the question asks for a proof for any integers.',
      ],
    });
  },
);

export default [a6ConsecutiveIntegerProof];
