'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { chapters } from '@/lib/chapters';
import MathDisplay from '@/components/MathDisplay';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import {
  ChevronLeft,
  RotateCcw,
  Brain,
  Clock,
  CheckCircle2,
  XCircle,
  TrendingUp,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

interface PageProps {
  params: Promise<{ id: string }>;
}

// Mock flashcard data - replace with actual spaced repetition data
interface ReviewCard {
  id: string;
  question: string;
  answer: string;
  difficulty: 'new' | 'learning' | 'review' | 'relearning';
  interval: number;
  easeFactor: number;
}

const mockReviewCards: Record<number, ReviewCard[]> = {
  1: [
    {
      id: '1-1',
      question: '\\text{Simplify: } \\frac{x^2 - 9}{x - 3}',
      answer: 'x + 3',
      difficulty: 'review',
      interval: 3,
      easeFactor: 2.5,
    },
    {
      id: '1-2',
      question: '\\text{Solve for } x: 2x + 5 = 13',
      answer: '4',
      difficulty: 'learning',
      interval: 1,
      easeFactor: 2.3,
    },
  ],
  2: [
    {
      id: '2-1',
      question: '\\text{Evaluate: } \\sin(30°)',
      answer: '1/2',
      difficulty: 'review',
      interval: 5,
      easeFactor: 2.6,
    },
  ],
  3: [],
  4: [],
  5: [],
  6: [],
};

// SM-2 Algorithm implementation
function calculateNextReview(
  quality: number, // 0-5 rating
  currentInterval: number,
  currentEaseFactor: number
): { interval: number; easeFactor: number } {
  let newEaseFactor = currentEaseFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (newEaseFactor < 1.3) newEaseFactor = 1.3;

  let newInterval: number;
  if (quality < 3) {
    newInterval = 1;
  } else if (currentInterval === 0) {
    newInterval = 1;
  } else if (currentInterval === 1) {
    newInterval = 6;
  } else {
    newInterval = Math.round(currentInterval * newEaseFactor);
  }

  return { interval: newInterval, easeFactor: newEaseFactor };
}

export default function ChapterReviewPage({ params }: PageProps) {
  const [chapterId, setChapterId] = useState<number | null>(null);
  const [cards, setCards] = useState<ReviewCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [sessionStats, setSessionStats] = useState({
    reviewed: 0,
    correct: 0,
    timeSpent: 0,
  });
  const [isComplete, setIsComplete] = useState(false);

  // Resolve params
  useEffect(() => {
    params.then(({ id }) => {
      const numId = Number(id);
      const chapter = chapters.find((ch) => ch.id === numId);
      if (!chapter) {
        notFound();
      }
      setChapterId(numId);
      setCards(mockReviewCards[numId] || []);
    });
  }, [params]);

  // Timer
  useEffect(() => {
    if (isComplete) return;
    const timer = setInterval(() => {
      setSessionStats((prev) => ({ ...prev, timeSpent: prev.timeSpent + 1 }));
    }, 1000);
    return () => clearInterval(timer);
  }, [isComplete]);

  if (!chapterId) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const chapter = chapters.find((c) => c.id === chapterId)!;
  const currentCard = cards[currentIndex];
  const progress = cards.length > 0 ? ((currentIndex) / cards.length) * 100 : 100;

  const handleRate = (quality: number) => {
    if (!currentCard) return;

    const { interval, easeFactor } = calculateNextReview(
      quality,
      currentCard.interval,
      currentCard.easeFactor
    );

    // Update card
    const updatedCards = [...cards];
    updatedCards[currentIndex] = {
      ...currentCard,
      interval,
      easeFactor,
    };
    setCards(updatedCards);

    // Update stats
    setSessionStats((prev) => ({
      reviewed: prev.reviewed + 1,
      correct: prev.correct + (quality >= 3 ? 1 : 0),
      timeSpent: prev.timeSpent,
    }));

    // Move to next card
    if (currentIndex < cards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setShowAnswer(false);
      setUserAnswer('');
    } else {
      setIsComplete(true);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (cards.length === 0) {
    return (
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Button asChild variant="ghost" size="sm" className="h-auto p-0">
              <Link href={`/chapter/${chapterId}`}>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back to Chapter
              </Link>
            </Button>
            <span>/</span>
            <span>Review Mode</span>
          </div>
          <div className="flex items-center gap-3">
            <Brain className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">
              Chapter {chapter.id} Review
            </h1>
          </div>
          <p className="text-muted-foreground">{chapter.title}</p>
        </div>

        <Card className="text-center py-12">
          <CardContent className="space-y-4">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto" />
            <h2 className="text-xl font-semibold">No Cards Due</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              You don&apos;t have any review cards for this chapter yet. 
              Complete exercises in practice mode to add cards to your review deck.
            </p>
            <div className="flex justify-center gap-3 pt-4">
              <Button asChild variant="outline">
                <Link href={`/chapter/${chapterId}`}>
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Back to Chapter
                </Link>
              </Button>
              <Button asChild>
                <Link href={`/chapter/${chapterId}/practice`}>
                  Start Practicing
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isComplete) {
    return (
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Button asChild variant="ghost" size="sm" className="h-auto p-0">
              <Link href={`/chapter/${chapterId}`}>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back to Chapter
              </Link>
            </Button>
            <span>/</span>
            <span>Review Mode</span>
          </div>
          <div className="flex items-center gap-3">
            <Brain className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">
              Chapter {chapter.id} Review
            </h1>
          </div>
          <p className="text-muted-foreground">{chapter.title}</p>
        </div>

        <Card className="text-center py-12">
          <CardContent className="space-y-6">
            <div className="flex justify-center">
              <div className="h-16 w-16 rounded-full bg-green-500/10 flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-green-500" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold">Review Complete!</h2>
              <p className="text-muted-foreground">
                Great job completing your review session
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
              <div className="p-4 rounded-lg bg-muted">
                <div className="text-2xl font-bold">{sessionStats.reviewed}</div>
                <div className="text-xs text-muted-foreground">Cards Reviewed</div>
              </div>
              <div className="p-4 rounded-lg bg-muted">
                <div className="text-2xl font-bold">
                  {Math.round((sessionStats.correct / sessionStats.reviewed) * 100)}%
                </div>
                <div className="text-xs text-muted-foreground">Accuracy</div>
              </div>
              <div className="p-4 rounded-lg bg-muted">
                <div className="text-2xl font-bold">{formatTime(sessionStats.timeSpent)}</div>
                <div className="text-xs text-muted-foreground">Time</div>
              </div>
            </div>

            <div className="flex justify-center gap-3 pt-4">
              <Button asChild variant="outline">
                <Link href={`/chapter/${chapterId}`}>
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Back to Chapter
                </Link>
              </Button>
              <Button onClick={() => window.location.reload()}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Review Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Button asChild variant="ghost" size="sm" className="h-auto p-0">
            <Link href={`/chapter/${chapterId}`}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Chapter
            </Link>
          </Button>
          <span>/</span>
          <span>Review Mode</span>
        </div>
        <div className="flex items-center gap-3">
          <Brain className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">
            Chapter {chapter.id} Review
          </h1>
        </div>
        <p className="text-muted-foreground">{chapter.title}</p>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Card {currentIndex + 1} of {cards.length}
          </span>
          <span className="text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatTime(sessionStats.timeSpent)}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Flashcard */}
      <Card className="min-h-[300px] flex flex-col">
        <CardHeader>
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="text-xs">
              {currentCard.difficulty === 'new' && <Sparkles className="mr-1 h-3 w-3" />}
              {currentCard.difficulty}
            </Badge>
            <span className="text-xs text-muted-foreground">
              Interval: {currentCard.interval} days
            </span>
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
          <div className="text-xl font-medium">
            <MathDisplay 
              latex={currentCard.question} 
              displayMode={true} 
            />
          </div>

          {!showAnswer ? (
            <div className="w-full max-w-sm space-y-3">
              <Input
                placeholder="Your answer..."
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && setShowAnswer(true)}
              />
              <Button 
                onClick={() => setShowAnswer(true)} 
                className="w-full"
                variant="outline"
              >
                Show Answer
              </Button>
            </div>
          ) : (
            <div className="w-full space-y-4">
              <Separator />
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Answer</p>
                <div className="text-lg font-semibold">
                  <MathDisplay latex={currentCard.answer} displayMode={true} />
                </div>
              </div>
              {userAnswer && (
                <div className="text-sm text-muted-foreground">
                  Your answer: <code className="bg-muted px-1.5 py-0.5 rounded">{userAnswer}</code>
                </div>
              )}
            </div>
          )}
        </CardContent>
        {showAnswer && (
          <>
            <Separator />
            <CardFooter className="p-4">
              <div className="w-full grid grid-cols-4 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRate(1)}
                  className="border-red-500/50 hover:bg-red-500/10"
                >
                  <XCircle className="mr-1 h-4 w-4 text-red-500" />
                  Again
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRate(3)}
                  className="border-yellow-500/50 hover:bg-yellow-500/10"
                >
                  Hard
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRate(4)}
                  className="border-green-500/50 hover:bg-green-500/10"
                >
                  Good
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRate(5)}
                  className="border-blue-500/50 hover:bg-blue-500/10"
                >
                  <CheckCircle2 className="mr-1 h-4 w-4 text-blue-500" />
                  Easy
                </Button>
              </div>
            </CardFooter>
          </>
        )}
      </Card>

      {/* Stats */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <TrendingUp className="h-4 w-4" />
            {sessionStats.reviewed} reviewed
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            {sessionStats.correct} correct
          </span>
        </div>
        <span>
          {Math.round((sessionStats.correct / Math.max(sessionStats.reviewed, 1)) * 100)}% accuracy
        </span>
      </div>
    </div>
  );
}
