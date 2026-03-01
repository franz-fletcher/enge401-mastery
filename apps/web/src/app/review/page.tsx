import Link from 'next/link';
import { getCorrectlyAnsweredExercises } from '@/lib/stats-actions';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  BookOpen,
  History,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { format } from 'date-fns';

interface ReviewPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function ReviewPage({ searchParams }: ReviewPageProps) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? '1', 10));
  const result = await getCorrectlyAnsweredExercises(page, 5);

  const { exercises, totalCount, totalPages, currentPage } = result;

  // Check if user is not authenticated (no exercises and totalCount is 0)
  const isUnauthenticated = totalCount === 0 && exercises.length === 0;

  const getDifficultyVariant = (
    difficulty: string | null
  ): 'default' | 'secondary' | 'destructive' | 'outline' => {
    switch (difficulty) {
      case 'easy':
        return 'secondary';
      case 'medium':
        return 'default';
      case 'hard':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getDifficultyLabel = (difficulty: string | null): string => {
    if (!difficulty) return 'Unknown';
    return difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2" data-testid="review-header">
        <div className="flex items-center gap-2">
          <History className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Review</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl">
          Review exercises you have answered correctly. Revisit these concepts
          to reinforce your understanding and maintain your knowledge.
        </p>
      </div>

      {/* Unauthenticated State */}
      {isUnauthenticated && (
        <Card data-testid="unauthenticated-state">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Lock className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Sign In Required</h3>
            <p className="text-muted-foreground text-center max-w-md mb-6">
              Please sign in to view your correctly answered exercises and track
              your progress.
            </p>
            <Button asChild>
              <Link href="/login">Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {!isUnauthenticated && exercises.length === 0 && (
        <Card data-testid="empty-state">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CheckCircle2 className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Exercises Yet</h3>
            <p className="text-muted-foreground text-center max-w-md mb-6">
              You have not answered any exercises correctly yet. Start
              practicing to build up your review history.
            </p>
            <Button asChild>
              <Link href="/practice">
                <BookOpen className="mr-2 h-4 w-4" />
                Start Practicing
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Exercise List */}
      {!isUnauthenticated && exercises.length > 0 && (
        <div className="space-y-4" data-testid="exercise-list">
          {exercises.map((exercise) => (
            <Card key={exercise.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary shrink-0">
                        {exercise.chapterId}
                      </span>
                      <CardTitle className="text-base truncate">
                        {exercise.chapterTitle}
                      </CardTitle>
                    </div>
                    <CardDescription className="text-sm">
                      {exercise.exerciseType}
                    </CardDescription>
                  </div>
                  <Badge variant={getDifficultyVariant(exercise.difficulty)}>
                    {getDifficultyLabel(exercise.difficulty)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <History className="h-4 w-4" />
                      <span>
                        Completed{' '}
                        {format(new Date(exercise.completedAt), 'MMM d, yyyy')}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`font-medium ${
                        exercise.accuracy >= 0.8
                          ? 'text-green-600'
                          : exercise.accuracy >= 0.6
                            ? 'text-yellow-600'
                            : 'text-red-600'
                      }`}
                    >
                      {Math.round(exercise.accuracy * 100)}%
                    </span>
                    <span className="text-muted-foreground">accuracy</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!isUnauthenticated && totalPages > 1 && (
        <div
          className="flex items-center justify-between pt-4"
          data-testid="pagination"
        >
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage <= 1}
            asChild={currentPage > 1}
          >
            {currentPage > 1 ? (
              <Link
                href={`/review?page=${currentPage - 1}`}
                data-testid="prev-page"
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous
              </Link>
            ) : (
              <span>
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous
              </span>
            )}
          </Button>

          <div className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </div>

          <Button
            variant="outline"
            size="sm"
            disabled={currentPage >= totalPages}
            asChild={currentPage < totalPages}
          >
            {currentPage < totalPages ? (
              <Link
                href={`/review?page=${currentPage + 1}`}
                data-testid="next-page"
              >
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            ) : (
              <span>
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </span>
            )}
          </Button>
        </div>
      )}

      {/* Summary Footer */}
      {!isUnauthenticated && exercises.length > 0 && (
        <div className="text-center text-sm text-muted-foreground pt-4">
          Showing {exercises.length} of {totalCount} correctly answered
          exercise{totalCount !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}
