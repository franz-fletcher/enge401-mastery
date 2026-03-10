import type { Exercise, Solution, StepSolver, Step } from '../../types.js';
import { SolverError } from '../../types.js';
import { StepBuilder } from '../../utils/step-builder.js';
import { parseQuadraticEquation, formatNumber } from '../../utils/expression-tree.js';
import {
  formatQuadraticEquation,
  formatQuadraticLeftSide,
  formatQuadraticFormula,
  formatTwoSolutions,
} from '../../utils/latex-formatter.js';

export class QuadraticEquationSolver implements StepSolver {
  canSolve(exercise: Exercise): boolean {
    // Check if this is a quadratic equation exercise
    const topic = exercise.topic.toLowerCase();
    const question = exercise.question;
    
    // Must be explicitly marked as quadratic
    if (!topic.includes('quadratic')) {
      return false;
    }
    
    // Must contain x^2 term
    if (!question.includes('x^2') && !question.includes('x²')) {
      return false;
    }
    
    return true;
  }

  solve(exercise: Exercise): Solution {
    const question = exercise.question;
    
    // Parse the equation
    const parsed = parseQuadraticEquation(question);
    if (!parsed) {
      throw new SolverError(
        `Failed to parse quadratic equation "${question}". Expected format: ax^2 + bx + c = 0`,
        exercise.id
      );
    }

    const { a, b, c } = parsed;

    // Validate coefficients
    if (a === 0) {
      throw new SolverError(
        `Coefficient 'a' cannot be zero. This is not a quadratic equation.`,
        exercise.id
      );
    }

    const builder = new StepBuilder();
    const steps: Step[] = [];

    // Step 1: Original Equation
    const originalEquation = formatQuadraticEquation(a, b, c);
    steps.push(
      builder.addStep({
        title: 'Original Equation',
        explanation: 'Start with the given quadratic equation in standard form.',
        expression: originalEquation,
        changeType: 'INITIAL_STATE',
        beforeState: '',
        afterState: originalEquation,
      }).build()[0]
    );

    // Step 2: Identify Coefficients
    const coefficientsLatex = `a = ${formatNumber(a)}, \\quad b = ${formatNumber(b)}, \\quad c = ${formatNumber(c)}`;
    steps.push(
      builder.addStep({
        title: 'Identify Coefficients',
        explanation: 'Identify the coefficients a, b, and c from the standard form ax^2 + bx + c = 0.',
        expression: coefficientsLatex,
        changeType: 'IDENTIFY_COEFFICIENTS',
        beforeState: originalEquation,
        afterState: coefficientsLatex,
      }).build()[steps.length]
    );

    // Step 3: Apply Quadratic Formula
    const quadraticFormula = 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}';
    steps.push(
      builder.addStep({
        title: 'Apply Quadratic Formula',
        explanation: 'Use the quadratic formula to find the solutions.',
        expression: quadraticFormula,
        changeType: 'APPLY_QUADRATIC_FORMULA',
        beforeState: coefficientsLatex,
        afterState: quadraticFormula,
        metadata: {
          formula: 'x = (-b ± √(b² - 4ac)) / 2a',
        },
      }).build()[steps.length]
    );

    // Step 4: Substitute Values
    const substitutedFormula = formatQuadraticFormula(a, b, c);
    steps.push(
      builder.addStep({
        title: 'Substitute Values',
        explanation: `Substitute a = ${formatNumber(a)}, b = ${formatNumber(b)}, and c = ${formatNumber(c)} into the formula.`,
        expression: substitutedFormula,
        changeType: 'SUBSTITUTE_VALUES',
        beforeState: quadraticFormula,
        afterState: substitutedFormula,
      }).build()[steps.length]
    );

    // Step 5: Calculate Discriminant
    const discriminant = b * b - 4 * a * c;
    const discriminantCalc = `b^2 - 4ac = (${formatNumber(b)})^2 - 4(${formatNumber(a)})(${formatNumber(c)}) = ${formatNumber(b * b)} - ${formatNumber(4 * a * c)} = ${formatNumber(discriminant)}`;
    
    steps.push(
      builder.addStep({
        title: 'Calculate Discriminant',
        explanation: 'Calculate the discriminant (b² - 4ac) to determine the nature of the solutions.',
        expression: discriminantCalc,
        changeType: 'SIMPLIFY_DISCRIMINANT',
        beforeState: substitutedFormula,
        afterState: discriminantCalc,
        metadata: {
          rule: `Discriminant = ${formatNumber(discriminant)}`,
        },
      }).build()[steps.length]
    );

    // Check discriminant
    if (discriminant < 0) {
      throw new SolverError(
        `The discriminant (${discriminant}) is negative. This equation has no real solutions (only complex solutions).`,
        exercise.id,
        5
      );
    }

    // Step 6: Calculate Square Root of Discriminant
    const sqrtDiscriminant = Math.sqrt(discriminant);
    const sqrtStep = `\\sqrt{${formatNumber(discriminant)}} = ${formatNumber(sqrtDiscriminant)}`;
    
    steps.push(
      builder.addStep({
        title: 'Calculate Square Root',
        explanation: 'Calculate the square root of the discriminant.',
        expression: sqrtStep,
        changeType: 'CALCULATE_SQUARE_ROOT',
        beforeState: discriminantCalc,
        afterState: sqrtStep,
      }).build()[steps.length]
    );

    // Step 7: Calculate Solutions
    const x1 = (-b + sqrtDiscriminant) / (2 * a);
    const x2 = (-b - sqrtDiscriminant) / (2 * a);
    
    const solutionCalc = `x = \\frac{${formatNumber(-b)} \\pm ${formatNumber(sqrtDiscriminant)}}{${formatNumber(2 * a)}}`;
    steps.push(
      builder.addStep({
        title: 'Calculate Solutions',
        explanation: 'Calculate the two solutions by adding and subtracting the square root.',
        expression: solutionCalc,
        changeType: 'CALCULATE_SOLUTIONS',
        beforeState: sqrtStep,
        afterState: solutionCalc,
      }).build()[steps.length]
    );

    // Step 8: Final Answer
    const finalAnswer = formatTwoSolutions(x1, x2);
    steps.push(
      builder.addStep({
        title: 'Final Solutions',
        explanation: 'The two solutions to the quadratic equation.',
        expression: finalAnswer,
        changeType: 'CALCULATE_SOLUTIONS',
        beforeState: solutionCalc,
        afterState: finalAnswer,
      }).build()[steps.length]
    );

    return {
      exerciseId: exercise.id,
      steps,
      finalAnswer: `x₁ = ${formatNumber(x1)}, x₂ = ${formatNumber(x2)}`,
      totalSteps: steps.length,
    };
  }
}
