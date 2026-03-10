/**
 * Differentiation solvers
 *
 * Provides solvers for:
 * - Power rule
 * - Product rule
 * - Quotient rule
 * - Chain rule
 * - Trigonometric derivatives
 * - Exponential and logarithmic derivatives
 */

import type { StepSolver } from '../../types.js';
import { DifferentiationSolver } from './power-rule.js';

// Export the solver class for direct use
export { DifferentiationSolver } from './power-rule.js';

// Registry of differentiation solvers
export const differentiationSolvers: StepSolver[] = [
  new DifferentiationSolver(),
];
