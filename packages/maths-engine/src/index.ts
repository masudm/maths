/**
 * @maths/engine - question generators and mark-scheme verifiers for GCSE Mathematics.
 *
 * The two functions that matter:
 *
 *   const question = generator.generate(seed);   // the maker
 *   const result   = mark(question, response);   // the solver / verifier
 *
 * A question is data, not prose: its content is a structured document that a renderer can
 * turn into text, diagrams, number lines, graphs, Venn diagrams, trees and tables. Marking
 * awards M / A / B marks against a structured mark scheme, so a wrong answer produces
 * partial credit and a named misconception rather than just `false`.
 */
export { Rng, pickUntil } from './core/rng.js';
export { Rational, rat } from './core/rational.js';
export { Exact, simplifySurd } from './core/exact.js';
export type { ExactTerm } from './core/exact.js';

export { parseExpression, tryParseExpression } from './core/expression/parse.js';
export { expressionsEquivalent } from './core/expression/equivalent.js';
export { evaluate, symbols, toText } from './core/expression/ast.js';
export type { Expr, RelOp } from './core/expression/ast.js';

export * from './core/value.js';
export { parseResponse } from './core/parse-response.js';
export type { ParsedResponse } from './core/parse-response.js';
export { equivalent, roundToSigFigs } from './core/compare.js';
export type { ComparePolicy } from './core/compare.js';

export * from './core/question.js';
export * from './core/markscheme.js';
export { mark, verify, normaliseResponse } from './core/marker.js';
export type { MarkResult, Response, ResponseLike, StepResult } from './core/marker.js';

export { defineGenerator } from './core/generator.js';
export type { GenerateOptions, GeneratorMeta, QuestionDraft, QuestionGenerator } from './core/generator.js';
export { GeneratorRegistry, ALL_REFS, STRAND_OF_PREFIX } from './core/registry.js';
export type { GeneratorQuery } from './core/registry.js';

export * from './figures/types.js';
export * as figureBuilders from './figures/builders.js';
export { validateFigure, collectFigures } from './figures/validate.js';

export * as numberHelpers from './helpers/numbers.js';
export { draft, answerSlot } from './helpers/dsl.js';
export type { DraftSpec, StepSpec } from './helpers/dsl.js';

export { runConformance, describeFailures, modelResponse, schemeWorking } from './testing/conformance.js';
export type { ConformanceFailure, ConformanceOptions } from './testing/conformance.js';

export { ALL_GENERATORS, registry } from './generators/index.js';
export { boardsFor } from './generators/board-refs.js';
