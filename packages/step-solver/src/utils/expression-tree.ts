/**
 * Utility for working with mathematical expression trees
 * Provides helpers for parsing and manipulating expressions
 */

export interface ExpressionNode {
  type: 'number' | 'variable' | 'operator' | 'function' | 'parentheses';
  value: string;
  children?: ExpressionNode[];
}

/**
 * Parse a simple linear equation of the form ax + b = c
 * Returns the coefficients or null if parsing fails
 */
export function parseLinearEquation(equation: string): { a: number; b: number; c: number } | null {
  // Remove LaTeX formatting
  let clean = equation.replace(/\$/g, '');

  // Extract just the equation part (after the last colon if present)
  // Handle formats like "Solve for x: 2x + 3 = 7" or just "2x + 3 = 7"
  const colonMatch = clean.match(/:\s*(.+)$/);
  if (colonMatch) {
    clean = colonMatch[1];
  }

  // Remove whitespace
  clean = clean.replace(/\s/g, '');

  // Remove parentheses around numbers (e.g., (3) -> 3)
  clean = clean.replace(/\(([+-]?\d+)\)/g, '$1');

  // Match pattern: ax + b = c or ax - b = c or ax = c or x + b = c etc.
  const patterns = [
    // ax + b = c or ax - b = c
    /^([+-]?\d*)x([+-]\d+)=([+-]?\d+)$/,
    // ax = c
    /^([+-]?\d*)x=([+-]?\d+)$/,
    // x + b = c or x - b = c
    /^x([+-]\d+)=([+-]?\d+)$/,
    // x = c
    /^x=([+-]?\d+)$/
  ];
  
  for (const pattern of patterns) {
    const match = clean.match(pattern);
    if (match) {
      if (pattern.source.includes('([+-]?\\d*)x([+-]\\d+)')) {
        // ax + b = c
        const aStr = match[1] || '1';
        const a = aStr === '-' ? -1 : aStr === '+' ? 1 : parseFloat(aStr);
        const b = parseFloat(match[2]);
        const c = parseFloat(match[3]);
        return { a, b, c };
      } else if (pattern.source.includes('([+-]?\\d*)x=') && !pattern.source.includes('([+-]\\d+)')) {
        // ax = c
        const aStr = match[1] || '1';
        const a = aStr === '-' ? -1 : aStr === '+' ? 1 : parseFloat(aStr);
        const c = parseFloat(match[2]);
        return { a, b: 0, c };
      } else if (pattern.source.includes('^x([+-]\\d+)')) {
        // x + b = c
        const b = parseFloat(match[1]);
        const c = parseFloat(match[2]);
        return { a: 1, b, c };
      } else if (pattern.source.includes('^x=')) {
        // x = c
        const c = parseFloat(match[1]);
        return { a: 1, b: 0, c };
      }
    }
  }
  
  return null;
}

/**
 * Parse a quadratic equation of the form ax^2 + bx + c = 0
 * Returns the coefficients or null if parsing fails
 */
export function parseQuadraticEquation(equation: string): { a: number; b: number; c: number } | null {
  // Remove whitespace
  const clean = equation.replace(/\s/g, '');
  
  // Match pattern: ax^2 + bx + c = 0
  // Handle various forms: x^2 - 5x + 6 = 0, 2x^2 + 3x - 4 = 0, etc.
  const patterns = [
    // ax^2 + bx + c = 0
    /^([+-]?\d*)x\^2([+-]\d*)x([+-]\d+)=0$/,
    // ax^2 + bx = 0
    /^([+-]?\d*)x\^2([+-]\d*)x=0$/,
    // ax^2 + c = 0
    /^([+-]?\d*)x\^2([+-]\d+)=0$/,
    // ax^2 = 0
    /^([+-]?\d*)x\^2=0$/,
    // x^2 + bx + c = 0
    /^x\^2([+-]\d*)x([+-]\d+)=0$/,
    // x^2 + c = 0
    /^x\^2([+-]\d+)=0$/,
    // x^2 = 0
    /^x\^2=0$/
  ];
  
  for (const pattern of patterns) {
    const match = clean.match(pattern);
    if (match) {
      let a = 1, b = 0, c = 0;
      
      if (pattern.source.includes('([+-]?\\d*)x\\^2')) {
        const aStr = match[1] || '1';
        a = aStr === '-' ? -1 : aStr === '+' ? 1 : parseFloat(aStr);
      }
      
      if (pattern.source.includes('([+-]\\d*)x') && match[2]) {
        const bStr = match[2];
        b = bStr === '-' ? -1 : bStr === '+' ? 1 : parseFloat(bStr);
      }
      
      if (pattern.source.includes('([+-]\\d+)=0') && match[3]) {
        c = parseFloat(match[3]);
      } else if (pattern.source.includes('([+-]\\d+)=0') && match[2] && !match[3]) {
        // For ax^2 + c = 0 pattern
        c = parseFloat(match[2]);
      }
      
      return { a, b, c };
    }
  }
  
  return null;
}

/**
 * Format a number for display in LaTeX
 */
export function formatNumber(n: number): string {
  if (Number.isInteger(n)) {
    return n.toString();
  }
  // Round to reasonable precision
  return n.toFixed(4).replace(/\.?0+$/, '');
}

/**
 * Format a coefficient for display (omits 1, shows -1 as -)
 */
export function formatCoefficient(n: number, variable: string = 'x'): string {
  if (n === 1) return variable;
  if (n === -1) return `-${variable}`;
  return `${formatNumber(n)}${variable}`;
}
