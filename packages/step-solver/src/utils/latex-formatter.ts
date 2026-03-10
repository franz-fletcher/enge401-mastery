/**
 * Utility for formatting mathematical expressions as LaTeX
 */

import { formatNumber, formatCoefficient } from './expression-tree.js';

/**
 * Format a linear equation ax + b = c as LaTeX
 */
export function formatLinearEquation(a: number, b: number, c: number): string {
  const leftSide = formatLinearLeftSide(a, b);
  return `${leftSide} = ${formatNumber(c)}`;
}

/**
 * Format the left side of a linear equation
 */
export function formatLinearLeftSide(a: number, b: number): string {
  if (b === 0) {
    return formatCoefficient(a, 'x');
  }
  
  const aTerm = formatCoefficient(a, 'x');
  const bTerm = formatNumber(Math.abs(b));
  const sign = b > 0 ? '+' : '-';
  
  return `${aTerm} ${sign} ${bTerm}`;
}

/**
 * Format a quadratic equation ax^2 + bx + c = 0 as LaTeX
 */
export function formatQuadraticEquation(a: number, b: number, c: number): string {
  const leftSide = formatQuadraticLeftSide(a, b, c);
  return `${leftSide} = 0`;
}

/**
 * Format the left side of a quadratic equation
 */
export function formatQuadraticLeftSide(a: number, b: number, c: number): string {
  const parts: string[] = [];
  
  // ax^2 term
  if (a !== 0) {
    if (a === 1) {
      parts.push('x^2');
    } else if (a === -1) {
      parts.push('-x^2');
    } else {
      parts.push(`${formatNumber(a)}x^2`);
    }
  }
  
  // bx term
  if (b !== 0) {
    const bFormatted = formatNumber(Math.abs(b));
    if (b === 1 && parts.length > 0) {
      parts.push('+ x');
    } else if (b === 1) {
      parts.push('x');
    } else if (b === -1) {
      parts.push('- x');
    } else if (b > 0 && parts.length > 0) {
      parts.push(`+ ${bFormatted}x`);
    } else if (b > 0) {
      parts.push(`${bFormatted}x`);
    } else {
      parts.push(`- ${bFormatted}x`);
    }
  }
  
  // c term
  if (c !== 0 || parts.length === 0) {
    const cFormatted = formatNumber(Math.abs(c));
    if (c > 0 && parts.length > 0) {
      parts.push(`+ ${cFormatted}`);
    } else if (c > 0) {
      parts.push(cFormatted);
    } else {
      parts.push(`- ${cFormatted}`);
    }
  }
  
  return parts.join(' ');
}

/**
 * Format the quadratic formula with substituted values
 */
export function formatQuadraticFormula(a: number, b: number, c: number): string {
  const discriminant = b * b - 4 * a * c;
  const discriminantLatex = discriminant >= 0 
    ? formatNumber(discriminant) 
    : `(${formatNumber(discriminant)})`;
  
  return `x = \\frac{${formatNumber(-b)} \\pm \\sqrt{${discriminantLatex}}}{${formatNumber(2 * a)}}`;
}

/**
 * Format a step showing subtraction from both sides
 */
export function formatSubtractionStep(leftBefore: string, rightBefore: string, value: number): string {
  const absValue = Math.abs(value);
  const sign = value > 0 ? '-' : '+';
  return `${leftBefore} ${sign} ${formatNumber(absValue)} = ${rightBefore} ${sign} ${formatNumber(absValue)}`;
}

/**
 * Format a step showing division of both sides
 */
export function formatDivisionStep(leftBefore: string, rightBefore: string, divisor: number): string {
  return `\\frac{${leftBefore}}{${formatNumber(divisor)}} = \\frac{${rightBefore}}{${formatNumber(divisor)}}`;
}

/**
 * Format a solution value
 */
export function formatSolution(value: number): string {
  return `x = ${formatNumber(value)}`;
}

/**
 * Format two solutions
 */
export function formatTwoSolutions(x1: number, x2: number): string {
  return `x_1 = ${formatNumber(x1)}, \\quad x_2 = ${formatNumber(x2)}`;
}

/**
 * Escape special LaTeX characters in text
 */
export function escapeLatex(text: string): string {
  return text
    .replace(/\\/g, '\\textbackslash{}')
    .replace(/&/g, '\\&')
    .replace(/%/g, '\\%')
    .replace(/\$/g, '\\$')
    .replace(/#/g, '\\#')
    .replace(/_/g, '\\_')
    .replace(/{/g, '\\{')
    .replace(/}/g, '\\}')
    .replace(/~/g, '\\textasciitilde{}')
    .replace(/\^/g, '\\textasciicircum{}');
}
