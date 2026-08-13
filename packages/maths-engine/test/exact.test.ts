import { describe, expect, it } from 'vitest';
import { Exact, simplifySurd } from '../src/core/exact.js';
import { rat } from '../src/core/rational.js';
import { parseResponse } from '../src/core/parse-response.js';

describe('Exact', () => {
  it('extracts square factors so equal surds have equal representations', () => {
    expect(simplifySurd(12n)).toEqual({ outside: 2n, inside: 3n });
    expect(Exact.surd(rat(1), 12n).eq(Exact.surd(rat(2), 3n))).toBe(true);
    expect(Exact.surd(rat(1), 50n).toString()).toBe('5root2');
  });

  it('rationalises a denominator', () => {
    // 6 / root3 = 2 root3
    const result = Exact.int(6).div(Exact.surd(rat(1), 3n));
    expect(result.eq(Exact.surd(rat(2), 3n))).toBe(true);
  });

  it('keeps multiples of pi exact', () => {
    const area = Exact.pi(rat(9));
    expect(area.toString()).toBe('9pi');
    expect(area.toNumber()).toBeCloseTo(28.2743, 4);
  });

  it('round-trips through its own text form', () => {
    const values = [
      Exact.surd(rat(1, 2), 3n),
      Exact.surd(rat(3, 2), 5n),
      Exact.pi(rat(3, 4)),
      Exact.rational(rat(5, 11)),
      Exact.int(-7),
    ];
    for (const value of values) {
      const parsed = parseResponse(value.toString(), 'exact').value;
      expect(parsed?.kind).toBe('exact');
      expect(parsed?.kind === 'exact' && parsed.value.eq(value)).toBe(true);
    }
  });

  it('refuses pi squared, which is out of scope at GCSE', () => {
    expect(() => Exact.pi(rat(1)).mul(Exact.pi(rat(1)))).toThrow();
  });
});
