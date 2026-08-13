import { runConformance } from '../src/testing/conformance.js';
import type { QuestionGenerator } from '../src/core/generator.js';

const modules = process.argv.slice(2);
let total = 0;
for (const m of modules) {
  const mod = (await import(m)) as Record<string, unknown>;
  const gens = (mod['default'] ?? []) as QuestionGenerator[];
  for (const g of gens) {
    const f = runConformance(g, { seeds: 40 });
    total += f.length;
    console.log(`${f.length === 0 ? 'PASS' : 'FAIL'} ${g.id} (${f.length})`);
    for (const x of f.slice(0, 3)) console.log(`     seed ${x.seed} [${x.check}] ${x.detail}`);
  }
}
console.log(total === 0 ? 'ALL PASS' : `TOTAL FAILURES ${total}`);
