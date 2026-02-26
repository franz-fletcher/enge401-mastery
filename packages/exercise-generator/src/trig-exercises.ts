import { nanoid } from 'nanoid';
import { degreesToRadians, unitCircleValue } from '@enge401-mastery/math-engine';
import type { Exercise, Difficulty, TrigFunction } from './types.js';

const STANDARD_ANGLES = [0, 30, 45, 60, 90, 120, 135, 150, 180];
const TRIG_FNS: TrigFunction[] = ['sin', 'cos', 'tan'];

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

/**
 * Generates a unit circle value exercise.
 */
export function generateTrigExercise(difficulty: Difficulty = 'easy'): Exercise {
  const angle = randomItem(STANDARD_ANGLES);
  const fn = randomItem(TRIG_FNS);
  const answer = unitCircleValue(angle, fn) ?? 'undefined';

  return {
    id: nanoid(),
    chapter: 2,
    topic: 'Trigonometry — Unit Circle',
    difficulty,
    question: `Find the exact value of $\\${fn}(${angle}^\\circ)$`,
    answer,
    hints: [
      `Convert ${angle}° to radians: $${angle}° = ${degreesToRadians(angle).toFixed(4)}$ rad`,
      'Use the unit circle to find the exact value',
    ],
  };
}
