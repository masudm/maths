/** G18 - Arc lengths, angles and areas of sectors of circles. */
import { boardsFor, defineGenerator, draft, Exact, exactValue, num, pickUntil, rat, slot, text } from '../kit.js';

export const g18SectorArea = defineGenerator(
  {
    id: 'G18.sector-area-in-terms-of-pi',
    ref: 'G18',
    title: 'Find the area of a sector, leaving the answer in terms of pi',
    strand: 'geometry',
    tiers: ['F+'],
    ao: 'AO1',
    marks: 2,
    calculator: 'non-calc',
    boards: boardsFor('G18'),
  },
  (rng) => {
    const { radius, angle } = pickUntil(
      rng,
      (r) => ({ radius: r.int(3, 15), angle: r.int(1, 11) * 30 }),
      ({ radius: rr, angle: a }) => (a * rr * rr) % 360 === 0,
    );
    const coefficient = rat((angle * radius * radius) / 360);
    const answer = Exact.pi(coefficient);

    return draft({
      params: { radius, angle, coefficient: coefficient.toString() },
      content: [
        text(`A sector of a circle has radius ${radius} cm and angle ${angle}°.`),
        text('Work out the area of the sector. Give your answer in terms of π.'),
        slot('answer', { suffix: 'cm²' }),
      ],
      answer: exactValue(answer),
      answerSlot: { alternativeForms: [`${coefficient.toString()}pi`] },
      steps: [
        {
          id: 'm1',
          type: 'M',
          values: [exactValue(answer), exactValue(Exact.rational(rat(angle, 360)))],
          note: 'the fraction of the circle used with the circle area formula',
        },
        { id: 'a1', type: 'A', values: [exactValue(answer)], note: 'in terms of pi' },
      ],
      guidance: [
        `A decimal answer such as ${(coefficient.toNumber() * Math.PI).toFixed(1)} loses the accuracy mark when the answer is demanded in terms of pi.`,
        `Full circle area would be ${num.formatNumber(radius * radius)}pi.`,
      ],
    });
  },
);

export default [g18SectorArea];
