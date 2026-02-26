import { describe, it, expect } from 'vitest';
import { generateLinearExercise, generateQuadraticExercise } from '../src/algebra-exercises';

describe('generateLinearExercise', () => {
  it('generates an exercise with correct structure', () => {
    const ex = generateLinearExercise('easy');
    expect(ex).toHaveProperty('id');
    expect(ex.chapter).toBe(1);
    expect(ex.topic).toBe('Linear Equations');
    expect(typeof ex.question).toBe('string');
    expect(typeof ex.answer).toBe('number');
  });

  it('generates a solvable linear equation', () => {
    for (let i = 0; i < 5; i++) {
      const ex = generateLinearExercise('easy');
      expect(typeof ex.answer).toBe('number');
      expect(isFinite(ex.answer as number)).toBe(true);
    }
  });
});

describe('generateQuadraticExercise', () => {
  it('generates an exercise with correct structure', () => {
    const ex = generateQuadraticExercise('medium');
    expect(ex.chapter).toBe(1);
    expect(ex.topic).toBe('Quadratic Equations');
    expect(ex.difficulty).toBe('medium');
  });

  it('generates a valid question string', () => {
    const ex = generateQuadraticExercise('hard');
    expect(ex.question).toMatch(/Solve/);
  });
});
