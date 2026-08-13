import { describe, expect, it } from 'vitest';
import { parseResponse } from '../src/core/parse-response.js';

describe('parseResponse', () => {
  it('reads the equivalent spellings of one number as the same value', () => {
    for (const text of ['3/4', '0.75', '75%', ' 0.750 ']) {
      const value = parseResponse(text, 'exact').value;
      expect(value?.kind).toBe('exact');
      expect(value?.kind === 'exact' && value.value.toNumber()).toBeCloseTo(0.75, 12);
    }
  });

  it('reads mixed numbers', () => {
    const value = parseResponse('3 1/2', 'exact').value;
    expect(value?.kind === 'exact' && value.value.toNumber()).toBe(3.5);
  });

  it('separates a unit from the value', () => {
    const parsed = parseResponse('£62.16', 'decimal');
    expect(parsed.unit).toBe('£');
    expect(parsed.value?.kind === 'decimal' && parsed.value.value).toBe(62.16);
  });

  it('does not mistake a trailing letter of a word for a unit', () => {
    // "exponential" ends in the litre symbol; "seconds" ends in "s".
    expect(parseResponse('exponential', 'choice').value).toEqual({
      kind: 'choice',
      value: 'exponential',
    });
  });

  it('records how many decimal places were written', () => {
    expect(parseResponse('3.14', 'decimal').decimalPlaces).toBe(2);
    expect(parseResponse('3', 'decimal').decimalPlaces).toBeNull();
  });

  it('reads ratios, coordinates and sets', () => {
    expect(parseResponse('3 : 5', 'ratio').value?.kind).toBe('ratio');
    expect(parseResponse('(1, -1)', 'point').value?.kind).toBe('point');
    expect(parseResponse('3.14 and -0.64', 'set').value?.kind).toBe('set');
  });

  it('reads a bracketed pair in working without being told to', () => {
    expect(parseResponse('(2, 5)', 'auto').value?.kind).toBe('point');
  });

  it('falls back to text so reason marks can still be matched', () => {
    expect(parseResponse('because the sample is too small', 'text').value?.kind).toBe('text');
  });
});
