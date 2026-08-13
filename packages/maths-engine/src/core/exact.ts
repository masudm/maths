/**
 * Exact values: sums of terms of the form  coefficient x sqrt(radicand) x pi^k.
 *
 * This covers everything GCSE asks to be left exact:
 *   5/11            (N10 recurring decimals)
 *   2 sqrt 3        (N8 surds, G21 exact trig values)
 *   9 pi            (G17, G18 "give your answer in terms of pi")
 *   (5 + sqrt 57)/4 (A18 quadratic formula)
 *   6/sqrt 3 -> 2 sqrt 3 (N8 rationalising denominators)
 *
 * Radicands are kept square-free so that equal values always have equal representations,
 * which is what lets the marker compare answers without floating point.
 */
import { Rational, rat } from './rational.js';

export interface ExactTerm {
  readonly coeff: Rational;
  /** Square-free integer >= 1. 1 means no surd part. */
  readonly radicand: bigint;
  /** Power of pi. Only 0 and 1 occur in GCSE work. */
  readonly pi: 0 | 1;
}

/** Pull square factors out of a radicand: 12 -> [2, 3] meaning 2 sqrt 3. */
export function simplifySurd(radicand: bigint): { outside: bigint; inside: bigint } {
  if (radicand < 0n) throw new Error('simplifySurd: negative radicand');
  if (radicand === 0n) return { outside: 0n, inside: 1n };
  let inside = radicand;
  let outside = 1n;
  for (let f = 2n; f * f <= inside; f++) {
    while (inside % (f * f) === 0n) {
      inside /= f * f;
      outside *= f;
    }
  }
  return { outside, inside };
}

export class Exact {
  /** Terms in canonical order, no zero coefficients, no duplicate (radicand, pi) keys. */
  readonly terms: readonly ExactTerm[];

  private constructor(terms: readonly ExactTerm[]) {
    this.terms = terms;
  }

  private static canonical(terms: readonly ExactTerm[]): Exact {
    const merged = new Map<string, ExactTerm>();
    for (const t of terms) {
      if (t.coeff.isZero()) continue;
      const { outside, inside } = simplifySurd(t.radicand);
      const coeff = t.coeff.mul(rat(outside));
      if (coeff.isZero()) continue;
      const key = `${inside}|${t.pi}`;
      const prev = merged.get(key);
      merged.set(
        key,
        prev
          ? { coeff: prev.coeff.add(coeff), radicand: inside, pi: t.pi }
          : { coeff, radicand: inside, pi: t.pi },
      );
    }
    const out = [...merged.values()]
      .filter((t) => !t.coeff.isZero())
      .sort((a, b) => a.pi - b.pi || Number(a.radicand - b.radicand));
    return new Exact(out);
  }

  static of(...terms: readonly ExactTerm[]): Exact {
    return Exact.canonical(terms);
  }

  static rational(value: Rational): Exact {
    return Exact.canonical([{ coeff: value, radicand: 1n, pi: 0 }]);
  }

  static int(value: number | bigint): Exact {
    return Exact.rational(rat(value));
  }

  /** coefficient x sqrt(radicand) */
  static surd(coeff: Rational, radicand: bigint): Exact {
    return Exact.canonical([{ coeff, radicand, pi: 0 }]);
  }

  /** coefficient x pi */
  static pi(coeff: Rational): Exact {
    return Exact.canonical([{ coeff, radicand: 1n, pi: 1 }]);
  }

  static readonly ZERO = Exact.int(0);

  add(o: Exact): Exact {
    return Exact.canonical([...this.terms, ...o.terms]);
  }

  sub(o: Exact): Exact {
    return this.add(o.neg());
  }

  neg(): Exact {
    return Exact.canonical(this.terms.map((t) => ({ ...t, coeff: t.coeff.neg() })));
  }

  mul(o: Exact): Exact {
    const out: ExactTerm[] = [];
    for (const a of this.terms) {
      for (const b of o.terms) {
        const pi = a.pi + b.pi;
        if (pi > 1) throw new Error('Exact.mul: pi^2 is out of scope for GCSE work');
        out.push({
          coeff: a.coeff.mul(b.coeff),
          radicand: a.radicand * b.radicand,
          pi: pi as 0 | 1,
        });
      }
    }
    return Exact.canonical(out);
  }

  /** Division is supported when the divisor is a single term (covers rationalising denominators). */
  div(o: Exact): Exact {
    if (o.terms.length !== 1) {
      throw new Error('Exact.div: only single-term divisors are supported');
    }
    const b = o.terms[0]!;
    if (b.coeff.isZero()) throw new Error('Exact.div: division by zero');
    const out: ExactTerm[] = [];
    for (const a of this.terms) {
      const pi = a.pi - b.pi;
      if (pi < 0) throw new Error('Exact.div: negative power of pi is out of scope');
      // a sqrt(x) / b sqrt(y) = (a/b) sqrt(x y) / y
      out.push({
        coeff: a.coeff.div(b.coeff).div(rat(b.radicand)),
        radicand: a.radicand * b.radicand,
        pi: pi as 0 | 1,
      });
    }
    return Exact.canonical(out);
  }

  /** The value as a plain rational, or null when a surd or pi part is present. */
  asRational(): Rational | null {
    if (this.terms.length === 0) return Rational.ZERO;
    if (this.terms.length === 1) {
      const t = this.terms[0]!;
      if (t.radicand === 1n && t.pi === 0) return t.coeff;
    }
    return null;
  }

  isRational(): boolean {
    return this.asRational() !== null;
  }

  isZero(): boolean {
    return this.terms.length === 0;
  }

  eq(o: Exact): boolean {
    if (this.terms.length !== o.terms.length) return false;
    return this.terms.every((t, i) => {
      const u = o.terms[i]!;
      return t.coeff.eq(u.coeff) && t.radicand === u.radicand && t.pi === u.pi;
    });
  }

  toNumber(): number {
    return this.terms.reduce(
      (s, t) => s + t.coeff.toNumber() * Math.sqrt(Number(t.radicand)) * (t.pi ? Math.PI : 1),
      0,
    );
  }

  /** Plain-text form, e.g. "2root3", "9pi", "5/11". Mirrors what students type. */
  toString(): string {
    if (this.terms.length === 0) return '0';
    return this.terms
      .map((t, i) => {
        const parts: string[] = [];
        const bare = t.radicand === 1n && t.pi === 0;
        const unit = t.coeff.abs().eq(Rational.ONE) && !bare;
        const c = t.coeff.abs();
        // A fractional coefficient on a surd or pi is written with the denominator trailing,
        // as "root3/2" rather than "1/2root3", which is both conventional and unambiguous
        // to parse back.
        const fractional = !bare && !c.isInteger();
        if (!unit && !fractional) parts.push(c.toString());
        if (!unit && fractional && !c.n.toString().startsWith('1/') && c.n !== 1n) {
          parts.push(`${c.n}`);
        }
        if (t.pi) parts.push('pi');
        if (t.radicand !== 1n) parts.push(`root${t.radicand}`);
        if (fractional) parts.push(`/${c.d}`);
        const body = parts.join('');
        const sign = t.coeff.isNegative() ? '-' : i > 0 ? '+' : '';
        return `${sign}${body}`;
      })
      .join('');
  }

  toLatex(): string {
    if (this.terms.length === 0) return '0';
    return this.terms
      .map((t, i) => {
        const bare = t.radicand === 1n && t.pi === 0;
        const unit = t.coeff.abs().eq(Rational.ONE) && !bare;
        const c = t.coeff.abs();
        const head = unit ? '' : c.isInteger() ? `${c.n}` : c.abs().toLatex();
        const pi = t.pi ? '\\pi ' : '';
        const surd = t.radicand !== 1n ? `\\sqrt{${t.radicand}}` : '';
        const sign = t.coeff.isNegative() ? '-' : i > 0 ? '+' : '';
        return `${sign}${head}${pi}${surd}`;
      })
      .join('');
  }
}
