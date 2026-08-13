/**
 * One import for everything a generator needs.
 */
export { defineGenerator } from '../core/generator.js';
export type { QuestionGenerator, GenerateOptions } from '../core/generator.js';
export { draft, answerSlot } from '../helpers/dsl.js';
export type { StepSpec } from '../helpers/dsl.js';
export { Rng, pickUntil } from '../core/rng.js';
export { Rational, rat } from '../core/rational.js';
export { Exact } from '../core/exact.js';
export { text, math, figure, slot, part, list } from '../core/question.js';
export * from '../core/value.js';
export { boardsFor } from './board-refs.js';
export * as num from '../helpers/numbers.js';
export * as fig from '../figures/builders.js';

import { parseExpression } from '../core/expression/parse.js';
import type { MathValue } from '../core/value.js';

/** An algebraic expression, equation or inequality as an expected answer. */
export function expr(source: string): MathValue {
  return { kind: 'expression', expr: parseExpression(source), source };
}

/** "+ 5" or "- 5", for building readable LaTeX with signed coefficients. */
export function signed(value: number, suffix = ''): string {
  return value < 0 ? `- ${-value}${suffix}` : `+ ${value}${suffix}`;
}

/** A free-text answer matched by keywords; the policy carries the keyword groups. */
export function reason(canonical: string): MathValue {
  return { kind: 'text', value: canonical };
}
