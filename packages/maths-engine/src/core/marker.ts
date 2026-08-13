/**
 * The marker: the "solver / verifier" half of the engine.
 *
 * Implements the marking principles collected in section 8.5 of the syllabus map:
 *
 *  1. a method mark is earned by a correct value seen anywhere, including the answer line
 *  2. an accuracy mark is never awarded after a failed method mark ("M0 A1 cannot be awarded")
 *  3. dependent method marks require their antecedents
 *  4. follow-through re-marks later steps against the student's own earlier value
 *  5. a special case and the method marks are alternatives: award whichever is greater
 *  6. special cases count only when they are the final answer, never mid-working
 *  7. equivalence is decided by the compare policy, so "or equivalent" is honoured
 */
import { equivalent, type ComparePolicy } from './compare.js';
import { parseResponse, type ParsedResponse } from './parse-response.js';
import type { FollowThroughContext, MarkScheme, MarkStep, Matcher } from './markscheme.js';
import type { Question } from './question.js';
import type { MathValue } from './value.js';

export interface Response {
  /** Answer-box contents, keyed by slot id. */
  slots: Record<string, string>;
  /** Optional lines of working, which method marks may be earned from. */
  working?: string[];
}

export interface StepResult {
  id: string;
  type: 'M' | 'A' | 'B';
  marks: number;
  awarded: number;
  /** Why the step was not awarded, when it was not. */
  reason?: 'no-match' | 'dependency-not-met';
  note?: string;
}

export interface MarkResult {
  /** True when every answer slot matches the expected answer. */
  correct: boolean;
  awarded: number;
  outOf: number;
  steps: StepResult[];
  /** Per-slot verdict, so a caller can highlight the specific box that is wrong. */
  slots: Record<string, boolean>;
  /** Set when a special case was awarded, identifying the misconception. */
  misconception?: string;
  /** True when the special-case total replaced the method total. */
  specialCaseApplied: boolean;
}

/** Accepts a bare string (single-slot questions), a slot map, or a full response. */
export type ResponseLike = string | Record<string, string> | Response;

export function normaliseResponse(question: Question, response: ResponseLike): Response {
  if (typeof response === 'string') {
    const firstSlot = question.slots[0];
    if (!firstSlot) throw new Error(`Question ${question.generatorId} has no answer slots`);
    return { slots: { [firstSlot.id]: response } };
  }
  if ('slots' in response && typeof response.slots === 'object' && response.slots !== null) {
    return response as Response;
  }
  return { slots: response as Record<string, string> };
}

interface ParsedState {
  slotValues: Record<string, MathValue | null>;
  slotParsed: Record<string, ParsedResponse>;
  workingValues: MathValue[];
  workingParsed: ParsedResponse[];
}

function parseAll(question: Question, response: Response): ParsedState {
  const slotValues: Record<string, MathValue | null> = {};
  const slotParsed: Record<string, ParsedResponse> = {};
  for (const s of question.slots) {
    const raw = response.slots[s.id] ?? '';
    const parsed = parseResponse(raw, s.expect.kind);
    slotParsed[s.id] = parsed;
    slotValues[s.id] = parsed.value;
  }
  const workingParsed = (response.working ?? []).map((line) => parseResponse(line, 'auto'));
  const workingValues = workingParsed
    .map((p) => p.value)
    .filter((v): v is MathValue => v !== null);
  return { slotValues, slotParsed, workingValues, workingParsed };
}

function matcherMatches(
  matcher: Matcher,
  state: ParsedState,
  context: FollowThroughContext,
  defaultPolicy: ComparePolicy,
): boolean {
  const expected = matcher.followThrough ? matcher.followThrough(context) : matcher.value;
  if (expected === null || expected === undefined) return false;
  const policy = matcher.policy ?? defaultPolicy;

  const tryValue = (value: MathValue | null, parsed?: ParsedResponse): boolean =>
    value !== null && equivalent(expected, value, policy, parsed);

  switch (matcher.target.where) {
    case 'slot': {
      const id = matcher.target.slotId;
      return tryValue(state.slotValues[id] ?? null, state.slotParsed[id]);
    }
    case 'working':
      return state.workingParsed.some((p) => tryValue(p.value, p));
    case 'anywhere':
      return (
        state.workingParsed.some((p) => tryValue(p.value, p)) ||
        Object.keys(state.slotValues).some((id) =>
          tryValue(state.slotValues[id] ?? null, state.slotParsed[id]),
        )
      );
  }
}

function dependenciesMet(step: MarkStep, scheme: MarkScheme, awarded: Set<string>): boolean {
  if (step.dependsOn && !step.dependsOn.every((id) => awarded.has(id))) return false;
  if (step.type === 'A' && !step.independent) {
    // "M0 A1 cannot be awarded": every preceding method step must have been earned.
    const index = scheme.steps.findIndex((s) => s.id === step.id);
    for (let i = 0; i < index; i++) {
      const prior = scheme.steps[i]!;
      if (prior.type === 'M' && !awarded.has(prior.id)) return false;
    }
  }
  return true;
}

/**
 * Mark a response against the question that produced it.
 *
 * The simple case the brief describes — generate a question, hand back the parameters, ask
 * whether it holds — is `mark(question, "80").correct`. Everything else in the result exists
 * so that mock papers can report partial credit the way a real examiner would.
 */
export function mark(question: Question, response: ResponseLike): MarkResult {
  const normalised = normaliseResponse(question, response);
  const state = parseAll(question, normalised);
  const scheme = question.markScheme;
  const context: FollowThroughContext = {
    slots: state.slotValues,
    working: state.workingValues,
  };

  const awardedIds = new Set<string>();
  const steps: StepResult[] = [];
  let methodTotal = 0;

  for (const step of scheme.steps) {
    const depsOk = dependenciesMet(step, scheme, awardedIds);
    const matched =
      depsOk &&
      step.accept.some((m) => matcherMatches(m, state, context, { mode: 'oe' }));
    if (matched) {
      awardedIds.add(step.id);
      methodTotal += step.marks;
    }
    steps.push({
      id: step.id,
      type: step.type,
      marks: step.marks,
      awarded: matched ? step.marks : 0,
      ...(matched ? {} : { reason: depsOk ? ('no-match' as const) : ('dependency-not-met' as const) }),
      ...(step.note ? { note: step.note } : {}),
    });
  }

  // Special cases are alternatives to the method marks, and only count on the answer line.
  let bestSpecial: { marks: number; misconception: string } | null = null;
  for (const sc of scheme.specialCases ?? []) {
    const matched = sc.accept.some((m) => {
      if (m.target.where === 'working') return false;
      const slotOnly: Matcher =
        m.target.where === 'anywhere'
          ? { ...m, target: { where: 'slot', slotId: question.slots[0]?.id ?? '' } }
          : m;
      return matcherMatches(slotOnly, state, context, { mode: 'oe' });
    });
    if (matched && (!bestSpecial || sc.marks > bestSpecial.marks)) {
      bestSpecial = { marks: sc.marks, misconception: sc.misconception };
    }
  }

  const slotResults: Record<string, boolean> = {};
  for (const s of question.slots) {
    const value = state.slotValues[s.id] ?? null;
    const policy = s.policy ?? { mode: 'oe' };
    const parsed = state.slotParsed[s.id];
    slotResults[s.id] =
      value !== null &&
      (equivalent(s.expect, value, policy, parsed) ||
        (s.alsoAccept ?? []).some((alt) => equivalent(alt, value, policy, parsed)));
  }
  const correct = question.slots.every((s) => slotResults[s.id]);

  const specialCaseApplied = bestSpecial !== null && bestSpecial.marks > methodTotal && !correct;
  // "Obtaining the correct final answer without working will score full marks unless the mark
  // scheme states otherwise" - AQA marking guidance. `requireWorking` is that exception.
  const baseTotal = specialCaseApplied ? bestSpecial!.marks : methodTotal;
  const awarded = correct && !scheme.requireWorking ? scheme.total : baseTotal;

  return {
    correct,
    awarded: Math.min(awarded, scheme.total),
    outOf: scheme.total,
    steps,
    slots: slotResults,
    specialCaseApplied,
    ...(bestSpecial && (specialCaseApplied || bestSpecial.marks > 0) && !correct
      ? { misconception: bestSpecial.misconception }
      : {}),
  };
}

/** Convenience wrapper for the boolean-only case. */
export function verify(question: Question, response: ResponseLike): boolean {
  return mark(question, response).correct;
}
