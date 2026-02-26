import Algebrite from 'algebrite';

/**
 * Chapter 3: Exponential & Logarithmic Functions
 * log/exp rules, growth/decay
 */

/**
 * Simplifies an exponential/logarithmic expression using Algebrite.
 */
export function simplifyExponential(expr: string): string {
  return Algebrite.run(`simplify(${expr})`);
}

/**
 * Solves an exponential equation of the form a^x = b, returning x = log(b) / log(a).
 * The expr should be in the form "a^x = b" or just provide a and b directly.
 */
export function solveExponentialEquation(base: number, result: number): number {
  if (base <= 0 || base === 1) throw new Error('Base must be positive and not 1');
  if (result <= 0) throw new Error('Result must be positive');
  return Math.log(result) / Math.log(base);
}

/**
 * Calculates compound growth/interest.
 * A = P(1 + r/n)^(nt)  or  A = Pe^(rt) when compoundings = Infinity (continuous)
 *
 * @param principal - Initial amount
 * @param rate - Annual interest/growth rate (decimal, e.g. 0.05 for 5%)
 * @param time - Time in years
 * @param compoundings - Number of compounding periods per year (default 1, Infinity for continuous)
 */
export function compoundGrowth(
  principal: number,
  rate: number,
  time: number,
  compoundings: number = 1,
): number {
  if (!isFinite(compoundings)) {
    // Continuous compounding: A = Pe^(rt)
    return principal * Math.exp(rate * time);
  }
  return principal * Math.pow(1 + rate / compoundings, compoundings * time);
}
