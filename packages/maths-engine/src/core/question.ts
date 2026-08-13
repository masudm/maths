/**
 * The question model.
 *
 * Content is structured rather than a prose string so that shape, angle, graph, Venn, tree
 * and table questions can all be rendered later from the same shape of data. Nothing here
 * assumes a renderer exists.
 */
import type { Figure } from '../figures/types.js';
import type { ComparePolicy } from './compare.js';
import type { MarkScheme } from './markscheme.js';
import type { MathValue } from './value.js';

export type Strand = 'number' | 'algebra' | 'ratio' | 'geometry' | 'probability' | 'statistics';
export type Tier = 'F' | 'F+' | 'H';
export type AO = 'AO1' | 'AO2' | 'AO3';
export type CalculatorPolicy = 'either' | 'non-calc' | 'calc';

export type Content =
  | { type: 'text'; text: string }
  /** Display mathematics, given as LaTeX. */
  | { type: 'math'; latex: string; display?: boolean }
  | { type: 'figure'; figure: Figure }
  | { type: 'list'; style: 'bullet' | 'number'; items: Content[][] }
  /** An answer box. `slotId` ties it to an AnswerSlot. */
  | { type: 'slot'; slotId: string; prefix?: string; suffix?: string }
  /** A labelled sub-question, e.g. (a). */
  | { type: 'part'; label: string; content: Content[] };

export interface AnswerSlot {
  id: string;
  /** Shown next to the box, e.g. "x =" or "(a)". */
  label?: string;
  /** The canonical answer. */
  expect: MathValue;
  /** How this slot is marked. */
  policy?: ComparePolicy;
  /** Units expected in the answer, for display. */
  units?: string;
  /** Alternative acceptable forms, used by the conformance harness to prove `oe` works. */
  alternativeForms?: string[];
}

export interface Question {
  /** Identifies the generator that produced this question. */
  generatorId: string;
  /** DfE / AQA content reference, e.g. "R9". */
  ref: string;
  /** The seed this question was generated from. Regenerating with it reproduces the question. */
  seed: number;
  strand: Strand;
  tier: Tier;
  ao: AO;
  calculator: CalculatorPolicy;
  /** Total marks available. Must equal the mark scheme total. */
  marks: number;
  /** The generated parameters, retained so figures, answers and tests can be cross-checked. */
  params: Record<string, unknown>;
  /** The prompt. */
  content: Content[];
  slots: AnswerSlot[];
  markScheme: MarkScheme;
  /** Board references, carried through from the generator metadata. */
  boards: { aqa: string; ocr: string[] };
}

export const text = (t: string): Content => ({ type: 'text', text: t });
export const math = (latex: string, display = false): Content => ({ type: 'math', latex, display });
export const figure = (f: Figure): Content => ({ type: 'figure', figure: f });
export const slot = (slotId: string, opts: { prefix?: string; suffix?: string } = {}): Content => ({
  type: 'slot',
  slotId,
  ...opts,
});
export const part = (label: string, content: Content[]): Content => ({
  type: 'part',
  label,
  content,
});
export const list = (style: 'bullet' | 'number', items: Content[][]): Content => ({
  type: 'list',
  style,
  items,
});

/** Flatten nested content, for tests and for plain-text previews. */
export function contentToText(content: Content[]): string {
  const out: string[] = [];
  const walk = (items: Content[]): void => {
    for (const c of items) {
      switch (c.type) {
        case 'text':
          out.push(c.text);
          break;
        case 'math':
          out.push(c.latex);
          break;
        case 'figure':
          out.push(`[${c.figure.kind}]`);
          break;
        case 'list':
          c.items.forEach(walk);
          break;
        case 'slot':
          out.push(`${c.prefix ?? ''}____${c.suffix ?? ''}`);
          break;
        case 'part':
          out.push(`(${c.label})`);
          walk(c.content);
          break;
      }
    }
  };
  walk(content);
  return out.join(' ').replace(/\s+/g, ' ').trim();
}
