// Core types
export * from './types.js';

// Solver registry and implementations
export * from './solvers/index.js';

// Utilities
export { StepBuilder } from './utils/step-builder.js';

// Expression tree utilities
export {
  parseLinearEquation,
  parseQuadraticEquation,
  formatNumber,
  formatCoefficient,
} from './utils/expression-tree.js';

// LaTeX formatter utilities
export {
  formatLinearEquation,
  formatQuadraticEquation,
  formatQuadraticFormula,
  formatSolution,
  formatTwoSolutions,
} from './utils/latex-formatter.js';

// Differential equation utilities
export {
  parseDiffEqQuestion,
  calculateEulerSteps,
} from './solvers/diffeq/euler-method.js';

// Solver classes
export { IntegrationSolver } from './solvers/integration/index.js';
export { EulerMethodSolver } from './solvers/diffeq/index.js';
