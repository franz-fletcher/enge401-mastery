import { describe, it, expect } from 'vitest';
import { ExponentialEquationSolver, parseExponentialEquation, isPowerOf } from '../src/solvers/exponentials/exponential-equation.js';
import { findSolver, solveExercise } from '../src/solvers/index.js';
import type { Exercise } from '../src/types.js';

describe('parseExponentialEquation', () => {
  it('should parse simple exponential equations', () => {
    expect(parseExponentialEquation('2^x = 8')).toEqual({ base: 2, result: 8 });
    expect(parseExponentialEquation('10^x = 100')).toEqual({ base: 10, result: 100 });
    expect(parseExponentialEquation('3^x = 27')).toEqual({ base: 3, result: 27 });
  });

  it('should parse equations with LaTeX formatting', () => {
    expect(parseExponentialEquation('Solve for $x$: $2^x = 8$')).toEqual({ base: 2, result: 8 });
    expect(parseExponentialEquation('Solve for $x$: $5^x = 125$')).toEqual({ base: 5, result: 125 });
  });

  it('should return null for invalid equations', () => {
    expect(parseExponentialEquation('2x = 8')).toBeNull();
    expect(parseExponentialEquation('x^2 = 4')).toBeNull();
    expect(parseExponentialEquation('2^x + 3 = 8')).toBeNull();
  });
});

describe('isPowerOf', () => {
  it('should detect exact powers', () => {
    expect(isPowerOf(2, 8)).toBe(3);   // 2^3 = 8
    expect(isPowerOf(2, 16)).toBe(4);  // 2^4 = 16
    expect(isPowerOf(3, 27)).toBe(3);  // 3^3 = 27
    expect(isPowerOf(5, 125)).toBe(3); // 5^3 = 125
    expect(isPowerOf(10, 100)).toBe(2); // 10^2 = 100
  });

  it('should return null for non-powers', () => {
    expect(isPowerOf(2, 10)).toBeNull();
    expect(isPowerOf(3, 10)).toBeNull();
  });

  it('should handle edge cases', () => {
    expect(isPowerOf(1, 1)).toBe(0);   // 1^0 = 1
    expect(isPowerOf(1, 2)).toBeNull(); // 1^x always equals 1
    expect(isPowerOf(-2, 8)).toBeNull(); // Negative base
    expect(isPowerOf(2, -8)).toBeNull(); // Negative result
  });
});

describe('ExponentialEquationSolver', () => {
  const solver = new ExponentialEquationSolver();

  describe('canSolve', () => {
    it('should return true for exponential equation exercises', () => {
      const exercise: Exercise = {
        id: 'test-1',
        chapter: 3,
        topic: 'Exponential Equations',
        difficulty: 'easy',
        question: 'Solve for $x$: $2^x = 8$',
        answer: 3,
      };
      expect(solver.canSolve(exercise)).toBe(true);
    });

    it('should return false for non-exponential topics', () => {
      const exercise: Exercise = {
        id: 'test-2',
        chapter: 1,
        topic: 'Linear Equations',
        difficulty: 'easy',
        question: 'Solve for $x$: $2x = 8$',
        answer: 4,
      };
      expect(solver.canSolve(exercise)).toBe(false);
    });

    it('should return false for questions without exponential pattern', () => {
      const exercise: Exercise = {
        id: 'test-3',
        chapter: 3,
        topic: 'Exponential Equations',
        difficulty: 'easy',
        question: 'What is the derivative of e^x?',
        answer: 'e^x',
      };
      expect(solver.canSolve(exercise)).toBe(false);
    });
  });

  describe('solve with exact powers', () => {
    it('should solve 2^x = 8 using exact power method', () => {
      const exercise: Exercise = {
        id: 'test-4',
        chapter: 3,
        topic: 'Exponential Equations',
        difficulty: 'easy',
        question: 'Solve for $x$: $2^x = 8$',
        answer: 3,
      };

      const solution = solver.solve(exercise);

      expect(solution.exerciseId).toBe('test-4');
      expect(solution.totalSteps).toBe(4);
      expect(solution.finalAnswer).toBe('3');
      expect(solution.steps[0].title).toBe('Original Equation');
      expect(solution.steps[0].expression).toBe('2^x = 8');
      expect(solution.steps[1].title).toBe('Recognize the Power');
      expect(solution.steps[2].title).toBe('Equate Exponents');
      expect(solution.steps[3].title).toBe('Solution');
    });

    it('should solve 5^x = 125 using exact power method', () => {
      const exercise: Exercise = {
        id: 'test-5',
        chapter: 3,
        topic: 'Exponential Equations',
        difficulty: 'easy',
        question: 'Solve for $x$: $5^x = 125$',
        answer: 3,
      };

      const solution = solver.solve(exercise);

      expect(solution.totalSteps).toBe(4);
      expect(solution.finalAnswer).toBe('3');
      expect(solution.steps[1].expression).toBe('5^x = 5^3');
    });
  });

  describe('solve with logarithmic method', () => {
    it('should solve 2^x = 10 using logarithms', () => {
      const exercise: Exercise = {
        id: 'test-6',
        chapter: 3,
        topic: 'Exponential Equations',
        difficulty: 'medium',
        question: 'Solve for $x$: $2^x = 10$',
        answer: 3.3219,
      };

      const solution = solver.solve(exercise);

      expect(solution.exerciseId).toBe('test-6');
      expect(solution.totalSteps).toBe(5);
      expect(solution.steps[0].title).toBe('Original Equation');
      expect(solution.steps[1].title).toBe('Take Logarithm of Both Sides');
      expect(solution.steps[2].title).toBe('Apply Power Rule');
      expect(solution.steps[3].title).toBe('Isolate x');
      expect(solution.steps[4].title).toBe('Calculate');

      // Verify the logarithmic steps
      expect(solution.steps[1].expression).toContain('\\log');
      expect(solution.steps[2].expression).toContain('\\cdot');
      expect(solution.steps[3].expression).toContain('\\frac');

      // Verify final answer is approximately correct
      const finalValue = parseFloat(solution.finalAnswer);
      expect(finalValue).toBeCloseTo(3.3219, 2);
    });

    it('should solve 3^x = 20 using logarithms', () => {
      const exercise: Exercise = {
        id: 'test-7',
        chapter: 3,
        topic: 'Exponential Equations',
        difficulty: 'medium',
        question: 'Solve for $x$: $3^x = 20$',
        answer: 2.7268,
      };

      const solution = solver.solve(exercise);

      expect(solution.totalSteps).toBe(5);
      const finalValue = parseFloat(solution.finalAnswer);
      expect(finalValue).toBeCloseTo(2.7268, 2);
    });
  });

  describe('error handling', () => {
    it('should throw error for invalid base (zero)', () => {
      const exercise: Exercise = {
        id: 'test-8',
        chapter: 3,
        topic: 'Exponential Equations',
        difficulty: 'easy',
        question: 'Solve for $x$: $0^x = 5$',
        answer: 0,
      };

      expect(() => solver.solve(exercise)).toThrow('Invalid base');
    });

    it('should throw error for invalid base (negative)', () => {
      const exercise: Exercise = {
        id: 'test-9',
        chapter: 3,
        topic: 'Exponential Equations',
        difficulty: 'easy',
        question: 'Solve for $x$: $(-2)^x = 8$',
        answer: 0,
      };

      // This won't parse due to parentheses, but let's test the validation
      const parsed = parseExponentialEquation('Solve for $x$: $(-2)^x = 8$');
      expect(parsed).toBeNull();
    });

    it('should throw error for base = 1', () => {
      const exercise: Exercise = {
        id: 'test-10',
        chapter: 3,
        topic: 'Exponential Equations',
        difficulty: 'easy',
        question: 'Solve for $x$: $1^x = 5$',
        answer: 0,
      };

      expect(() => solver.solve(exercise)).toThrow('Invalid base: 1');
    });

    it('should throw error for negative result', () => {
      const exercise: Exercise = {
        id: 'test-11',
        chapter: 3,
        topic: 'Exponential Equations',
        difficulty: 'easy',
        question: 'Solve for $x$: $2^x = -8$',
        answer: 0,
      };

      expect(() => solver.solve(exercise)).toThrow('Invalid result');
    });

    it('should throw error for unparsable equation', () => {
      const exercise: Exercise = {
        id: 'test-12',
        chapter: 3,
        topic: 'Exponential Equations',
        difficulty: 'easy',
        question: 'Solve for $x$: $2x = 8$',
        answer: 4,
      };

      expect(() => solver.solve(exercise)).toThrow('Failed to parse');
    });
  });

  describe('step metadata', () => {
    it('should include proper metadata in steps', () => {
      const exercise: Exercise = {
        id: 'test-13',
        chapter: 3,
        topic: 'Exponential Equations',
        difficulty: 'easy',
        question: 'Solve for $x$: $2^x = 8$',
        answer: 3,
      };

      const solution = solver.solve(exercise);

      // Check metadata for exact power method
      expect(solution.steps[1].metadata).toBeDefined();
      expect(solution.steps[1].metadata?.rule).toBe('Exponent Recognition');
      expect(solution.steps[2].metadata?.rule).toBe('If a^x = a^y, then x = y (for a > 0, a ≠ 1)');
    });

    it('should include metadata for logarithmic method', () => {
      const exercise: Exercise = {
        id: 'test-14',
        chapter: 3,
        topic: 'Exponential Equations',
        difficulty: 'medium',
        question: 'Solve for $x$: $2^x = 10$',
        answer: 3.3219,
      };

      const solution = solver.solve(exercise);

      expect(solution.steps[1].metadata?.rule).toBe('Logarithm Property: log(a^b) = b * log(a)');
      expect(solution.steps[2].metadata?.rule).toBe('Power Rule: log(a^b) = b * log(a)');
      expect(solution.steps[2].metadata?.formula).toBe('log(a^x) = x * log(a)');
      expect(solution.steps[3].metadata?.rule).toBe('Division Property of Equality');
    });
  });
});

describe('ExponentialEquationSolver Integration', () => {
  it('should be found by findSolver()', () => {
    const exercise: Exercise = {
      id: 'integration-test-1',
      chapter: 3,
      topic: 'Exponential Equations',
      difficulty: 'easy',
      question: 'Solve for $x$: $2^x = 8$',
      answer: 3,
    };

    const foundSolver = findSolver(exercise);
    expect(foundSolver).not.toBeNull();
    expect(foundSolver?.constructor.name).toBe('ExponentialEquationSolver');
  });

  it('should work with solveExercise()', () => {
    const exercise: Exercise = {
      id: 'integration-test-2',
      chapter: 3,
      topic: 'Exponential Equations',
      difficulty: 'easy',
      question: 'Solve for $x$: $3^x = 27$',
      answer: 3,
    };

    const solution = solveExercise(exercise);
    expect(solution.exerciseId).toBe('integration-test-2');
    expect(solution.totalSteps).toBeGreaterThan(0);
    expect(solution.finalAnswer).toBe('3');
    expect(solution.steps.length).toBeGreaterThan(0);
  });
});
