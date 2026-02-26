import { describe, it, expect } from 'vitest';
import { degreesToRadians, radiansToDegrees, unitCircleValue, verifyIdentity } from '../src/trig';

describe('degreesToRadians', () => {
  it('converts 180 degrees to PI', () => {
    expect(degreesToRadians(180)).toBeCloseTo(Math.PI, 10);
  });
  it('converts 90 degrees to PI/2', () => {
    expect(degreesToRadians(90)).toBeCloseTo(Math.PI / 2, 10);
  });
});

describe('radiansToDegrees', () => {
  it('converts PI to 180', () => {
    expect(radiansToDegrees(Math.PI)).toBeCloseTo(180, 10);
  });
});

describe('unitCircleValue', () => {
  it('returns sin(30) = 1/2', () => {
    expect(unitCircleValue(30, 'sin')).toBe('1/2');
  });
  it('returns cos(60) = 1/2', () => {
    expect(unitCircleValue(60, 'cos')).toBe('1/2');
  });
  it('returns null for non-standard angle', () => {
    expect(unitCircleValue(37, 'sin')).toBeNull();
  });
});

describe('verifyIdentity', () => {
  it('verifies sin^2(x) + cos^2(x) = 1', () => {
    expect(verifyIdentity('sin(x)**2 + cos(x)**2', '1')).toBe(true);
  });
  it('rejects a non-identity', () => {
    expect(verifyIdentity('sin(x) + 1', 'cos(x)')).toBe(false);
  });
});
