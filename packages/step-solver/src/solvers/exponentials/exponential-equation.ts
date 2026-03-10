import type { Exercise, Solution, StepSolver, Step } from '../../types.js';
import { SolverError } from '../../types.js';
import { StepBuilder } from '../../utils/step-builder.js';
import { formatNumber } from '../../utils/expression-tree.js';

/**
 * Parse an exponential equation of the form a^x = b
 * Returns the base and result or null if parsing fails
 */
export function parseExponentialEquation(equation: string): { base: number; result: number } | null {
  // Remove LaTeX formatting
  let clean = equation.replace(/\$/g, '');

  // Extract just the equation part (after the last colon if present)
  // Handle formats like "Solve for x: 2^x = 8" or just "2^x = 8"
  const colonMatch = clean.match(/:\s*(.+)$/);
  if (colonMatch) {
    clean = colonMatch[1];
  }

  // Remove whitespace
  clean = clean.replace(/\s/g, '');

  // Match pattern: a^x = b where a and b are positive numbers
  // Handle various forms: 2^x = 8, 10^x = 100, etc.
  const pattern = /^(\d+)\^x=([+-]?\d+(?:\.\d+)?)$/;
  const match = clean.match(pattern);

  if (match) {
    const base = parseFloat(match[1]);
    const result = parseFloat(match[2]);
    return { base, result };
  }

  return null;
}

/**
 * Check if a number is a power of another number
 * Returns the exponent if it is, null otherwise
 */
export function isPowerOf(base: number, value: number): number | null {
  if (base <= 0 || value <= 0) return null;
  if (base === 1) return value === 1 ? 0 : null;

  // Check if value is a power of base
  const logResult = Math.log(value) / Math.log(base);
  const rounded = Math.round(logResult);

  // Check if it's close to an integer (within floating point tolerance)
  if (Math.abs(logResult - rounded) < 1e-10) {
    return rounded;
  }

  return null;
}

/**
 * Format an exponential equation a^x = b as LaTeX
 */
export function formatExponentialEquation(base: number, result: number): string {
  return `${formatNumber(base)}^x = ${formatNumber(result)}`;
}

/**
 * Format a logarithmic expression log(a) as LaTeX
 */
export function formatLog(value: number): string {
  return `\\log(${formatNumber(value)})`;
}

/**
 * Format a natural logarithmic expression ln(a) as LaTeX
 */
export function formatLn(value: number): string {
  return `\\ln(${formatNumber(value)})`;
}

/**
 * Format a fraction as LaTeX
 */
export function formatFraction(numerator: string, denominator: string): string {
  return `\\frac{${numerator}}{${denominator}}`;
}

/**
 * Solver for exponential equations of the form a^x = b
 */
export class ExponentialEquationSolver implements StepSolver {
  canSolve(exercise: Exercise): boolean {
    // Check if this is an exponential equation exercise
    const topic = exercise.topic.toLowerCase();
    const question = exercise.question.toLowerCase();

    // Must be explicitly marked as exponential
    if (!topic.includes('exponential')) {
      return false;
    }

    // Must contain the pattern a^x = b
    // Check for patterns like 2^x = 8, 10^x = 100, etc.
    const exponentialPattern = /\d+\^x\s*=\s*\d+/;
    if (!exponentialPattern.test(question)) {
      return false;
    }

    return true;
  }

  solve(exercise: Exercise): Solution {
    const question = exercise.question;

    // Parse the equation
    const parsed = parseExponentialEquation(question);
    if (!parsed) {
      throw new SolverError(
        `Failed to parse exponential equation "${question}". Expected format: a^x = b where a and b are positive numbers.`,
        exercise.id
      );
    }

    const { base, result } = parsed;

    // Validate inputs
    if (base <= 0) {
      throw new SolverError(
        `Invalid base: ${base}. The base of an exponential equation must be positive.`,
        exercise.id
      );
    }

    if (base === 1) {
      throw new SolverError(
        `Invalid base: 1. The base cannot be 1 (1^x = 1 for all x).`,
        exercise.id
      );
    }

    if (result <= 0) {
      throw new SolverError(
        `Invalid result: ${result}. The right side must be positive (a^x > 0 for all real x when a > 0).`,
        exercise.id
      );
    }

    const builder = new StepBuilder();
    const steps: Step[] = [];

    // Check if result is an exact power of base
    const exactExponent = isPowerOf(base, result);

    if (exactExponent !== null) {
      // Use the exact power approach for cleaner solutions
      return this.solveExactPower(exercise, base, result, exactExponent, builder);
    }

    // Step 1: Original Equation
    const originalEquation = formatExponentialEquation(base, result);
    steps.push(
      builder.addStep({
        title: 'Original Equation',
        explanation: 'Start with the given exponential equation.',
        expression: originalEquation,
        changeType: 'INITIAL_STATE',
        beforeState: '',
        afterState: originalEquation,
      }).build()[0]
    );

    // Step 2: Take Logarithm of Both Sides
    const logStep = `${formatLog(base)}^x = ${formatLog(result)}`;
    steps.push(
      builder.addStep({
        title: 'Take Logarithm of Both Sides',
        explanation: `Take the logarithm (base 10) of both sides to bring down the exponent.`,
        expression: logStep,
        changeType: 'TAKE_NATURAL_LOG',
        beforeState: originalEquation,
        afterState: logStep,
        metadata: {
          rule: 'Logarithm Property: log(a^b) = b * log(a)',
        },
      }).build()[steps.length]
    );

    // Step 3: Apply Power Rule
    const powerRuleStep = `x \\cdot ${formatLog(base)} = ${formatLog(result)}`;
    steps.push(
      builder.addStep({
        title: 'Apply Power Rule',
        explanation: `Apply the logarithm power rule: log(a^x) = x * log(a).`,
        expression: powerRuleStep,
        changeType: 'APPLY_EXPONENT_RULE',
        beforeState: logStep,
        afterState: powerRuleStep,
        metadata: {
          rule: 'Power Rule: log(a^b) = b * log(a)',
          formula: 'log(a^x) = x * log(a)',
        },
      }).build()[steps.length]
    );

    // Step 4: Isolate x
    const logBase = formatLog(base);
    const logResult = formatLog(result);
    const isolateStep = `x = ${formatFraction(logResult, logBase)}`;
    steps.push(
      builder.addStep({
        title: 'Isolate x',
        explanation: `Divide both sides by log(${formatNumber(base)}) to solve for x.`,
        expression: isolateStep,
        changeType: 'DIVIDE_BOTH_SIDES',
        beforeState: powerRuleStep,
        afterState: isolateStep,
        metadata: {
          rule: 'Division Property of Equality',
        },
      }).build()[steps.length]
    );

    // Step 5: Calculate Final Value
    const solution = Math.log(result) / Math.log(base);
    const solutionFormatted = `x = ${formatNumber(solution)}`;
    steps.push(
      builder.addStep({
        title: 'Calculate',
        explanation: `Calculate the numerical value using logarithms: log(${formatNumber(result)}) / log(${formatNumber(base)}) = ${formatNumber(solution)}.`,
        expression: solutionFormatted,
        changeType: 'CALCULATE_SOLUTIONS',
        beforeState: isolateStep,
        afterState: solutionFormatted,
      }).build()[steps.length]
    );

    return {
      exerciseId: exercise.id,
      steps,
      finalAnswer: formatNumber(solution),
      totalSteps: steps.length,
    };
  }

  /**
   * Solve when the result is an exact power of the base (e.g., 2^x = 8 where 8 = 2^3)
   */
  private solveExactPower(
    exercise: Exercise,
    base: number,
    result: number,
    exponent: number,
    builder: StepBuilder
  ): Solution {
    const steps: Step[] = [];

    // Step 1: Original Equation
    const originalEquation = formatExponentialEquation(base, result);
    steps.push(
      builder.addStep({
        title: 'Original Equation',
        explanation: 'Start with the given exponential equation.',
        expression: originalEquation,
        changeType: 'INITIAL_STATE',
        beforeState: '',
        afterState: originalEquation,
      }).build()[0]
    );

    // Step 2: Recognize the Power
    const recognizeStep = `${formatNumber(base)}^x = ${formatNumber(base)}^${exponent}`;
    steps.push(
      builder.addStep({
        title: 'Recognize the Power',
        explanation: `Recognize that ${formatNumber(result)} = ${formatNumber(base)}^${exponent}.`,
        expression: recognizeStep,
        changeType: 'APPLY_EXPONENT_RULE',
        beforeState: originalEquation,
        afterState: recognizeStep,
        metadata: {
          rule: 'Exponent Recognition',
          formula: `${formatNumber(result)} = ${formatNumber(base)}^${exponent}`,
        },
      }).build()[steps.length]
    );

    // Step 3: Equate Exponents
    const equateStep = `x = ${exponent}`;
    steps.push(
      builder.addStep({
        title: 'Equate Exponents',
        explanation: `Since the bases are equal, the exponents must be equal.`,
        expression: equateStep,
        changeType: 'CALCULATE_SOLUTIONS',
        beforeState: recognizeStep,
        afterState: equateStep,
        metadata: {
          rule: 'If a^x = a^y, then x = y (for a > 0, a ≠ 1)',
        },
      }).build()[steps.length]
    );

    // Step 4: Final Answer
    const finalStep = `x = ${formatNumber(exponent)}`;
    steps.push(
      builder.addStep({
        title: 'Solution',
        explanation: 'The solution to the exponential equation.',
        expression: finalStep,
        changeType: 'CALCULATE_SOLUTIONS',
        beforeState: equateStep,
        afterState: finalStep,
      }).build()[steps.length]
    );

    return {
      exerciseId: exercise.id,
      steps,
      finalAnswer: formatNumber(exponent),
      totalSteps: steps.length,
    };
  }
}
