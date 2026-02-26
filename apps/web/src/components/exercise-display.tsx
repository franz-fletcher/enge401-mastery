'use client';

import { useState } from 'react';
import MathDisplay from './MathDisplay';
import ExerciseCard from './ExerciseCard';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { BookOpen, Target, CheckCircle2, HelpCircle } from 'lucide-react';
import type { Difficulty } from '@enge401-mastery/exercise-generator';

interface Exercise {
  question: string;
  answer: string | number;
  hints?: string[];
}

interface ExerciseDisplayProps {
  exercise: Exercise | null;
  difficulty?: Difficulty;
  chapterTitle?: string;
  chapterId?: number;
  isLoading?: boolean;
  exerciseKey?: number;
  onAttempt?: (correct: boolean) => void;
}

const difficultyConfig = {
  easy: { 
    label: 'Easy', 
    color: 'text-green-500 border-green-500/50',
    icon: CheckCircle2,
    bgColor: 'bg-green-500/5'
  },
  medium: { 
    label: 'Medium', 
    color: 'text-yellow-500 border-yellow-500/50',
    icon: Target,
    bgColor: 'bg-yellow-500/5'
  },
  hard: { 
    label: 'Hard', 
    color: 'text-red-500 border-red-500/50',
    icon: HelpCircle,
    bgColor: 'bg-red-500/5'
  },
};

export function ExerciseDisplay({
  exercise,
  difficulty = 'easy',
  chapterTitle,
  chapterId,
  isLoading = false,
  exerciseKey = 0,
  onAttempt,
}: ExerciseDisplayProps) {
  const difficultyInfo = difficultyConfig[difficulty];
  const DifficultyIcon = difficultyInfo.icon;

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-20" />
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-20 w-full" />
          <div className="flex gap-3">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 w-24" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!exercise) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          <BookOpen className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
          <p>No exercise available.</p>
          <p className="text-sm">Please try generating a new question.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={difficultyInfo.bgColor}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">
              {chapterId && `Chapter ${chapterId}: `}
              {chapterTitle || 'Exercise'}
            </CardTitle>
          </div>
          <Badge 
            variant="outline" 
            className={`${difficultyInfo.color} ${difficultyInfo.bgColor}`}
          >
            <DifficultyIcon className="mr-1 h-3 w-3" />
            {difficultyInfo.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
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
          onAttempt={onAttempt}
        />
      </CardContent>
    </Card>
  );
}

export function ExerciseSkeleton() {
  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-5 w-20" />
        </div>
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-20 w-full" />
        <div className="flex gap-3">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-24" />
        </div>
      </CardContent>
    </Card>
  );
}
