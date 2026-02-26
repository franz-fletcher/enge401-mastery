import type { Card } from 'ts-fsrs';

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface ReviewCard extends Card {
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
