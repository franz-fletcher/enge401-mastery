/**
 * Differential equation solvers
 * 
 * Currently implemented:
 * - Euler's method for first-order ODEs
 * 
 * TODO: Implement solvers for:
 * - Separable equations
 * - First-order linear ODEs
 * - Second-order linear ODEs with constant coefficients
 * - Initial value problems (analytical solutions)
 */

import type { StepSolver } from '../../types.js';
import { EulerMethodSolver, parseDiffEqQuestion, calculateEulerSteps } from './euler-method.js';

export const differentialEquationSolvers: StepSolver[] = [
  new EulerMethodSolver(),
];

export { EulerMethodSolver, parseDiffEqQuestion, calculateEulerSteps };
