/**
 * The conformance harness.
 *
 * Every generator is put through this. It is what makes "97 generators are all valid" a
 * claim the test suite can actually check, rather than 97 hand-written assertions that each
 * verify a different subset of the contract.
 */
import { collectFigures, validateFigure } from '../figures/validate.js';
import { mark } from '../core/marker.js';
import { schemeTotal } from '../core/markscheme.js';
import { contentToText, type Question } from '../core/question.js';
import { displayValue, toNumber, type MathValue } from '../core/value.js';
import { nonCalculatorSafe } from '../helpers/numbers.js';
import type { QuestionGenerator } from '../core/generator.js';

export interface ConformanceOptions {
  /** How many seeds to exercise. */
  seeds?: number;
  /** Skip the "a wrong answer scores less than full marks" probe. */
  skipWrongAnswerProbe?: boolean;
}

export interface ConformanceFailure {
  seed: number;
  check: string;
  detail: string;
}

/** The answer the generator itself declares, as a response. */
export function modelResponse(question: Question): Record<string, string> {
  const slots: Record<string, string> = {};
  for (const s of question.slots) {
    // A range answer has no single canonical spelling, so the midpoint stands in for what a
    // student would write.
    slots[s.id] =
      s.expect.kind === 'range'
        ? `${(s.expect.min + s.expect.max) / 2}`
        : displayValue(s.expect);
  }
  return slots;
}

/**
 * Working that contains every value the mark scheme looks for.
 * Used to prove that the method marks are reachable at all — a scheme whose M1 can never be
 * earned is a broken scheme, and that is easy to write by accident.
 */
export function schemeWorking(question: Question): string[] {
  const lines: string[] = [];
  for (const step of question.markScheme.steps) {
    for (const matcher of step.accept) {
      if (matcher.followThrough) continue;
      lines.push(displayValue(matcher.value));
    }
  }
  return lines;
}

function perturb(value: MathValue): string | null {
  const n = toNumber(value);
  if (n === null) return null;
  // Move far enough that no tolerance or range could accept it. n -> 2n + 7 has a fixed
  // point at -7, so the result is checked rather than assumed to differ.
  let shifted = Math.abs(n) > 1e-9 ? n * 2 + 7 : 13;
  if (Math.abs(shifted - n) < 1e-6) shifted = n + 11;
  return `${shifted}`;
}

/** JSON.stringify cannot serialise the bigints inside Rational, so structure is compared here. */
function stableStringify(value: unknown): string {
  const seen = new WeakSet<object>();
  const walk = (v: unknown): string => {
    if (typeof v === 'bigint') return `${v}n`;
    if (typeof v === 'function') return '"[fn]"';
    if (v === null || typeof v !== 'object') return JSON.stringify(v) ?? 'null';
    if (seen.has(v as object)) return '"[circular]"';
    seen.add(v as object);
    if (Array.isArray(v)) return `[${v.map(walk).join(',')}]`;
    const entries = Object.entries(v as Record<string, unknown>).sort(([a], [b]) =>
      a < b ? -1 : a > b ? 1 : 0,
    );
    return `{${entries.map(([k, val]) => `${JSON.stringify(k)}:${walk(val)}`).join(',')}}`;
  };
  return walk(value);
}

function containsNonFinite(value: unknown): boolean {
  if (typeof value === 'number') return !Number.isFinite(value);
  if (Array.isArray(value)) return value.some(containsNonFinite);
  if (value && typeof value === 'object') {
    return Object.values(value as Record<string, unknown>).some(containsNonFinite);
  }
  return false;
}

export function runConformance(
  generator: QuestionGenerator,
  options: ConformanceOptions = {},
): ConformanceFailure[] {
  const seedCount = options.seeds ?? 60;
  const failures: ConformanceFailure[] = [];
  const add = (seed: number, check: string, detail: string): void => {
    failures.push({ seed, check, detail });
  };

  for (let seed = 1; seed <= seedCount; seed++) {
    let question: Question;
    try {
      question = generator.generate(seed);
    } catch (error) {
      add(seed, 'generate', `threw: ${(error as Error).message}`);
      continue;
    }

    // 1. Determinism.
    try {
      const again = generator.generate(seed);
      if (stableStringify(again) !== stableStringify(question)) {
        add(seed, 'determinism', 'the same seed produced a different question');
      }
    } catch (error) {
      add(seed, 'determinism', `regeneration threw: ${(error as Error).message}`);
    }

    // 2. Tariff consistency.
    const total = schemeTotal(question.markScheme);
    if (total !== question.marks) {
      add(seed, 'tariff', `steps total ${total} but the question is worth ${question.marks}`);
    }
    if (question.markScheme.steps.length === 0) {
      add(seed, 'tariff', 'mark scheme has no steps');
    }

    // 3. The content is renderable at all.
    if (question.content.length === 0) add(seed, 'content', 'question has no content');
    if (contentToText(question.content).trim() === '') {
      add(seed, 'content', 'question renders to empty text');
    }
    if (containsNonFinite(question.params)) {
      add(seed, 'params', 'params contain NaN or Infinity');
    }

    // 4. Round trip: the generator's own answer must mark as correct and score full marks
    //    when the working shows what the scheme asks for.
    const model = modelResponse(question);
    const resultWithWorking = mark(question, {
      slots: model,
      working: schemeWorking(question),
    });
    if (!resultWithWorking.correct) {
      add(
        seed,
        'round-trip',
        `the declared answer ${JSON.stringify(model)} did not mark as correct`,
      );
    }
    if (resultWithWorking.awarded !== question.marks) {
      const missed = resultWithWorking.steps
        .filter((s) => s.awarded === 0)
        .map((s) => `${s.id}(${s.reason ?? 'no-match'})`)
        .join(', ');
      add(
        seed,
        'round-trip',
        `full working scored ${resultWithWorking.awarded}/${question.marks}; unearned: ${missed}`,
      );
    }

    // 4b. The method and independent steps must be reachable from working alone, otherwise
    //     a scheme can silently be unearnable and still look healthy because the final answer
    //     shortcut carries it.
    const methodOnly = mark(question, { slots: {}, working: schemeWorking(question) });
    const reachable = question.markScheme.steps
      .filter((step) => step.type !== 'A')
      .filter((step) => step.accept.every((m) => !m.followThrough))
      .filter((step) => step.accept.every((m) => m.target.where !== 'slot'));
    for (const step of reachable) {
      const outcome = methodOnly.steps.find((s) => s.id === step.id);
      if (outcome && outcome.awarded === 0 && outcome.reason === 'no-match') {
        add(
          seed,
          'step-reachable',
          `step ${step.id} (${step.type}${step.marks}) cannot be earned by the value the scheme itself declares`,
        );
      }
    }

    // 5. A bare correct answer must still be correct (schemes only withhold this when the
    //    question demands working, which is expressed by the slot policy, not by silence).
    const bare = mark(question, { slots: model });
    if (!bare.correct) {
      add(seed, 'bare-answer', 'the declared answer alone did not mark as correct');
    }

    // 6. Alternative forms must be accepted, since that is what `oe` means.
    for (const s of question.slots) {
      for (const alt of s.alternativeForms ?? []) {
        const slots = { ...model, [s.id]: alt };
        if (!mark(question, { slots }).slots[s.id]) {
          add(seed, 'alternative-forms', `"${alt}" was rejected for slot "${s.id}"`);
        }
      }
    }

    // 7. A clearly wrong answer must not score full marks.
    if (!options.skipWrongAnswerProbe) {
      const firstSlot = question.slots[0]!;
      const wrong = perturb(firstSlot.expect);
      if (wrong !== null) {
        const wrongResult = mark(question, { slots: { ...model, [firstSlot.id]: wrong } });
        if (wrongResult.correct) {
          add(seed, 'wrong-answer', `"${wrong}" was accepted as correct`);
        }
        if (wrongResult.awarded === question.marks) {
          add(seed, 'wrong-answer', `"${wrong}" still scored full marks`);
        }
      }
    }

    // 8. Special cases award their stated marks and report their misconception.
    for (const sc of question.markScheme.specialCases ?? []) {
      const matcher = sc.accept[0];
      if (!matcher) {
        add(seed, 'special-case', `special case "${sc.misconception}" has no matcher`);
        continue;
      }
      const value = displayValue(matcher.value);
      const scResult = mark(question, {
        slots: { ...model, [question.slots[0]!.id]: value },
      });
      if (scResult.awarded < sc.marks) {
        add(
          seed,
          'special-case',
          `"${value}" scored ${scResult.awarded} but special case "${sc.misconception}" is worth ${sc.marks}`,
        );
      }
      if (scResult.correct) {
        add(
          seed,
          'special-case',
          `special case "${sc.misconception}" matched the correct answer, so it is not a misconception`,
        );
      }
    }

    // 9. Figures must be structurally sound.
    for (const fig of collectFigures(question.content)) {
      const problems = validateFigure(fig);
      for (const p of problems) add(seed, 'figure', `${fig.kind}: ${p}`);
    }

    // 10. Non-calculator questions must not require a calculator.
    if (question.calculator === 'non-calc') {
      // Only decimal answers are policed: an exact fraction, surd or multiple of pi is a
      // non-calculator answer by its nature, however long its decimal expansion runs.
      const numbers = question.slots
        .filter((s) => s.expect.kind === 'decimal')
        .map((s) => toNumber(s.expect))
        .filter((n): n is number => n !== null);
      if (numbers.length > 0 && !nonCalculatorSafe(numbers)) {
        add(
          seed,
          'non-calculator',
          `answers ${numbers.join(', ')} are not reasonable without a calculator`,
        );
      }
    }
  }

  return failures;
}

/** Format failures for a test assertion message. */
export function describeFailures(
  generator: QuestionGenerator,
  failures: ConformanceFailure[],
): string {
  const shown = failures.slice(0, 8);
  const lines = shown.map((f) => `  seed ${f.seed} [${f.check}] ${f.detail}`);
  const more = failures.length > shown.length ? `\n  ... and ${failures.length - shown.length} more` : '';
  return `${generator.id} failed conformance:\n${lines.join('\n')}${more}`;
}
