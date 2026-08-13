/**
 * End-to-end check and eyeball test.
 *
 * Walks the registry, generates one question per generator from a fixed seed, marks the
 * model answer against the mark scheme it produced, and prints the result. Exits non-zero if
 * any reference is missing or any generator fails to mark its own answer, so this doubles as
 * a smoke test of the whole pipeline.
 */
import { registry } from '../src/generators/index.js';
import { mark } from '../src/core/marker.js';
import { contentToText } from '../src/core/question.js';
import { displayValue } from '../src/core/value.js';
import { modelResponse, schemeWorking } from '../src/testing/conformance.js';
import { ALL_REFS } from '../src/core/registry.js';

const seed = Number(process.argv[2] ?? 42);
const filter = process.argv[3];

let failures = 0;
let shown = 0;

for (const generator of registry.all()) {
  if (filter && !generator.id.toLowerCase().includes(filter.toLowerCase())) continue;
  const question = generator.generate(seed);
  const response = modelResponse(question);
  // Working is supplied as well as the answer: questions that say "you must show your
  // working" correctly withhold full marks from a bare answer, and that is not a failure.
  const result = mark(question, { slots: response, working: schemeWorking(question) });

  const status = result.correct && result.awarded === question.marks ? 'ok' : 'FAIL';
  if (status === 'FAIL') failures++;
  shown++;

  console.log(`\n${'-'.repeat(78)}`);
  console.log(
    `${question.ref}  ${generator.id}  [${status}]  ` +
      `${question.marks} mark${question.marks === 1 ? '' : 's'} · tier ${question.tier} · ` +
      `${question.ao} · ${question.calculator} · AQA ${question.boards.aqa} / OCR ${question.boards.ocr.join(', ')}`,
  );
  console.log(`Q: ${contentToText(question.content)}`);
  for (const slot of question.slots) {
    console.log(`A: ${slot.label ? `${slot.label} = ` : ''}${displayValue(slot.expect)}`);
  }
  console.log('Mark scheme:');
  for (const step of question.markScheme.steps) {
    const dep = step.dependsOn ? ` dep on ${step.dependsOn.join(', ')}` : '';
    console.log(`  ${step.type}${step.marks}${dep}${step.note ? ` — ${step.note}` : ''}`);
  }
  for (const sc of question.markScheme.specialCases ?? []) {
    console.log(`  SC${sc.marks} — ${sc.misconception}`);
  }
}

const missing = registry.missingRefs();
console.log(`\n${'='.repeat(78)}`);
console.log(
  `${shown} generators sampled at seed ${seed} · ${registry.byRef().size}/${ALL_REFS.length} references covered`,
);
if (missing.length > 0) console.log(`MISSING REFERENCES: ${missing.join(', ')}`);
if (failures > 0) console.log(`SELF-MARK FAILURES: ${failures}`);

if (failures > 0 || missing.length > 0) process.exit(1);
console.log('All sampled generators marked their own answer correctly.');
