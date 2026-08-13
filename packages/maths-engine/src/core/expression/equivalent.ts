/**
 * Expression equivalence.
 *
 * This is what makes the "or equivalent" rule work. Examiners accept 3x + 2 for 2 + 3x,
 * y = 3.5x for y = 7x/2, and (x+1)(x+3) for x^2 + 4x + 3, so the marker cannot compare
 * strings or even syntax trees. It compares behaviour.
 *
 * Method: evaluate both expressions at a spread of deterministic sample points and require
 * agreement at every point where both are defined. For relations (equations and
 * inequalities) the difference lhs - rhs is compared up to a scalar multiple, since
 * 2x + 2y = 4 and x + y = 2 are the same equation.
 *
 * Sample points are fixed rather than random so that equivalence is deterministic and a
 * failing test always reproduces.
 */
import { evaluate, isRelation, symbols, type Expr } from './ast.js';

const SAMPLE_POINTS = [
  0.3712, 1.6234, -0.8451, 2.7183, -1.9302, 3.1416, 0.5772, -2.4142, 1.2361, 4.6692, -0.6180,
  5.4366,
];

const REL_TOLERANCE = 1e-9;

function close(a: number, b: number): boolean {
  if (!Number.isFinite(a) || !Number.isFinite(b)) return false;
  const scale = Math.max(1, Math.abs(a), Math.abs(b));
  return Math.abs(a - b) <= REL_TOLERANCE * scale;
}

function environments(vars: string[], count: number): Record<string, number>[] {
  const envs: Record<string, number>[] = [];
  for (let i = 0; i < count; i++) {
    const env: Record<string, number> = {};
    vars.forEach((v, j) => {
      env[v] = SAMPLE_POINTS[(i * 3 + j * 5) % SAMPLE_POINTS.length]! + j * 0.101;
    });
    envs.push(env);
  }
  return envs;
}

function sample(e: Expr, envs: Record<string, number>[]): (number | null)[] {
  return envs.map((env) => {
    try {
      const v = evaluate(e, env);
      return Number.isFinite(v) ? v : null;
    } catch {
      return null;
    }
  });
}

/** Are two expressions (or two relations) mathematically equivalent? */
export function expressionsEquivalent(a: Expr, b: Expr): boolean {
  const aRel = isRelation(a);
  const bRel = isRelation(b);
  if (aRel !== bRel) {
    // An answer box labelled "y =" is satisfied by "y = 3x + 2" and by "3x + 2" alike, so a
    // simple equation is compared against the bare expression by its other side.
    const relation = aRel ? a : bRel ? b : null;
    const bare = aRel ? b : a;
    if (!relation || !isRelation(relation) || relation.op !== '=') return false;
    const lhsIsSymbol = relation.lhs.k === 'sym';
    const rhsIsSymbol = relation.rhs.k === 'sym';
    if (lhsIsSymbol === rhsIsSymbol) return false;
    const subject = lhsIsSymbol ? relation.rhs : relation.lhs;
    return expressionsEquivalent(subject, bare);
  }

  const vars = [...new Set([...symbols(a), ...symbols(b)])].filter((v) => v !== 'pi');
  const envs = environments(vars, Math.max(8, vars.length * 4));

  const sa = sample(a, envs);
  const sb = sample(b, envs);

  if (aRel && bRel) {
    if (a.op !== b.op) {
      // x > 3 and 3 < x are the same statement, so allow a mirrored operator with a
      // negated difference.
      const mirrored: Record<string, string> = { '<': '>', '>': '<', '<=': '>=', '>=': '<=' };
      if (mirrored[a.op] !== b.op) return false;
      return proportional(sa, sb, { requireNegative: true });
    }
    // Same operator: for an equation any non-zero multiple is equivalent; for an
    // inequality the multiple must be positive or the sense would flip.
    return proportional(sa, sb, a.op === '=' ? {} : { requirePositive: true });
  }

  let compared = 0;
  for (let i = 0; i < envs.length; i++) {
    const x = sa[i] ?? null;
    const y = sb[i] ?? null;
    if (x === null || y === null) continue;
    if (!close(x, y)) return false;
    compared++;
  }
  return compared >= Math.min(4, envs.length);
}

/** Do two sampled difference-functions agree up to a single constant multiple? */
function proportional(
  sa: (number | null)[],
  sb: (number | null)[],
  opts: { requirePositive?: boolean; requireNegative?: boolean },
): boolean {
  let ratio: number | null = null;
  let compared = 0;
  for (let i = 0; i < sa.length; i++) {
    const x = sa[i] ?? null;
    const y = sb[i] ?? null;
    if (x === null || y === null) continue;
    if (Math.abs(x) < 1e-12 && Math.abs(y) < 1e-12) continue;
    if (Math.abs(x) < 1e-12 || Math.abs(y) < 1e-12) return false;
    const r = y / x;
    if (ratio === null) ratio = r;
    else if (!close(ratio, r)) return false;
    compared++;
  }
  if (ratio === null || compared < 2) return false;
  if (Math.abs(ratio) < 1e-12) return false;
  if (opts.requirePositive && ratio <= 0) return false;
  if (opts.requireNegative && ratio >= 0) return false;
  return true;
}
