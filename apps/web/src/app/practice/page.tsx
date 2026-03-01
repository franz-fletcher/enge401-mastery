'use client';

import { useState, useEffect, useCallback } from 'react';
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
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import {
  Calculator,
  RefreshCw,
  BookOpen,
  Target,
  CheckCircle2,
  HelpCircle,
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

const difficultyConfig = {
  easy: { label: 'Easy', color: 'bg-green-500', icon: CheckCircle2 },
  medium: { label: 'Medium', color: 'bg-yellow-500', icon: Target },
  hard: { label: 'Hard', color: 'bg-red-500', icon: HelpCircle },
};

export default function PracticePage() {
  const [selectedChapter, setSelectedChapter] = useState<number>(1);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('easy');
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [exerciseKey, setExerciseKey] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const generateExercise = useCallback(async () => {
    setIsLoading(true);
    const generator = exerciseGenerators[selectedChapter];
    if (generator) {
      // Simulate a brief loading state for better UX
      await new Promise((resolve) => setTimeout(resolve, 300));
      const newExercise = generator(selectedDifficulty);
      setExercise(newExercise);
      setExerciseKey((prev) => prev + 1);
    }
    setIsLoading(false);
  }, [selectedChapter, selectedDifficulty]);

  // Generate exercise when chapter or difficulty changes
  useEffect(() => {
    generateExercise();
  }, [generateExercise]);

  const chapter = chapters.find((c) => c.id === selectedChapter)!;
  const difficultyInfo = difficultyConfig[selectedDifficulty];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2" data-testid="practice-header">
        <div className="flex items-center gap-2">
          <Calculator className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Practice Mode</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl">
          Generate randomised exercises. Select a chapter and difficulty, then answer
          the question.
        </p>
      </div>

      {/* Controls */}
      <Card data-testid="exercise-card">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Target className="h-4 w-4" />
            Exercise Settings
          </CardTitle>
          <CardDescription>
            Choose your chapter and difficulty level
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Chapter Selector */}
          <div className="space-y-2" data-testid="chapter-selector">
            <label className="text-sm font-medium">Chapter</label>
            <Select
              value={String(selectedChapter)}
              onValueChange={(value) => setSelectedChapter(Number(value))}
            >
              <SelectTrigger className="w-full sm:w-[300px]">
                <SelectValue placeholder="Select a chapter" />
              </SelectTrigger>
              <SelectContent>
                {chapters.map((ch) => (
                  <SelectItem key={ch.id} value={String(ch.id)}>
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      <span>{ch.id}. {ch.title}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Difficulty Selector */}
          <div className="space-y-2" data-testid="difficulty-selector">
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
        <CardFooter className="flex justify-between">
          <Button
            onClick={generateExercise}
            disabled={isLoading}
            className="gap-2"
            data-testid="generate-exercise-btn"
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
            <h2 className="text-xl font-semibold tracking-tight">
              Chapter {chapter.id}: {chapter.title}
            </h2>
          </div>
          <Badge 
            variant="outline" 
            className={`${difficultyInfo.color.replace('bg-', 'text-')} border-current`}
          >
            {difficultyInfo.label}
          </Badge>
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
                  latex={exercise.question.replace(/\$/g, '')} 
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
                chapterId={selectedChapter}
                onAttempt={async (correct, metadata) => {
                  try {
                    await recordPracticeAttempt({
                      chapterId: selectedChapter,
                      exerciseType: exerciseTypeMap[selectedChapter] || 'unknown',
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
                onCorrectAnswer={generateExercise}
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
    </div>
  );
}
