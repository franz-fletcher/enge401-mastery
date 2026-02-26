'use client';

import { useState, useEffect, useCallback } from 'react';
import { getUserStats, getStudyDays, getReviewDueDates, UserStats, StudyDay } from '@/lib/stats-actions';

interface UseStatsReturn {
  stats: UserStats;
  studyDays: StudyDay[];
  reviewDueDates: Date[];
  isLoading: boolean;
  error: Error | null;
  refresh: () => void;
}

const defaultStats: UserStats = {
  streak: 0,
  accuracy: 0,
  completedToday: 0,
  reviewsDue: 0,
};

export function useStats(month?: Date): UseStatsReturn {
  const [stats, setStats] = useState<UserStats>(defaultStats);
  const [studyDays, setStudyDays] = useState<StudyDay[]>([]);
  const [reviewDueDates, setReviewDueDates] = useState<Date[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function fetchStats() {
      try {
        setIsLoading(true);
        setError(null);

        const [userStats, days, dueDates] = await Promise.all([
          getUserStats(),
          month ? getStudyDays(month) : Promise.resolve([]),
          getReviewDueDates(),
        ]);

        if (isMounted) {
          setStats(userStats);
          setStudyDays(days);
          setReviewDueDates(dueDates);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Failed to fetch stats'));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchStats();

    return () => {
      isMounted = false;
    };
  }, [month, refreshKey]);

  return {
    stats,
    studyDays,
    reviewDueDates,
    isLoading,
    error,
    refresh,
  };
}
