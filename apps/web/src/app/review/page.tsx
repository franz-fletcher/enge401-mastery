import Link from 'next/link';
import { getAllExercises } from '@/lib/stats-actions';
import MathDisplay from '@/components/MathDisplay';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  BookOpen,
  History,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Lock,
  Lightbulb,
  ChevronDown,
} from 'lucide-react';
import { format } from 'date-fns';

interface ReviewPageProps {
  searchParams: Promise<{ page?: string; filter?: string }>;
}

export default async function ReviewPage({ searchParams }: ReviewPageProps) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? '1', 10));
  const filter = (params.filter ?? 'all') as 'all' | 'correct' | 'incorrect';
  const result = await getAllExercises(page, 5, filter);

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

  const getFilterLabel = (f: string): string => {
    switch (f) {
      case 'correct':
        return 'Correct';
      case 'incorrect':
        return 'Incorrect';
      default:
        return 'All';
    }
  };

  const buildPageUrl = (pageNum: number): string => {
    const params = new URLSearchParams();
    params.set('page', pageNum.toString());
    if (filter !== 'all') {
      params.set('filter', filter);
    }
    return `/review?${params.toString()}`;
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
          Review all your exercise attempts. Filter by correctness to focus on
          areas that need improvement or reinforce concepts you have mastered.
        </p>
      </div>

      {/* Unauthenticated State */}
      {isUnauthenticated && (
        <Card data-testid="unauthenticated-state">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Lock className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Sign In Required</h3>
            <p className="text-muted-foreground text-center max-w-md mb-6">
              Please sign in to view your exercise history and track your
              progress.
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
            <History className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Exercises Found</h3>
            <p className="text-muted-foreground text-center max-w-md mb-6">
              {filter === 'all'
                ? "You haven't attempted any exercises yet. Start practicing to build up your review history."
                : `You don't have any ${filter} answers yet. Try changing the filter or start practicing.`}
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

      {/* Filter and Exercise List */}
      {!isUnauthenticated && (
        <div className="space-y-4" data-testid="exercise-list">
          {/* Filter Dropdown */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Filter:</span>
              <Select name="filter" defaultValue={filter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Filter by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    <Link href="/review">All</Link>
                  </SelectItem>
                  <SelectItem value="correct">
                    <Link href="/review?filter=correct">Correct</Link>
                  </SelectItem>
                  <SelectItem value="incorrect">
                    <Link href="/review?filter=incorrect">Incorrect</Link>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="text-sm text-muted-foreground">
              Showing {getFilterLabel(filter).toLowerCase()} exercises
            </div>
          </div>

          {/* Exercise Cards */}
          {exercises.length > 0 &&
            exercises.map((exercise) => (
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
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          exercise.accuracy >= 0.8 ? 'default' : 'destructive'
                        }
                        className="flex items-center gap-1"
                      >
                        {exercise.accuracy >= 0.8 ? (
                          <>
                            <CheckCircle2 className="h-3 w-3" />
                            Correct
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3 w-3" />
                            Incorrect
                          </>
                        )}
                      </Badge>
                      <Badge variant={getDifficultyVariant(exercise.difficulty)}>
                        {getDifficultyLabel(exercise.difficulty)}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 space-y-4">
                  {/* Question */}
                  {exercise.question && (
                    <div className="bg-muted/50 rounded-lg p-4">
                      <p className="text-sm text-muted-foreground mb-2">
                        Question:
                      </p>
                      <div className="text-base">
                        <MathDisplay
                          latex={exercise.question}
                          displayMode={true}
                        />
                      </div>
                    </div>
                  )}

                  {/* Answer and Hints Collapsible */}
                  <Collapsible>
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full flex items-center justify-between"
                      >
                        <span className="flex items-center gap-2">
                          <Lightbulb className="h-4 w-4" />
                          Show Answer & Hints
                        </span>
                        <ChevronDown className="h-4 w-4 transition-transform data-[state=open]:rotate-180" />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-3 pt-2">
                      {/* Answer */}
                      {exercise.answer && (
                        <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-3">
                          <p className="text-sm font-medium text-green-700 dark:text-green-400 mb-1">
                            Answer:
                          </p>
                          <div className="text-base">
                            <MathDisplay
                              latex={exercise.answer}
                              displayMode={true}
                            />
                          </div>
                        </div>
                      )}

                      {/* Hints */}
                      {exercise.hints && exercise.hints.length > 0 && (
                        <div className="bg-amber-50 dark:bg-amber-950/20 rounded-lg p-3">
                          <p className="text-sm font-medium text-amber-700 dark:text-amber-400 mb-2">
                            Hints:
                          </p>
                          <ul className="space-y-1">
                            {exercise.hints.map((hint, index) => (
                              <li
                                key={index}
                                className="text-sm text-amber-800 dark:text-amber-300 flex items-start gap-2"
                              >
                                <span className="font-medium shrink-0">
                                  {index + 1}.
                                </span>
                                <MathDisplay
                                  latex={hint}
                                  displayMode={false}
                                />
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CollapsibleContent>
                  </Collapsible>

                  {/* Metadata Footer */}
                  <div className="flex items-center justify-between text-sm pt-2 border-t">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <History className="h-4 w-4" />
                        <span>
                          Completed{' '}
                          {format(
                            new Date(exercise.completedAt),
                            'MMM d, yyyy'
                          )}
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
                href={buildPageUrl(currentPage - 1)}
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
                href={buildPageUrl(currentPage + 1)}
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
          Showing {exercises.length} of {totalCount}{' '}
          {getFilterLabel(filter).toLowerCase()} exercise
          {totalCount !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}
