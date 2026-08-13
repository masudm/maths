# Maths engine: question generators and mark-scheme verifiers for GCSE Maths

## Context

`gcse-maths-syllabus-map.md` maps all 97 DfE content statements shared by AQA 8300 and OCR J560,
each with tier, board references, a sample question, an answer, and a mark breakdown in authentic
notation (M1 / M1dep / A1 / B1 / ft / SC / oe / cao).

That document is reference data for humans. The next phase needs it as **executable code**: for every
reference item, a function that *produces* a question and a function that *verifies* a response. These
become the supply side of the mock-exam builder — a paper is assembled by selecting generators that
satisfy the Ofqual topic and AO weightings, and marked automatically by the same code that produced it.

Two constraints shape the design:

1. **Questions must carry enough structure to be rendered later**, including shape, angle, graph, Venn,
   tree and table questions. Generators emit a structured content model, never a prose string. Nothing
   in this phase renders anything.
2. **Verification must reflect how the boards actually mark.** The syllabus map's §8.5 lists ten marking
   rules — `oe` equivalence, method marks surviving arithmetic slips, follow-through, ranges,
   special-case misconceptions. A boolean comparison cannot express these, so verification awards
   marks against a structured mark scheme and reports which steps were earned.

The repository is currently empty apart from the syllabus map, `.gitignore` (Node, with `.next`
listed), Node 22 and npm 10. Nothing existing to reuse or refactor.

---

## Approach

### Layout — npm workspaces monorepo

```
maths/
├── package.json                  workspaces: ["packages/*"]
├── tsconfig.base.json
├── gcse-maths-syllabus-map.md
└── packages/maths-engine/
    ├── package.json  tsconfig.json  vitest.config.ts
    ├── src/{core,figures,helpers,generators,testing}
    └── test/                     mirrors src/
```

TypeScript strict, ESM, Vitest. A future `packages/web` imports `@maths/engine` directly.

### The two functions the user asked for

Everything below exists to make these two signatures correct and general:

```ts
generate(seed: number, opts?: GenerateOptions): Question   // the maker
mark(question: Question, response: Response): MarkResult   // the solver / verifier
```

`Response` is `Record<SlotId, string>` — a map of answer slots, not a single scalar. That covers
multi-part questions, "x = …, y = …" simultaneous equations, and the user's `x + y = 2` example
(two named parameters checked against the question that produced them).

`MarkResult` reports `{ correct, awarded, outOf, steps[], misconception? }`, so a caller wanting the
simple boolean reads `.correct` and a caller building a mock paper reads the rest.

### Core model — `src/core/`

| File | Responsibility |
|---|---|
| `rng.ts` | Seeded deterministic PRNG (mulberry32) + `int`, `pick`, `shuffle`, `weighted`. **Determinism is load-bearing**: a mock paper stores only `(generatorId, seed)` pairs and regenerates identically. |
| `rational.ts` | Exact rational arithmetic on `bigint`. Required because marking distinguishes ½ from 0.5 from 3/6, and floats would corrupt surd and π work. |
| `exact.ts` | Exact values as a sum of terms `{ coeff: Rational, radicand: bigint, piPower: 0\|1 }` — covers `2√3`, `9π`, `25/4`, `(5±√57)/4`. Needed by N8, G17, G18, G21, A18. |
| `expression/` | Algebraic AST, parser, normaliser, and `equivalent()` by polynomial normal form with **random rational probing** as fallback — this is what makes `y = 3.5x` ≡ `y = 7x/2` and `3x + 2` ≡ `2 + 3x` work. |
| `value.ts` | The `MathValue` union: exact, decimal, range, expression, set (ordered or not), ratio, point, vector, text, figure-response. |
| `parse-response.ts` | Student string → `MathValue`. Handles `3/4`, `0.75`, `75%`, `2:3`, `x>=3`, `(1,-1)`, `2root3`, `5pi`, mixed numbers, units. Tolerant by design; ambiguity is resolved by the expected type. |
| `compare.ts` | Equivalence under a policy: `oe` / `cao` / `nfww` / accuracy demanded (dp, sf) / `figs` / inclusive ranges / units required or ignored. |
| `question.ts` | `Question`, content blocks (text, math, table, figure, slot), `AnswerSlot`. |
| `markscheme.ts` | Ordered steps `{ type: 'M'\|'A'\|'B', marks, dependsOn?, accept: Matcher[], followThrough?, note? }` plus `specialCases: [{ marks, accept, misconception }]`. |
| `marker.ts` | Implements §8.5 of the syllabus map: never award A after M0; M marks from any correct value seen; follow-through against the student's own earlier value; SC vs method marks — award the greater; ignore subsequent working; penalise premature approximation once; reject probability written as a ratio. |
| `generator.ts` | `defineGenerator()` — binds metadata (ref, tier, boards, AO, marks, calculator) to `generate`, and validates the metadata against the syllabus map at construction. |
| `registry.ts` | All generators keyed by DfE ref, queryable by tier / strand / AO / marks — the interface the mock builder will consume next phase. |

### Figures — `src/figures/`

A declarative scene graph, generated **from the same parameters as the answer**, so figure and answer
cannot disagree. Primitives: points, segments, polygons, circles, arcs, angle marks, right-angle marks,
tick marks, labels, shading, `notToScale`. Builders for the recurring exam furniture:

triangle / polygon · circle-with-theorem · number line (open vs closed circles — A22) · coordinate axes
with plotted functions (A9–A16) · Venn (P6) · tree and frequency tree (P1, P8, P9) · two-way table (P7)
· bar, pie, histogram, box plot, cumulative frequency, scatter (S2–S6) · plans and elevations (G13).

`validate.ts` asserts geometric consistency — angles sum correctly, lengths positive, labels match
params, points non-degenerate. Every figure-producing generator runs this in its tests.

### Shared helpers — `src/helpers/`

The constraint-satisfaction layer that makes generated numbers *exam-like* rather than arbitrary:
`pickUntil(rng, gen, predicate)` with an attempt cap, primes/HCF/LCM pairs, factorisable quadratic
triples, Pythagorean triples, angle sets that sum correctly, similar-shape scale factors, datasets with
whole-number mean and clean quartiles, money and percentage values that stay to 2 dp, and a
`nonCalculatorSafe` predicate for questions flagged non-calc.

### Generators — `src/generators/<strand>/`

One file per reference item (`n01.ts` … `s06.ts`), each exporting one or more generators. Extra
generators only where a single ref genuinely spans distinct skills — A4 (expand binomials / factorise
`x²+bx+c` / factorise `ax²+bx+c` / algebraic fractions), R9 (increase-decrease / express as percentage /
reverse percentage), S4 (compare distributions / averages / box plots). Expected total ~130–150
generators across the 97 refs.

Each generator's mark scheme and at least one worked example are taken from the corresponding row of
`gcse-maths-syllabus-map.md`, including its named special cases — the SC entries in that document are
the misconception taxonomy, so they become `specialCases` with stable misconception IDs.

---

## Testing

`NEED to be unit tested to ensure validity` is the requirement, so testing is two-layered.

**1. Conformance harness (`src/testing/conformance.ts`) — applied to every generator.**
Runs each generator across ~200 seeds and asserts:

- determinism — same seed yields a byte-identical question
- round-trip — the generator's own declared answer marks as fully correct
- mark scheme step values sum to the declared tariff
- every declared `oe` alternative form also scores full marks
- a perturbed/wrong answer scores strictly less than full
- each declared special case scores exactly its SC marks and reports its misconception ID
- metadata valid — ref exists in the syllabus map, tier and AO legal, marks > 0
- figures pass `validate.ts`
- non-calculator-flagged questions produce calculator-free intermediate values
- no NaN, no floating-point drift into answers, no empty content blocks

**2. Bespoke per-generator tests** — the actual mathematics. Fixed seeds with hand-checked questions,
answers and mark awards, plus the specific wrong answers a student would give.

**3. Coverage test** — asserts all 97 DfE refs are present in the registry, so the suite fails if a ref
is missed.

---

## Sequencing

Each step is a commit on `claude/gcse-maths-education-platform-9k8tvd`.

1. **Workspace + core** — layout, RNG, rational, exact, expression engine, value/compare/parse,
   question and mark-scheme types, marker, generator, registry. Unit tests for each core module.
2. **Figures + helpers + conformance harness.**
3. **Number (N1–N16)** — then pause for review: this is the first full strand and sets the pattern for
   the remaining five.
4. **Algebra (A1–A25)** — heaviest use of the expression engine.
5. **Ratio (R1–R16)**.
6. **Geometry (G1–G25)** — heaviest use of the figure model.
7. **Probability (P1–P9) and Statistics (S1–S6)**.
8. **Coverage test green across all 97 refs**, README documenting how to add a generator.

Steps 1–2 are the risky part; steps 3–7 are repetitive application of the pattern.

## Verification

```bash
npm install
npm run typecheck          # tsc --noEmit, strict
npm test                   # vitest — core, conformance, per-generator, coverage
npm run test:coverage
npx tsx scripts/sample.ts  # prints one generated question + answer + mark scheme per ref
```

`scripts/sample.ts` is the end-to-end check: it walks the registry, generates from a fixed seed, marks
the model answer, and fails loudly if any of the 97 refs is missing or any self-mark is not full marks.
Its output is also the artefact to eyeball for whether questions actually read like exam questions.

## Out of scope

Rendering, the mock-paper assembler, persistence, gamification, and the web app. This phase produces
only the generator/verifier layer and its tests — the assembler in the next phase consumes the registry.
