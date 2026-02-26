import { describe, it, expect } from 'vitest';
import { Rating } from 'ts-fsrs';
import { createNewCard, reviewCard, getDueCards } from '../src/scheduler';

describe('createNewCard', () => {
  it('creates a card with the correct topic and chapter', () => {
    const card = createNewCard('algebra', 1);
    expect(card.topic).toBe('algebra');
    expect(card.chapter).toBe(1);
    expect(card.difficulty).toBe('easy');
  });

  it('creates a card with the specified difficulty', () => {
    const card = createNewCard('trig', 2, 'hard');
    expect(card.difficulty).toBe('hard');
  });
});

describe('reviewCard', () => {
  it('returns an updated card and nextDue after a Good review', () => {
    const card = createNewCard('algebra', 1);
    const { card: updated, nextDue } = reviewCard(card, Rating.Good);
    expect(updated).toBeDefined();
    expect(nextDue).toBeInstanceOf(Date);
    expect(updated.topic).toBe('algebra');
  });

  it('returns an updated card after an Easy review', () => {
    const card = createNewCard('trig', 2);
    const { card: updated } = reviewCard(card, Rating.Easy);
    expect(updated.reps).toBeGreaterThanOrEqual(1);
  });
});

describe('getDueCards', () => {
  it('returns cards that are due', () => {
    const pastDate = new Date(Date.now() - 1000);
    const futureDate = new Date(Date.now() + 86400000);
    const card1 = { ...createNewCard('algebra', 1), due: pastDate };
    const card2 = { ...createNewCard('trig', 2), due: futureDate };
    const due = getDueCards([card1, card2]);
    expect(due).toHaveLength(1);
    expect(due[0]!.topic).toBe('algebra');
  });

  it('returns empty array when no cards are due', () => {
    const futureDate = new Date(Date.now() + 86400000);
    const card = { ...createNewCard('algebra', 1), due: futureDate };
    expect(getDueCards([card])).toHaveLength(0);
  });
});
