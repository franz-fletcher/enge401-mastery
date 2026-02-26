import { derivative, parse, simplify } from 'mathjs';

/**
 * Chapter 4: Differentiation
 * Power, product, quotient, chain rules
 */

/**
 * General derivative of an expression with respect to a variable.
 */
export function differentiate(expr: string, variable: string = 'x'): string {
  return derivative(expr, variable).toString();
}

/**
 * Applies the power rule to a term of the form ax^n and returns the derivative string.
 * Handles expressions that mathjs can differentiate.
 */
export function powerRuleDerivative(expr: string): string {
  return differentiate(expr, 'x');
}

/**
 * Applies the product rule: d/dx[u*v] = u'v + uv'
 */
export function productRuleDerivative(u: string, v: string): string {
  const uPrime = differentiate(u, 'x');
  const vPrime = differentiate(v, 'x');
  return simplify(`(${uPrime}) * (${v}) + (${u}) * (${vPrime})`).toString();
}

/**
 * Applies the chain rule: d/dx[outer(inner)] = outer'(inner) * inner'
 * outer should be expressed in terms of 'u', inner in terms of 'x'.
 */
export function chainRuleDerivative(outer: string, inner: string): string {
  // Derivative of outer w.r.t. u, then substitute inner for u
  const outerPrime = differentiate(outer, 'u');
  const innerPrime = differentiate(inner, 'x');

  // Replace 'u' with inner expression in outerPrime
  const substituted = outerPrime.replace(/\bu\b/g, `(${inner})`);
  return simplify(`(${substituted}) * (${innerPrime})`).toString();
}

/**
 * Computes the nth derivative of an expression.
 */
export function nthDerivative(expr: string, n: number, variable: string = 'x'): string {
  let result = expr;
  for (let i = 0; i < n; i++) {
    result = derivative(result, variable).toString();
  }
  return result;
}

/**
 * Applies the quotient rule: d/dx[u/v] = (u'v - uv') / v²
 */
export function quotientRuleDerivative(u: string, v: string): string {
  const uPrime = differentiate(u, 'x');
  const vPrime = differentiate(v, 'x');
  return simplify(
    `((${uPrime}) * (${v}) - (${u}) * (${vPrime})) / ((${v})^2)`,
  ).toString();
}
