/**
 * Mark schemes as data.
 *
 * Modelled on how the boards actually write them (see section 8 of the syllabus map):
 * an ordered list of steps, each earning M (method), A (accuracy) or B (independent) marks,
 * with dependencies for M1dep, follow-through for A1ft, and named special cases for the
 * misconceptions the boards think are worth partial credit.
 */
import type { ComparePolicy } from './compare.js';
import type { MathValue } from './value.js';

/** Where a matcher looks for its value. */
export type MatchTarget =
  /** A specific answer slot. */
  | { where: 'slot'; slotId: string }
  /**
   * Anywhere in the response: any slot, or any line of working. This implements the rule
   * that a method mark is earned by "a correct value seen anywhere, even as the student's
   * final answer".
   */
  | { where: 'anywhere' }
  /** Only in the written working, not the answer line. */
  | { where: 'working' };

export interface Matcher {
  target: MatchTarget;
  /** The value that earns the mark. */
  value: MathValue;
  policy?: ComparePolicy;
  /**
   * Follow-through: recompute the accepted value from the student's own earlier answer.
   * Given the values already established, return the value now acceptable, or null.
   */
  followThrough?: (context: FollowThroughContext) => MathValue | null;
}

export interface FollowThroughContext {
  /** Parsed student values by slot id. */
  slots: Record<string, MathValue | null>;
  /** Parsed values from every line of working. */
  working: MathValue[];
}

export type MarkType = 'M' | 'A' | 'B';

export interface MarkStep {
  /** Stable id, referenced by `dependsOn`. */
  id: string;
  type: MarkType;
  marks: number;
  /** Any one of these earns the step. */
  accept: Matcher[];
  /** Step ids that must already be awarded (M1dep, B dep). */
  dependsOn?: string[];
  /**
   * By default an A step requires every preceding M step to have been awarded, because
   * "M0 A1 cannot be awarded". Set this when the scheme grants the mark independently.
   */
  independent?: boolean;
  /** Scheme annotation, e.g. "oe", "ft their 60", carried through for display. */
  note?: string;
}

export interface SpecialCase {
  marks: number;
  /** Special cases are only awarded for the final answer, never for a value in working. */
  accept: Matcher[];
  /** Stable identifier for the misconception, used by progress tracking. */
  misconception: string;
  note?: string;
}

export interface MarkScheme {
  steps: MarkStep[];
  specialCases?: SpecialCase[];
  /** Total marks. Validated against the sum of step marks and against the question tariff. */
  total: number;
  /**
   * Set when the question says "you must show your working" or "show that...". Without it,
   * a correct final answer alone scores full marks, which is the default rule on both boards.
   */
  requireWorking?: boolean;
  /** Free-text guidance mirroring the "Additional Guidance" column. */
  guidance?: string[];
}

/** Sum of the step tariffs. */
export function schemeTotal(scheme: MarkScheme): number {
  return scheme.steps.reduce((s, step) => s + step.marks, 0);
}

// --- Construction helpers -------------------------------------------------

export const inSlot = (slotId: string): MatchTarget => ({ where: 'slot', slotId });
export const anywhere: MatchTarget = { where: 'anywhere' };
export const inWorking: MatchTarget = { where: 'working' };

export const match = (
  value: MathValue,
  target: MatchTarget = anywhere,
  policy?: ComparePolicy,
): Matcher => ({ target, value, ...(policy ? { policy } : {}) });

export function methodStep(
  id: string,
  marks: number,
  accept: Matcher[],
  opts: { dependsOn?: string[]; note?: string } = {},
): MarkStep {
  return { id, type: 'M', marks, accept, ...opts };
}

export function accuracyStep(
  id: string,
  marks: number,
  accept: Matcher[],
  opts: { dependsOn?: string[]; note?: string; independent?: boolean } = {},
): MarkStep {
  return { id, type: 'A', marks, accept, ...opts };
}

export function independentStep(
  id: string,
  marks: number,
  accept: Matcher[],
  opts: { dependsOn?: string[]; note?: string } = {},
): MarkStep {
  return { id, type: 'B', marks, accept, independent: true, ...opts };
}
