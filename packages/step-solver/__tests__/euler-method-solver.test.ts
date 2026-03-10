import { describe, it, expect } from 'vitest';
import {
  EulerMethodSolver,
  parseDiffEqQuestion,
  calculateEulerSteps,
  findSolver,
  type Exercise,
} from '../src/index.js';

describe('EulerMethodSolver', () => {
  const solver = new EulerMethodSolver();

  it('should return true for canSolve with differential equation topic', () => {
    const exercise: Exercise = {
      id: 'euler-test-1',
      chapter: 6,
      topic: 'Differential Equations — Euler\'s Method',
      difficulty: 'easy',
      question: 'Use Euler\'s method with h=0.1 and 5 steps to approximate y(0.5) for dy/dx = 2y, y(0) = 1',
      answer: 1.4883,
      hints: [],
    };

    expect(solver.canSolve(exercise)).toBe(true);
  });

  it('should return true for canSolve with euler in topic', () => {
    const exercise: Exercise = {
      id: 'euler-test-2',
      chapter: 6,
      topic: 'euler method',
      difficulty: 'easy',
      question: 'Use Euler\'s method with h=0.1 and 5 steps to approximate y(0.5) for dy/dx = 2y, y(0) = 1',
      answer: 1.4883,
      hints: [],
    };

    expect(solver.canSolve(exercise)).toBe(true);
  });

  it('should return true for canSolve with euler in question', () => {
    const exercise: Exercise = {
      id: 'euler-test-3',
      chapter: 6,
      topic: 'some topic',
      difficulty: 'easy',
      question: "Use Euler's method with h=0.1 and 5 steps to approximate y(0.5) for dy/dx = 2y, y(0) = 1",
      answer: 1.4883,
      hints: [],
    };

    expect(solver.canSolve(exercise)).toBe(true);
  });

  it('should return false for canSolve with unrelated topic', () => {
    const exercise: Exercise = {
      id: 'euler-test-4',
      chapter: 1,
      topic: 'linear equation',
      difficulty: 'easy',
      question: '2x + 3 = 7',
      answer: 2,
      hints: [],
    };

    expect(solver.canSolve(exercise)).toBe(false);
  });

  it('should solve dy/dx = 2y with y(0) = 1, h=0.1, 5 steps', () => {
    const exercise: Exercise = {
      id: 'euler-test-5',
      chapter: 6,
      topic: 'Differential Equations — Euler\'s Method',
      difficulty: 'easy',
      question: 'Use Euler\'s method with h=0.1 and 5 steps to approximate y(0.5) for dy/dx = 2y, y(0) = 1',
      answer: 2.4883,
      hints: [],
    };

    const solution = solver.solve(exercise);

    expect(solution.exerciseId).toBe('euler-test-5');
    expect(solution.steps).toHaveLength(5);
    expect(solution.totalSteps).toBe(5);

    // Check step titles
    expect(solution.steps[0].title).toBe('Original Problem');
    expect(solution.steps[1].title).toBe('Euler\'s Method Formula');
    expect(solution.steps[2].title).toBe('Initial Setup');
    expect(solution.steps[3].title).toBe('Iteration Steps');
    expect(solution.steps[4].title).toBe('Final Approximation');

    // Check final answer is approximately 2.4883 (y(0.5) after 5 steps with k=2)
    const finalAnswer = parseFloat(solution.finalAnswer);
    expect(finalAnswer).toBeCloseTo(2.4883, 3);
  });

  it('should solve dy/dx = y with y(0) = 1, h=0.1, 5 steps', () => {
    const exercise: Exercise = {
      id: 'euler-test-6',
      chapter: 6,
      topic: 'Differential Equations — Euler\'s Method',
      difficulty: 'easy',
      question: 'Use Euler\'s method with h=0.1 and 5 steps to approximate y(0.5) for dy/dx = 1y, y(0) = 1',
      answer: 1.6105,
      hints: [],
    };

    const solution = solver.solve(exercise);

    // Expected: y(0.5) ≈ 1.61051 (approximation of e^0.5)
    const finalAnswer = parseFloat(solution.finalAnswer);
    expect(finalAnswer).toBeCloseTo(1.6105, 3);
  });

  it('should be found by findSolver for differential equation exercises', async () => {
    const exercise: Exercise = {
      id: 'euler-test-7',
      chapter: 6,
      topic: 'Differential Equations — Euler\'s Method',
      difficulty: 'easy',
      question: 'Use Euler\'s method with h=0.1 and 5 steps to approximate y(0.5) for dy/dx = 2y, y(0) = 1',
      answer: 1.4883,
      hints: [],
    };

    const foundSolver = findSolver(exercise);
    expect(foundSolver).not.toBeNull();
    expect(foundSolver?.canSolve(exercise)).toBe(true);
  });
});

describe('parseDiffEqQuestion', () => {
  it('should parse standard Euler method question', () => {
    const question = 'Use Euler\'s method with h=0.1 and 5 steps to approximate y(0.5) for dy/dx = 2y, y(0) = 1';
    const params = parseDiffEqQuestion(question);

    expect(params).not.toBeNull();
    expect(params!.k).toBe(2);
    expect(params!.y0).toBe(1);
    expect(params!.h).toBe(0.1);
    expect(params!.steps).toBe(5);
    expect(params!.targetX).toBe(0.5);
  });

  it('should parse question with k=1', () => {
    const question = 'Use Euler\'s method with h=0.1 and 5 steps to approximate y(0.5) for dy/dx = 1y, y(0) = 1';
    const params = parseDiffEqQuestion(question);

    expect(params).not.toBeNull();
    expect(params!.k).toBe(1);
    expect(params!.y0).toBe(1);
    expect(params!.h).toBe(0.1);
    expect(params!.steps).toBe(5);
    expect(params!.targetX).toBe(0.5);
  });

  it('should return null for invalid question format', () => {
    const question = 'Solve the differential equation dy/dx = 2y';
    const params = parseDiffEqQuestion(question);

    expect(params).toBeNull();
  });

  it('should return null when targetX does not match steps * h', () => {
    const question = 'Use Euler\'s method with h=0.1 and 5 steps to approximate y(1.0) for dy/dx = 2y, y(0) = 1';
    const params = parseDiffEqQuestion(question);

    expect(params).toBeNull();
  });
});

describe('calculateEulerSteps', () => {
  it('should calculate correct iterations for dy/dx = 2y', () => {
    const iterations = calculateEulerSteps(2, 1, 0.1, 5);

    expect(iterations).toHaveLength(5);

    // Step 0: x=0, y=1, f=2, y_next=1.2
    expect(iterations[0].n).toBe(0);
    expect(iterations[0].xn).toBe(0);
    expect(iterations[0].yn).toBe(1);
    expect(iterations[0].f_xy).toBe(2);
    expect(iterations[0].y_next).toBe(1.2);

    // Step 1: x=0.1, y=1.2, f=2.4, y_next=1.44
    expect(iterations[1].n).toBe(1);
    expect(iterations[1].xn).toBeCloseTo(0.1, 5);
    expect(iterations[1].yn).toBe(1.2);
    expect(iterations[1].f_xy).toBe(2.4);
    expect(iterations[1].y_next).toBe(1.44);

    // Step 4 (final): should give y ≈ 2.48832
    expect(iterations[4].y_next).toBeCloseTo(2.48832, 4);
  });

  it('should calculate correct iterations for dy/dx = y', () => {
    const iterations = calculateEulerSteps(1, 1, 0.1, 5);

    expect(iterations).toHaveLength(5);

    // Step 0: x=0, y=1, f=1, y_next=1.1
    expect(iterations[0].n).toBe(0);
    expect(iterations[0].xn).toBe(0);
    expect(iterations[0].yn).toBe(1);
    expect(iterations[0].f_xy).toBe(1);
    expect(iterations[0].y_next).toBe(1.1);

    // Step 4 (final): should give y ≈ 1.61051
    expect(iterations[4].y_next).toBeCloseTo(1.61051, 4);
  });
});
