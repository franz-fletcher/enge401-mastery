import Algebrite from 'algebrite';
import { evaluate } from 'mathjs';

/**
 * Chapter 5: Integration
 * Antiderivatives, substitution, by parts
 */

/**
 * Computes the indefinite integral of an expression using Algebrite.
 * Returns the antiderivative as a string (constant of integration not included).
 */
export function integrate(expr: string, variable: string = 'x'): string {
  return Algebrite.run(`integral(${expr}, ${variable})`);
}

/**
 * Evaluates a definite integral numerically using Simpson's rule as fallback
 * and Algebrite for exact evaluation when possible.
 */
export function definiteIntegral(
  expr: string,
  lower: number,
  upper: number,
  variable: string = 'x',
): number {
  // Try Algebrite exact evaluation
  const result = Algebrite.run(
    `defint(${expr}, ${variable}, ${lower}, ${upper})`,
  );
  try {
    const parsed = evaluate(result) as number;
    if (typeof parsed === 'number' && isFinite(parsed)) return parsed;
  } catch {
    // fall through to numerical
  }

  // Fallback: numerical integration using Simpson's rule
  return simpsonRule(expr, variable, lower, upper, 1000);
}

/**
 * Numerical integration using Simpson's 1/3 rule.
 */
function simpsonRule(
  expr: string,
  variable: string,
  lower: number,
  upper: number,
  n: number,
): number {
  if (n % 2 !== 0) n += 1;
  const h = (upper - lower) / n;
  let sum = evalAt(expr, variable, lower) + evalAt(expr, variable, upper);

  for (let i = 1; i < n; i++) {
    const x = lower + i * h;
    sum += (i % 2 === 0 ? 2 : 4) * evalAt(expr, variable, x);
  }
  return (h / 3) * sum;
}

function evalAt(expr: string, variable: string, value: number): number {
  const js = expr
    .replace(new RegExp(`\\b${variable}\\b`, 'g'), `(${value})`)
    .replace(/\^/g, '**');
  // eslint-disable-next-line no-new-func
  return Function(`"use strict"; return (${js});`)() as number;
}

/**
 * Performs integration by substitution.
 * Returns the integral of expr after substituting `substitution` for the inner expression.
 * substitution should be in the form "u = f(x)".
 */
export function integrateBySubstitution(
  expr: string,
  substitution: string,
): string {
  // Parse substitution "u = f(x)" => replace f(x) with u in expr, integrate, substitute back
  const match = substitution.match(/^(\w+)\s*=\s*(.+)$/);
  if (!match) throw new Error('Substitution must be in the form "u = f(x)"');
  const [, u, fx] = match;
  const substituted = expr.replace(new RegExp(fx.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), u);
  const integrated = Algebrite.run(`integral(${substituted}, ${u})`);
  // Substitute back
  return integrated.replace(new RegExp(`\\b${u}\\b`, 'g'), `(${fx})`);
}
