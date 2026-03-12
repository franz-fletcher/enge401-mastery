'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { chapters } from '@/lib/chapters';
import ExerciseCard from '@/components/ExerciseCard';
import MathDisplay from '@/components/MathDisplay';
import { recordPracticeAttempt } from '@/lib/stats-actions';
import type { Difficulty, Exercise } from '@enge401-mastery/exercise-generator';
import {
  generateAlgebraExercise,
  generateTrigExercise,
  generateExponentialExercise,
  generateDifferentiationExercise,
  generateIntegrationExercise,
  generateDiffeqExercise,
} from '@enge401-mastery/exercise-generator';
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
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import {
  ChevronLeft,
  Calculator,
  Target,
  RefreshCw,
  CheckCircle2,
  HelpCircle,
  BookOpen,
} from 'lucide-react';

const exerciseGenerators: Record<number, (difficulty: Difficulty) => Exercise> = {
  1: generateAlgebraExercise,
  2: generateTrigExercise,
  3: generateExponentialExercise,
  4: generateDifferentiationExercise,
  5: generateIntegrationExercise,
  6: generateDiffeqExercise,
};

const exerciseTypeMap: Record<number, string> = {
  1: 'algebra',
  2: 'trig',
  3: 'exponential',
  4: 'differentiation',
  5: 'integration',
  6: 'diffeq',
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ChapterPracticePage({ params }: PageProps) {
  const [chapterId, setChapterId] = useState<number | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('easy');
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [exerciseKey, setExerciseKey] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Resolve params
  useEffect(() => {
    params.then(({ id }) => {
      const numId = Number(id);
      const chapter = chapters.find((ch) => ch.id === numId);
      if (!chapter) {
        notFound();
      }
      setChapterId(numId);
    });
  }, [params]);

  const generateExercise = useCallback(async () => {
    if (!chapterId) return;
    
    setIsLoading(true);
    const generator = exerciseGenerators[chapterId];
    if (generator) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const newExercise = generator(selectedDifficulty);
      setExercise(newExercise);
      setExerciseKey((prev) => prev + 1);
    }
    setIsLoading(false);
  }, [chapterId, selectedDifficulty]);

  // Generate exercise when chapter or difficulty changes
  useEffect(() => {
    if (chapterId) {
      generateExercise();
    }
  }, [chapterId, generateExercise]);

  if (!chapterId) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const chapter = chapters.find((c) => c.id === chapterId)!;

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
          <span>Practice Mode</span>
        </div>
        <div className="flex items-center gap-3">
          <Calculator className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">
            Chapter {chapter.id} Practice
          </h1>
        </div>
        <p className="text-muted-foreground">{chapter.title}</p>
      </div>

      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Target className="h-4 w-4" />
            Exercise Settings
          </CardTitle>
          <CardDescription>
            Choose your difficulty level for this chapter
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <label className="text-sm font-medium">Difficulty</label>
            <ToggleGroup
              type="single"
              value={selectedDifficulty}
              onValueChange={(value) => value && setSelectedDifficulty(value as Difficulty)}
              variant="outline"
              className="justify-start"
            >
              <ToggleGroupItem value="easy" aria-label="Easy difficulty">
                <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                Easy
              </ToggleGroupItem>
              <ToggleGroupItem value="medium" aria-label="Medium difficulty">
                <Target className="mr-2 h-4 w-4 text-yellow-500" />
                Medium
              </ToggleGroupItem>
              <ToggleGroupItem value="hard" aria-label="Hard difficulty">
                <HelpCircle className="mr-2 h-4 w-4 text-red-500" />
                Hard
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={generateExercise}
            disabled={isLoading}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Generating...' : 'New Question'}
          </Button>
        </CardFooter>
      </Card>

      <Separator />

      {/* Exercise Display */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold tracking-tight">Exercise</h2>
          </div>
          <Badge variant="outline">{selectedDifficulty}</Badge>
        </div>

        {isLoading ? (
          <Card>
            <CardContent className="p-6 space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-20 w-full" />
              <div className="flex gap-3">
                <Skeleton className="h-10 flex-1" />
                <Skeleton className="h-10 w-24" />
              </div>
            </CardContent>
          </Card>
        ) : exercise ? (
          <Card>
            <CardContent className="p-6 space-y-6">
              <div className="text-foreground font-medium text-lg">
                <MathDisplay 
                  latex={exercise.question} 
                  displayMode={true} 
                />
              </div>
              <Separator />
              <ExerciseCard
                key={exerciseKey}
                question=""
                answer={exercise.answer}
                hints={exercise.hints}
                difficulty={selectedDifficulty}
                chapterId={chapterId}
                solution={exercise.solution}
                onAttempt={async (correct, metadata) => {
                  try {
                    await recordPracticeAttempt({
                      chapterId: chapterId!,
                      exerciseType: exerciseTypeMap[chapterId!] || 'unknown',
                      difficulty: selectedDifficulty,
                      isCorrect: correct,
                      accuracy: correct ? 1 : 0,
                      question: exercise.question,
                      answer: String(exercise.answer),
                      hints: exercise.hints,
                    });
                  } catch (error) {
                    console.error('Failed to record practice attempt:', error);
                  }
                }}
                onCorrectAnswer={() => {
                  // Auto-advance to next exercise after a short delay
                  setTimeout(() => {
                    generateExercise();
                  }, 1500);
                }}
              />
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              Failed to load exercise. Please try again.
            </CardContent>
          </Card>
        )}
      </section>

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <Button asChild variant="outline">
          <Link href={`/chapter/${chapterId}`}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Chapter
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href={`/chapter/${chapterId}/review`}>
            Go to Review Mode
          </Link>
        </Button>
      </div>
    </div>
  );
}
