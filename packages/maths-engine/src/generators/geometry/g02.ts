/**
 * G2 - Standard ruler and compass constructions, and loci.
 *
 * A construction is a drawn answer, so what is marked here is the measurable outcome and the
 * method, which is how the published schemes award the marks: arcs present, then accuracy.
 */
import { boardsFor, choiceValue, decimalValue, defineGenerator, draft, fig, figure, slot, text } from '../kit.js';

export const g2AngleBisector = defineGenerator(
  {
    id: 'G2.angle-bisector-construction',
    ref: 'G2',
    title: 'Construct the bisector of an angle and state the resulting angle',
    strand: 'geometry',
    tiers: ['F+'],
    ao: 'AO1',
    marks: 2,
    calculator: 'non-calc',
    boards: boardsFor('G2'),
  },
  (rng) => {
    const angle = rng.int(11, 44) * 2;
    const half = angle / 2;

    return draft({
      params: { angle, half },
      content: [
        text(`The diagram shows an angle of ${angle}° at the point A.`),
        figure(
          fig.diagram(
            [
              { type: 'segment', from: fig.pt(0, 0), to: fig.pt(90, 0) },
              {
                type: 'segment',
                from: fig.pt(0, 0),
                to: fig.pt(90 * Math.cos((angle * Math.PI) / 180), 90 * Math.sin((angle * Math.PI) / 180)),
              },
              { type: 'point', at: fig.pt(0, 0), label: 'A' },
              {
                type: 'angleMark',
                at: fig.pt(0, 0),
                from: fig.pt(90, 0),
                to: fig.pt(
                  90 * Math.cos((angle * Math.PI) / 180),
                  90 * Math.sin((angle * Math.PI) / 180),
                ),
                label: `${angle}°`,
              },
            ],
            { notToScale: false },
          ),
        ),
        text('(a) Construct the bisector of the angle, showing your construction arcs.'),
        text('Write down the size of each of the two angles you have created.'),
        slot('angle', { suffix: '°' }),
        text('(b) Which construction gives the shortest distance from a point to a line?'),
        slot('shortest'),
      ],
      slots: [
        { id: 'angle', label: 'each angle', expect: decimalValue(half) },
        {
          id: 'shortest',
          label: 'construction',
          expect: choiceValue('perpendicular'),
          policy: { mode: 'oe' },
        },
      ],
      steps: [
        { id: 'b1', type: 'B', values: [decimalValue(half)], target: { slot: 'angle' } },
        {
          id: 'b2',
          type: 'B',
          values: [choiceValue('perpendicular')],
          target: { slot: 'shortest' },
        },
      ],
      guidance: [
        'On paper: B2 for an acceptable bisector with two pairs of supporting arcs, B1 with no or incorrect arcs. Tolerance ± 2°.',
      ],
    });
  },
);

export default [g2AngleBisector];
