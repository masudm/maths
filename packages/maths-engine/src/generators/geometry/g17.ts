/**
 * G17 - Circle formulae, and the surface area and volume of spheres, cones and pyramids.
 * Modelled on the OCR J560/04 melt-and-recast item.
 */
import { boardsFor, decimalValue, defineGenerator, draft, slot, text } from '../kit.js';

export const g17CylinderToSphere = defineGenerator(
  {
    id: 'G17.recast-cylinder-as-sphere',
    ref: 'G17',
    title: 'Recast a cylinder as a sphere and find the radius',
    strand: 'geometry',
    tiers: ['H'],
    ao: 'AO3',
    marks: 5,
    calculator: 'calc',
    boards: boardsFor('G17'),
  },
  (rng) => {
    const radius = rng.int(4, 20);
    const height = rng.int(8, 40);
    const cylinderVolume = Math.PI * radius * radius * height;
    const sphereRadius = Math.cbrt((3 * cylinderVolume) / (4 * Math.PI));

    return draft({
      params: { radius, height, cylinderVolume, sphereRadius },
      content: [
        text(
          `A solid cylinder has radius ${radius} cm and height ${height} cm. ` +
            'It is melted down and recast as a single sphere.',
        ),
        text('Work out the radius of the sphere. Give your answer to 3 significant figures.'),
        text('The volume of a sphere is (4/3)πr³.'),
        slot('answer', { suffix: 'cm' }),
      ],
      answer: decimalValue(Number(sphereRadius.toPrecision(3))),
      answerSlot: { units: 'cm', policy: { accuracy: { type: 'sf', digits: 3 } } },
      steps: [
        {
          id: 'm1',
          type: 'M',
          values: [decimalValue(Number((Math.PI * radius * radius).toPrecision(6)))],
          policy: { accuracy: { type: 'sf', digits: 3 } },
          note: 'the cross-sectional area of the cylinder',
        },
        {
          id: 'm2',
          type: 'M',
          values: [decimalValue(Number(cylinderVolume.toPrecision(6)))],
          dependsOn: ['m1'],
          policy: { accuracy: { type: 'sf', digits: 3 } },
          note: 'the volume of the cylinder',
        },
        {
          id: 'b1',
          type: 'B',
          values: [decimalValue(Number(((3 * cylinderVolume) / (4 * Math.PI)).toPrecision(6)))],
          policy: { accuracy: { type: 'sf', digits: 3 } },
          note: 'the sphere volume formula equated to their cylinder volume and rearranged',
        },
        {
          id: 'm3',
          type: 'M',
          values: [decimalValue(Number(sphereRadius.toPrecision(6)))],
          dependsOn: ['m2'],
          policy: { accuracy: { type: 'sf', digits: 3 } },
          note: 'the cube root taken',
        },
        {
          id: 'a1',
          type: 'A',
          values: [decimalValue(Number(sphereRadius.toPrecision(3)))],
          policy: { accuracy: { type: 'sf', digits: 3 } },
        },
      ],
      guidance: [
        'The circle formulae must be recalled; the sphere volume formula is given in the question on both boards.',
      ],
    });
  },
);

export default [g17CylinderToSphere];
