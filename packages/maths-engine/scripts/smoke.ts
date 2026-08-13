import { n1Ordering } from '../src/generators/number/n01.js';
import { mark } from '../src/core/marker.js';
import { contentToText } from '../src/core/question.js';
import { displayValue } from '../src/core/value.js';
import { runConformance } from '../src/testing/conformance.js';

const q = n1Ordering.generate(7);
console.log('Q:', contentToText(q.content));
console.log('A:', displayValue(q.slots[0]!.expect));
console.log('mark(model):', JSON.stringify(mark(q, { slots: { answer: displayValue(q.slots[0]!.expect) } })));
console.log('mark(wrong):', JSON.stringify(mark(q, { slots: { answer: '1, 2, 3, 4, 5' } })));
const f = runConformance(n1Ordering, { seeds: 30 });
console.log('conformance failures:', f.length, JSON.stringify(f.slice(0, 4), null, 1));
