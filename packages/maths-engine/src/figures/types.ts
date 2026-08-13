/**
 * Figures are data, not pictures.
 *
 * Nothing here renders. A generator emits a scene description built from the *same*
 * parameters that produced the answer, so a diagram can never contradict the mark scheme —
 * the triangle whose angles the student is asked to find is the triangle whose angles the
 * answer was computed from. A renderer in a later phase consumes these structures.
 *
 * `notToScale` matters: exam diagrams are routinely drawn out of proportion and labelled
 * accordingly, so a generator may place vertices for legibility while the stated lengths
 * carry the mathematics.
 */

export interface Point2 {
  x: number;
  y: number;
}

export type DiagramElement =
  | { type: 'point'; at: Point2; label?: string; labelPosition?: LabelPosition; open?: boolean }
  | { type: 'segment'; from: Point2; to: Point2; label?: string; dashed?: boolean; ticks?: number }
  | { type: 'polygon'; vertices: Point2[]; labels?: string[]; shaded?: boolean; sideLabels?: (string | null)[] }
  | { type: 'circle'; centre: Point2; radius: number; label?: string; dashed?: boolean }
  | { type: 'arc'; centre: Point2; radius: number; startDegrees: number; endDegrees: number; label?: string }
  | { type: 'angleMark'; at: Point2; from: Point2; to: Point2; label?: string; arcs?: number }
  | { type: 'rightAngle'; at: Point2; from: Point2; to: Point2 }
  | { type: 'arrow'; from: Point2; to: Point2; label?: string }
  | { type: 'text'; at: Point2; text: string };

export type LabelPosition = 'above' | 'below' | 'left' | 'right' | 'above-left' | 'above-right' | 'below-left' | 'below-right';

export interface Diagram {
  kind: 'diagram';
  width: number;
  height: number;
  notToScale: boolean;
  elements: DiagramElement[];
  caption?: string;
}

export interface NumberLine {
  kind: 'numberLine';
  min: number;
  max: number;
  step: number;
  /** Circles placed on the line. `open` = strict inequality, closed = included boundary. */
  markers: { at: number; open: boolean; label?: string }[];
  /** Shaded rays, e.g. everything to the right of 3. */
  rays: { from: number; direction: 'left' | 'right' }[];
  segments: { from: number; to: number }[];
}

export interface Axes {
  kind: 'axes';
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
  xLabel?: string;
  yLabel?: string;
  gridStep?: number;
  /** Curves given as sampled points so the renderer needs no expression engine. */
  plots: { points: Point2[]; label?: string; dashed?: boolean }[];
  points: { at: Point2; label?: string; open?: boolean }[];
  /** Half-plane shading for inequality regions. */
  shadedRegions?: { above: boolean; boundary: Point2[] }[];
}

export interface VennDiagram {
  kind: 'venn';
  /** Two or three set labels. */
  sets: string[];
  /** Region key -> displayed content. Keys are set-letter combinations, "" for outside. */
  regions: Record<string, string>;
  universalLabel?: string;
}

export interface TreeDiagram {
  kind: 'tree';
  /** Probability tree or frequency tree; frequency trees carry counts, not probabilities. */
  variant: 'probability' | 'frequency';
  root: TreeNode;
}

export interface TreeNode {
  label: string;
  /** Edge label from the parent, e.g. "0.3" or "12". Absent on the root. */
  edgeLabel?: string;
  /** True when the learner must supply this edge or node value. */
  blank?: boolean;
  children: TreeNode[];
}

export interface DataTable {
  kind: 'table';
  caption?: string;
  head: string[];
  rows: string[][];
  /** Cells the learner must complete, as [rowIndex, columnIndex] pairs. */
  blanks?: [number, number][];
}

export interface StatChart {
  kind: 'statChart';
  variant: 'bar' | 'pie' | 'histogram' | 'boxPlot' | 'cumulativeFrequency' | 'scatter' | 'lineGraph' | 'pictogram';
  xLabel?: string;
  yLabel?: string;
  /** Categorical or interval labels, one per datum where the variant needs them. */
  categories?: string[];
  values?: number[];
  /** Histogram bars: interval boundaries with frequency density. */
  bars?: { from: number; to: number; height: number }[];
  /** Box plot five-figure summary. */
  fiveFigure?: { min: number; q1: number; median: number; q3: number; max: number };
  /** Scatter and line data. */
  points?: Point2[];
  /** Pictogram key, e.g. "each symbol represents 5 people". */
  keyValue?: number;
}

export type Figure =
  | Diagram
  | NumberLine
  | Axes
  | VennDiagram
  | TreeDiagram
  | DataTable
  | StatChart;

export type FigureKind = Figure['kind'];
