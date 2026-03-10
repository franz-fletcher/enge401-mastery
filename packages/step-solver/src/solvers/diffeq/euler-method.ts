import type { Exercise, Solution, StepSolver, Step } from '../../types.js';
import { SolverError } from '../../types.js';
import { StepBuilder } from '../../utils/step-builder.js';

/**
 * Parsed differential equation parameters
 */
interface DiffEqParams {
  k: number;
  y0: number;
  h: number;
  steps: number;
  targetX: number;
}

/**
 * Single iteration result from Euler's method
 */
interface EulerIteration {
  n: number;
  xn: number;
  yn: number;
  f_xy: number;
  y_next: number;
}

/**
 * Solver for differential equations using Euler's method
 * Generates step-by-step solutions for dy/dx = ky with initial conditions
 */
export class EulerMethodSolver implements StepSolver {
  canSolve(exercise: Exercise): boolean {
    const topic = exercise.topic.toLowerCase();
    const question = exercise.question.toLowerCase();
    
    // Check if this is a differential equation or Euler's method exercise
    return topic.includes('differential') || 
           topic.includes('euler') || 
           question.includes("euler's method") ||
           question.includes('euler method');
  }

  solve(exercise: Exercise): Solution {
    const params = parseDiffEqQuestion(exercise.question);
    if (!params) {
      throw new SolverError(
        `Failed to parse differential equation question: "${exercise.question}". ` +
        `Expected format: "Use Euler's method with h=X and N steps to approximate y(X) for dy/dx = ky, y(0) = y0"`,
        exercise.id
      );
    }

    const builder = new StepBuilder();
    const steps: Step[] = [];

    // Step 1: Original Problem
    const originalProblem = formatOriginalProblem(params);
    steps.push(
      builder.addStep({
        title: 'Original Problem',
        explanation: 'We are given a differential equation with initial conditions and asked to approximate the solution using Euler\'s method.',
        expression: originalProblem,
        changeType: 'INITIAL_STATE',
        beforeState: '',
        afterState: originalProblem,
      }).build()[0]
    );

    // Step 2: Euler's Formula
    const eulerFormula = String.raw`y_{n+1} = y_n + h \cdot f(x_n, y_n)`;
    steps.push(
      builder.addStep({
        title: "Euler's Method Formula",
        explanation: 'Euler\'s method uses this iterative formula to approximate the solution. At each step, we use the slope at the current point to estimate the next value.',
        expression: eulerFormula,
        changeType: 'IDENTIFY_COEFFICIENTS',
        beforeState: originalProblem,
        afterState: eulerFormula,
        metadata: {
          formula: "Euler's Method",
          rule: 'Iterative approximation using tangent line',
        },
      }).build()[steps.length]
    );

    // Step 3: Initial Setup
    const fDefinition = String.raw`f(x, y) = ${params.k}y`;
    const initialSetup = String.raw`\begin{aligned}
&x_0 = 0, \quad y_0 = ${params.y0} \\
&h = ${params.h}, \quad \text{steps} = ${params.steps} \\
&f(x, y) = ${params.k}y
\end{aligned}`;
    
    steps.push(
      builder.addStep({
        title: 'Initial Setup',
        explanation: `We identify the initial conditions and the step size. The function f(x, y) represents the right-hand side of the differential equation dy/dx = ${params.k}y.`,
        expression: initialSetup,
        changeType: 'SUBSTITUTE_VALUES',
        beforeState: eulerFormula,
        afterState: initialSetup,
        metadata: {
          formula: fDefinition,
        },
      }).build()[steps.length]
    );

    // Step 4: Calculate iterations
    const iterations = calculateEulerSteps(params.k, params.y0, params.h, params.steps);
    const iterationTable = formatIterationTable(iterations, params.k, params.h);
    
    steps.push(
      builder.addStep({
        title: 'Iteration Steps',
        explanation: `We apply Euler's formula iteratively for ${params.steps} steps. At each step, we calculate the slope f(x_n, y_n) = ${params.k}y_n and use it to find the next approximation y_{n+1} = y_n + ${params.h} \cdot f(x_n, y_n).`,
        expression: iterationTable,
        changeType: 'CALCULATE_SOLUTIONS',
        beforeState: initialSetup,
        afterState: iterationTable,
      }).build()[steps.length]
    );

    // Step 5: Final Approximation
    const finalY = iterations[iterations.length - 1]!.y_next;
    const finalResult = String.raw`y(${params.targetX}) \approx ${formatNumber(finalY)}`;
    
    steps.push(
      builder.addStep({
        title: 'Final Approximation',
        explanation: `After ${params.steps} steps, we arrive at the approximate value of y at x = ${params.targetX}.`,
        expression: finalResult,
        changeType: 'CALCULATE_SOLUTIONS',
        beforeState: iterationTable,
        afterState: finalResult,
      }).build()[steps.length]
    );

    return {
      exerciseId: exercise.id,
      steps,
      finalAnswer: formatNumber(finalY),
      totalSteps: steps.length,
    };
  }
}

/**
 * Parse a differential equation question to extract parameters
 * Expected format: "Use Euler's method with h=0.1 and 5 steps to approximate y(0.5) for dy/dx = 2y, y(0) = 1"
 */
export function parseDiffEqQuestion(question: string): DiffEqParams | null {
  // Extract h (step size)
  const hMatch = question.match(/h\s*=\s*([0-9.]+)/);
  if (!hMatch) return null;
  const h = parseFloat(hMatch[1]!);

  // Extract number of steps
  const stepsMatch = question.match(/(\d+)\s+steps?/);
  if (!stepsMatch) return null;
  const steps = parseInt(stepsMatch[1]!, 10);

  // Extract target x value (inside y(...))
  const targetXMatch = question.match(/y\(([0-9.]+)\)/);
  if (!targetXMatch) return null;
  const targetX = parseFloat(targetXMatch[1]!);

  // Verify: targetX should equal steps * h
  if (Math.abs(targetX - steps * h) > 0.001) {
    // Allow small floating point differences
    return null;
  }

  // Extract k (coefficient in dy/dx = ky)
  const kMatch = question.match(/dy\s*\/\s*dx\s*=\s*([0-9.]+)\s*y/);
  if (!kMatch) return null;
  const k = parseFloat(kMatch[1]!);

  // Extract y0 (initial condition y(0) = y0)
  const y0Match = question.match(/y\(0\)\s*=\s*([0-9.]+)/);
  if (!y0Match) return null;
  const y0 = parseFloat(y0Match[1]!);

  return { k, y0, h, steps, targetX };
}

/**
 * Calculate all iterations of Euler's method
 */
export function calculateEulerSteps(
  k: number,
  y0: number,
  h: number,
  steps: number
): EulerIteration[] {
  const iterations: EulerIteration[] = [];
  let xn = 0;
  let yn = y0;

  for (let n = 0; n < steps; n++) {
    const f_xy = k * yn;
    const y_next = yn + h * f_xy;

    iterations.push({
      n,
      xn,
      yn,
      f_xy,
      y_next,
    });

    xn = parseFloat((xn + h).toFixed(10)); // Avoid floating point errors
    yn = y_next;
  }

  return iterations;
}

/**
 * Format the original problem in LaTeX
 */
function formatOriginalProblem(params: DiffEqParams): string {
  return String.raw`\begin{aligned}
&\frac{dy}{dx} = ${params.k}y, \quad y(0) = ${params.y0} \\
&\text{Approximate } y(${params.targetX}) \text{ using Euler's method with } h = ${params.h}
\end{aligned}`;
}

/**
 * Format the iteration table in LaTeX
 */
function formatIterationTable(
  iterations: EulerIteration[],
  k: number,
  h: number
): string {
  const rows = iterations.map((iter) => {
    const xnStr = formatNumber(iter.xn);
    const ynStr = formatNumber(iter.yn);
    const fStr = formatNumber(iter.f_xy);
    const yNextStr = formatNumber(iter.y_next);
    
    return String.raw`${iter.n} & ${xnStr} & ${ynStr} & ${k} \cdot ${ynStr} = ${fStr} & ${ynStr} + ${h} \cdot ${fStr} = ${yNextStr} \\`;
  });

  return String.raw`\begin{array}{|c|c|c|c|c|}
\hline
n & x_n & y_n & f(x_n, y_n) = ${k}y_n & y_{n+1} = y_n + ${h}f \\
\hline
${rows.join('\n')}
\hline
\end{array}`;
}

/**
 * Format a number for display, avoiding unnecessary decimals
 */
function formatNumber(n: number): string {
  // Handle very small numbers
  if (Math.abs(n) < 0.0001 && n !== 0) {
    return n.toExponential(2);
  }
  
  // Round to 4 decimal places and remove trailing zeros
  const rounded = Math.round(n * 10000) / 10000;
  
  // Convert to string and remove trailing zeros after decimal
  let str = rounded.toString();
  if (str.includes('.')) {
    str = str.replace(/\.?0+$/, '');
  }
  
  return str;
}
