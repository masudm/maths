/**
 * Student input -> MathValue.
 *
 * Written to be forgiving in exactly the ways examiners are forgiving. A student who types
 * "3/4", "0.75", "75%" or "  0.750  " has given the same answer, and none of those spellings
 * should cost a mark. Ambiguity is resolved by the expected kind: "3 : 5" is a ratio when a
 * ratio is expected, and 3 divided by 5 is never inferred from that spelling.
 */
import { Exact } from './exact.js';
import { Rational, rat } from './rational.js';
import { tryParseExpression } from './expression/parse.js';
import {
  decimalValue,
  exactValue,
  pointValue,
  ratioValue,
  setValue,
  textValue,
  vectorValue,
  type MathValue,
} from './value.js';

const UNIT_PATTERN =
  /\s*(cm|mm|km|m|kg|g|ml|litres|litre|l|hours|hour|hrs|h|minutes|minute|mins|min|seconds|secs|s|degrees|deg|people|days|years|units?|square units?|cm2|cm3|m2|m3|cm\^2|cm\^3|m\^2|m\^3|km\/h|m\/s|mph|g\/cm3|£|\$|p|%)\s*$/i;

export interface ParsedResponse {
  /** Best-effort interpretation of the raw text. */
  value: MathValue | null;
  /** The unit or currency symbol the student wrote, if any. */
  unit: string | null;
  /** The number of decimal places written, for accuracy checks. */
  decimalPlaces: number | null;
  raw: string;
}

function stripCurrency(text: string): { body: string; unit: string | null } {
  let t = text.trim();
  let unit: string | null = null;
  const currency = /^([£$€])\s*/.exec(t);
  if (currency) {
    unit = currency[1]!;
    t = t.slice(currency[0].length).trim();
  }
  const trailing = UNIT_PATTERN.exec(t);
  if (trailing) {
    unit = unit ?? trailing[1]!;
    t = t.slice(0, trailing.index).trim();
  }
  return { body: t, unit };
}

function countDecimalPlaces(text: string): number | null {
  const m = /^[+-]?\d*\.(\d+)$/.exec(text.replace(/[\s,]/g, ''));
  return m ? m[1]!.length : null;
}

/** "2root3", "5pi", "3/4", "0.75", "-2" -> an exact value, when the text is purely numeric. */
function parseExactNumeric(text: string): Exact | null {
  const t = text.replace(/\s+/g, '').replace(/,/g, '');
  if (t === '') return null;

  // Surd forms: 2root3, root12, -3root5, 2sqrt(3)
  const surd = /^([+-]?\d*(?:\.\d+)?)(?:root|sqrt)\(?(\d+)\)?$/i.exec(t);
  if (surd) {
    const coeffText = surd[1]!;
    const coeff =
      coeffText === '' || coeffText === '+'
        ? Rational.ONE
        : coeffText === '-'
          ? Rational.of(-1n)
          : Rational.fromDecimal(coeffText);
    return Exact.surd(coeff, BigInt(surd[2]!));
  }

  // Fractional surd: root3/2, 2root3/3
  const surdFraction = /^([+-]?\d*(?:\.\d+)?)(?:root|sqrt)\(?(\d+)\)?\/(\d+)$/i.exec(t);
  if (surdFraction) {
    const coeffText = surdFraction[1]!;
    const coeff =
      coeffText === '' || coeffText === '+'
        ? Rational.ONE
        : coeffText === '-'
          ? Rational.of(-1n)
          : Rational.fromDecimal(coeffText);
    return Exact.surd(coeff.div(rat(BigInt(surdFraction[3]!))), BigInt(surdFraction[2]!));
  }

  // Multiples of pi: 9pi, pi, -2pi, 3pi/4
  const pi = /^([+-]?\d*(?:\.\d+)?)pi(?:\/(\d+))?$/i.exec(t);
  if (pi) {
    const coeffText = pi[1]!;
    let coeff =
      coeffText === '' || coeffText === '+'
        ? Rational.ONE
        : coeffText === '-'
          ? Rational.of(-1n)
          : Rational.fromDecimal(coeffText);
    if (pi[2]) coeff = coeff.div(rat(BigInt(pi[2])));
    return Exact.pi(coeff);
  }

  // Percentage
  const pct = /^([+-]?\d+(?:\.\d+)?)%$/.exec(t);
  if (pct) return Exact.rational(Rational.fromDecimal(pct[1]!).div(rat(100)));

  // Mixed number: "3 1/2" (spaces already stripped, so match digit-fraction)
  const mixed = /^([+-]?\d+)_(\d+)\/(\d+)$/.exec(t);
  if (mixed) {
    const whole = Rational.fromDecimal(mixed[1]!);
    const frac = rat(BigInt(mixed[2]!), BigInt(mixed[3]!));
    return Exact.rational(whole.isNegative() ? whole.sub(frac) : whole.add(frac));
  }

  // Fraction
  const frac = /^([+-]?\d+(?:\.\d+)?)\/([+-]?\d+(?:\.\d+)?)$/.exec(t);
  if (frac) {
    const a = Rational.fromDecimal(frac[1]!);
    const b = Rational.fromDecimal(frac[2]!);
    if (b.isZero()) return null;
    return Exact.rational(a.div(b));
  }

  // Plain decimal or integer
  if (/^[+-]?(\d+(\.\d*)?|\.\d+)$/.test(t)) {
    return Exact.rational(Rational.fromDecimal(t));
  }
  return null;
}

export type ExpectKind = MathValue['kind'] | 'auto';

/** Parse a raw student answer, guided by the kind of value expected. */
export function parseResponse(raw: string, expect: ExpectKind = 'auto'): ParsedResponse {
  const trimmed = (raw ?? '').trim();
  const result: ParsedResponse = {
    value: null,
    unit: null,
    decimalPlaces: null,
    raw: trimmed,
  };
  if (trimmed === '') return result;

  const { body, unit } = stripCurrency(trimmed);
  result.unit = unit;
  result.decimalPlaces = countDecimalPlaces(body);

  const mixedSpaced = /^([+-]?\d+)\s+(\d+)\/(\d+)$/.exec(body);
  const normalisedBody = mixedSpaced
    ? `${mixedSpaced[1]}_${mixedSpaced[2]}/${mixedSpaced[3]}`
    : body;

  if (expect === 'text') {
    result.value = textValue(body);
    return result;
  }

  if (expect === 'choice') {
    result.value = { kind: 'choice', value: body };
    return result;
  }

  if (expect === 'ratio' || (expect === 'auto' && /^[^:]+(:[^:]+)+$/.test(body))) {
    const parts = body.split(':').map((p) => p.trim());
    const parsed = parts.map((p) => parseExactNumeric(p)?.asRational() ?? null);
    if (parsed.every((p): p is Rational => p !== null) && parsed.length >= 2) {
      result.value = ratioValue(...parsed);
      return result;
    }
  }

  if (expect === 'point' || expect === 'vector') {
    const inner = /^\(?\s*(.+?)\s*\)?$/.exec(body)?.[1] ?? body;
    const parts = inner.split(',').map((p) => p.trim());
    const parsed = parts.map((p) => parseExactNumeric(p)?.asRational() ?? null);
    if (parsed.every((p): p is Rational => p !== null) && parsed.length >= 2) {
      result.value = expect === 'point' ? pointValue(...parsed) : vectorValue(...parsed);
      return result;
    }
  }

  if (expect === 'set') {
    const parts = body
      .replace(/^\{|\}$/g, '')
      .split(/\s*(?:,|\band\b|;)\s*/i)
      .map((p) => p.trim())
      .filter((p) => p !== '');
    if (parts.length > 1) {
      const items = parts.map((p) => parseResponse(p, 'auto').value);
      if (items.every((i): i is MathValue => i !== null)) {
        result.value = setValue(items, false);
        return result;
      }
    }
  }

  const exact = parseExactNumeric(normalisedBody);
  if (exact && expect !== 'expression') {
    result.value =
      expect === 'decimal' ? decimalValue(exact.toNumber()) : exactValue(exact);
    return result;
  }

  const expr = tryParseExpression(body);
  if (expr) {
    result.value = { kind: 'expression', expr, source: body };
    return result;
  }

  // Nothing numeric or algebraic parsed; treat it as prose so reason marks can still match.
  result.value = textValue(body);
  return result;
}
