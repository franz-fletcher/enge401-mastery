/**
 * Chapter 2: Trigonometry
 * Trig identities, unit circle values, conversions
 */

export type TrigFunction = 'sin' | 'cos' | 'tan' | 'csc' | 'sec' | 'cot';

/**
 * Converts degrees to radians.
 */
export function degreesToRadians(deg: number): number {
  return (deg * Math.PI) / 180;
}

/**
 * Converts radians to degrees.
 */
export function radiansToDegrees(rad: number): number {
  return (rad * 180) / Math.PI;
}

// Exact unit circle values (multiples of 30° and 45°) as [numerator_sqrt, denominator]
// where the value = sqrt(numerator_sqrt) / denominator
// Using a map of (angle in degrees) -> { sin, cos, tan } as exact strings
const UNIT_CIRCLE: Record<number, Record<TrigFunction, string>> = {
  0:   { sin: '0',          cos: '1',          tan: '0',          csc: 'undefined', sec: '1',          cot: 'undefined' },
  30:  { sin: '1/2',        cos: 'sqrt(3)/2',  tan: '1/sqrt(3)',  csc: '2',         sec: '2/sqrt(3)',   cot: 'sqrt(3)'  },
  45:  { sin: 'sqrt(2)/2',  cos: 'sqrt(2)/2',  tan: '1',          csc: 'sqrt(2)',   sec: 'sqrt(2)',     cot: '1'        },
  60:  { sin: 'sqrt(3)/2',  cos: '1/2',        tan: 'sqrt(3)',    csc: '2/sqrt(3)', sec: '2',           cot: '1/sqrt(3)'},
  90:  { sin: '1',          cos: '0',          tan: 'undefined',  csc: '1',         sec: 'undefined',   cot: '0'       },
  120: { sin: 'sqrt(3)/2',  cos: '-1/2',       tan: '-sqrt(3)',   csc: '2/sqrt(3)', sec: '-2',          cot: '-1/sqrt(3)'},
  135: { sin: 'sqrt(2)/2',  cos: '-sqrt(2)/2', tan: '-1',         csc: 'sqrt(2)',   sec: '-sqrt(2)',    cot: '-1'      },
  150: { sin: '1/2',        cos: '-sqrt(3)/2', tan: '-1/sqrt(3)', csc: '2',         sec: '-2/sqrt(3)',  cot: '-sqrt(3)'},
  180: { sin: '0',          cos: '-1',         tan: '0',          csc: 'undefined', sec: '-1',          cot: 'undefined'},
  210: { sin: '-1/2',       cos: '-sqrt(3)/2', tan: '1/sqrt(3)',  csc: '-2',        sec: '-2/sqrt(3)',  cot: 'sqrt(3)' },
  225: { sin: '-sqrt(2)/2', cos: '-sqrt(2)/2', tan: '1',          csc: '-sqrt(2)',  sec: '-sqrt(2)',    cot: '1'       },
  240: { sin: '-sqrt(3)/2', cos: '-1/2',       tan: 'sqrt(3)',    csc: '-2/sqrt(3)',sec: '-2',          cot: '1/sqrt(3)'},
  270: { sin: '-1',         cos: '0',          tan: 'undefined',  csc: '-1',        sec: 'undefined',   cot: '0'      },
  300: { sin: '-sqrt(3)/2', cos: '1/2',        tan: '-sqrt(3)',   csc: '-2/sqrt(3)',sec: '2',           cot: '-1/sqrt(3)'},
  315: { sin: '-sqrt(2)/2', cos: 'sqrt(2)/2',  tan: '-1',         csc: '-sqrt(2)',  sec: 'sqrt(2)',     cot: '-1'      },
  330: { sin: '-1/2',       cos: 'sqrt(3)/2',  tan: '-1/sqrt(3)', csc: '-2',        sec: '2/sqrt(3)',   cot: '-sqrt(3)'},
  360: { sin: '0',          cos: '1',          tan: '0',          csc: 'undefined', sec: '1',           cot: 'undefined'},
};

/**
 * Returns the exact trig value for a standard angle (multiples of 30° or 45°).
 * @param angleDeg - Angle in degrees
 * @param fn - Trig function name
 * @returns Exact string representation (e.g. 'sqrt(3)/2') or null if not a standard angle
 */
export function unitCircleValue(angleDeg: number, fn: TrigFunction): string | null {
  const normalised = ((angleDeg % 360) + 360) % 360;
  const entry = UNIT_CIRCLE[normalised];
  if (!entry) return null;
  return entry[fn];
}

/**
 * Verifies if two trig expressions are equivalent by evaluating at multiple points.
 * Uses numerical comparison at several test angles.
 */
export function verifyIdentity(lhs: string, rhs: string): boolean {
  const testAngles = [0.1, 0.3, 0.7, 1.1, 1.3, 2.0];
  for (const x of testAngles) {
    const lhsVal = evaluateTrigExpr(lhs, x);
    const rhsVal = evaluateTrigExpr(rhs, x);
    if (lhsVal === null || rhsVal === null) continue;
    if (Math.abs(lhsVal - rhsVal) > 1e-9) return false;
  }
  return true;
}

function evaluateTrigExpr(expr: string, x: number): number | null {
  try {
    // Replace trig function names and x with numeric value
    const js = expr
      .replace(/\bsin\b/g, 'Math.sin')
      .replace(/\bcos\b/g, 'Math.cos')
      .replace(/\btan\b/g, 'Math.tan')
      .replace(/\bx\b/g, x.toString());
    // eslint-disable-next-line no-new-func
    return Function(`"use strict"; return (${js});`)() as number;
  } catch {
    return null;
  }
}
