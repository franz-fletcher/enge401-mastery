import { describe, it, expect } from 'vitest';
import { definiteIntegral } from '../src/integration';

describe('definiteIntegral', () => {
  it('integrates x from 0 to 1 = 0.5', () => {
    expect(definiteIntegral('x', 0, 1)).toBeCloseTo(0.5, 4);
  });
  it('integrates x^2 from 0 to 3 = 9', () => {
    expect(definiteIntegral('x^2', 0, 3)).toBeCloseTo(9, 4);
  });
  it('integrates 2*x from 1 to 3 = 8', () => {
    expect(definiteIntegral('2*x', 1, 3)).toBeCloseTo(8, 4);
  });
});
