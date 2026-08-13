/**
 * The value model. Every expected answer and every parsed student response is one of these.
 */
import { Exact } from './exact.js';
import { Rational, rat } from './rational.js';
import type { Expr } from './expression/ast.js';

export type MathValue =
  /** An exact quantity: rational, surd, or multiple of pi. */
  | { kind: 'exact'; value: Exact }
  /** A decimal, typically a rounded or calculator answer. */
  | { kind: 'decimal'; value: number }
  /** An accepted interval, for estimation and measurement answers. */
  | { kind: 'range'; min: number; max: number; minInclusive: boolean; maxInclusive: boolean }
  /** An algebraic expression, equation or inequality. */
  | { kind: 'expression'; expr: Expr; source: string }
  /** A collection; `ordered` distinguishes a sequence from a set of roots. */
  | { kind: 'set'; items: MathValue[]; ordered: boolean }
  /** A ratio such as 3 : 5. Kept distinct because probability answers must reject it. */
  | { kind: 'ratio'; parts: Rational[] }
  /** A coordinate pair or triple. */
  | { kind: 'point'; coords: Rational[] }
  /** A column vector. */
  | { kind: 'vector'; components: Rational[] }
  /** Free text, matched by keywords — reasons, explanations, comparisons. */
  | { kind: 'text'; value: string }
  /** One of a fixed list of options. */
  | { kind: 'choice'; value: string };

export const exactValue = (value: Exact): MathValue => ({ kind: 'exact', value });
export const intValue = (n: number | bigint): MathValue => exactValue(Exact.int(n));
export const ratioValue = (...parts: (Rational | number)[]): MathValue => ({
  kind: 'ratio',
  parts: parts.map((p) => (typeof p === 'number' ? rat(p) : p)),
});
export const rationalValue = (n: number | bigint, d: number | bigint = 1): MathValue =>
  exactValue(Exact.rational(rat(n, d)));
export const decimalValue = (value: number): MathValue => ({ kind: 'decimal', value });
export const textValue = (value: string): MathValue => ({ kind: 'text', value });
export const choiceValue = (value: string): MathValue => ({ kind: 'choice', value });
export const pointValue = (...coords: (Rational | number)[]): MathValue => ({
  kind: 'point',
  coords: coords.map((c) => (typeof c === 'number' ? rat(c) : c)),
});
export const vectorValue = (...components: (Rational | number)[]): MathValue => ({
  kind: 'vector',
  components: components.map((c) => (typeof c === 'number' ? rat(c) : c)),
});
export const setValue = (items: MathValue[], ordered = false): MathValue => ({
  kind: 'set',
  items,
  ordered,
});
export const rangeValue = (
  min: number,
  max: number,
  minInclusive = true,
  maxInclusive = true,
): MathValue => ({ kind: 'range', min, max, minInclusive, maxInclusive });

/** Numeric size of a value where one is defined, for range and tolerance checks. */
export function toNumber(v: MathValue): number | null {
  switch (v.kind) {
    case 'exact':
      return v.value.toNumber();
    case 'decimal':
      return v.value;
    default:
      return null;
  }
}

/** Plain-text rendering, used for the model answer shown alongside a question. */
export function displayValue(v: MathValue): string {
  switch (v.kind) {
    case 'exact': {
      const r = v.value.asRational();
      if (r) return r.toString();
      return v.value.toString();
    }
    case 'decimal':
      return `${v.value}`;
    case 'range':
      return `${v.minInclusive ? '[' : '('}${v.min}, ${v.max}${v.maxInclusive ? ']' : ')'}`;
    case 'expression':
      return v.source;
    case 'set':
      return v.items.map(displayValue).join(v.ordered ? ', ' : ' and ');
    case 'ratio':
      return v.parts.map((p) => p.toString()).join(' : ');
    case 'point':
      return `(${v.coords.map((c) => c.toString()).join(', ')})`;
    case 'vector':
      return `(${v.components.map((c) => c.toString()).join(', ')})`;
    case 'text':
      return v.value;
    case 'choice':
      return v.value;
  }
}
