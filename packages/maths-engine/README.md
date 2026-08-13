# @maths/engine

Question generators and mark-scheme verifiers for GCSE Mathematics (AQA 8300 and OCR J560).

One generator per DfE content reference, each able to **produce** a question and **mark** a response
against the mark scheme it produced. Built from `gcse-maths-syllabus-map.md` at the repository root,
which maps all 97 content statements shared by the two boards.

Nothing here renders. Questions are structured data so that a later phase can draw them.

## The two functions

```ts
import { registry, mark, verify } from '@maths/engine';

const generator = registry.get('R9.reverse-percentage');

const question = generator.generate(1234);      // the maker
const result   = mark(question, '80');          // the solver / verifier

result.correct;         // false
result.awarded;         // 1 of 3
result.misconception;   // 'reverse-percentage-treated-as-additive'
result.steps;           // which M1 / A1 / B1 steps were earned, and why not

verify(question, '80'); // the plain boolean, when that is all you need
```

`generate` is deterministic: the same seed always yields a byte-identical question. A mock paper is
therefore stored as a list of `(generatorId, seed)` pairs and regenerated exactly.

Responses are keyed by answer slot, so multi-part questions and multi-value answers work:

```ts
mark(question, { slots: { x: '5', y: '2' }, working: ['4x = 20'] });
```

Working is optional. Supplying it lets method marks be earned even when the final answer is wrong —
which is the whole point of a mark scheme.

## What marking actually implements

Drawn from AQA's *Marking guidance* and OCR's *Subject-Specific Marking Instructions* (section 8 of
the syllabus map):

- a method mark is earned by a correct value seen **anywhere**, including on the answer line
- `M0 A1` can never be awarded; dependent method marks require their antecedents
- follow-through re-marks later steps against the student's own earlier value
- a special case and the method marks are alternatives — whichever is greater is awarded
- a special case only counts as the final answer, never mid-working
- a bare correct answer scores full marks unless the question demands working
- "or equivalent" is decided by behaviour, not spelling: `3/4`, `0.75` and `75%` are one answer, and
  `y = 3.5x` and `y = 7x/2` are one equation
- a probability written as a ratio scores zero, however it is written

## Layout

| Path | Contents |
|---|---|
| `src/core/` | exact arithmetic, the expression engine, response parsing, comparison, mark schemes, the marker, the registry |
| `src/figures/` | the declarative figure model (diagrams, number lines, axes, Venn, trees, tables, charts) and its validator |
| `src/helpers/` | number theory, constraint-satisfying value pickers, and the generator DSL |
| `src/generators/` | one file per content reference, `n01.ts` … `s06.ts` |
| `src/testing/` | the conformance harness applied to every generator |

Exact values are built on `Rational` (bigint) rather than floats, because marking distinguishes ½
from 0.5 from 3/6, and because surds and multiples of π must stay exact.

## Adding a generator

```ts
import { boardsFor, defineGenerator, draft, intValue, slot, text } from '../kit.js';

export const example = defineGenerator(
  {
    id: 'N3.priority-of-operations',   // stable: a mock paper stores this with a seed
    ref: 'N3',                          // DfE reference, the shared spine
    title: 'Order of operations with brackets and a power',
    strand: 'number',
    tiers: ['F'],                       // 'F' | 'F+' | 'H'
    ao: 'AO1',
    marks: 2,
    calculator: 'non-calc',
    boards: boardsFor('N3'),
  },
  (rng) => draft({
    params: { /* everything the figure and answer derive from */ },
    content: [text('Work out …'), slot('answer')],
    answer: intValue(17),
    steps: [
      { id: 'm1', type: 'M', values: [intValue(4)], note: 'the bracket evaluated' },
      { id: 'a1', type: 'A', values: [intValue(17)] },
    ],
    specialCases: [
      { marks: 0, values: [intValue(32)], misconception: 'evaluates-strictly-left-to-right' },
    ],
  }),
);

export default [example];
```

Then add it to `src/generators/index.ts`. Rules the framework enforces at construction:

- the mark scheme steps must total the declared tariff
- `M` and `B` steps default to matching **anywhere**; `A` steps default to the answer slot
- use `rng` for every random choice — `Math.random` breaks reproducibility
- derive figures from the same `params` as the answer, so the two cannot disagree
- a special case must be a genuinely *wrong* answer; the harness fails it if it can coincide with the
  correct one

## Tests

```bash
npm run typecheck      # tsc --noEmit, strict
npm test               # vitest
npm run sample         # generate, mark and print one question per generator
npm run sample -- 7 G1 # a specific seed, filtered by generator id
```

Every generator is run through `runConformance` over 40 seeds, which checks:

determinism · tariff consistency · the declared answer marks as correct · full working scores full
marks · every mark-scheme step is individually reachable · alternative forms are accepted · a wrong
answer does not score full marks · each special case scores its stated marks and reports its
misconception · figures are structurally valid · non-calculator questions stay calculator-free.

This is what makes "all 97 references are covered and valid" a claim the suite checks rather than a
claim in a comment. Several genuine defects were caught by it while the generators were being
written — distractors that coincided with the correct answer, a float that broke exact arithmetic,
and estimation questions whose "estimate" needed a calculator.
