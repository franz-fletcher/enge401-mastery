/**
 * Trigonometric equation solvers
 * 
 * Provides solvers for:
 * - Unit circle exact values (sin, cos, tan for standard angles)
 * 
 * TODO: Implement additional solvers for:
 * - Basic trig equations (sin(x) = a, cos(x) = a, tan(x) = a)
 * - Trig identities
 * - Inverse trig functions
 */

import type { StepSolver } from '../../types.js';
import { UnitCircleSolver } from './unit-circle.js';

export { UnitCircleSolver } from './unit-circle.js';

// Registry of trigonometry solvers
export const trigSolvers: StepSolver[] = [
  new UnitCircleSolver(),
];
