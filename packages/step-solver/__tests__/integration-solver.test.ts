import { describe, it, expect } from 'vitest';
import {
  IntegrationSolver,
  findSolver,
  type Exercise,
} from '../src/index.js';

describe('IntegrationSolver', () => {
  const solver = new IntegrationSolver();

  it('should return true for canSolve with integration topic', () => {
    const exercise: Exercise = {
      id: 'int-test-1',
      chapter: 5,
      topic: 'Integration',
      difficulty: 'easy',
      question: 'Find $\\int x^2\\, dx$',
      answer: 'x^3/3',
      hints: [],
    };

    expect(solver.canSolve(exercise)).toBe(true);
  });

  it('should return true for canSolve with integral in topic', () => {
    const exercise: Exercise = {
      id: 'int-test-2',
      chapter: 5,
      topic: 'Indefinite Integrals',
      difficulty: 'easy',
      question: 'Find $\\int x^2\\, dx$',
      answer: 'x^3/3',
      hints: [],
    };

    expect(solver.canSolve(exercise)).toBe(true);
  });

  it('should return false for canSolve with unrelated topic', () => {
    const exercise: Exercise = {
      id: 'int-test-3',
      chapter: 1,
      topic: 'linear equation',
      difficulty: 'easy',
      question: '2x + 3 = 7',
      answer: 2,
      hints: [],
    };

    expect(solver.canSolve(exercise)).toBe(false);
  });

  it('should solve ∫x^2 dx', () => {
    const exercise: Exercise = {
      id: 'int-test-4',
      chapter: 5,
      topic: 'Integration',
      difficulty: 'easy',
      question: 'Find $\\int x^2\\, dx$',
      answer: 'x^3/3',
      hints: [],
    };

    const solution = solver.solve(exercise);

    expect(solution.exerciseId).toBe('int-test-4');
    expect(solution.steps).toHaveLength(4);
    expect(solution.totalSteps).toBe(4);

    // Check step titles
    expect(solution.steps[0].title).toBe('Original Integral');
    expect(solution.steps[1].title).toBe('Identify Integration Rule');
    expect(solution.steps[2].title).toBe('Apply the Rule');
    expect(solution.steps[3].title).toBe('Final Answer');

    // Check final answer includes + C
    expect(solution.finalAnswer).toBe('\\frac{x^3}{3} + C');
  });

  it('should solve ∫x^3 dx', () => {
    const exercise: Exercise = {
      id: 'int-test-5',
      chapter: 5,
      topic: 'Integration',
      difficulty: 'easy',
      question: 'Find $\\int x^3\\, dx$',
      answer: 'x^4/4',
      hints: [],
    };

    const solution = solver.solve(exercise);

    expect(solution.steps).toHaveLength(4);
    expect(solution.finalAnswer).toBe('\\frac{x^4}{4} + C');
  });

  it('should solve ∫x dx', () => {
    const exercise: Exercise = {
      id: 'int-test-6',
      chapter: 5,
      topic: 'Integration',
      difficulty: 'easy',
      question: 'Find $\\int x\\, dx$',
      answer: 'x^2/2',
      hints: [],
    };

    const solution = solver.solve(exercise);

    expect(solution.steps).toHaveLength(4);
    expect(solution.finalAnswer).toBe('\\frac{x^2}{2} + C');
  });

  it('should solve ∫2x dx', () => {
    const exercise: Exercise = {
      id: 'int-test-7',
      chapter: 5,
      topic: 'Integration',
      difficulty: 'easy',
      question: 'Find $\\int 2x\\, dx$',
      answer: 'x^2',
      hints: [],
    };

    const solution = solver.solve(exercise);

    expect(solution.steps).toHaveLength(4);
    expect(solution.finalAnswer).toBe('\\frac{2x^2}{2} + C');
  });

  it('should solve ∫3x^2 dx', () => {
    const exercise: Exercise = {
      id: 'int-test-8',
      chapter: 5,
      topic: 'Integration',
      difficulty: 'easy',
      question: 'Find $\\int 3x^2\\, dx$',
      answer: 'x^3',
      hints: [],
    };

    const solution = solver.solve(exercise);

    expect(solution.steps).toHaveLength(4);
    expect(solution.finalAnswer).toBe('x^3 + C');
  });

  it('should solve ∫sin(x) dx', () => {
    const exercise: Exercise = {
      id: 'int-test-9',
      chapter: 5,
      topic: 'Integration',
      difficulty: 'easy',
      question: 'Find $\\int \\sin(x)\\, dx$',
      answer: '-cos(x)',
      hints: [],
    };

    const solution = solver.solve(exercise);

    expect(solution.steps).toHaveLength(4);
    expect(solution.finalAnswer).toBe('-\\cos(x) + C');
  });

  it('should solve ∫cos(x) dx', () => {
    const exercise: Exercise = {
      id: 'int-test-10',
      chapter: 5,
      topic: 'Integration',
      difficulty: 'easy',
      question: 'Find $\\int \\cos(x)\\, dx$',
      answer: 'sin(x)',
      hints: [],
    };

    const solution = solver.solve(exercise);

    expect(solution.steps).toHaveLength(4);
    expect(solution.finalAnswer).toBe('\\sin(x) + C');
  });

  it('should throw error for unsupported expression', () => {
    const exercise: Exercise = {
      id: 'int-test-11',
      chapter: 5,
      topic: 'Integration',
      difficulty: 'easy',
      question: 'Find $\\int e^x\\, dx$',
      answer: 'e^x',
      hints: [],
    };

    expect(() => solver.solve(exercise)).toThrow();
  });

  it('should throw error for unparsable question', () => {
    const exercise: Exercise = {
      id: 'int-test-12',
      chapter: 5,
      topic: 'Integration',
      difficulty: 'easy',
      question: 'Solve the equation',
      answer: 'x',
      hints: [],
    };

    expect(() => solver.solve(exercise)).toThrow();
  });

  it('should be found by findSolver for integration exercises', async () => {
    const exercise: Exercise = {
      id: 'int-test-13',
      chapter: 5,
      topic: 'Integration',
      difficulty: 'easy',
      question: 'Find $\\int x^2\\, dx$',
      answer: 'x^3/3',
      hints: [],
    };

    const foundSolver = findSolver(exercise);
    expect(foundSolver).not.toBeNull();
    expect(foundSolver?.canSolve(exercise)).toBe(true);
  });

  it('should handle Unicode integral symbol', () => {
    const exercise: Exercise = {
      id: 'int-test-14',
      chapter: 5,
      topic: 'Integration',
      difficulty: 'easy',
      question: 'Find ∫ x^2 dx',
      answer: 'x^3/3',
      hints: [],
    };

    const solution = solver.solve(exercise);

    expect(solution.steps).toHaveLength(4);
    expect(solution.finalAnswer).toBe('\\frac{x^3}{3} + C');
  });

  it('should handle coefficient with multiplication sign', () => {
    const exercise: Exercise = {
      id: 'int-test-15',
      chapter: 5,
      topic: 'Integration',
      difficulty: 'easy',
      question: 'Find $\\int 2*x^2\\, dx$',
      answer: '2x^3/3',
      hints: [],
    };

    const solution = solver.solve(exercise);

    expect(solution.steps).toHaveLength(4);
    expect(solution.finalAnswer).toBe('\\frac{2x^3}{3} + C');
  });
});
