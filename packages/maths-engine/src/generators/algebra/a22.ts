/**
 * A22 - Solve linear inequalities and represent the solution set on a number line.
 *
 * The second part tests the open-circle / closed-circle convention, which is where the mark
 * is actually lost in the published papers.
 */
import { boardsFor, choiceValue, defineGenerator, draft, expr, fig, figure, intValue, math, signed, slot, text } from '../kit.js';

export const a22SolveInequality = defineGenerator(
  {
    id: 'A22.solve-and-represent-inequality',
    ref: 'A22',
    title: 'Solve a linear inequality and identify its number line',
    strand: 'algebra',
    tiers: ['F+'],
    ao: 'AO1',
    marks: 3,
    calculator: 'non-calc',
    boards: boardsFor('A22'),
  },
  (rng) => {
    const a = rng.int(2, 6);
    const x = rng.int(-4, 9);
    const b = rng.intNonZero(-9, 9);
    const c = a * x + b;
    const strict = rng.bool();
    const direction = rng.bool() ? 'right' : 'left';
    const symbol = direction === 'right' ? (strict ? '>' : '>=') : strict ? '<' : '<=';
    const latexSymbol = direction === 'right' ? (strict ? '>' : '\\geqslant') : strict ? '<' : '\\leqslant';

    const correct = fig.inequalityNumberLine(x, direction, strict);
    const wrongCircle = fig.inequalityNumberLine(x, direction, !strict);
    const wrongDirection = fig.inequalityNumberLine(x, direction === 'right' ? 'left' : 'right', strict);
    const options = rng.shuffle([
      { figure: correct, key: 'correct' },
      { figure: wrongCircle, key: 'circle' },
      { figure: wrongDirection, key: 'direction' },
    ]);
    const letters = ['A', 'B', 'C'];
    const answerLetter = letters[options.findIndex((o) => o.key === 'correct')]!;

    return draft({
      params: { a, b, c, x, strict, direction, answerLetter },
      content: [
        text('(a) Solve'),
        math(`${a}x ${signed(b)} ${latexSymbol} ${c}`, true),
        slot('inequality'),
        text('(b) Here are three number lines.'),
        ...options.flatMap((o, i) => [text(letters[i]!), figure(o.figure)]),
        text('Write down the letter of the number line that shows your solution set.'),
        slot('diagram'),
      ],
      slots: [
        { id: 'inequality', label: 'solution', expect: expr(`x${symbol}${x}`) },
        { id: 'diagram', label: 'number line', expect: choiceValue(answerLetter) },
      ],
      steps: [
        {
          id: 'm1',
          type: 'M',
          values: [intValue(c - b)],
          note: 'the constant term collected on the right',
        },
        { id: 'a1', type: 'A', values: [expr(`x${symbol}${x}`)], target: { slot: 'inequality' } },
        {
          id: 'b1',
          type: 'B',
          values: [choiceValue(answerLetter)],
          target: { slot: 'diagram' },
          note: 'ft their inequality, with the correct circle and direction',
        },
      ],
      guidance: [
        'An open circle is a strict inequality and a closed circle an included boundary.',
      ],
    });
  },
);

export default [a22SolveInequality];
