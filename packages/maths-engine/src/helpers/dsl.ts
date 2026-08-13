/**
 * A small builder over the core types.
 *
 * Without it every generator would restate the same wiring between slots, matchers and
 * steps. With it a generator reads as: here is the question, here is the answer, here is
 * what earns each mark.
 */
import type { ComparePolicy } from '../core/compare.js';
import type { QuestionDraft } from '../core/generator.js';
import {
  anywhere,
  inSlot,
  type MarkScheme,
  type MarkStep,
  type Matcher,
  type SpecialCase,
} from '../core/markscheme.js';
import type { AnswerSlot, Content, Tier } from '../core/question.js';
import type { MathValue } from '../core/value.js';

export interface StepSpec {
  /** Defaults to the step's position, e.g. "s1". */
  id?: string;
  type: 'M' | 'A' | 'B';
  /** Defaults to 1. */
  marks?: number;
  /** Any one of these values earns the step. */
  values: MathValue[];
  /**
   * Where the value must appear. `anywhere` (the default for M and B) implements the rule
   * that a correct value seen anywhere earns the method mark; `answer` restricts to the
   * answer slot, which is the default for A steps.
   */
  target?: 'anywhere' | 'answer' | 'working' | { slot: string };
  dependsOn?: string[];
  independent?: boolean;
  note?: string;
  policy?: ComparePolicy;
  /** Follow-through: derive the acceptable value from what the student already wrote. */
  followThrough?: Matcher['followThrough'];
}

export interface SpecialCaseSpec {
  marks: number;
  values: MathValue[];
  misconception: string;
  note?: string;
  policy?: ComparePolicy;
}

export interface DraftSpec {
  params: Record<string, unknown>;
  content: Content[];
  /** Single-slot shorthand. Provide this or `slots`. */
  answer?: MathValue;
  answerSlot?: Partial<Omit<AnswerSlot, 'expect'>> & { id?: string };
  slots?: AnswerSlot[];
  steps: StepSpec[];
  specialCases?: SpecialCaseSpec[];
  guidance?: string[];
  /** The question demands working, so a bare answer does not earn full marks. */
  requireWorking?: boolean;
  tier?: Tier;
}

const DEFAULT_SLOT_ID = 'answer';

function resolveTarget(spec: StepSpec, primarySlotId: string): Matcher['target'] {
  const target = spec.target ?? (spec.type === 'A' ? 'answer' : 'anywhere');
  if (target === 'anywhere') return anywhere;
  if (target === 'working') return { where: 'working' };
  if (target === 'answer') return inSlot(primarySlotId);
  return inSlot(target.slot);
}

function toStep(spec: StepSpec, index: number, primarySlotId: string): MarkStep {
  const target = resolveTarget(spec, primarySlotId);
  const accept: Matcher[] = spec.values.map((value) => ({
    target,
    value,
    ...(spec.policy ? { policy: spec.policy } : {}),
    ...(spec.followThrough ? { followThrough: spec.followThrough } : {}),
  }));
  return {
    id: spec.id ?? `s${index + 1}`,
    type: spec.type,
    marks: spec.marks ?? 1,
    accept,
    ...(spec.dependsOn ? { dependsOn: spec.dependsOn } : {}),
    ...(spec.independent ? { independent: spec.independent } : {}),
    ...(spec.note ? { note: spec.note } : {}),
  };
}

/** Build a QuestionDraft from a compact specification. */
export function draft(spec: DraftSpec): QuestionDraft {
  const slots: AnswerSlot[] =
    spec.slots ??
    (spec.answer
      ? [
          {
            id: spec.answerSlot?.id ?? DEFAULT_SLOT_ID,
            expect: spec.answer,
            ...(spec.answerSlot ?? {}),
          } as AnswerSlot,
        ]
      : []);

  if (slots.length === 0) {
    throw new Error('draft: provide either `answer` or `slots`');
  }

  const primarySlotId = slots[0]!.id;
  const steps = spec.steps.map((s, i) => toStep(s, i, primarySlotId));

  const specialCases: SpecialCase[] = (spec.specialCases ?? []).map((sc) => ({
    marks: sc.marks,
    misconception: sc.misconception,
    ...(sc.note ? { note: sc.note } : {}),
    accept: sc.values.map((value) => ({
      target: inSlot(primarySlotId),
      value,
      ...(sc.policy ? { policy: sc.policy } : {}),
    })),
  }));

  const markScheme: MarkScheme = {
    steps,
    total: steps.reduce((s, step) => s + step.marks, 0),
    ...(specialCases.length > 0 ? { specialCases } : {}),
    ...(spec.requireWorking ? { requireWorking: true } : {}),
    ...(spec.guidance ? { guidance: spec.guidance } : {}),
  };

  return {
    params: spec.params,
    content: spec.content,
    slots,
    markScheme,
    ...(spec.tier ? { tier: spec.tier } : {}),
  };
}

/** A slot with sensible defaults. */
export function answerSlot(
  id: string,
  expect: MathValue,
  opts: Partial<Omit<AnswerSlot, 'id' | 'expect'>> = {},
): AnswerSlot {
  return { id, expect, ...opts };
}
