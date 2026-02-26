import Algebrite from 'algebrite';

/**
 * Chapter 6: Differential Equations
 * First-order ODE, Euler's method, separable equations
 */

export interface EulerStep {
  x: number;
  y: number;
}

/**
 * Solves a first-order ODE numerically using Euler's method.
 * dy/dx = f(x, y), with initial condition (x0, y0).
 *
 * @param f - The right-hand side function f(x, y)
 * @param x0 - Initial x value
 * @param y0 - Initial y value
 * @param h - Step size
 * @param steps - Number of steps
 * @returns Array of {x, y} pairs representing the solution
 */
export function eulerMethod(
  f: (x: number, y: number) => number,
  x0: number,
  y0: number,
  h: number,
  steps: number,
): EulerStep[] {
  const result: EulerStep[] = [{ x: x0, y: y0 }];
  let x = x0;
  let y = y0;
  for (let i = 0; i < steps; i++) {
    y = y + h * f(x, y);
    x = x + h;
    result.push({ x, y });
  }
  return result;
}

/**
 * Attempts to solve a separable ODE of the form dy/dx = g(x) (y-independent).
 * Returns the general solution y = integral(g(x)) dx + C.
 */
export function solveSeparable(expr: string): string {
  const integral = Algebrite.run(`integral(${expr}, x)`);
  return `y = ${integral} + C`;
}

/**
 * Solves a first-order linear ODE: dy/dx + P(x)*y = Q(x)
 * Uses the integrating factor method: μ = e^(∫P dx)
 *
 * @param p - P(x) as a string expression
 * @param q - Q(x) as a string expression
 * @returns General solution as a string
 */
export function solveFirstOrderLinear(p: string, q: string): string {
  const integralP = Algebrite.run(`integral(${p}, x)`);
  const mu = `exp(${integralP})`;
  const rhs = Algebrite.run(`integral((${mu}) * (${q}), x)`);
  return `y = (${rhs} + C) / (${mu})`;
}
