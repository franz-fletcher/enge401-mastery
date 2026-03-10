export interface Step {
  id: string;
  number: number;
  title: string;
  explanation: string;
  expression: string;      // LaTeX formatted
  changeType: ChangeType;
  beforeState: string;     // Previous expression
  afterState: string;      // Current expression
  substeps?: Step[];       // Optional nested steps
  metadata?: {
    rule?: string;
    formula?: string;
  };
}

export type ChangeType = 
  | 'INITIAL_STATE'
  | 'SUBTRACT_FROM_BOTH_SIDES'
  | 'DIVIDE_BOTH_SIDES'
  | 'APPLY_QUADRATIC_FORMULA'
  | 'SIMPLIFY_DISCRIMINANT'
  | 'CALCULATE_SQUARE_ROOT'
  | 'CALCULATE_SOLUTIONS'
  | 'IDENTIFY_COEFFICIENTS'
  | 'SUBSTITUTE_VALUES'
  | 'COMBINE_LIKE_TERMS'
  | 'DISTRIBUTE'
  | 'FACTOR'
  | 'APPLY_POWER_RULE'
  | 'APPLY_PRODUCT_RULE'
  | 'APPLY_CHAIN_RULE'
  | 'APPLY_QUOTIENT_RULE'
  | 'INTEGRATE_BY_SUBSTITUTION'
  | 'INTEGRATE_BY_PARTS'
  | 'APPLY_TRIG_IDENTITY'
  | 'SIMPLIFY_TRIG_EXPRESSION'
  | 'APPLY_EXPONENT_RULE'
  | 'TAKE_NATURAL_LOG'
  | 'SEPARATE_VARIABLES'
  | 'INTEGRATE_BOTH_SIDES'
  | 'APPLY_INITIAL_CONDITION';

export interface Solution {
  exerciseId: string;
  steps: Step[];
  finalAnswer: string;
  totalSteps: number;
}

export interface Exercise {
  id: string;
  chapter: number;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  answer: string | number;
  hints?: string[];
}

export interface StepSolver {
  canSolve(exercise: Exercise): boolean;
  solve(exercise: Exercise): Solution;
}

export class SolverError extends Error {
  constructor(
    message: string,
    public readonly exerciseId: string,
    public readonly stepNumber?: number
  ) {
    super(message);
    this.name = 'SolverError';
  }
}
