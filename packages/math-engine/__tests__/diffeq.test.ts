import { describe, it, expect } from 'vitest';
import { eulerMethod } from '../src/diffeq';

describe('eulerMethod', () => {
  it('solves dy/dx = y with y(0)=1 approximates e^x', () => {
    // dy/dx = y => y = e^x; y(1) ≈ e ≈ 2.718
    const steps = eulerMethod((_, y) => y, 0, 1, 0.01, 100);
    const y1 = steps[100]!.y;
    expect(y1).toBeCloseTo(Math.exp(1), 1);
  });

  it('solves dy/dx = 0 (constant)', () => {
    const steps = eulerMethod(() => 0, 0, 5, 0.1, 10);
    expect(steps[10]!.y).toBeCloseTo(5, 10);
  });

  it('returns correct number of steps', () => {
    const steps = eulerMethod(() => 1, 0, 0, 1, 5);
    expect(steps).toHaveLength(6); // initial + 5 steps
  });
});
