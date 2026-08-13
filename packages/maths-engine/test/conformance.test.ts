import { describe, expect, it } from 'vitest';
import { ALL_REFS } from '../src/core/registry.js';
import { registry } from '../src/generators/index.js';
import { describeFailures, runConformance } from '../src/testing/conformance.js';

describe('coverage', () => {
  it('has at least one generator for every DfE content reference', () => {
    expect(registry.missingRefs()).toEqual([]);
  });

  it('covers all 97 references', () => {
    expect(ALL_REFS).toHaveLength(97);
    expect(registry.byRef().size).toBe(97);
  });

  it('declares board references for every generator', () => {
    for (const generator of registry.all()) {
      expect(generator.boards.aqa).toBe(generator.ref);
      expect(generator.boards.ocr.length).toBeGreaterThan(0);
    }
  });
});

describe('generator conformance', () => {
  for (const generator of registry.all()) {
    it(`${generator.id} (${generator.ref}) conforms across many seeds`, () => {
      const failures = runConformance(generator, { seeds: 40 });
      expect(failures.length, describeFailures(generator, failures)).toBe(0);
    });
  }
});
