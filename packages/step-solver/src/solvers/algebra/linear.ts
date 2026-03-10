import type { Exercise, Solution, StepSolver, Step } from '../../types.js';
import { SolverError } from '../../types.js';
import { StepBuilder } from '../../utils/step-builder.js';
import { parseLinearEquation, formatNumber } from '../../utils/expression-tree.js';
import {
  formatLinearEquation,
  formatLinearLeftSide,
  formatSubtractionStep,
  formatDivisionStep,
  formatSolution,
} from '../../utils/latex-formatter.js';

export class LinearEquationSolver implements StepSolver {
  canSolve(exercise: Exercise): boolean {
    // Check if this is specifically a linear equation exercise
    const topic = exercise.topic.toLowerCase();
    const question = exercise.question.toLowerCase();
    
    // Must explicitly be a linear equation topic
    if (!topic.includes('linear')) {
      return false;
    }
    
    // Exclude other types
    if (topic.includes('quadratic') || topic.includes('system')) {
      return false;
    }
    
    // Check that question doesn't contain quadratic terms
    if (question.includes('x^2') || question.includes('x²')) {
      return false;
    }
    
    return true;
  }

  solve(exercise: Exercise): Solution {
    const question = exercise.question;
    
    // Parse the equation
    const parsed = parseLinearEquation(question);
    if (!parsed) {
      throw new SolverError(
        `Failed to parse equation "${question}". Expected format: ax + b = c or ax = c`,
        exercise.id
      );
    }

    const { a, b, c } = parsed;

    // Validate coefficients
    if (a === 0) {
      throw new SolverError(
        `Cannot solve equation: coefficient of x is zero. This is not a linear equation in x.`,
        exercise.id
      );
    }

    const builder = new StepBuilder();
    const steps: Step[] = [];

    // Step 1: Original Equation
    const originalEquation = formatLinearEquation(a, b, c);
    steps.push(
      builder.addStep({
        title: 'Original Equation',
        explanation: 'Start with the given linear equation.',
        expression: originalEquation,
        changeType: 'INITIAL_STATE',
        beforeState: '',
        afterState: originalEquation,
      }).build()[0]
    );

    // Step 2: Isolate the variable term (subtract b from both sides if b != 0)
    let currentLeft = formatLinearLeftSide(a, b);
    let currentRight = formatNumber(c);

    if (b !== 0) {
      const subtractionStep = formatSubtractionStep(currentLeft, currentRight, b);
      const newLeft = formatCoefficient(a, 'x');
      const newRight = formatNumber(c - b);
      
      steps.push(
        builder.addStep({
          title: 'Subtract from Both Sides',
          explanation: `Subtract ${formatNumber(Math.abs(b))} from both sides to isolate the term with x.`,
          expression: subtractionStep,
          changeType: 'SUBTRACT_FROM_BOTH_SIDES',
          beforeState: `${currentLeft} = ${currentRight}`,
          afterState: `${newLeft} = ${newRight}`,
          metadata: {
            rule: 'Subtraction Property of Equality',
          },
        }).build()[steps.length]
      );

      currentLeft = newLeft;
      currentRight = newRight;
    }

    // Step 3: Solve for x (divide both sides by a)
    const divisionStep = formatDivisionStep(currentLeft, currentRight, a);
    const solution = (c - b) / a;
    const solutionFormatted = formatSolution(solution);

    steps.push(
      builder.addStep({
        title: 'Divide Both Sides',
        explanation: `Divide both sides by ${formatNumber(a)} to solve for x.`,
        expression: divisionStep,
        changeType: 'DIVIDE_BOTH_SIDES',
        beforeState: `${currentLeft} = ${currentRight}`,
        afterState: solutionFormatted,
        metadata: {
          rule: 'Division Property of Equality',
        },
      }).build()[steps.length]
    );

    // Step 4: Final Answer
    steps.push(
      builder.addStep({
        title: 'Solution',
        explanation: 'The solution to the equation.',
        expression: solutionFormatted,
        changeType: 'CALCULATE_SOLUTIONS',
        beforeState: `${currentLeft} = ${currentRight}`,
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
}

/**
 * Format coefficient for display (helper function)
 */
function formatCoefficient(n: number, variable: string = 'x'): string {
  if (n === 1) return variable;
  if (n === -1) return `-${variable}`;
  return `${formatNumber(n)}${variable}`;
}
