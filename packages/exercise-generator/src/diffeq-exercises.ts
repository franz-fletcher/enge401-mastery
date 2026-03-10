import { nanoid } from 'nanoid';
import { eulerMethod } from '@enge401-mastery/math-engine';
import { solveExercise } from '@enge401-mastery/step-solver';
import type { Exercise, Difficulty } from './types';

/**
 * Generates a differential equation / Euler method exercise.
 */
export function generateDiffeqExercise(difficulty: Difficulty = 'easy'): Exercise {
  // dy/dx = ky with initial condition y(0) = y0
  const k = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3;
  const y0 = 1;
  const steps = 5;
  const h = 0.1;
  const result = eulerMethod((_, y) => k * y, 0, y0, h, steps);
  const finalY = result[steps]!.y;

  const exercise: Exercise = {
    id: nanoid(),
    chapter: 6,
    topic: 'Differential Equations — Euler\'s Method',
    difficulty,
    question: `Use Euler's method with $h=${h}$ and ${steps} steps to approximate $y(${steps * h})$ for $\\frac{dy}{dx} = ${k}y$, $y(0) = ${y0}$.`,
    answer: parseFloat(finalY.toFixed(4)),
    hints: [
      `$y_{n+1} = y_n + h \\cdot f(x_n, y_n)$`,
      `Here $f(x, y) = ${k}y$`,
    ],
  };

  try {
    (exercise as any).solution = solveExercise(exercise);
  } catch (e) {
    console.warn('Failed to generate solution for differential equation exercise:', e);
  }

  return exercise;
}
