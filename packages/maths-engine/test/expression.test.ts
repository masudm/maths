import { describe, expect, it } from 'vitest';
import { parseExpression } from '../src/core/expression/parse.js';
import { expressionsEquivalent } from '../src/core/expression/equivalent.js';

const equivalent = (a: string, b: string): boolean =>
  expressionsEquivalent(parseExpression(a), parseExpression(b));

describe('expression equivalence', () => {
  it('accepts reordered and rearranged forms', () => {
    expect(equivalent('3x + 2', '2 + 3x')).toBe(true);
    expect(equivalent('(x+1)(x+3)', 'x^2 + 4x + 3')).toBe(true);
    expect(equivalent('2(x + 3)', '2x + 6')).toBe(true);
  });

  it('accepts equivalent fractional coefficients', () => {
    expect(equivalent('y = 3.5x', 'y = 7x/2')).toBe(true);
    expect(equivalent('C/(2*pi)', 'C/(2pi)')).toBe(true);
  });

  it('treats equations as equal up to a non-zero multiple', () => {
    expect(equivalent('x + y = 2', '2x + 2y = 4')).toBe(true);
    expect(equivalent('3x + 4y = 25', 'y = -3/4x + 25/4')).toBe(true);
  });

  it('does not let an inequality flip sense', () => {
    expect(equivalent('x >= 3', '2x >= 6')).toBe(true);
    expect(equivalent('x >= 3', '-x >= -3')).toBe(false);
  });

  it('matches a labelled equation against the bare expression', () => {
    // An answer box labelled "y =" is satisfied by either spelling.
    expect(equivalent('y = 3x + 2', '3x + 2')).toBe(true);
  });

  it('rejects genuinely different expressions', () => {
    expect(equivalent('3x + 2', '3x + 3')).toBe(false);
    expect(equivalent('(x+2)(x-2)', 'x^2 + 4')).toBe(false);
  });

  it('parses the spellings students type', () => {
    expect(equivalent('3x', '3*x')).toBe(true);
    expect(equivalent('2root3', '2*sqrt(3)')).toBe(true);
    expect(equivalent('x + -4', 'x - 4')).toBe(true);
    expect(equivalent('x ≥ 3', 'x >= 3')).toBe(true);
  });
});
