import { describe, it, expect } from 'vitest';
import {
  LinearEquationSolver,
  QuadraticEquationSolver,
  SolverError,
  type Exercise,
} from '../src/index.js';

describe('LinearEquationSolver', () => {
  const solver = new LinearEquationSolver();

  it('should solve 2x + 3 = 7', () => {
    const exercise: Exercise = {
      id: 'test-1',
      chapter: 1,
      topic: 'linear equation',
      difficulty: 'easy',
      question: '2x + 3 = 7',
      answer: 2,
      hints: ['Isolate x', 'Subtract 3 from both sides', 'Divide by 2'],
    };

    const solution = solver.solve(exercise);

    expect(solution.exerciseId).toBe('test-1');
    expect(solution.steps).toHaveLength(4);
    expect(solution.finalAnswer).toBe('2');
    expect(solution.totalSteps).toBe(4);

    // Check step titles
    expect(solution.steps[0].title).toBe('Original Equation');
    expect(solution.steps[1].title).toBe('Subtract from Both Sides');
    expect(solution.steps[2].title).toBe('Divide Both Sides');
    expect(solution.steps[3].title).toBe('Solution');

    // Check expressions contain LaTeX
    expect(solution.steps[0].expression).toContain('2x');
    expect(solution.steps[1].expression).toContain('2x');
    expect(solution.steps[2].expression).toContain('\\frac');
    expect(solution.steps[3].expression).toBe('x = 2');
  });

  it('should solve x = 5', () => {
    const exercise: Exercise = {
      id: 'test-2',
      chapter: 1,
      topic: 'linear equation',
      difficulty: 'easy',
      question: 'x = 5',
      answer: 5,
      hints: [],
    };

    const solution = solver.solve(exercise);

    expect(solution.finalAnswer).toBe('5');
    expect(solution.steps).toHaveLength(3); // Original + Divide + Solution (no subtraction needed)
  });

  it('should solve 3x = 12', () => {
    const exercise: Exercise = {
      id: 'test-3',
      chapter: 1,
      topic: 'linear equation',
      difficulty: 'easy',
      question: '3x = 12',
      answer: 4,
      hints: [],
    };

    const solution = solver.solve(exercise);

    expect(solution.finalAnswer).toBe('4');
    expect(solution.steps).toHaveLength(3); // Original + Divide + Solution
  });

  it('should solve -x + 4 = 2', () => {
    const exercise: Exercise = {
      id: 'test-4',
      chapter: 1,
      topic: 'linear equation',
      difficulty: 'medium',
      question: '-x + 4 = 2',
      answer: 2,
      hints: [],
    };

    const solution = solver.solve(exercise);

    expect(solution.finalAnswer).toBe('2');
  });

  it('should throw error for invalid equation format', () => {
    const exercise: Exercise = {
      id: 'test-error-1',
      chapter: 1,
      topic: 'linear equation',
      difficulty: 'easy',
      question: 'invalid equation',
      answer: 0,
      hints: [],
    };

    expect(() => solver.solve(exercise)).toThrow(SolverError);
    expect(() => solver.solve(exercise)).toThrow('Failed to parse equation');
  });

  it('should throw error for zero coefficient', () => {
    const exercise: Exercise = {
      id: 'test-error-2',
      chapter: 1,
      topic: 'linear equation',
      difficulty: 'easy',
      question: '0x + 3 = 7',
      answer: 0,
      hints: [],
    };

    expect(() => solver.solve(exercise)).toThrow(SolverError);
    expect(() => solver.solve(exercise)).toThrow('coefficient of x is zero');
  });

  it('should return true for canSolve with linear equation topic', () => {
    const exercise: Exercise = {
      id: 'test-can-1',
      chapter: 1,
      topic: 'linear equation',
      difficulty: 'easy',
      question: '2x = 4',
      answer: 2,
      hints: [],
    };

    expect(solver.canSolve(exercise)).toBe(true);
  });

  it('should return false for canSolve with quadratic topic', () => {
    const exercise: Exercise = {
      id: 'test-can-2',
      chapter: 1,
      topic: 'quadratic equation',
      difficulty: 'medium',
      question: 'x^2 = 4',
      answer: 2,
      hints: [],
    };

    expect(solver.canSolve(exercise)).toBe(false);
  });
});

describe('QuadraticEquationSolver', () => {
  const solver = new QuadraticEquationSolver();

  it('should solve x^2 - 5x + 6 = 0', () => {
    const exercise: Exercise = {
      id: 'test-quad-1',
      chapter: 1,
      topic: 'quadratic equation',
      difficulty: 'medium',
      question: 'x^2 - 5x + 6 = 0',
      answer: 'x = 2 or x = 3',
      hints: ['Use quadratic formula', 'Calculate discriminant'],
    };

    const solution = solver.solve(exercise);

    expect(solution.exerciseId).toBe('test-quad-1');
    expect(solution.steps).toHaveLength(8);
    expect(solution.finalAnswer).toContain('2');
    expect(solution.finalAnswer).toContain('3');

    // Check step titles
    expect(solution.steps[0].title).toBe('Original Equation');
    expect(solution.steps[1].title).toBe('Identify Coefficients');
    expect(solution.steps[2].title).toBe('Apply Quadratic Formula');
    expect(solution.steps[3].title).toBe('Substitute Values');
    expect(solution.steps[4].title).toBe('Calculate Discriminant');
    expect(solution.steps[5].title).toBe('Calculate Square Root');
    expect(solution.steps[6].title).toBe('Calculate Solutions');
    expect(solution.steps[7].title).toBe('Final Solutions');

    // Check coefficients step
    expect(solution.steps[1].expression).toContain('a = 1');
    expect(solution.steps[1].expression).toContain('b = -5');
    expect(solution.steps[1].expression).toContain('c = 6');
  });

  it('should solve 2x^2 + 4x - 6 = 0', () => {
    const exercise: Exercise = {
      id: 'test-quad-2',
      chapter: 1,
      topic: 'quadratic equation',
      difficulty: 'medium',
      question: '2x^2 + 4x - 6 = 0',
      answer: 'x = 1 or x = -3',
      hints: [],
    };

    const solution = solver.solve(exercise);

    expect(solution.steps[1].expression).toContain('a = 2');
    expect(solution.steps[1].expression).toContain('b = 4');
    expect(solution.steps[1].expression).toContain('c = -6');
  });

  it('should solve x^2 - 4 = 0', () => {
    const exercise: Exercise = {
      id: 'test-quad-3',
      chapter: 1,
      topic: 'quadratic equation',
      difficulty: 'easy',
      question: 'x^2 - 4 = 0',
      answer: 'x = 2 or x = -2',
      hints: [],
    };

    const solution = solver.solve(exercise);

    expect(solution.steps[1].expression).toContain('a = 1');
    expect(solution.steps[1].expression).toContain('b = 0');
    expect(solution.steps[1].expression).toContain('c = -4');
  });

  it('should throw error for negative discriminant', () => {
    const exercise: Exercise = {
      id: 'test-quad-error-1',
      chapter: 1,
      topic: 'quadratic equation',
      difficulty: 'hard',
      question: 'x^2 + x + 1 = 0',
      answer: 'no real solutions',
      hints: [],
    };

    expect(() => solver.solve(exercise)).toThrow(SolverError);
    expect(() => solver.solve(exercise)).toThrow('discriminant');
    expect(() => solver.solve(exercise)).toThrow('negative');
  });

  it('should throw error for invalid equation format', () => {
    const exercise: Exercise = {
      id: 'test-quad-error-2',
      chapter: 1,
      topic: 'quadratic equation',
      difficulty: 'medium',
      question: 'not a quadratic',
      answer: 0,
      hints: [],
    };

    expect(() => solver.solve(exercise)).toThrow(SolverError);
    expect(() => solver.solve(exercise)).toThrow('Failed to parse quadratic equation');
  });

  it('should throw error for zero a coefficient', () => {
    const exercise: Exercise = {
      id: 'test-quad-error-3',
      chapter: 1,
      topic: 'quadratic equation',
      difficulty: 'medium',
      question: '0x^2 + 2x + 1 = 0',
      answer: 0,
      hints: [],
    };

    expect(() => solver.solve(exercise)).toThrow(SolverError);
    expect(() => solver.solve(exercise)).toThrow('a\' cannot be zero');
  });

  it('should return true for canSolve with quadratic topic', () => {
    const exercise: Exercise = {
      id: 'test-can-quad-1',
      chapter: 1,
      topic: 'quadratic equation',
      difficulty: 'medium',
      question: 'x^2 - 4 = 0',
      answer: 2,
      hints: [],
    };

    expect(solver.canSolve(exercise)).toBe(true);
  });

  it('should return true for canSolve with quadratic topic and x^2 in question', () => {
    const exercise: Exercise = {
      id: 'test-can-quad-2',
      chapter: 1,
      topic: 'quadratic equation',
      difficulty: 'medium',
      question: '2x^2 + 3x = 0',
      answer: 0,
      hints: [],
    };

    expect(solver.canSolve(exercise)).toBe(true);
  });

  it('should return false for canSolve with x^2 but not quadratic topic', () => {
    const exercise: Exercise = {
      id: 'test-can-quad-2b',
      chapter: 1,
      topic: 'equation',
      difficulty: 'medium',
      question: '2x^2 + 3x = 0',
      answer: 0,
      hints: [],
    };

    expect(solver.canSolve(exercise)).toBe(false);
  });

  it('should return false for canSolve with linear equation', () => {
    const exercise: Exercise = {
      id: 'test-can-quad-3',
      chapter: 1,
      topic: 'linear equation',
      difficulty: 'easy',
      question: '2x + 3 = 7',
      answer: 2,
      hints: [],
    };

    expect(solver.canSolve(exercise)).toBe(false);
  });
});

describe('Solver Registry', () => {
  it('should export solver registry functions', async () => {
    const { findSolver, solveExercise, canSolve, solvers } = await import('../src/solvers/index.js');
    
    expect(typeof findSolver).toBe('function');
    expect(typeof solveExercise).toBe('function');
    expect(typeof canSolve).toBe('function');
    expect(Array.isArray(solvers)).toBe(true);
    expect(solvers.length).toBeGreaterThanOrEqual(2);
  });

  it('should find appropriate solver for linear equation', async () => {
    const { findSolver } = await import('../src/solvers/index.js');
    
    const exercise: Exercise = {
      id: 'registry-test-1',
      chapter: 1,
      topic: 'linear equation',
      difficulty: 'easy',
      question: '2x + 3 = 7',
      answer: 2,
      hints: [],
    };

    const solver = findSolver(exercise);
    expect(solver).not.toBeNull();
    expect(solver?.canSolve(exercise)).toBe(true);
  });

  it('should find appropriate solver for quadratic equation', async () => {
    const { findSolver } = await import('../src/solvers/index.js');
    
    const exercise: Exercise = {
      id: 'registry-test-2',
      chapter: 1,
      topic: 'quadratic equation',
      difficulty: 'medium',
      question: 'x^2 - 5x + 6 = 0',
      answer: 'x = 2 or x = 3',
      hints: [],
    };

    const solver = findSolver(exercise);
    expect(solver).not.toBeNull();
    expect(solver?.canSolve(exercise)).toBe(true);
  });

  it('should return null for unsupported exercise type', async () => {
    const { findSolver } = await import('../src/solvers/index.js');
    
    const exercise: Exercise = {
      id: 'registry-test-3',
      chapter: 5,
      topic: 'complex analysis',
      difficulty: 'hard',
      question: 'Evaluate contour integral',
      answer: '2πi',
      hints: [],
    };

    const solver = findSolver(exercise);
    expect(solver).toBeNull();
  });

  it('should throw SolverError when no solver available', async () => {
    const { solveExercise } = await import('../src/solvers/index.js');
    
    const exercise: Exercise = {
      id: 'registry-test-4',
      chapter: 5,
      topic: 'complex analysis',
      difficulty: 'hard',
      question: 'Evaluate contour integral',
      answer: '2πi',
      hints: [],
    };

    expect(() => solveExercise(exercise)).toThrow(SolverError);
    expect(() => solveExercise(exercise)).toThrow('No solver available');
  });
});

describe('StepBuilder', () => {
  it('should build steps with auto-incrementing numbers', async () => {
    const { StepBuilder } = await import('../src/index.js');
    
    const builder = new StepBuilder();
    const steps = builder
      .addStep({
        title: 'Step 1',
        explanation: 'First step',
        expression: 'x = 1',
        changeType: 'INITIAL_STATE',
        beforeState: '',
        afterState: 'x = 1',
      })
      .addStep({
        title: 'Step 2',
        explanation: 'Second step',
        expression: 'x = 2',
        changeType: 'CALCULATE_SOLUTIONS',
        beforeState: 'x = 1',
        afterState: 'x = 2',
      })
      .build();

    expect(steps).toHaveLength(2);
    expect(steps[0].number).toBe(1);
    expect(steps[1].number).toBe(2);
    expect(steps[0].id).toBeDefined();
    expect(steps[1].id).toBeDefined();
  });

  it('should include substeps array', async () => {
    const { StepBuilder } = await import('../src/index.js');
    
    const builder = new StepBuilder();
    const steps = builder
      .addStep({
        title: 'Main Step',
        explanation: 'With substeps',
        expression: 'x = 1',
        changeType: 'INITIAL_STATE',
        beforeState: '',
        afterState: 'x = 1',
        substeps: [],
      })
      .build();

    expect(steps[0].substeps).toEqual([]);
  });
});
