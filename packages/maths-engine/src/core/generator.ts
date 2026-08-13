/**
 * Generator definition.
 *
 * `defineGenerator` binds the syllabus metadata to a build function and validates the pair,
 * so a generator whose mark scheme does not add up to its stated tariff fails at module load
 * rather than in a mock paper.
 */
import { Rng } from './rng.js';
import { schemeTotal, type MarkScheme } from './markscheme.js';
import type { AnswerSlot, AO, CalculatorPolicy, Content, Question, Strand, Tier } from './question.js';

export interface GeneratorMeta {
  /** Stable identifier, e.g. "R9.reverse-percentage". Used with a seed to reproduce a question. */
  id: string;
  /** DfE / AQA content reference, e.g. "R9". */
  ref: string;
  /** Human-readable description of what the question tests. */
  title: string;
  strand: Strand;
  /** Tiers this question is appropriate for. */
  tiers: Tier[];
  ao: AO;
  marks: number;
  calculator: CalculatorPolicy;
  boards: { aqa: string; ocr: string[] };
}

/** What a generator's build function returns; the framework fills in the rest of the Question. */
export interface QuestionDraft {
  params: Record<string, unknown>;
  content: Content[];
  slots: AnswerSlot[];
  markScheme: MarkScheme;
  /** Override the metadata tier for this particular draft. */
  tier?: Tier;
}

export interface GenerateOptions {
  /** Restrict generation to a tier, where a generator supports several. */
  tier?: Tier;
}

export interface QuestionGenerator extends GeneratorMeta {
  generate(seed: number, opts?: GenerateOptions): Question;
}

export function defineGenerator(
  meta: GeneratorMeta,
  build: (rng: Rng, opts: GenerateOptions) => QuestionDraft,
): QuestionGenerator {
  if (!/^[NARGPS]\d{1,2}$/.test(meta.ref)) {
    throw new Error(`defineGenerator(${meta.id}): "${meta.ref}" is not a valid content reference`);
  }
  if (meta.marks < 1) {
    throw new Error(`defineGenerator(${meta.id}): marks must be at least 1`);
  }
  if (meta.tiers.length === 0) {
    throw new Error(`defineGenerator(${meta.id}): at least one tier is required`);
  }

  return {
    ...meta,
    generate(seed: number, opts: GenerateOptions = {}): Question {
      const rng = new Rng(seed);
      const draft = build(rng, opts);

      const total = schemeTotal(draft.markScheme);
      if (total !== draft.markScheme.total) {
        throw new Error(
          `${meta.id}: mark scheme steps total ${total} but the scheme declares ${draft.markScheme.total}`,
        );
      }
      if (total !== meta.marks) {
        throw new Error(
          `${meta.id}: mark scheme totals ${total} but the generator declares ${meta.marks} marks`,
        );
      }
      if (draft.slots.length === 0) {
        throw new Error(`${meta.id}: a question must have at least one answer slot`);
      }

      const slotIds = new Set(draft.slots.map((s) => s.id));
      if (slotIds.size !== draft.slots.length) {
        throw new Error(`${meta.id}: duplicate answer slot ids`);
      }

      return {
        generatorId: meta.id,
        ref: meta.ref,
        seed,
        strand: meta.strand,
        tier: draft.tier ?? opts.tier ?? meta.tiers[0]!,
        ao: meta.ao,
        calculator: meta.calculator,
        marks: meta.marks,
        params: draft.params,
        content: draft.content,
        slots: draft.slots,
        markScheme: draft.markScheme,
        boards: meta.boards,
      };
    },
  };
}
