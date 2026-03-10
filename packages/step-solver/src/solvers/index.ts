import type { Exercise, Solution, StepSolver } from '../types.js';
import { SolverError } from '../types.js';
import { LinearEquationSolver, QuadraticEquationSolver } from './algebra/index.js';
import { trigSolvers } from './trig/index.js';
import { differentiationSolvers } from './differentiation/index.js';
import { integrationSolvers } from './integration/index.js';
import { exponentialSolvers } from './exponentials/index.js';
import { differentialEquationSolvers } from './diffeq/index.js';

// Registry of all available solvers
export const solvers: StepSolver[] = [
  new LinearEquationSolver(),
  new QuadraticEquationSolver(),
  ...trigSolvers,
  ...differentiationSolvers,
  ...integrationSolvers,
  ...exponentialSolvers,
  ...differentialEquationSolvers,
];

/**
 * Find a solver that can handle the given exercise
 * @param exercise - The exercise to solve
 * @returns The first solver that can handle the exercise, or null if none found
 */
export function findSolver(exercise: Exercise): StepSolver | null {
  return solvers.find(solver => solver.canSolve(exercise)) || null;
}

/**
 * Solve an exercise using the appropriate solver
 * @param exercise - The exercise to solve
 * @returns The solution with step-by-step breakdown
 * @throws SolverError if no solver is available for the exercise type
 */
export function solveExercise(exercise: Exercise): Solution {
  const solver = findSolver(exercise);
  if (!solver) {
    throw new SolverError(
      `No solver available for exercise type: ${exercise.topic}. ` +
      `Supported types: linear equations, quadratic equations.`,
      exercise.id
    );
  }
  return solver.solve(exercise);
}

/**
 * Check if a solver is available for the given exercise
 * @param exercise - The exercise to check
 * @returns true if a solver is available
 */
export function canSolve(exercise: Exercise): boolean {
  return findSolver(exercise) !== null;
}

// Re-export solver classes for direct use
export { LinearEquationSolver, QuadraticEquationSolver };
export { UnitCircleSolver } from './trig/index.js';
export { IntegrationSolver } from './integration/index.js';
export { EulerMethodSolver } from './diffeq/index.js';
