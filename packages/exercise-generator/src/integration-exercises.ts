import { nanoid } from 'nanoid';
import type { Exercise, Difficulty } from './types';

const INTEGRALS = [
  { expr: 'x', latex: 'x', answer: 'x^2/2' },
  { expr: 'x^2', latex: 'x^2', answer: 'x^3/3' },
  { expr: '2*x', latex: '2x', answer: 'x^2' },
  { expr: 'x^3', latex: 'x^3', answer: 'x^4/4' },
  { expr: 'cos(x)', latex: '\\cos(x)', answer: 'sin(x)' },
  { expr: 'sin(x)', latex: '\\sin(x)', answer: '-cos(x)' },
];

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

/**
 * Generates an indefinite integration exercise.
 */
export function generateIntegrationExercise(difficulty: Difficulty = 'easy'): Exercise {
  const item = randomItem(INTEGRALS);

  return {
    id: nanoid(),
    chapter: 5,
    topic: 'Integration',
    difficulty,
    question: `Find $\\int ${item.latex}\\, dx$`,
    answer: `${item.answer} + C`,
    hints: [
      'Apply the power rule for integration: $\\int x^n\\, dx = \\frac{x^{n+1}}{n+1} + C$',
    ],
  };
}
