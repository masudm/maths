/**
 * Parser for the algebra students actually type.
 *
 * Deliberately permissive about the things a keyboard makes awkward and an examiner would
 * never penalise: implicit multiplication (3x, 2(x+1), xy), "root3" and "sqrt(3)", "pi",
 * ">=" for the inequality signs, and unicode minus / times characters.
 */
import { Rational } from '../rational.js';
import { add, mul, num, pow, rel, sym, fn, type Expr, type RelOp } from './ast.js';

type Token =
  | { t: 'num'; v: Rational }
  | { t: 'ident'; v: string }
  | { t: 'op'; v: string }
  | { t: 'lparen' }
  | { t: 'rparen' }
  | { t: 'comma' };

const KNOWN_FUNCTIONS = new Set(['sqrt', 'cbrt', 'abs', 'sin', 'cos', 'tan', 'ln', 'log']);

function normaliseInput(src: string): string {
  return src
    .replace(/−/g, '-')
    .replace(/[×⋅]/g, '*')
    .replace(/÷/g, '/')
    .replace(/≤/g, '<=')
    .replace(/≥/g, '>=')
    .replace(/√/g, 'sqrt')
    .replace(/π/g, 'pi')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokenize(src: string): Token[] {
  const s = normaliseInput(src);
  const out: Token[] = [];
  let i = 0;
  while (i < s.length) {
    const c = s[i]!;
    if (c === ' ') {
      i++;
      continue;
    }
    if (/[0-9]/.test(c) || (c === '.' && /[0-9]/.test(s[i + 1] ?? ''))) {
      let j = i;
      while (j < s.length && /[0-9.]/.test(s[j]!)) j++;
      out.push({ t: 'num', v: Rational.fromDecimal(s.slice(i, j)) });
      i = j;
      continue;
    }
    if (/[a-zA-Z]/.test(c)) {
      let j = i;
      while (j < s.length && /[a-zA-Z]/.test(s[j]!)) j++;
      let word = s.slice(i, j);
      // "root3" and "root(3)" are both common student spellings of a surd.
      if (/^root/i.test(word) && word.length > 4) {
        out.push({ t: 'ident', v: 'sqrt' });
        out.push({ t: 'lparen' });
        out.push({ t: 'ident', v: word.slice(4) });
        out.push({ t: 'rparen' });
        i = j;
        continue;
      }
      if (/^root$/i.test(word)) word = 'sqrt';
      // A run of letters that is not a known function is a product of single-letter symbols (xy).
      if (KNOWN_FUNCTIONS.has(word) || word === 'pi') {
        out.push({ t: 'ident', v: word });
      } else {
        for (const ch of word) out.push({ t: 'ident', v: ch });
      }
      i = j;
      continue;
    }
    if (s.startsWith('<=', i) || s.startsWith('>=', i)) {
      out.push({ t: 'op', v: s.slice(i, i + 2) });
      i += 2;
      continue;
    }
    if ('+-*/^=<>'.includes(c)) {
      out.push({ t: 'op', v: c });
      i++;
      continue;
    }
    if (c === '(' || c === '[') {
      out.push({ t: 'lparen' });
      i++;
      continue;
    }
    if (c === ')' || c === ']') {
      out.push({ t: 'rparen' });
      i++;
      continue;
    }
    if (c === ',') {
      out.push({ t: 'comma' });
      i++;
      continue;
    }
    throw new Error(`parseExpression: unexpected character "${c}" in "${src}"`);
  }
  return out;
}

class Parser {
  private pos = 0;
  constructor(private readonly tokens: Token[], private readonly src: string) {}

  private peek(): Token | undefined {
    return this.tokens[this.pos];
  }
  private eat(): Token {
    const t = this.tokens[this.pos];
    if (!t) throw new Error(`parseExpression: unexpected end of "${this.src}"`);
    this.pos++;
    return t;
  }
  private isOp(v: string): boolean {
    const t = this.peek();
    return !!t && t.t === 'op' && t.v === v;
  }

  parse(): Expr {
    const e = this.relation();
    if (this.pos !== this.tokens.length) {
      throw new Error(`parseExpression: trailing input in "${this.src}"`);
    }
    return e;
  }

  private relation(): Expr {
    const lhs = this.sum();
    const t = this.peek();
    if (t && t.t === 'op' && ['=', '<', '>', '<=', '>='].includes(t.v)) {
      this.eat();
      const rhs = this.sum();
      return rel(t.v as RelOp, lhs, rhs);
    }
    return lhs;
  }

  private sum(): Expr {
    const args: Expr[] = [];
    let negateFirst = false;
    if (this.isOp('-')) {
      this.eat();
      negateFirst = true;
    } else if (this.isOp('+')) {
      this.eat();
    }
    let first = this.product();
    if (negateFirst) first = mul(num(Rational.of(-1n)), first);
    args.push(first);
    for (;;) {
      if (this.isOp('+')) {
        this.eat();
        args.push(this.product());
      } else if (this.isOp('-')) {
        this.eat();
        args.push(mul(num(Rational.of(-1n)), this.product()));
      } else break;
    }
    return args.length === 1 ? args[0]! : add(...args);
  }

  private product(): Expr {
    const args: Expr[] = [this.power()];
    for (;;) {
      if (this.isOp('*')) {
        this.eat();
        args.push(this.power());
        continue;
      }
      if (this.isOp('/')) {
        this.eat();
        args.push(pow(this.power(), num(Rational.of(-1n))));
        continue;
      }
      // Implicit multiplication: 3x, 2(x+1), (x+1)(x-1), 2pi.
      const t = this.peek();
      if (t && (t.t === 'num' || t.t === 'ident' || t.t === 'lparen')) {
        args.push(this.power());
        continue;
      }
      break;
    }
    return args.length === 1 ? args[0]! : mul(...args);
  }

  private power(): Expr {
    const base = this.atom();
    if (this.isOp('^')) {
      this.eat();
      // Right-associative, and a unary minus binds into the exponent: x^-2.
      let neg = false;
      if (this.isOp('-')) {
        this.eat();
        neg = true;
      }
      const exp = this.power();
      return pow(base, neg ? mul(num(Rational.of(-1n)), exp) : exp);
    }
    return base;
  }

  private atom(): Expr {
    // A sign directly after an operator, e.g. "3 + -2" or "2*(x + -4)". Students type this
    // and generated source produces it, so it is accepted rather than rejected.
    if (this.isOp('-')) {
      this.eat();
      return mul(num(Rational.of(-1n)), this.power());
    }
    if (this.isOp('+')) {
      this.eat();
      return this.power();
    }
    const t = this.eat();
    if (t.t === 'num') return num(t.v);
    if (t.t === 'lparen') {
      const e = this.sum();
      const close = this.eat();
      if (close.t !== 'rparen') throw new Error(`parseExpression: expected ")" in "${this.src}"`);
      return e;
    }
    if (t.t === 'ident') {
      if (KNOWN_FUNCTIONS.has(t.v)) {
        const open = this.peek();
        if (open && open.t === 'lparen') {
          this.eat();
          const args: Expr[] = [this.sum()];
          for (;;) {
            const n = this.peek();
            if (n && n.t === 'comma') {
              this.eat();
              args.push(this.sum());
            } else break;
          }
          const close = this.eat();
          if (close.t !== 'rparen') {
            throw new Error(`parseExpression: expected ")" in "${this.src}"`);
          }
          return fn(t.v, ...args);
        }
        // "sqrt 3" without brackets applies to the next atom.
        return fn(t.v, this.power());
      }
      return sym(t.v);
    }
    throw new Error(`parseExpression: unexpected token in "${this.src}"`);
  }
}

export function parseExpression(src: string): Expr {
  const tokens = tokenize(src);
  if (tokens.length === 0) throw new Error('parseExpression: empty input');
  return new Parser(tokens, src).parse();
}

export function tryParseExpression(src: string): Expr | null {
  try {
    return parseExpression(src);
  } catch {
    return null;
  }
}
