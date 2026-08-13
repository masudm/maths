import { describe, expect, it } from 'vitest';
import { mark, verify } from '../src/core/marker.js';
import { registry } from '../src/generators/index.js';

const reverse = registry.get('R9.reverse-percentage');
const quadratic = registry.get('A18.quadratic-formula');
const probability = registry.get('P3.relative-frequency');
const proof = registry.get('A6.proof-consecutive-integers');

describe('marker', () => {
  it('gives the simple boolean the brief asked for', () => {
    const q = reverse.generate(1);
    const answer = `${q.params['original'] as number}`;
    expect(verify(q, answer)).toBe(true);
    expect(verify(q, '1')).toBe(false);
  });

  it('awards full marks for a bare correct answer', () => {
    const q = reverse.generate(2);
    const result = mark(q, `${q.params['original'] as number}`);
    expect(result.correct).toBe(true);
    expect(result.awarded).toBe(q.marks);
  });

  it('withholds full marks for a bare answer when the question demands working', () => {
    const q = proof.generate(3);
    expect(q.markScheme.requireWorking).toBe(true);
    const bare = mark(q, { slots: { answer: `a multiple of ${q.params['count'] as number}` } });
    expect(bare.correct).toBe(true);
    expect(bare.awarded).toBeLessThan(q.marks);
  });

  it('awards a method mark for a correct value seen in working', () => {
    const q = reverse.generate(4);
    const result = mark(q, {
      slots: { answer: '0' },
      working: [`${q.params['multiplier'] as number}`],
    });
    expect(result.correct).toBe(false);
    expect(result.steps.find((s) => s.id === 'm1')?.awarded).toBe(1);
  });

  it('never awards an accuracy mark after a failed method mark', () => {
    const q = reverse.generate(5);
    const result = mark(q, { slots: { answer: '999999' } });
    const accuracy = result.steps.find((s) => s.type === 'A');
    expect(accuracy?.awarded).toBe(0);
  });

  it('reports the misconception behind a named special case', () => {
    const q = reverse.generate(6);
    const sale = q.params['salePrice'] as number;
    const percent = q.params['percent'] as number;
    const additive = Number((sale * (1 + percent / 100)).toFixed(2));
    const result = mark(q, `${additive}`);
    expect(result.correct).toBe(false);
    expect(result.misconception).toBe('reverse-percentage-treated-as-additive');
    expect(result.awarded).toBe(1);
  });

  it('accepts equivalent forms of a probability but never a ratio', () => {
    const q = probability.generate(7);
    const successes = q.params['successes'] as number;
    const trials = q.params['trials'] as number;
    expect(verify(q, `${successes}/${trials}`)).toBe(true);
    expect(verify(q, `${successes / trials}`)).toBe(true);
    expect(verify(q, `${successes} : ${trials}`)).toBe(false);
  });

  it('accepts two roots given in either order', () => {
    const q = quadratic.generate(8);
    const r1 = q.params['r1'] as number;
    const r2 = q.params['r2'] as number;
    expect(verify(q, `${r1}, ${r2}`)).toBe(true);
    expect(verify(q, `${r2} and ${r1}`)).toBe(true);
  });

  it('marks each slot separately in a multi-part question', () => {
    const simultaneous = registry.get('A19.simultaneous-linear-equations');
    const q = simultaneous.generate(9);
    const result = mark(q, { slots: { x: `${q.params['x'] as number}`, y: '99999' } });
    expect(result.slots['x']).toBe(true);
    expect(result.slots['y']).toBe(false);
    expect(result.correct).toBe(false);
  });
});
