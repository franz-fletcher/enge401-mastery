import { describe, it, expect } from 'vitest';
import { solveLinearEquation, solveQuadratic, simplifyExpression, factorExpression } from '../src/algebra.js';

describe('solveLinearEquation', () => {
  it('solves 2x + 3 = 7', () => {
    expect(solveLinearEquation(2, 3, 7)).toBe(2);
  });
  it('solves x - 5 = 10', () => {
    expect(solveLinearEquation(1, -5, 10)).toBe(15);
  });
  it('throws for a = 0', () => {
    expect(() => solveLinearEquation(0, 1, 2)).toThrow();
  });
});

describe('solveQuadratic', () => {
  it('solves x^2 - 5x + 6 = 0', () => {
    const roots = solveQuadratic(1, -5, 6);
    expect(roots).toEqual([3, 2]);
  });
  it('solves x^2 - 4 = 0', () => {
    const roots = solveQuadratic(1, 0, -4);
    expect(roots).toEqual([2, -2]);
  });
  it('returns null for no real roots', () => {
    expect(solveQuadratic(1, 0, 1)).toBeNull();
  });
  it('handles repeated root (discriminant = 0)', () => {
    const roots = solveQuadratic(1, -2, 1);
    expect(roots).toEqual([1, 1]);
  });
});

describe('simplifyExpression', () => {
  it('simplifies 2*x + 3*x', () => {
    const result = simplifyExpression('2*x + 3*x');
    expect(result).toBe('5 * x');
  });
});

describe('factorExpression', () => {
  it('factors x^2 - 1', () => {
    const result = factorExpression('x^2-1');
    expect(result).toContain('x');
  });
});
