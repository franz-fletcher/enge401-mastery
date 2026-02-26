'use server';

import { auth } from '@/auth';
import { db } from '@/db';
import { progress, spacedRepetition, studySessions } from '@/db/schema';
import { eq, and, gte, sql } from 'drizzle-orm';
import { startOfDay, endOfDay } from 'date-fns';

export interface UserStats {
  streak: number;
  accuracy: number;
  completedToday: number;
  reviewsDue: number;
}

export interface StudyDay {
  date: Date;
  exercisesCompleted: number;
  reviewsCompleted: number;
}

export async function getUserStats(): Promise<UserStats> {
  const session = await auth();
  
  if (!session?.user?.id) {
    return {
      streak: 0,
      accuracy: 0,
      completedToday: 0,
      reviewsDue: 0,
    };
  }

  const userId = session.user.id;
  const today = new Date();
  const todayStart = startOfDay(today);
  const todayEnd = endOfDay(today);

  // Get today's progress entries
  const todayProgress = await db
    .select()
    .from(progress)
    .where(
      and(
        eq(progress.userId, userId),
        gte(progress.completedAt, todayStart),
        sql`${progress.completedAt} <= ${todayEnd}`
      )
    );

  // Calculate accuracy from today's progress
  const correctAttempts = todayProgress.filter(p => p.accuracy >= 0.8).length;
  const accuracy = todayProgress.length > 0 
    ? Math.round((todayProgress.reduce((sum, p) => sum + p.accuracy, 0) / todayProgress.length) * 100) 
    : 0;

  // Get reviews due (using spacedRepetition table)
  const now = new Date();
  const dueReviews = await db
    .select()
    .from(spacedRepetition)
    .where(
      and(
        eq(spacedRepetition.userId, userId),
        sql`${spacedRepetition.nextReviewAt} <= ${now}`
      )
    );

  // Get streak (simplified - count consecutive days with activity)
  const streak = await calculateStreak(userId);

  return {
    streak,
    accuracy,
    completedToday: todayProgress.length,
    reviewsDue: dueReviews.length,
  };
}

async function calculateStreak(userId: string): Promise<number> {
  // Get all progress entries ordered by date
  const progressEntries = await db
    .select({
      date: sql<Date>`date(${progress.completedAt})`,
    })
    .from(progress)
    .where(eq(progress.userId, userId))
    .orderBy(sql`date(${progress.completedAt}) DESC`)
    .groupBy(sql`date(${progress.completedAt})`);

  if (progressEntries.length === 0) return 0;

  let streak = 0;
  const today = startOfDay(new Date());
  let currentDate = today;
  let foundToday = false;

  for (const entry of progressEntries) {
    const entryDate = startOfDay(entry.date);
    const diffDays = Math.floor(
      (currentDate.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 0 && !foundToday) {
      // Found today
      streak++;
      foundToday = true;
      currentDate = entryDate;
    } else if (diffDays === 1) {
      // Consecutive day
      streak++;
      currentDate = entryDate;
    } else if (diffDays === 0 && foundToday) {
      // Same day, skip
      continue;
    } else {
      // Streak broken
      break;
    }
  }

  return streak;
}

export async function getStudyDays(month: Date): Promise<StudyDay[]> {
  const session = await auth();
  
  if (!session?.user?.id) {
    return [];
  }

  const userId = session.user.id;
  const monthStart = new Date(month.getFullYear(), month.getMonth(), 1);
  const monthEnd = new Date(month.getFullYear(), month.getMonth() + 1, 0);

  // Get progress entries for the month
  const progressEntries = await db
    .select({
      date: sql<Date>`date(${progress.completedAt})`,
      count: sql<number>`count(*)`,
    })
    .from(progress)
    .where(
      and(
        eq(progress.userId, userId),
        gte(progress.completedAt, monthStart),
        sql`${progress.completedAt} <= ${monthEnd}`
      )
    )
    .groupBy(sql`date(${progress.completedAt})`);

  // Get review completions for the month (from spacedRepetition updatedAt)
  const reviewCompletions = await db
    .select({
      date: sql<Date>`date(${spacedRepetition.updatedAt})`,
      count: sql<number>`count(*)`,
    })
    .from(spacedRepetition)
    .where(
      and(
        eq(spacedRepetition.userId, userId),
        sql`${spacedRepetition.updatedAt} IS NOT NULL`,
        gte(spacedRepetition.updatedAt, monthStart),
        sql`${spacedRepetition.updatedAt} <= ${monthEnd}`
      )
    )
    .groupBy(sql`date(${spacedRepetition.updatedAt})`);

  // Merge the data
  const studyDaysMap = new Map<string, StudyDay>();

  progressEntries.forEach(entry => {
    const dateStr = entry.date.toISOString().split('T')[0];
    studyDaysMap.set(dateStr, {
      date: entry.date,
      exercisesCompleted: entry.count,
      reviewsCompleted: 0,
    });
  });

  reviewCompletions.forEach(review => {
    const dateStr = review.date.toISOString().split('T')[0];
    const existing = studyDaysMap.get(dateStr);
    if (existing) {
      existing.reviewsCompleted = review.count;
    } else {
      studyDaysMap.set(dateStr, {
        date: review.date,
        exercisesCompleted: 0,
        reviewsCompleted: review.count,
      });
    }
  });

  return Array.from(studyDaysMap.values());
}

export async function getReviewDueDates(): Promise<Date[]> {
  const session = await auth();
  
  if (!session?.user?.id) {
    return [];
  }

  const userId = session.user.id;
  const today = new Date();
  const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

  const dueReviews = await db
    .select({
      nextReviewAt: spacedRepetition.nextReviewAt,
    })
    .from(spacedRepetition)
    .where(
      and(
        eq(spacedRepetition.userId, userId),
        gte(spacedRepetition.nextReviewAt, today),
        sql`${spacedRepetition.nextReviewAt} <= ${thirtyDaysFromNow}`
      )
    );

  return dueReviews.map(r => r.nextReviewAt);
}
