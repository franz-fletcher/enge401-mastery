import type { StepSolver } from '../../types.js';
import { IntegrationSolver } from './power-rule.js';

export const integrationSolvers: StepSolver[] = [new IntegrationSolver()];
export { IntegrationSolver };
