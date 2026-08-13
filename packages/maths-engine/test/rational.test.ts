import { describe, expect, it } from 'vitest';
import { Rational, rat } from '../src/core/rational.js';

describe('Rational', () => {
  it('reduces to lowest terms and normalises the sign', () => {
    expect(rat(6, 8).toString()).toBe('3/4');
    expect(rat(2, -4).toString()).toBe('-1/2');
    expect(rat(-6, -9).toString()).toBe('2/3');
  });

  it('treats equal values as equal regardless of how they were built', () => {
    expect(rat(1, 2).eq(rat(3, 6))).toBe(true);
    expect(Rational.fromDecimal('0.75').eq(rat(3, 4))).toBe(true);
  });

  it('adds without floating point error', () => {
    // 0.1 + 0.2 !== 0.3 in binary floating point; it must here.
    const sum = Rational.fromDecimal('0.1').add(Rational.fromDecimal('0.2'));
    expect(sum.eq(Rational.fromDecimal('0.3'))).toBe(true);
  });

  it('supports the four operations and powers', () => {
    expect(rat(2, 3).mul(rat(3, 4)).toString()).toBe('1/2');
    expect(rat(1, 2).div(rat(1, 4)).toString()).toBe('2');
    expect(rat(2, 3).pow(3).toString()).toBe('8/27');
    expect(rat(3, 4).pow(-1).toString()).toBe('4/3');
  });

  it('renders decimals only when the value terminates', () => {
    expect(rat(3, 4).toDecimalString()).toBe('0.75');
    expect(rat(1, 3).toDecimalString()).toBeNull();
  });

  it('renders mixed numbers', () => {
    expect(rat(7, 2).toMixedString()).toBe('3 1/2');
    expect(rat(-7, 2).toMixedString()).toBe('-3 1/2');
  });

  it('rejects a zero denominator', () => {
    expect(() => rat(1, 0)).toThrow();
  });
});
