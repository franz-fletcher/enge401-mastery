import { describe, it, expect } from 'vitest';
import { solveExponentialEquation, compoundGrowth } from '../src/exponentials.js';

describe('solveExponentialEquation', () => {
  it('solves 2^x = 8, x = 3', () => {
    expect(solveExponentialEquation(2, 8)).toBeCloseTo(3, 10);
  });
  it('solves 10^x = 100, x = 2', () => {
    expect(solveExponentialEquation(10, 100)).toBeCloseTo(2, 10);
  });
  it('throws for base <= 0', () => {
    expect(() => solveExponentialEquation(0, 5)).toThrow();
  });
});

describe('compoundGrowth', () => {
  it('calculates simple annual growth', () => {
    // A = 1000 * (1 + 0.1)^1 = 1100
    expect(compoundGrowth(1000, 0.1, 1, 1)).toBeCloseTo(1100, 5);
  });
  it('calculates continuous growth', () => {
    // A = 1000 * e^(0.1)
    expect(compoundGrowth(1000, 0.1, 1, Infinity)).toBeCloseTo(
      1000 * Math.exp(0.1),
      5,
    );
  });
  it('calculates monthly compounding', () => {
    // A = 1000 * (1 + 0.12/12)^12 = 1000 * (1.01)^12
    expect(compoundGrowth(1000, 0.12, 1, 12)).toBeCloseTo(1126.825, 2);
  });
});
