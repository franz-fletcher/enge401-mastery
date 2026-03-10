import { describe, it, expect } from 'vitest';
import { UnitCircleSolver } from '../src/solvers/trig/unit-circle.js';
import type { Exercise } from '../src/types.js';

describe('UnitCircleSolver', () => {
  const solver = new UnitCircleSolver();

  describe('canSolve', () => {
    it('should return true for trigonometry exercises', () => {
      const exercise: Exercise = {
        id: 'test-1',
        chapter: 2,
        topic: 'Trigonometry — Unit Circle',
        difficulty: 'easy',
        question: 'Find the exact value of $\\sin(30^\\circ)$',
        answer: '1/2',
      };
      expect(solver.canSolve(exercise)).toBe(true);
    });

    it('should return true for unit circle exercises', () => {
      const exercise: Exercise = {
        id: 'test-2',
        chapter: 2,
        topic: 'Unit Circle',
        difficulty: 'easy',
        question: 'Find the exact value of $\\cos(45^\\circ)$',
        answer: 'sqrt(2)/2',
      };
      expect(solver.canSolve(exercise)).toBe(true);
    });

    it('should return false for non-trigonometry exercises', () => {
      const exercise: Exercise = {
        id: 'test-3',
        chapter: 1,
        topic: 'Linear Equations',
        difficulty: 'easy',
        question: 'Solve 2x + 3 = 7',
        answer: '2',
      };
      expect(solver.canSolve(exercise)).toBe(false);
    });
  });

  describe('solve', () => {
    it('should solve sin(30°) correctly', () => {
      const exercise: Exercise = {
        id: 'test-sin-30',
        chapter: 2,
        topic: 'Trigonometry — Unit Circle',
        difficulty: 'easy',
        question: 'Find the exact value of $\\sin(30^\\circ)$',
        answer: '1/2',
      };

      const solution = solver.solve(exercise);

      expect(solution.exerciseId).toBe('test-sin-30');
      expect(solution.totalSteps).toBe(5);
      expect(solution.steps[0].title).toBe('Original Problem');
      expect(solution.steps[0].expression).toBe('\\sin(30^\\circ)');
      expect(solution.steps[1].title).toBe('Convert to Radians');
      expect(solution.steps[2].title).toBe('Identify Quadrant');
      expect(solution.steps[3].title).toBe('Reference Angle');
      expect(solution.steps[4].title).toBe('Final Answer');
      expect(solution.finalAnswer).toBe('\\frac{1}{2}');
    });

    it('should solve cos(45°) correctly', () => {
      const exercise: Exercise = {
        id: 'test-cos-45',
        chapter: 2,
        topic: 'Trigonometry — Unit Circle',
        difficulty: 'easy',
        question: 'Find the exact value of $\\cos(45^\\circ)$',
        answer: 'sqrt(2)/2',
      };

      const solution = solver.solve(exercise);

      expect(solution.totalSteps).toBe(5);
      expect(solution.finalAnswer).toBe('\\frac{\\sqrt{2}}{2}');
    });

    it('should solve tan(60°) correctly', () => {
      const exercise: Exercise = {
        id: 'test-tan-60',
        chapter: 2,
        topic: 'Trigonometry — Unit Circle',
        difficulty: 'easy',
        question: 'Find the exact value of $\\tan(60^\\circ)$',
        answer: 'sqrt(3)',
      };

      const solution = solver.solve(exercise);

      expect(solution.totalSteps).toBe(5);
      expect(solution.finalAnswer).toBe('\\sqrt{3}');
    });

    it('should solve sin(120°) correctly (Quadrant II)', () => {
      const exercise: Exercise = {
        id: 'test-sin-120',
        chapter: 2,
        topic: 'Trigonometry — Unit Circle',
        difficulty: 'medium',
        question: 'Find the exact value of $\\sin(120^\\circ)$',
        answer: 'sqrt(3)/2',
      };

      const solution = solver.solve(exercise);

      expect(solution.totalSteps).toBe(5);
      expect(solution.steps[2].title).toBe('Identify Quadrant');
      expect(solution.steps[2].expression).toContain('Quadrant 2');
      expect(solution.finalAnswer).toBe('\\frac{\\sqrt{3}}{2}');
    });

    it('should solve cos(135°) correctly (Quadrant II, negative)', () => {
      const exercise: Exercise = {
        id: 'test-cos-135',
        chapter: 2,
        topic: 'Trigonometry — Unit Circle',
        difficulty: 'medium',
        question: 'Find the exact value of $\\cos(135^\\circ)$',
        answer: '-sqrt(2)/2',
      };

      const solution = solver.solve(exercise);

      expect(solution.totalSteps).toBe(5);
      expect(solution.steps[2].expression).toContain('Quadrant 2');
      expect(solution.finalAnswer).toBe('-\\frac{\\sqrt{2}}{2}');
    });

    it('should solve tan(90°) correctly (undefined)', () => {
      const exercise: Exercise = {
        id: 'test-tan-90',
        chapter: 2,
        topic: 'Trigonometry — Unit Circle',
        difficulty: 'medium',
        question: 'Find the exact value of $\\tan(90^\\circ)$',
        answer: 'undefined',
      };

      const solution = solver.solve(exercise);

      expect(solution.totalSteps).toBe(5);
      expect(solution.finalAnswer).toBe('\\text{undefined}');
    });

    it('should solve sin(0°) correctly', () => {
      const exercise: Exercise = {
        id: 'test-sin-0',
        chapter: 2,
        topic: 'Trigonometry — Unit Circle',
        difficulty: 'easy',
        question: 'Find the exact value of $\\sin(0^\\circ)$',
        answer: '0',
      };

      const solution = solver.solve(exercise);

      expect(solution.totalSteps).toBe(5);
      expect(solution.finalAnswer).toBe('0');
    });

    it('should solve cos(180°) correctly', () => {
      const exercise: Exercise = {
        id: 'test-cos-180',
        chapter: 2,
        topic: 'Trigonometry — Unit Circle',
        difficulty: 'easy',
        question: 'Find the exact value of $\\cos(180^\\circ)$',
        answer: '-1',
      };

      const solution = solver.solve(exercise);

      expect(solution.totalSteps).toBe(5);
      expect(solution.finalAnswer).toBe('-1');
    });

    it('should throw error for non-standard angles', () => {
      const exercise: Exercise = {
        id: 'test-invalid',
        chapter: 2,
        topic: 'Trigonometry — Unit Circle',
        difficulty: 'hard',
        question: 'Find the exact value of $\\sin(37^\\circ)$',
        answer: 'unknown',
      };

      expect(() => solver.solve(exercise)).toThrow('Angle 37° is not a standard unit circle angle');
    });

    it('should throw error for unparsable questions', () => {
      const exercise: Exercise = {
        id: 'test-unparsable',
        chapter: 2,
        topic: 'Trigonometry — Unit Circle',
        difficulty: 'easy',
        question: 'What is the meaning of life?',
        answer: '42',
      };

      expect(() => solver.solve(exercise)).toThrow('Failed to parse trigonometry question');
    });
  });
});
