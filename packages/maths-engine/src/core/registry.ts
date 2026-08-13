/**
 * The generator registry: the interface the mock-paper builder will consume.
 */
import type { AO, Strand, Tier } from './question.js';
import type { QuestionGenerator } from './generator.js';

/** Every DfE content reference, in specification order. The registry is checked against this. */
export const ALL_REFS: readonly string[] = [
  ...Array.from({ length: 16 }, (_, i) => `N${i + 1}`),
  ...Array.from({ length: 25 }, (_, i) => `A${i + 1}`),
  ...Array.from({ length: 16 }, (_, i) => `R${i + 1}`),
  ...Array.from({ length: 25 }, (_, i) => `G${i + 1}`),
  ...Array.from({ length: 9 }, (_, i) => `P${i + 1}`),
  ...Array.from({ length: 6 }, (_, i) => `S${i + 1}`),
];

export const STRAND_OF_PREFIX: Record<string, Strand> = {
  N: 'number',
  A: 'algebra',
  R: 'ratio',
  G: 'geometry',
  P: 'probability',
  S: 'statistics',
};

export interface GeneratorQuery {
  ref?: string;
  refs?: string[];
  strand?: Strand;
  tier?: Tier;
  ao?: AO;
  calculator?: 'either' | 'non-calc' | 'calc';
  minMarks?: number;
  maxMarks?: number;
}

export class GeneratorRegistry {
  private readonly byId = new Map<string, QuestionGenerator>();

  register(...generators: QuestionGenerator[]): this {
    for (const g of generators) {
      if (this.byId.has(g.id)) {
        throw new Error(`GeneratorRegistry: duplicate generator id "${g.id}"`);
      }
      if (!ALL_REFS.includes(g.ref)) {
        throw new Error(`GeneratorRegistry: "${g.id}" declares unknown reference "${g.ref}"`);
      }
      const expectedStrand = STRAND_OF_PREFIX[g.ref[0]!];
      if (g.strand !== expectedStrand) {
        throw new Error(
          `GeneratorRegistry: "${g.id}" is ref ${g.ref} (${expectedStrand}) but declares strand "${g.strand}"`,
        );
      }
      this.byId.set(g.id, g);
    }
    return this;
  }

  get(id: string): QuestionGenerator {
    const g = this.byId.get(id);
    if (!g) throw new Error(`GeneratorRegistry: no generator "${id}"`);
    return g;
  }

  has(id: string): boolean {
    return this.byId.has(id);
  }

  all(): QuestionGenerator[] {
    return [...this.byId.values()];
  }

  find(query: GeneratorQuery = {}): QuestionGenerator[] {
    return this.all().filter((g) => {
      if (query.ref && g.ref !== query.ref) return false;
      if (query.refs && !query.refs.includes(g.ref)) return false;
      if (query.strand && g.strand !== query.strand) return false;
      if (query.ao && g.ao !== query.ao) return false;
      if (query.tier && !g.tiers.includes(query.tier)) return false;
      if (query.calculator && g.calculator !== 'either' && g.calculator !== query.calculator) {
        return false;
      }
      if (query.minMarks !== undefined && g.marks < query.minMarks) return false;
      if (query.maxMarks !== undefined && g.marks > query.maxMarks) return false;
      return true;
    });
  }

  /** Generators grouped by content reference. */
  byRef(): Map<string, QuestionGenerator[]> {
    const out = new Map<string, QuestionGenerator[]>();
    for (const g of this.all()) {
      const list = out.get(g.ref) ?? [];
      list.push(g);
      out.set(g.ref, list);
    }
    return out;
  }

  /** References with no generator. The coverage test asserts this is empty. */
  missingRefs(): string[] {
    const covered = new Set(this.all().map((g) => g.ref));
    return ALL_REFS.filter((r) => !covered.has(r));
  }
}
