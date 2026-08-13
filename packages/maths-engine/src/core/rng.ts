/**
 * Seeded deterministic pseudo-random number generator.
 *
 * Determinism is load-bearing for this engine: a mock paper is stored as a list of
 * `(generatorId, seed)` pairs and regenerated exactly on demand, so the same seed must
 * always produce a byte-identical question on any machine and any Node version.
 * `Math.random` cannot be used anywhere in a generator.
 */
export class Rng {
  private state: number;

  constructor(seed: number) {
    // Mix the seed so that small, adjacent seeds (0, 1, 2 …) produce well-separated streams.
    let s = seed >>> 0;
    s = Math.imul(s ^ (s >>> 16), 0x45d9f3b) >>> 0;
    s = Math.imul(s ^ (s >>> 16), 0x45d9f3b) >>> 0;
    this.state = (s ^ (s >>> 16)) >>> 0;
  }

  /** Uniform float in [0, 1). mulberry32. */
  next(): number {
    this.state = (this.state + 0x6d2b79f5) >>> 0;
    let t = this.state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  /** Uniform integer in [min, max] inclusive. */
  int(min: number, max: number): number {
    if (max < min) throw new Error(`Rng.int: empty range [${min}, ${max}]`);
    return min + Math.floor(this.next() * (max - min + 1));
  }

  /** Uniform non-zero integer in [min, max] inclusive. */
  intNonZero(min: number, max: number): number {
    if (min > 0 || max < 0) return this.int(min, max);
    for (let i = 0; i < 100; i++) {
      const v = this.int(min, max);
      if (v !== 0) return v;
    }
    throw new Error(`Rng.intNonZero: exhausted range [${min}, ${max}]`);
  }

  /** true with probability p. */
  bool(p = 0.5): boolean {
    return this.next() < p;
  }

  /** Either 1 or -1. */
  sign(): number {
    return this.bool() ? 1 : -1;
  }

  pick<T>(items: readonly T[]): T {
    if (items.length === 0) throw new Error('Rng.pick: empty array');
    return items[this.int(0, items.length - 1)]!;
  }

  /** Pick `count` distinct items, preserving no particular order. */
  pickMany<T>(items: readonly T[], count: number): T[] {
    if (count > items.length) {
      throw new Error(`Rng.pickMany: asked for ${count} of ${items.length}`);
    }
    return this.shuffle(items).slice(0, count);
  }

  /** Fisher–Yates, returning a new array. */
  shuffle<T>(items: readonly T[]): T[] {
    const out = [...items];
    for (let i = out.length - 1; i > 0; i--) {
      const j = this.int(0, i);
      const a = out[i]!;
      out[i] = out[j]!;
      out[j] = a;
    }
    return out;
  }

  /** Pick by relative weight. Weights must be positive. */
  weighted<T>(entries: readonly (readonly [T, number])[]): T {
    const total = entries.reduce((s, [, w]) => s + w, 0);
    if (total <= 0) throw new Error('Rng.weighted: weights must sum to > 0');
    let r = this.next() * total;
    for (const [item, w] of entries) {
      r -= w;
      if (r < 0) return item;
    }
    return entries[entries.length - 1]![0];
  }
}

/**
 * Draw from `make` until `ok` is satisfied. Generators use this to keep numbers exam-like —
 * whole-number answers, factorisable quadratics, sensible money values — without risking an
 * unbounded loop when the constraint is unsatisfiable.
 */
export function pickUntil<T>(
  rng: Rng,
  make: (rng: Rng) => T,
  ok: (candidate: T) => boolean,
  attempts = 200,
): T {
  for (let i = 0; i < attempts; i++) {
    const candidate = make(rng);
    if (ok(candidate)) return candidate;
  }
  throw new Error(`pickUntil: no candidate satisfied the constraint in ${attempts} attempts`);
}
