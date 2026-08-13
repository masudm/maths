/**
 * A5 - Understand and use standard formulae; rearrange formulae to change the subject.
 */
import { boardsFor, defineGenerator, draft, expr, math, slot, text } from '../kit.js';

interface Template {
  formula: string;
  subject: string;
  rearranged: string;
  firstStep: string;
}

export const a5ChangeSubject = defineGenerator(
  {
    id: 'A5.change-the-subject',
    ref: 'A5',
    title: 'Rearrange a formula to change the subject',
    strand: 'algebra',
    tiers: ['F+'],
    ao: 'AO1',
    marks: 2,
    calculator: 'non-calc',
    boards: boardsFor('A5'),
  },
  (rng) => {
    const k = rng.int(2, 9);
    const c = rng.int(2, 12);
    const templates: Template[] = [
      { formula: 'C = 2\\pi r', subject: 'r', rearranged: 'r=C/(2*pi)', firstStep: 'C/2' },
      { formula: `v = u + ${k}t`, subject: 't', rearranged: `t=(v-u)/${k}`, firstStep: 'v-u' },
      { formula: `y = ${k}x - ${c}`, subject: 'x', rearranged: `x=(y+${c})/${k}`, firstStep: `y+${c}` },
      { formula: `P = ${k}(a + ${c})`, subject: 'a', rearranged: `a=P/${k}-${c}`, firstStep: `P/${k}` },
    ];
    const chosen = rng.pick(templates);

    return draft({
      params: { formula: chosen.formula, subject: chosen.subject, k, c },
      content: [
        text(`Make ${chosen.subject} the subject of the formula.`),
        math(chosen.formula, true),
        slot('answer', { prefix: `${chosen.subject} =` }),
      ],
      answer: expr(chosen.rearranged),
      steps: [
        {
          id: 'm1',
          type: 'M',
          values: [expr(chosen.firstStep), expr(chosen.rearranged)],
          note: 'a correct first step in the rearrangement',
        },
        { id: 'a1', type: 'A', values: [expr(chosen.rearranged)], note: 'oe' },
      ],
      guidance: ['Accept any equivalent rearranged form, with or without the subject stated.'],
    });
  },
);

export default [a5ChangeSubject];
