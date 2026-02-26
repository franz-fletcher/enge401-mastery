import { FSRS, Rating, createEmptyCard } from 'ts-fsrs';
import type { Card, Grade } from 'ts-fsrs';
import type { ReviewCard, Difficulty } from './types.js';

const f = new FSRS({});

/**
 * Creates a new FSRS card for the given topic and chapter.
 */
export function createNewCard(topic: string, chapter: number, difficulty: Difficulty = 'easy'): ReviewCard {
  const base = createEmptyCard();
  return {
    ...base,
    topic,
    chapter,
    difficulty,
  };
}

/**
 * Processes a review for a card and returns the updated card + next due date.
 * @param card - The card to review
 * @param rating - Rating value (1=Again, 2=Hard, 3=Good, 4=Easy)
 */
export function reviewCard(
  card: ReviewCard,
  rating: Grade,
): { card: ReviewCard; nextDue: Date } {
  const now = new Date();
  const record = f.repeat(card as Card, now);
  const result = record[rating as Grade];
  return {
    card: { ...result.card, topic: card.topic, chapter: card.chapter, difficulty: card.difficulty },
    nextDue: result.card.due,
  };
}

/**
 * Returns all cards that are due for review (due date <= now).
 */
export function getDueCards(cards: ReviewCard[]): ReviewCard[] {
  const now = new Date();
  return cards.filter((c) => c.due <= now);
}

export { Rating };
