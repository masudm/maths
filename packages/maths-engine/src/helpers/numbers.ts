/**
 * Number-theoretic and "make it look like an exam question" helpers.
 *
 * Generators use these so that generated values behave the way exam values behave:
 * whole-number answers, factorisable quadratics, money to two decimal places, and
 * intermediate steps a student could reasonably do without a calculator.
 */
import { Rational, rat } from '../core/rational.js';
import { Rng, pickUntil } from '../core/rng.js';

export const PRIMES_UNDER_100 = [
  2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97,
] as const;

export function isPrime(n: number): boolean {
  if (n < 2 || !Number.isInteger(n)) return false;
  if (n % 2 === 0) return n === 2;
  for (let f = 3; f * f <= n; f += 2) if (n % f === 0) return false;
  return true;
}

export function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) {
    const t = x % y;
    x = y;
    y = t;
  }
  return x;
}

export function lcm(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return Math.abs((a * b) / gcd(a, b));
}

export function coprime(a: number, b: number): boolean {
  return gcd(a, b) === 1;
}

/** Prime factorisation as ordered [prime, exponent] pairs. */
export function primeFactors(n: number): [number, number][] {
  if (n < 2) return [];
  const out: [number, number][] = [];
  let rest = n;
  for (let f = 2; f * f <= rest; f++) {
    let count = 0;
    while (rest % f === 0) {
      rest /= f;
      count++;
    }
    if (count > 0) out.push([f, count]);
  }
  if (rest > 1) out.push([rest, 1]);
  return out;
}

/** "2^2 x 3 x 7" in LaTeX, index form as the specifications require. */
export function primeFactorLatex(n: number): string {
  return primeFactors(n)
    .map(([p, e]) => (e === 1 ? `${p}` : `${p}^{${e}}`))
    .join(' \\times ');
}

export function divisors(n: number): number[] {
  const out: number[] = [];
  for (let d = 1; d * d <= n; d++) {
    if (n % d === 0) {
      out.push(d);
      if (d !== n / d) out.push(n / d);
    }
  }
  return out.sort((a, b) => a - b);
}

/** A pair with a non-trivial HCF, so the question is worth asking. */
export function hcfPair(rng: Rng, opts: { minHcf?: number; max?: number } = {}): [number, number] {
  const minHcf = opts.minHcf ?? 2;
  const max = opts.max ?? 120;
  return pickUntil(
    rng,
    (r) => [r.int(12, max), r.int(12, max)] as [number, number],
    ([a, b]) => a !== b && gcd(a, b) >= minHcf && gcd(a, b) < Math.min(a, b),
  );
}

/** Integer roots (p, q) giving x^2 + bx + c = (x - p)(x - q) with the requested coefficients. */
export function factorisableQuadratic(
  rng: Rng,
  opts: { maxRoot?: number; distinct?: boolean } = {},
): { p: number; q: number; b: number; c: number } {
  const maxRoot = opts.maxRoot ?? 9;
  const distinct = opts.distinct ?? true;
  return pickUntil(
    rng,
    (r) => {
      const p = r.intNonZero(-maxRoot, maxRoot);
      const q = r.intNonZero(-maxRoot, maxRoot);
      return { p, q, b: -(p + q), c: p * q };
    },
    ({ p, q }) => (!distinct || p !== q) && Math.abs(p * q) > 1,
  );
}

/** ax^2 + bx + c that factorises as (dx + e)(fx + g), for the Higher-tier statement. */
export function factorisableQuadraticWithLead(
  rng: Rng,
  opts: { maxLead?: number; maxConst?: number } = {},
): { a: number; b: number; c: number; d: number; e: number; f: number; g: number } {
  const maxLead = opts.maxLead ?? 4;
  const maxConst = opts.maxConst ?? 6;
  return pickUntil(
    rng,
    (r) => {
      const d = r.int(2, maxLead);
      const f = 1;
      const e = r.intNonZero(-maxConst, maxConst);
      const g = r.intNonZero(-maxConst, maxConst);
      return { d, e, f, g, a: d * f, b: d * g + e * f, c: e * g };
    },
    ({ a, b, c, e, g }) => a > 1 && b !== 0 && c !== 0 && gcd(gcd(a, Math.abs(b)), Math.abs(c)) === 1 && e !== g,
  );
}

export const PYTHAGOREAN_TRIPLES: readonly [number, number, number][] = [
  [3, 4, 5],
  [5, 12, 13],
  [8, 15, 17],
  [7, 24, 25],
  [20, 21, 29],
  [9, 40, 41],
  [6, 8, 10],
  [9, 12, 15],
  [12, 16, 20],
  [10, 24, 26],
  [15, 20, 25],
  [16, 30, 34],
];

export function pythagoreanTriple(rng: Rng): [number, number, number] {
  return rng.pick(PYTHAGOREAN_TRIPLES);
}

/** A money amount in pounds with at most two decimal places. */
export function money(rng: Rng, minPence: number, maxPence: number): Rational {
  return rat(rng.int(minPence, maxPence), 100);
}

/** Format a Rational as currency, always to two decimal places. */
export function formatMoney(value: Rational, symbol = '£'): string {
  const pence = Math.round(value.toNumber() * 100);
  const neg = pence < 0;
  const abs = Math.abs(pence);
  return `${neg ? '-' : ''}${symbol}${Math.floor(abs / 100)}.${String(abs % 100).padStart(2, '0')}`;
}

/** Format a plain number for display, trimming trailing zeros. */
export function formatNumber(value: number, maxDp = 6): string {
  if (Number.isInteger(value)) return `${value}`;
  return Number(value.toFixed(maxDp)).toString();
}

/** Round half-up to a number of decimal places, avoiding binary-float surprises. */
export function roundDp(value: number, dp: number): number {
  const factor = 10 ** dp;
  return Math.round((value + Number.EPSILON * Math.sign(value)) * factor) / factor;
}

/**
 * Would a student meet only calculator-free values working this through?
 * Used by the conformance harness for questions flagged non-calculator.
 */
export function nonCalculatorSafe(values: number[]): boolean {
  return values.every((v) => {
    if (!Number.isFinite(v)) return false;
    const scaled = v * 100;
    return Math.abs(scaled - Math.round(scaled)) < 1e-9;
  });
}

/**
 * A composite worth factorising: at least two distinct primes or a repeated prime, so the
 * index form is actually interesting.
 */
export function compositeForFactorisation(rng: Rng, min = 24, max = 300): number {
  return pickUntil(
    rng,
    (r) => r.int(min, max),
    (n) => {
      const factors = primeFactors(n);
      const distinct = factors.length;
      const repeated = factors.some(([, e]) => e > 1);
      return distinct >= 2 && (distinct >= 3 || repeated) && factors.every(([p]) => p <= 13);
    },
  );
}

/** Distinct integers, useful for data sets and option lists. */
export function distinctInts(rng: Rng, count: number, min: number, max: number): number[] {
  const pool: number[] = [];
  for (let v = min; v <= max; v++) pool.push(v);
  return rng.pickMany(pool, count);
}
