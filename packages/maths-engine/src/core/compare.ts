/**
 * Equivalence under a marking policy.
 *
 * The policy is where the mark scheme's shorthand lives: `oe` accepts any equivalent form,
 * `cao` accepts one, an accuracy demand makes 2 d.p. part of the answer rather than a
 * presentational detail, and `rejectRatio` implements the rule that a probability written
 * as a ratio always scores zero even when the correct fraction is alongside it.
 */
import { expressionsEquivalent } from './expression/equivalent.js';
import { parseExpression } from './expression/parse.js';
import { Rational } from './rational.js';
import { Exact } from './exact.js';
import { toNumber, type MathValue } from './value.js';
import type { ParsedResponse } from './parse-response.js';

export interface ComparePolicy {
  /** `oe` (default) accepts equivalent forms; `cao` accepts only the canonical answer. */
  mode?: 'oe' | 'cao';
  /** Demanded accuracy. The student's written form must show it. */
  accuracy?: { type: 'dp' | 'sf'; digits: number };
  /** Absolute tolerance for decimal comparison. Defaults to a value derived from `accuracy`. */
  tolerance?: number;
  /** Probability answers: a ratio scores zero however it is written. */
  rejectRatio?: boolean;
  /** Require the answer to be in its simplest form (fractions, ratios). */
  requireSimplified?: boolean;
  /** Require a unit to be written. */
  requireUnit?: boolean;
  /** Accepted unit spellings, lower-cased. */
  units?: string[];
  /** Text answers: response matches if every term in any one group appears. */
  keywordGroups?: string[][];
  /** Text answers: any of these terms present causes a fail (contradiction). */
  forbid?: string[];
  /**
   * The answer must be written in standard form A x 10^n with 1 <= A < 10. Presentation is
   * part of the answer here, so 12.8 x 10^3 is wrong even though it has the right value.
   */
  requireStandardForm?: boolean;
}

const DEFAULT_TOLERANCE = 5e-10;

function toleranceFor(policy: ComparePolicy, expected: number): number {
  if (policy.tolerance !== undefined) return policy.tolerance;
  if (policy.accuracy?.type === 'dp') return 0.5 * 10 ** -policy.accuracy.digits;
  if (policy.accuracy?.type === 'sf') {
    const magnitude = expected === 0 ? 0 : Math.floor(Math.log10(Math.abs(expected)));
    return 0.5 * 10 ** (magnitude - policy.accuracy.digits + 1);
  }
  return DEFAULT_TOLERANCE;
}

export function roundToSigFigs(x: number, sf: number): number {
  if (x === 0) return 0;
  const magnitude = Math.floor(Math.log10(Math.abs(x)));
  const factor = 10 ** (sf - 1 - magnitude);
  return Math.round(x * factor) / factor;
}

function simplified(v: MathValue): boolean {
  if (v.kind === 'ratio') {
    const ints = v.parts.every((p) => p.isInteger());
    if (!ints) return false;
    let g = v.parts[0]!.n < 0n ? -v.parts[0]!.n : v.parts[0]!.n;
    for (const p of v.parts.slice(1)) {
      let b = p.n < 0n ? -p.n : p.n;
      while (b) {
        const t = g % b;
        g = b;
        b = t;
      }
    }
    return g === 1n;
  }
  return true;
}

function textMatches(response: string, policy: ComparePolicy): boolean {
  const text = response.toLowerCase();
  if (policy.forbid?.some((f) => text.includes(f.toLowerCase()))) return false;
  const groups = policy.keywordGroups;
  if (!groups || groups.length === 0) return text.trim().length > 0;
  return groups.some((group) => group.every((term) => text.includes(term.toLowerCase())));
}

function unitOk(parsed: ParsedResponse | undefined, policy: ComparePolicy): boolean {
  if (!policy.requireUnit) return true;
  const written = parsed?.unit?.toLowerCase().replace(/\s+/g, '');
  if (!written) return false;
  if (!policy.units || policy.units.length === 0) return true;
  return policy.units.some((u) => u.toLowerCase().replace(/\s+/g, '') === written);
}

function accuracyOk(parsed: ParsedResponse | undefined, policy: ComparePolicy): boolean {
  const acc = policy.accuracy;
  if (!acc || !parsed) return true;
  if (acc.type === 'dp') {
    // An answer that terminates earlier is only acceptable when the exact value does too,
    // e.g. 7 for "7.00 to 2 d.p." is correct, but 3.1 for "to 2 d.p." is not.
    const written = parsed.decimalPlaces;
    if (written === null) return true;
    return written <= acc.digits;
  }
  return true;
}

/**
 * Compare a student's value with the expected value under a policy.
 * `parsed` carries the presentational detail (units, decimal places) when available.
 */
const STANDARD_FORM = /^[+-]?[1-9](?:\.\d+)?\s*(?:x|\*|×)\s*10\s*\^?\s*[+-]?\d+$/i;

export function equivalent(
  expected: MathValue,
  actual: MathValue,
  policy: ComparePolicy = {},
  parsed?: ParsedResponse,
): boolean {
  if (parsed?.percentWritten) {
    // "75%" is 0.75 as a probability and 75 as a percentage answer. Both readings are
    // offered, since examiners accept either wherever the quantity is unambiguous.
    const asFraction = compareCore(expected, actual, policy, parsed);
    if (asFraction) return true;
    const scaled = scaleBy100(actual);
    return scaled !== null && compareCore(expected, scaled, policy, parsed);
  }
  return compareCore(expected, actual, policy, parsed);
}

function scaleBy100(value: MathValue): MathValue | null {
  if (value.kind === 'exact') {
    return { kind: 'exact', value: value.value.mul(Exact.int(100)) };
  }
  if (value.kind === 'decimal') return { kind: 'decimal', value: value.value * 100 };
  return null;
}

function compareCore(
  expected: MathValue,
  actual: MathValue,
  policy: ComparePolicy = {},
  parsed?: ParsedResponse,
): boolean {
  if (policy.rejectRatio && actual.kind === 'ratio') return false;
  if (policy.requireStandardForm && !STANDARD_FORM.test((parsed?.raw ?? '').trim())) return false;
  if (!unitOk(parsed, policy)) return false;
  if (!accuracyOk(parsed, policy)) return false;
  if (policy.requireSimplified && !simplified(actual)) return false;

  switch (expected.kind) {
    case 'range': {
      const n = toNumber(actual);
      if (n === null) return false;
      const lower = expected.minInclusive ? n >= expected.min : n > expected.min;
      const upper = expected.maxInclusive ? n <= expected.max : n < expected.max;
      return lower && upper;
    }

    case 'exact': {
      if (actual.kind === 'exact') {
        if (expected.value.eq(actual.value)) return true;
        if (policy.mode === 'cao') return false;
        // Different representations of the same quantity, e.g. root12 and 2root3, already
        // canonicalise to the same terms; anything left over is compared numerically.
        return numericallyEqual(expected, actual, policy);
      }
      if (actual.kind === 'decimal') return numericallyEqual(expected, actual, policy);
      if (actual.kind === 'expression') {
        // "25/4" typed as an expression, or an answer left as "5*5/4".
        try {
          const expectedExpr = parseExpression(expected.value.toString().replace(/root/g, 'sqrt'));
          return expressionsEquivalent(expectedExpr, actual.expr);
        } catch {
          return false;
        }
      }
      return false;
    }

    case 'decimal': {
      if (actual.kind === 'exact' || actual.kind === 'decimal') {
        return numericallyEqual(expected, actual, policy);
      }
      return false;
    }

    case 'expression': {
      if (actual.kind === 'expression') {
        return expressionsEquivalent(expected.expr, actual.expr);
      }
      if (actual.kind === 'exact' || actual.kind === 'decimal') {
        try {
          const actualExpr = parseExpression(String(toNumber(actual)));
          return expressionsEquivalent(expected.expr, actualExpr);
        } catch {
          return false;
        }
      }
      return false;
    }

    case 'set': {
      if (actual.kind !== 'set') {
        // A single value can satisfy a one-element set.
        return expected.items.length === 1 && equivalent(expected.items[0]!, actual, policy, parsed);
      }
      if (actual.items.length !== expected.items.length) return false;
      if (expected.ordered) {
        return expected.items.every((item, i) => equivalent(item, actual.items[i]!, policy));
      }
      const remaining = [...actual.items];
      return expected.items.every((item) => {
        const idx = remaining.findIndex((candidate) => compareCore(item, candidate, policy));
        if (idx === -1) return false;
        remaining.splice(idx, 1);
        return true;
      });
    }

    case 'ratio': {
      if (actual.kind !== 'ratio') return false;
      if (actual.parts.length !== expected.parts.length) return false;
      if (policy.mode === 'cao') {
        return expected.parts.every((p, i) => p.eq(actual.parts[i]!));
      }
      // Equivalent ratios: every part scaled by the same non-zero factor.
      const first = actual.parts[0]!;
      if (first.isZero() || expected.parts[0]!.isZero()) {
        return expected.parts.every((p, i) => p.eq(actual.parts[i]!));
      }
      const scale = first.div(expected.parts[0]!);
      return expected.parts.every((p, i) => p.mul(scale).eq(actual.parts[i]!));
    }

    case 'point':
    case 'vector': {
      const e = expected.kind === 'point' ? expected.coords : expected.components;
      if (actual.kind !== expected.kind) return false;
      const a = actual.kind === 'point' ? actual.coords : actual.components;
      return e.length === a.length && e.every((c, i) => c.eq(a[i]!));
    }

    case 'text': {
      if (actual.kind !== 'text' && actual.kind !== 'choice') return false;
      return textMatches(actual.value, policy);
    }

    case 'choice': {
      const value = actual.kind === 'choice' || actual.kind === 'text' ? actual.value : null;
      if (value === null) return false;
      return value.trim().toLowerCase() === expected.value.trim().toLowerCase();
    }
  }
}

function numericallyEqual(a: MathValue, b: MathValue, policy: ComparePolicy): boolean {
  const x = toNumber(a);
  const y = toNumber(b);
  if (x === null || y === null) return false;
  if (policy.accuracy?.type === 'sf') {
    const digits = policy.accuracy.digits;
    if (roundToSigFigs(x, digits) === roundToSigFigs(y, digits)) return true;
  }
  return Math.abs(x - y) <= toleranceFor(policy, x);
}

/** Exposed for tests and for helper construction. */
export function rationalsEqual(a: Rational, b: Rational): boolean {
  return a.eq(b);
}
