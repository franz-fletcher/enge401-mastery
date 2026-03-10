/**
 * Exponential and logarithmic equation solvers
 */

import type { StepSolver } from '../../types.js';
import { ExponentialEquationSolver } from './exponential-equation.js';

export { ExponentialEquationSolver } from './exponential-equation.js';

// Registry of exponential/logarithmic solvers
export const exponentialSolvers: StepSolver[] = [
  new ExponentialEquationSolver(),
];
