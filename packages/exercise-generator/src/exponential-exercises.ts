import { nanoid } from 'nanoid';
import { solveExponentialEquation, compoundGrowth } from '@enge401-mastery/math-engine';
import type { Exercise, Difficulty } from './types';

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generates an exponential equation exercise: solve a^x = b.
 */
export function generateExponentialExercise(difficulty: Difficulty = 'easy'): Exercise {
  const bases = [2, 3, 5, 10];
  const base = bases[randomInt(0, bases.length - 1)]!;
  const x = randomInt(1, difficulty === 'easy' ? 3 : 6);
  const result = Math.pow(base, x);

  return {
    id: nanoid(),
    chapter: 3,
    topic: 'Exponential Equations',
    difficulty,
    question: `Solve for $x$: $${base}^x = ${result}$`,
    answer: solveExponentialEquation(base, result),
    hints: [
      `Take $\\log$ of both sides`,
      `$x = \\frac{\\log(${result})}{\\log(${base})}$`,
    ],
  };
}

/**
 * Generates a compound interest exercise.
 */
export function generateCompoundInterestExercise(difficulty: Difficulty = 'medium'): Exercise {
  const principal = randomInt(500, 5000);
  const rate = randomInt(2, 10) / 100;
  const time = randomInt(1, 10);
  const answer = compoundGrowth(principal, rate, time, 12);

  return {
    id: nanoid(),
    chapter: 3,
    topic: 'Compound Growth',
    difficulty,
    question: `An investment of $\\$${principal}$ is compounded monthly at ${rate * 100}\\% per year for ${time} year(s). Find the final amount.`,
    answer: parseFloat(answer.toFixed(2)),
    hints: [
      `Use $A = P\\left(1 + \\frac{r}{n}\\right)^{nt}$`,
      `$P=${principal}$, $r=${rate}$, $n=12$, $t=${time}$`,
    ],
  };
}
