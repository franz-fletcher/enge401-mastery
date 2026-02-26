export type Difficulty = 'easy' | 'medium' | 'hard';
export type TrigFunction = 'sin' | 'cos' | 'tan' | 'csc' | 'sec' | 'cot';

export interface Exercise {
  id: string;
  chapter: number;
  topic: string;
  difficulty: Difficulty;
  question: string;   // LaTeX-formatted question
  answer: string | number;
  hints?: string[];
}

export interface ExerciseGenerator {
  generate(difficulty?: Difficulty): Exercise;
}
