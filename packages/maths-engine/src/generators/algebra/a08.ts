/**
 * A8 - Work with coordinates in all four quadrants.
 */
import { boardsFor, defineGenerator, draft, pickUntil, pointValue, rat, slot, text } from '../kit.js';

export const a8Midpoint = defineGenerator(
  {
    id: 'A8.midpoint-of-a-line-segment',
    ref: 'A8',
    title: 'Find the midpoint of a line segment in all four quadrants',
    strand: 'algebra',
    tiers: ['F'],
    ao: 'AO1',
    marks: 2,
    calculator: 'non-calc',
    boards: boardsFor('A8'),
  },
  (rng) => {
    const { ax, ay, bx, by } = pickUntil(
      rng,
      (r) => ({
        ax: r.int(-8, 8),
        ay: r.int(-8, 8),
        bx: r.int(-8, 8),
        by: r.int(-8, 8),
      }),
      // Even sums keep the midpoint on integer coordinates, and the points must be distinct.
      ({ ax: p, ay: q, bx: u, by: v }) => (p + u) % 2 === 0 && (q + v) % 2 === 0 && (p !== u || q !== v),
    );
    const mx = (ax + bx) / 2;
    const my = (ay + by) / 2;

    return draft({
      params: { ax, ay, bx, by, mx, my },
      content: [
        text(`A is the point (${ax}, ${ay}) and B is the point (${bx}, ${by}).`),
        text('Work out the coordinates of the midpoint of AB.'),
        slot('answer'),
      ],
      answer: pointValue(rat(mx), rat(my)),
      steps: [
        {
          id: 'm1',
          type: 'M',
          values: [pointValue(rat(mx), rat(my))],
          note: 'a correct method for either coordinate',
        },
        { id: 'a1', type: 'A', values: [pointValue(rat(mx), rat(my))] },
      ],
      specialCases: [
        {
          marks: 0,
          values: [pointValue(rat(bx - ax), rat(by - ay))],
          misconception: 'midpoint-confused-with-vector-between-points',
        },
      ],
    });
  },
);

export default [a8Midpoint];
