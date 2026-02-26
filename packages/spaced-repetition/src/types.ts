import type { Card } from 'ts-fsrs';

export type Difficulty = 'easy' | 'medium' | 'hard';

// Omit the difficulty property from Card and add our own
export interface ReviewCard extends Omit<Card, 'difficulty'> {
  topic: string;
  chapter: number;
  difficulty: Difficulty;
}

export interface ReviewLog {
  cardId: string;
  rating: number;
  reviewedAt: Date;
  nextDue: Date;
}
