import { simplify, parse } from 'mathjs';
import Algebrite from 'algebrite';

/**
 * Chapter 1: Algebra
 * Equation solving, simplification, quadratic formula
 */

/**
 * Solves ax + b = c, returns x = (c - b) / a
 */
export function solveLinearEquation(a: number, b: number, c: number): number {
  if (a === 0) throw new Error('Coefficient a must not be zero');
  return (c - b) / a;
}

/**
 * Solves ax² + bx + c = 0 using the quadratic formula.
 * Returns [x1, x2] sorted descending, or null for no real roots.
 */
export function solveQuadratic(
  a: number,
  b: number,
  c: number,
): [number, number] | null {
  const discriminant = b * b - 4 * a * c;
  if (discriminant < 0) return null;
  const sqrtD = Math.sqrt(discriminant);
  const x1 = (-b + sqrtD) / (2 * a);
  const x2 = (-b - sqrtD) / (2 * a);
  return [x1, x2];
}

/**
 * Simplifies a mathematical expression string using mathjs.
 */
export function simplifyExpression(expr: string): string {
  return simplify(expr).toString();
}

/**
 * Expands a product expression using mathjs parse + simplify.
 */
export function expandExpression(expr: string): string {
  // mathjs simplify with expand rules
  const rules = ['n1*(n2+n3) -> n1*n2+n1*n3'];
  try {
    return simplify(expr, rules).toString();
  } catch {
    return parse(expr).toString();
  }
}

/**
 * Factors an expression using Algebrite.
 */
export function factorExpression(expr: string): string {
  return Algebrite.run(`factor(${expr})`);
}
