import type { Exercise, Solution, StepSolver, Step } from '../../types.js';
import { SolverError } from '../../types.js';
import { StepBuilder } from '../../utils/step-builder.js';
import { unitCircleValue, degreesToRadians } from '@enge401-mastery/math-engine';

// Type for the trig functions we support in this solver
type SupportedTrigFunction = 'sin' | 'cos' | 'tan';

/**
 * Parses a trig question to extract the function and angle.
 * Expected format: "Find the exact value of $\sin(30^\circ)$"
 */
function parseTrigQuestion(question: string): { fn: SupportedTrigFunction; angle: number } | null {
  // Match patterns like \sin(30^\circ), \cos(45°), \tan(60)
  const patterns = [
    /\\?(sin|cos|tan)\s*\(?\s*(\d+)\s*(?:\^\\circ|°|\s*degrees?|\s*deg)?\s*\)?/i,
    /(sin|cos|tan)\s*\(?\s*(\d+)\s*(?:\^\\circ|°|\s*degrees?|\s*deg)?\s*\)?/i,
  ];

  for (const pattern of patterns) {
    const match = question.match(pattern);
    if (match) {
      const fn = match[1]!.toLowerCase() as SupportedTrigFunction;
      const angle = parseInt(match[2]!, 10);
      return { fn, angle };
    }
  }

  return null;
}

/**
 * Converts degrees to a LaTeX fraction of π.
 * Returns LaTeX string like "\\frac{\\pi}{6}"
 */
function degreesToRadiansLatex(degrees: number): string {
  const normalized = ((degrees % 360) + 360) % 360;
  
  // Map standard angles to π fractions
  const angleMap: Record<number, string> = {
    0: '0',
    30: '\\frac{\\pi}{6}',
    45: '\\frac{\\pi}{4}',
    60: '\\frac{\\pi}{3}',
    90: '\\frac{\\pi}{2}',
    120: '\\frac{2\\pi}{3}',
    135: '\\frac{3\\pi}{4}',
    150: '\\frac{5\\pi}{6}',
    180: '\\pi',
    210: '\\frac{7\\pi}{6}',
    225: '\\frac{5\\pi}{4}',
    240: '\\frac{4\\pi}{3}',
    270: '\\frac{3\\pi}{2}',
    300: '\\frac{5\\pi}{3}',
    315: '\\frac{7\\pi}{4}',
    330: '\\frac{11\\pi}{6}',
    360: '2\\pi',
  };

  return angleMap[normalized] || degreesToRadians(degrees).toFixed(4);
}

/**
 * Determines the quadrant for a given angle in degrees.
 */
function getQuadrant(angle: number): { quadrant: number; range: string; signInfo: Record<SupportedTrigFunction, string> } {
  const normalized = ((angle % 360) + 360) % 360;
  
  if (normalized >= 0 && normalized < 90) {
    return {
      quadrant: 1,
      range: '0° to 90°',
      signInfo: { sin: 'positive', cos: 'positive', tan: 'positive' },
    };
  } else if (normalized >= 90 && normalized < 180) {
    return {
      quadrant: 2,
      range: '90° to 180°',
      signInfo: { sin: 'positive', cos: 'negative', tan: 'negative' },
    };
  } else if (normalized >= 180 && normalized < 270) {
    return {
      quadrant: 3,
      range: '180° to 270°',
      signInfo: { sin: 'negative', cos: 'negative', tan: 'positive' },
    };
  } else {
    return {
      quadrant: 4,
      range: '270° to 360°',
      signInfo: { sin: 'negative', cos: 'positive', tan: 'negative' },
    };
  }
}

/**
 * Calculates the reference angle for a given angle in degrees.
 */
function getReferenceAngle(angle: number): number {
  const normalized = ((angle % 360) + 360) % 360;
  
  if (normalized <= 90) {
    return normalized;
  } else if (normalized <= 180) {
    return 180 - normalized;
  } else if (normalized <= 270) {
    return normalized - 180;
  } else {
    return 360 - normalized;
  }
}

/**
 * Formats a trig value as LaTeX.
 * Converts math-engine format (e.g., "sqrt(3)/2") to LaTeX (e.g., "\\frac{\\sqrt{3}}{2}")
 */
function formatTrigValue(value: string | null): string {
  if (value === null || value === 'undefined') {
    return '\\text{undefined}';
  }

  // Handle negative values
  const isNegative = value.startsWith('-');
  const absValue = isNegative ? value.slice(1) : value;

  // Convert sqrt(n) to \sqrt{n}
  let latex = absValue.replace(/sqrt\((\d+)\)/g, '\\sqrt{$1}');

  // Convert fractions to \frac{}{} format
  if (latex.includes('/')) {
    const [numerator, denominator] = latex.split('/');
    latex = `\\frac{${numerator}}{${denominator}}`;
  }

  return isNegative ? `-${latex}` : latex;
}

/**
 * Gets the sign (+ or -) for a trig function in a given quadrant.
 */
function getTrigSign(fn: SupportedTrigFunction, quadrant: number): string {
  const signs: Record<SupportedTrigFunction, Record<number, string>> = {
    sin: { 1: '+', 2: '+', 3: '-', 4: '-' },
    cos: { 1: '+', 2: '-', 3: '-', 4: '+' },
    tan: { 1: '+', 2: '-', 3: '+', 4: '-' },
  };

  return signs[fn][quadrant] || '+';
}

/**
 * Solver for unit circle trigonometry exercises.
 * Generates step-by-step solutions for finding exact values of sin, cos, tan.
 */
export class UnitCircleSolver implements StepSolver {
  canSolve(exercise: Exercise): boolean {
    const topic = exercise.topic.toLowerCase();
    const question = exercise.question.toLowerCase();

    // Check if this is a trigonometry or unit circle exercise
    if (topic.includes('trigonometry') || topic.includes('unit circle')) {
      return true;
    }

    // Check if question contains trig functions with angles
    if (/\\?(sin|cos|tan)/.test(question) && /\d+/.test(question)) {
      return true;
    }

    return false;
  }

  solve(exercise: Exercise): Solution {
    const parsed = parseTrigQuestion(exercise.question);
    if (!parsed) {
      throw new SolverError(
        `Failed to parse trigonometry question "${exercise.question}". ` +
        `Expected format: "Find the exact value of $\\\\sin(30^\\\\circ)$"`,
        exercise.id
      );
    }

    const { fn, angle } = parsed;

    // Validate that this is a standard angle
    const exactValue = unitCircleValue(angle, fn);
    if (exactValue === null) {
      throw new SolverError(
        `Angle ${angle}° is not a standard unit circle angle. ` +
        `Supported angles: 0°, 30°, 45°, 60°, 90°, 120°, 135°, 150°, 180°, and their multiples.`,
        exercise.id
      );
    }

    const builder = new StepBuilder();
    const steps: Step[] = [];

    // Step 1: Original Problem
    const originalExpression = `\\${fn}(${angle}^\\circ)`;
    steps.push(
      builder.addStep({
        title: 'Original Problem',
        explanation: `Find the exact value of $\\${fn}(${angle}^\\circ)$ using the unit circle.`,
        expression: originalExpression,
        changeType: 'INITIAL_STATE',
        beforeState: '',
        afterState: originalExpression,
      }).build()[0]
    );

    // Step 2: Convert to Radians
    const radiansLatex = degreesToRadiansLatex(angle);
    const conversionStep = `${angle}^\\circ = ${radiansLatex} \\text{ radians}`;
    steps.push(
      builder.addStep({
        title: 'Convert to Radians',
        explanation: `Convert ${angle}° to radians using the conversion factor $\\frac{\\pi}{180}$.`,
        expression: conversionStep,
        changeType: 'SIMPLIFY_TRIG_EXPRESSION',
        beforeState: originalExpression,
        afterState: `\\${fn}(${radiansLatex})`,
        metadata: {
          rule: 'Degree to Radian Conversion',
          formula: '$\\theta_{rad} = \\theta_{deg} \\times \\frac{\\pi}{180}$',
        },
      }).build()[steps.length]
    );

    // Step 3: Identify Quadrant
    const quadrantInfo = getQuadrant(angle);
    const quadrantStep = `${angle}° \\text{ is in Quadrant ${quadrantInfo.quadrant} (${quadrantInfo.range})}`;
    const signExplanation = `where $\\${fn}$ is ${quadrantInfo.signInfo[fn]}`;
    
    steps.push(
      builder.addStep({
        title: 'Identify Quadrant',
        explanation: `${angle}° lies in Quadrant ${quadrantInfo.quadrant} (${quadrantInfo.range}), ` +
          `where ${fn} is ${quadrantInfo.signInfo[fn]}.`,
        expression: `${quadrantStep} \\text{ ${signExplanation}}`,
        changeType: 'APPLY_TRIG_IDENTITY',
        beforeState: `\\${fn}(${radiansLatex})`,
        afterState: `${getTrigSign(fn, quadrantInfo.quadrant)}\\${fn}(${getReferenceAngle(angle)}^\\circ)`,
        metadata: {
          rule: 'ASTC Rule (All Students Take Calculus)',
          formula: `Quadrant ${quadrantInfo.quadrant}: ${fn} is ${quadrantInfo.signInfo[fn]}`,
        },
      }).build()[steps.length]
    );

    // Step 4: Reference Angle
    const referenceAngle = getReferenceAngle(angle);
    const referenceValue = unitCircleValue(referenceAngle, fn);
    const formattedReferenceValue = formatTrigValue(referenceValue);
    
    let referenceExplanation: string;
    if (referenceAngle === angle) {
      referenceExplanation = `The angle ${angle}° is already a reference angle (in Quadrant I).`;
    } else {
      referenceExplanation = `The reference angle for ${angle}° is ${referenceAngle}°. ` +
        `From the unit circle, $\\${fn}(${referenceAngle}^\\circ) = ${formattedReferenceValue}$.`;
    }

    const sign = getTrigSign(fn, quadrantInfo.quadrant) === '-' ? '-' : '';
    const referenceStep = referenceAngle === angle
      ? `\\${fn}(${angle}^\\circ) = ${formattedReferenceValue}`
      : `\\${fn}(${angle}^\\circ) = ${sign}\\${fn}(${referenceAngle}^\\circ) = ${sign}${formattedReferenceValue}`;

    steps.push(
      builder.addStep({
        title: 'Reference Angle',
        explanation: referenceExplanation,
        expression: referenceStep,
        changeType: 'APPLY_TRIG_IDENTITY',
        beforeState: `${getTrigSign(fn, quadrantInfo.quadrant)}\\${fn}(${referenceAngle}^\\circ)`,
        afterState: `${sign}${formattedReferenceValue}`,
        metadata: {
          rule: 'Reference Angle Theorem',
          formula: `Reference angle = ${referenceAngle}°`,
        },
      }).build()[steps.length]
    );

    // Step 5: Final Answer
    const finalValue = formatTrigValue(exactValue);
    const finalAnswer = `\\${fn}(${angle}^\\circ) = ${finalValue}`;
    
    steps.push(
      builder.addStep({
        title: 'Final Answer',
        explanation: `The exact value of $\\${fn}(${angle}^\\circ)$ is $${finalValue}$.`,
        expression: finalAnswer,
        changeType: 'CALCULATE_SOLUTIONS',
        beforeState: referenceStep,
        afterState: finalValue,
      }).build()[steps.length]
    );

    return {
      exerciseId: exercise.id,
      steps,
      finalAnswer: finalValue,
      totalSteps: steps.length,
    };
  }
}
