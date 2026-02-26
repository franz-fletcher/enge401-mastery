import { nanoid } from 'nanoid';
import { differentiate } from '@enge401-mastery/math-engine';
import type { Exercise, Difficulty } from './types.js';

const POLY_TERMS = [
  { expr: 'x^2', diff: '2 * x', latex: 'x^2' },
  { expr: 'x^3', diff: '3 * x ^ 2', latex: 'x^3' },
  { expr: '3*x^2', diff: '6 * x', latex: '3x^2' },
  { expr: 'x^4', diff: '4 * x ^ 3', latex: 'x^4' },
  { expr: 'x^2 + 2*x', diff: '2 * x + 2', latex: 'x^2 + 2x' },
  { expr: 'sin(x)', diff: 'cos(x)', latex: '\\sin(x)' },
  { expr: 'cos(x)', diff: '-sin(x)', latex: '\\cos(x)' },
  { expr: 'exp(x)', diff: 'exp(x)', latex: 'e^x' },
];

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

/**
 * Generates a differentiation exercise.
 */
export function generateDifferentiationExercise(difficulty: Difficulty = 'easy'): Exercise {
  const term = randomItem(POLY_TERMS);

  return {
    id: nanoid(),
    chapter: 4,
    topic: 'Differentiation',
    difficulty,
    question: `Find $\\frac{d}{dx}\\left[${term.latex}\\right]$`,
    answer: differentiate(term.expr),
    hints: [
      'Apply the power rule: $\\frac{d}{dx}[x^n] = nx^{n-1}$',
    ],
  };
}
