/**
 * Structural checks on generated figures.
 *
 * Run by the conformance harness against every figure a generator emits, so a diagram that
 * has drifted out of agreement with its parameters fails a test rather than reaching a
 * student. Returns a list of problems; empty means valid.
 */
import type { Figure, Point2, TreeNode } from './types.js';

const EPSILON = 1e-9;

function finite(p: Point2): boolean {
  return Number.isFinite(p.x) && Number.isFinite(p.y);
}

function distance(a: Point2, b: Point2): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export function validateFigure(figure: Figure): string[] {
  const problems: string[] = [];
  const fail = (message: string): void => {
    problems.push(message);
  };

  switch (figure.kind) {
    case 'diagram': {
      if (figure.width <= 0 || figure.height <= 0) fail('diagram has a non-positive extent');
      if (figure.elements.length === 0) fail('diagram has no elements');
      for (const el of figure.elements) {
        switch (el.type) {
          case 'point':
            if (!finite(el.at)) fail('point has a non-finite coordinate');
            break;
          case 'segment':
            if (!finite(el.from) || !finite(el.to)) fail('segment has a non-finite endpoint');
            else if (distance(el.from, el.to) < EPSILON) fail('segment has zero length');
            break;
          case 'polygon': {
            if (el.vertices.length < 3) fail('polygon has fewer than three vertices');
            if (!el.vertices.every(finite)) fail('polygon has a non-finite vertex');
            if (el.labels && el.labels.length !== el.vertices.length) {
              fail(`polygon has ${el.vertices.length} vertices but ${el.labels.length} labels`);
            }
            if (el.sideLabels && el.sideLabels.length !== el.vertices.length) {
              fail('polygon side labels do not match the number of sides');
            }
            // Degenerate (collinear) triangles would be undrawable.
            if (el.vertices.length === 3) {
              const [a, b, c] = el.vertices as [Point2, Point2, Point2];
              const area = Math.abs(
                (b.x - a.x) * (c.y - a.y) - (c.x - a.x) * (b.y - a.y),
              ) / 2;
              if (area < EPSILON) fail('triangle is degenerate (vertices are collinear)');
            }
            break;
          }
          case 'circle':
            if (!finite(el.centre)) fail('circle has a non-finite centre');
            if (!(el.radius > 0)) fail('circle has a non-positive radius');
            break;
          case 'arc':
            if (!(el.radius > 0)) fail('arc has a non-positive radius');
            if (el.startDegrees === el.endDegrees) fail('arc has zero angular extent');
            break;
          case 'angleMark':
          case 'rightAngle':
            if (!finite(el.at) || !finite(el.from) || !finite(el.to)) {
              fail('angle mark has a non-finite point');
            } else if (
              distance(el.at, el.from) < EPSILON ||
              distance(el.at, el.to) < EPSILON
            ) {
              fail('angle mark has a zero-length arm');
            }
            break;
          case 'arrow':
            if (!finite(el.from) || !finite(el.to)) fail('arrow has a non-finite endpoint');
            break;
          case 'text':
            if (!finite(el.at)) fail('text has a non-finite position');
            if (el.text.trim() === '') fail('text element is empty');
            break;
        }
      }
      break;
    }

    case 'numberLine': {
      if (!(figure.max > figure.min)) fail('number line has a non-increasing range');
      if (!(figure.step > 0)) fail('number line has a non-positive step');
      for (const m of figure.markers) {
        if (m.at < figure.min || m.at > figure.max) fail(`marker ${m.at} is outside the line`);
      }
      for (const r of figure.rays) {
        if (r.from < figure.min || r.from > figure.max) fail('ray starts outside the line');
      }
      for (const s of figure.segments) {
        if (s.to <= s.from) fail('number line segment has a non-increasing range');
      }
      break;
    }

    case 'axes': {
      if (!(figure.xMax > figure.xMin)) fail('axes have a non-increasing x range');
      if (!(figure.yMax > figure.yMin)) fail('axes have a non-increasing y range');
      for (const plot of figure.plots) {
        if (plot.points.length < 2) fail('plot has fewer than two points');
        if (!plot.points.every(finite)) fail('plot has a non-finite point');
      }
      for (const p of figure.points) {
        if (!finite(p.at)) fail('plotted point is non-finite');
      }
      break;
    }

    case 'venn': {
      if (figure.sets.length < 2 || figure.sets.length > 3) {
        fail('Venn diagram must have two or three sets');
      }
      const letters = figure.sets.map((_, i) => String.fromCharCode(65 + i));
      for (const key of Object.keys(figure.regions)) {
        if (key !== '' && ![...key].every((c) => letters.includes(c))) {
          fail(`Venn region key "${key}" names a set that does not exist`);
        }
      }
      break;
    }

    case 'tree': {
      const walk = (node: TreeNode, depth: number): void => {
        if (depth > 4) fail('tree is deeper than any GCSE question requires');
        if (node.label.trim() === '' && !node.blank) fail('tree node has an empty label');
        node.children.forEach((c) => walk(c, depth + 1));
      };
      walk(figure.root, 0);
      if (figure.root.children.length === 0) fail('tree has no branches');
      break;
    }

    case 'table': {
      if (figure.head.length === 0) fail('table has no columns');
      for (const row of figure.rows) {
        if (row.length !== figure.head.length) {
          fail(`table row has ${row.length} cells but there are ${figure.head.length} columns`);
        }
      }
      for (const [r, c] of figure.blanks ?? []) {
        if (!figure.rows[r] || figure.rows[r]![c] === undefined) {
          fail(`table blank at [${r}, ${c}] is outside the table`);
        }
      }
      break;
    }

    case 'statChart': {
      const { variant } = figure;
      if (variant === 'histogram') {
        if (!figure.bars || figure.bars.length === 0) fail('histogram has no bars');
        for (const bar of figure.bars ?? []) {
          if (bar.to <= bar.from) fail('histogram bar has a non-positive width');
          if (bar.height < 0) fail('histogram bar has a negative frequency density');
        }
      } else if (variant === 'boxPlot') {
        const f = figure.fiveFigure;
        if (!f) fail('box plot has no five-figure summary');
        else if (!(f.min <= f.q1 && f.q1 <= f.median && f.median <= f.q3 && f.q3 <= f.max)) {
          fail('box plot five-figure summary is not in order');
        }
      } else if (variant === 'scatter' || variant === 'lineGraph') {
        if (!figure.points || figure.points.length < 2) fail(`${variant} needs at least two points`);
        if (!(figure.points ?? []).every(finite)) fail(`${variant} has a non-finite point`);
      } else {
        if (!figure.values || figure.values.length === 0) fail(`${variant} has no values`);
        if (figure.categories && figure.values && figure.categories.length !== figure.values.length) {
          fail(`${variant} has ${figure.categories.length} categories but ${figure.values.length} values`);
        }
        if ((figure.values ?? []).some((v) => !Number.isFinite(v))) {
          fail(`${variant} has a non-finite value`);
        }
      }
      break;
    }
  }

  return problems;
}

/** Every figure reachable from a question's content. */
export function collectFigures(content: unknown): Figure[] {
  const out: Figure[] = [];
  const walk = (node: unknown): void => {
    if (Array.isArray(node)) {
      node.forEach(walk);
      return;
    }
    if (node && typeof node === 'object') {
      const obj = node as Record<string, unknown>;
      if (obj['type'] === 'figure' && obj['figure']) {
        out.push(obj['figure'] as Figure);
        return;
      }
      Object.values(obj).forEach(walk);
    }
  };
  walk(content);
  return out;
}
