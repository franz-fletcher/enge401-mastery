import { nanoid } from 'nanoid';
import { solveLinearEquation, solveQuadratic } from '@enge401-mastery/math-engine';
import { solveExercise } from '@enge401-mastery/step-solver';
import type { Exercise, Difficulty } from './types';

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generates a random linear equation exercise: ax + b = c
 */
export function generateLinearExercise(difficulty: Difficulty = 'easy'): Exercise {
  const range = difficulty === 'easy' ? 5 : difficulty === 'medium' ? 10 : 20;
  const a = randomInt(1, range);
  const b = randomInt(-range, range);
  const x = randomInt(-range, range);
  const c = a * x + b;

  const exercise: Exercise = {
    id: nanoid(),
    chapter: 1,
    topic: 'Linear Equations',
    difficulty,
    question: `Solve for $x$: $${a}x + (${b}) = ${c}$`,
    answer: solveLinearEquation(a, b, c),
    hints: [
      `Subtract ${b} from both sides`,
      `Divide both sides by ${a}`,
    ],
  };

  // Generate step-by-step solution
  try {
    exercise.solution = solveExercise(exercise);
  } catch {
    // If solver fails, exercise still works without solution
    console.warn('Failed to generate solution for linear exercise');
  }

  return exercise;
}

/**
 * Generates a random quadratic equation exercise: ax² + bx + c = 0
 */
export function generateQuadraticExercise(difficulty: Difficulty = 'medium'): Exercise {
  // Generate factored form (x - r1)(x - r2) to ensure integer roots
  const r1 = randomInt(-5, 5);
  const r2 = randomInt(-5, 5);
  const a = 1;
  const b = -(r1 + r2);
  const c = r1 * r2;

  const exercise: Exercise = {
    id: nanoid(),
    chapter: 1,
    topic: 'Quadratic Equations',
    difficulty,
    question: `Solve $x^2 ${b >= 0 ? '+' : ''} ${b}x ${c >= 0 ? '+' : ''} ${c} = 0$`,
    answer: JSON.stringify(solveQuadratic(a, b, c)),
    hints: [
      'Use the quadratic formula: $x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$',
      `The discriminant is $b^2 - 4ac = ${b * b - 4 * a * c}$`,
    ],
  };

  // Generate step-by-step solution
  try {
    exercise.solution = solveExercise(exercise);
  } catch {
    // If solver fails, exercise still works without solution
    console.warn('Failed to generate solution for quadratic exercise');
  }

  return exercise;
}

/**
 * Generates a random algebra exercise based on difficulty.
 */
export function generateAlgebraExercise(difficulty: Difficulty = 'easy'): Exercise {
  if (difficulty === 'easy') return generateLinearExercise(difficulty);
  return generateQuadraticExercise(difficulty);
}
