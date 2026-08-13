/**
 * Builders for the recurring exam furniture.
 *
 * Each builder takes the mathematical parameters and returns a figure whose geometry is
 * derived from them, so the picture and the answer are guaranteed to agree.
 */
import type {
  Axes,
  DataTable,
  Diagram,
  DiagramElement,
  NumberLine,
  Point2,
  StatChart,
  TreeDiagram,
  TreeNode,
  VennDiagram,
} from './types.js';

export const pt = (x: number, y: number): Point2 => ({ x, y });

export function diagram(
  elements: DiagramElement[],
  opts: { width?: number; height?: number; notToScale?: boolean; caption?: string } = {},
): Diagram {
  return {
    kind: 'diagram',
    width: opts.width ?? 200,
    height: opts.height ?? 160,
    notToScale: opts.notToScale ?? true,
    elements,
    ...(opts.caption ? { caption: opts.caption } : {}),
  };
}

/**
 * A triangle drawn from two sides and the included angle, so the vertices are consistent
 * with the stated measurements even when the figure is labelled "not to scale".
 */
export function triangleFromSAS(
  b: number,
  angleDegrees: number,
  c: number,
  labels: [string, string, string] = ['A', 'B', 'C'],
): { vertices: [Point2, Point2, Point2]; elements: DiagramElement[] } {
  const A = pt(0, 0);
  const B = pt(c, 0);
  const rad = (angleDegrees * Math.PI) / 180;
  const C = pt(b * Math.cos(rad), b * Math.sin(rad));
  const vertices: [Point2, Point2, Point2] = [A, B, C];
  const elements: DiagramElement[] = [
    { type: 'polygon', vertices: [A, B, C], labels: [...labels] },
    { type: 'angleMark', at: A, from: B, to: C, label: `${angleDegrees}°` },
  ];
  return { vertices, elements };
}

/** A right-angled triangle with the right angle at the origin. */
export function rightTriangle(
  base: number,
  height: number,
  labels: { base?: string; height?: string; hypotenuse?: string; vertices?: [string, string, string] } = {},
): Diagram {
  const A = pt(0, 0);
  const B = pt(base, 0);
  const C = pt(0, height);
  const elements: DiagramElement[] = [
    {
      type: 'polygon',
      vertices: [A, B, C],
      ...(labels.vertices ? { labels: labels.vertices } : {}),
      sideLabels: [labels.base ?? null, labels.hypotenuse ?? null, labels.height ?? null],
    },
    { type: 'rightAngle', at: A, from: B, to: C },
  ];
  return diagram(elements, { width: Math.max(base, 60), height: Math.max(height, 60) });
}

/** A regular polygon, used for interior and exterior angle questions. */
export function regularPolygon(sides: number, radius = 60): Diagram {
  const vertices: Point2[] = [];
  for (let i = 0; i < sides; i++) {
    const angle = (Math.PI * 2 * i) / sides - Math.PI / 2;
    vertices.push(pt(radius * Math.cos(angle), radius * Math.sin(angle)));
  }
  return diagram([{ type: 'polygon', vertices }], {
    width: radius * 2 + 20,
    height: radius * 2 + 20,
    notToScale: false,
  });
}

/** A circle with points on the circumference, for the circle theorems. */
export function circleWithPoints(
  pointsAtDegrees: { degrees: number; label: string }[],
  opts: { radius?: number; showCentre?: boolean; chords?: [string, string][]; centreLabel?: string } = {},
): Diagram {
  const radius = opts.radius ?? 70;
  const centre = pt(0, 0);
  const byLabel = new Map<string, Point2>();
  const elements: DiagramElement[] = [{ type: 'circle', centre, radius }];

  for (const p of pointsAtDegrees) {
    const rad = (p.degrees * Math.PI) / 180;
    const at = pt(radius * Math.cos(rad), radius * Math.sin(rad));
    byLabel.set(p.label, at);
    elements.push({ type: 'point', at, label: p.label });
  }
  if (opts.showCentre) {
    elements.push({ type: 'point', at: centre, label: opts.centreLabel ?? 'O' });
  }
  for (const [a, b] of opts.chords ?? []) {
    const from = byLabel.get(a);
    const to = byLabel.get(b);
    if (from && to) elements.push({ type: 'segment', from, to });
  }
  return diagram(elements, { width: radius * 2 + 40, height: radius * 2 + 40, notToScale: false });
}

/**
 * A number line for inequality solution sets. An open circle is a strict inequality and a
 * closed circle an included boundary, which is exactly what the mark scheme checks.
 */
export function inequalityNumberLine(
  boundary: number,
  direction: 'left' | 'right',
  strict: boolean,
  opts: { min?: number; max?: number; step?: number } = {},
): NumberLine {
  const min = opts.min ?? boundary - 5;
  const max = opts.max ?? boundary + 5;
  return {
    kind: 'numberLine',
    min,
    max,
    step: opts.step ?? 1,
    markers: [{ at: boundary, open: strict }],
    rays: [{ from: boundary, direction }],
    segments: [],
  };
}

export function blankNumberLine(min: number, max: number, step = 1): NumberLine {
  return { kind: 'numberLine', min, max, step, markers: [], rays: [], segments: [] };
}

/** Sample a function over a range so the renderer needs no expression engine. */
export function plotFunction(
  f: (x: number) => number,
  xMin: number,
  xMax: number,
  samples = 60,
): Point2[] {
  const points: Point2[] = [];
  for (let i = 0; i <= samples; i++) {
    const x = xMin + ((xMax - xMin) * i) / samples;
    const y = f(x);
    if (Number.isFinite(y)) points.push(pt(x, y));
  }
  return points;
}

export function axes(opts: Partial<Axes> & Pick<Axes, 'xMin' | 'xMax' | 'yMin' | 'yMax'>): Axes {
  return {
    kind: 'axes',
    plots: [],
    points: [],
    gridStep: 1,
    ...opts,
  };
}

export function venn(
  sets: string[],
  regions: Record<string, string>,
  universalLabel?: string,
): VennDiagram {
  return {
    kind: 'venn',
    sets,
    regions,
    ...(universalLabel ? { universalLabel } : {}),
  };
}

export function treeNode(
  label: string,
  opts: { edgeLabel?: string; blank?: boolean; children?: TreeNode[] } = {},
): TreeNode {
  return {
    label,
    ...(opts.edgeLabel !== undefined ? { edgeLabel: opts.edgeLabel } : {}),
    ...(opts.blank ? { blank: true } : {}),
    children: opts.children ?? [],
  };
}

export function tree(variant: 'probability' | 'frequency', root: TreeNode): TreeDiagram {
  return { kind: 'tree', variant, root };
}

export function table(
  head: string[],
  rows: string[][],
  opts: { caption?: string; blanks?: [number, number][] } = {},
): DataTable {
  return {
    kind: 'table',
    head,
    rows,
    ...(opts.caption ? { caption: opts.caption } : {}),
    ...(opts.blanks ? { blanks: opts.blanks } : {}),
  };
}

export function statChart(
  variant: StatChart['variant'],
  data: Omit<StatChart, 'kind' | 'variant'>,
): StatChart {
  return { kind: 'statChart', variant, ...data };
}
