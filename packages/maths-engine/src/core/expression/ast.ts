import { Rational } from '../rational.js';

export type RelOp = '=' | '<' | '>' | '<=' | '>=';

export type Expr =
  | { k: 'num'; v: Rational }
  | { k: 'sym'; name: string }
  | { k: 'add'; args: Expr[] }
  | { k: 'mul'; args: Expr[] }
  | { k: 'pow'; base: Expr; exp: Expr }
  | { k: 'fn'; name: string; args: Expr[] }
  | { k: 'rel'; op: RelOp; lhs: Expr; rhs: Expr };

export const num = (v: Rational): Expr => ({ k: 'num', v });
export const sym = (name: string): Expr => ({ k: 'sym', name });
export const add = (...args: Expr[]): Expr => ({ k: 'add', args });
export const mul = (...args: Expr[]): Expr => ({ k: 'mul', args });
export const pow = (base: Expr, exp: Expr): Expr => ({ k: 'pow', base, exp });
export const fn = (name: string, ...args: Expr[]): Expr => ({ k: 'fn', name, args });
export const rel = (op: RelOp, lhs: Expr, rhs: Expr): Expr => ({ k: 'rel', op, lhs, rhs });

/** Every free symbol in the expression, sorted, so two expressions can be probed consistently. */
export function symbols(e: Expr): string[] {
  const out = new Set<string>();
  const walk = (x: Expr): void => {
    switch (x.k) {
      case 'sym':
        out.add(x.name);
        break;
      case 'add':
      case 'mul':
        x.args.forEach(walk);
        break;
      case 'pow':
        walk(x.base);
        walk(x.exp);
        break;
      case 'fn':
        x.args.forEach(walk);
        break;
      case 'rel':
        walk(x.lhs);
        walk(x.rhs);
        break;
      default:
        break;
    }
  };
  walk(e);
  return [...out].sort();
}

export function isRelation(e: Expr): e is Extract<Expr, { k: 'rel' }> {
  return e.k === 'rel';
}

const FUNCTIONS: Record<string, (args: number[]) => number> = {
  sqrt: ([x]) => Math.sqrt(x!),
  cbrt: ([x]) => Math.cbrt(x!),
  abs: ([x]) => Math.abs(x!),
  sin: ([x]) => Math.sin((x! * Math.PI) / 180),
  cos: ([x]) => Math.cos((x! * Math.PI) / 180),
  tan: ([x]) => Math.tan((x! * Math.PI) / 180),
  ln: ([x]) => Math.log(x!),
  log: ([x]) => Math.log10(x!),
};

/** Numeric evaluation, used for equivalence probing. Trig arguments are in degrees, as at GCSE. */
export function evaluate(e: Expr, env: Record<string, number>): number {
  switch (e.k) {
    case 'num':
      return e.v.toNumber();
    case 'sym': {
      if (e.name === 'pi') return Math.PI;
      const v = env[e.name];
      if (v === undefined) throw new Error(`evaluate: unbound symbol "${e.name}"`);
      return v;
    }
    case 'add':
      return e.args.reduce((s, a) => s + evaluate(a, env), 0);
    case 'mul':
      return e.args.reduce((s, a) => s * evaluate(a, env), 1);
    case 'pow':
      return Math.pow(evaluate(e.base, env), evaluate(e.exp, env));
    case 'fn': {
      const f = FUNCTIONS[e.name];
      if (!f) throw new Error(`evaluate: unknown function "${e.name}"`);
      return f(e.args.map((a) => evaluate(a, env)));
    }
    case 'rel':
      // A relation evaluates to the difference, which is what proportionality testing needs.
      return evaluate(e.lhs, env) - evaluate(e.rhs, env);
  }
}

/** Readable round-trip form, mainly for test failure messages. */
export function toText(e: Expr): string {
  switch (e.k) {
    case 'num':
      return e.v.toString();
    case 'sym':
      return e.name;
    case 'add':
      return `(${e.args.map(toText).join(' + ')})`;
    case 'mul':
      return `(${e.args.map(toText).join(' * ')})`;
    case 'pow':
      return `${toText(e.base)}^${toText(e.exp)}`;
    case 'fn':
      return `${e.name}(${e.args.map(toText).join(', ')})`;
    case 'rel':
      return `${toText(e.lhs)} ${e.op} ${toText(e.rhs)}`;
  }
}
