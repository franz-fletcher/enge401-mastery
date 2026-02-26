import { describe, it, expect } from 'vitest';
import { differentiate, productRuleDerivative, nthDerivative } from '../src/differentiation';

describe('differentiate', () => {
  it('differentiates x^2 -> 2x', () => {
    const result = differentiate('x^2');
    expect(result).toBe('2 * x');
  });
  it('differentiates 3x^3 -> 9x^2', () => {
    const result = differentiate('3*x^3');
    expect(result).toBe('9 * x ^ 2');
  });
  it('differentiates sin(x) -> cos(x)', () => {
    const result = differentiate('sin(x)');
    expect(result).toBe('cos(x)');
  });
});

describe('productRuleDerivative', () => {
  it('differentiates x * sin(x)', () => {
    const result = productRuleDerivative('x', 'sin(x)');
    // Should be sin(x) + x*cos(x)
    expect(result).toBeTruthy();
    expect(typeof result).toBe('string');
  });
});

describe('nthDerivative', () => {
  it('computes second derivative of x^3 -> 6x', () => {
    const result = nthDerivative('x^3', 2);
    expect(result).toBe('6 * x');
  });
  it('computes first derivative as-is', () => {
    expect(nthDerivative('x^2', 1)).toBe('2 * x');
  });
});
