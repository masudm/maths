/**
 * Exact rational arithmetic on bigint.
 *
 * Required rather than convenient: GCSE marking distinguishes 1/2 from 0.5 from 3/6 (the
 * "or equivalent" rule accepts all three, the "give your answer in its simplest form"
 * instruction does not), and floating point would corrupt the surd and pi work in N8,
 * G17, G18 and G21. Every exact quantity in the engine is built on this type.
 */

function gcd(a: bigint, b: bigint): bigint {
  let x = a < 0n ? -a : a;
  let y = b < 0n ? -b : b;
  while (y) {
    const t = x % y;
    x = y;
    y = t;
  }
  return x;
}

export class Rational {
  /** Numerator, carrying the sign. */
  readonly n: bigint;
  /** Denominator, always > 0, always coprime with n. */
  readonly d: bigint;

  private constructor(n: bigint, d: bigint) {
    this.n = n;
    this.d = d;
  }

  static of(n: bigint | number, d: bigint | number = 1n): Rational {
    let nn = typeof n === 'number' ? BigInt(Math.trunc(n)) : n;
    let dd = typeof d === 'number' ? BigInt(Math.trunc(d)) : d;
    if (typeof n === 'number' && !Number.isInteger(n)) {
      throw new Error(`Rational.of: ${n} is not an integer; use Rational.fromDecimal`);
    }
    if (dd === 0n) throw new Error('Rational.of: zero denominator');
    if (dd < 0n) {
      nn = -nn;
      dd = -dd;
    }
    const g = gcd(nn, dd) || 1n;
    return new Rational(nn / g, dd / g);
  }

  static readonly ZERO = Rational.of(0n);
  static readonly ONE = Rational.of(1n);

  /** Parse an exact decimal string, e.g. "0.75" -> 3/4. Recurring decimals are not handled here. */
  static fromDecimal(text: string): Rational {
    const t = text.trim();
    const m = /^([+-]?)(\d*)(?:\.(\d*))?$/.exec(t);
    if (!m || (m[2] === '' && (m[3] ?? '') === '')) {
      throw new Error(`Rational.fromDecimal: cannot parse "${text}"`);
    }
    const sign = m[1] === '-' ? -1n : 1n;
    const whole = m[2] === '' ? 0n : BigInt(m[2]!);
    const frac = m[3] ?? '';
    const scale = 10n ** BigInt(frac.length);
    const n = whole * scale + (frac === '' ? 0n : BigInt(frac));
    return Rational.of(sign * n, scale);
  }

  /** Best rational approximation of a float, for round-tripping computed values. */
  static fromNumber(x: number, maxDenominator = 1_000_000): Rational {
    if (!Number.isFinite(x)) throw new Error(`Rational.fromNumber: ${x}`);
    if (Number.isInteger(x)) return Rational.of(BigInt(x));
    // Continued fraction expansion.
    let [h0, h1, k0, k1] = [0n, 1n, 1n, 0n];
    let v = x;
    for (let i = 0; i < 64; i++) {
      const a = BigInt(Math.floor(v));
      [h0, h1] = [h1, a * h1 + h0];
      [k0, k1] = [k1, a * k1 + k0];
      if (k1 > BigInt(maxDenominator)) break;
      const approx = Number(h1) / Number(k1);
      if (Math.abs(approx - x) < 1e-12) return Rational.of(h1, k1);
      const frac = v - Math.floor(v);
      if (frac === 0) break;
      v = 1 / frac;
    }
    return Rational.of(h1, k1 === 0n ? 1n : k1);
  }

  add(o: Rational): Rational {
    return Rational.of(this.n * o.d + o.n * this.d, this.d * o.d);
  }
  sub(o: Rational): Rational {
    return Rational.of(this.n * o.d - o.n * this.d, this.d * o.d);
  }
  mul(o: Rational): Rational {
    return Rational.of(this.n * o.n, this.d * o.d);
  }
  div(o: Rational): Rational {
    if (o.isZero()) throw new Error('Rational.div: division by zero');
    return Rational.of(this.n * o.d, this.d * o.n);
  }
  neg(): Rational {
    return Rational.of(-this.n, this.d);
  }
  abs(): Rational {
    return this.n < 0n ? this.neg() : this;
  }
  inv(): Rational {
    return Rational.ONE.div(this);
  }

  pow(exp: number): Rational {
    if (!Number.isInteger(exp)) throw new Error(`Rational.pow: non-integer exponent ${exp}`);
    if (exp < 0) return this.inv().pow(-exp);
    return Rational.of(this.n ** BigInt(exp), this.d ** BigInt(exp));
  }

  cmp(o: Rational): number {
    const l = this.n * o.d;
    const r = o.n * this.d;
    return l < r ? -1 : l > r ? 1 : 0;
  }
  eq(o: Rational): boolean {
    return this.n === o.n && this.d === o.d;
  }
  lt(o: Rational): boolean {
    return this.cmp(o) < 0;
  }
  gt(o: Rational): boolean {
    return this.cmp(o) > 0;
  }
  isZero(): boolean {
    return this.n === 0n;
  }
  isInteger(): boolean {
    return this.d === 1n;
  }
  isNegative(): boolean {
    return this.n < 0n;
  }

  get sign(): number {
    return this.n < 0n ? -1 : this.n > 0n ? 1 : 0;
  }

  toNumber(): number {
    return Number(this.n) / Number(this.d);
  }

  /** "3/4", "-2", "7/2". */
  toString(): string {
    return this.d === 1n ? `${this.n}` : `${this.n}/${this.d}`;
  }

  toLatex(): string {
    if (this.d === 1n) return `${this.n}`;
    const sign = this.n < 0n ? '-' : '';
    const n = this.n < 0n ? -this.n : this.n;
    return `${sign}\\frac{${n}}{${this.d}}`;
  }

  /** Mixed-number form, e.g. 7/2 -> "3 1/2". Returns the plain form for integers. */
  toMixedString(): string {
    if (this.d === 1n) return `${this.n}`;
    const neg = this.n < 0n;
    const n = neg ? -this.n : this.n;
    const whole = n / this.d;
    const rem = n % this.d;
    if (whole === 0n) return `${neg ? '-' : ''}${rem}/${this.d}`;
    return `${neg ? '-' : ''}${whole} ${rem}/${this.d}`;
  }

  /**
   * Decimal string, or null when the value does not terminate in base 10.
   * Used to offer the decimal alternative form when marking "or equivalent".
   */
  toDecimalString(maxDp = 10): string | null {
    let d = this.d;
    while (d % 2n === 0n) d /= 2n;
    while (d % 5n === 0n) d /= 5n;
    if (d !== 1n) return null;
    const neg = this.n < 0n;
    const n = neg ? -this.n : this.n;
    const scale = 10n ** BigInt(maxDp);
    const scaled = (n * scale) / this.d;
    let s = scaled.toString().padStart(maxDp + 1, '0');
    const whole = s.slice(0, s.length - maxDp);
    let frac = s.slice(s.length - maxDp).replace(/0+$/, '');
    return `${neg ? '-' : ''}${whole}${frac ? `.${frac}` : ''}`;
  }
}

export const rat = (n: bigint | number, d: bigint | number = 1n): Rational => Rational.of(n, d);
