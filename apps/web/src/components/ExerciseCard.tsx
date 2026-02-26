'use client';

import { useState } from 'react';
import MathDisplay from './MathDisplay';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';
import { Lightbulb, CheckCircle2, XCircle, RotateCcw, ChevronDown } from 'lucide-react';

interface ExerciseCardProps {
  question: string;
  answer: string | number;
  hints?: string[];
  onAttempt?: (correct: boolean) => void;
}

export default function ExerciseCard({
  question,
  answer,
  hints = [],
  onAttempt,
}: ExerciseCardProps) {
  const [userAnswer, setUserAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [hintsShown, setHintsShown] = useState(0);

  const isCorrect =
    submitted &&
    userAnswer.trim().toLowerCase() === String(answer).trim().toLowerCase();

  const handleSubmit = () => {
    if (!userAnswer.trim()) return;
    setSubmitted(true);
    onAttempt?.(isCorrect);
  };

  const handleReset = () => {
    setSubmitted(false);
    setUserAnswer('');
    setHintsShown(0);
  };

  return (
    <div className="space-y-4">
      {/* Question */}
      {question && (
        <div className="text-foreground font-medium">
          {question}
        </div>
      )}

      {/* Hints */}
      {hints.length > 0 && !submitted && (
        <Collapsible open={hintsShown > 0}>
          <div className="space-y-2">
            {hints.slice(0, hintsShown).map((hint, i) => (
              <Card key={i} className="bg-yellow-500/10 border-yellow-500/20">
                <CardContent className="p-3">
                  <div className="flex items-start gap-2">
                    <Lightbulb className="h-4 w-4 text-yellow-600 mt-0.5 shrink-0" />
                    <div className="text-sm text-yellow-800">
                      <span className="font-medium">Hint {i + 1}:</span>{' '}
                      <MathDisplay latex={hint.replace(/\$/g, '')} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {hintsShown < hints.length && (
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setHintsShown((n) => n + 1)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Lightbulb className="mr-2 h-4 w-4" />
                  Show hint {hintsShown + 1}
                  <ChevronDown className="ml-1 h-3 w-3" />
                </Button>
              </CollapsibleTrigger>
            )}
          </div>
        </Collapsible>
      )}

      {/* Answer Input */}
      {!submitted ? (
        <div className="flex gap-3">
          <Input
            type="text"
            placeholder="Your answer..."
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            className="flex-1"
          />
          <Button onClick={handleSubmit} disabled={!userAnswer.trim()}>
            Submit
          </Button>
        </div>
      ) : (
        <Card className={isCorrect ? 'border-green-500/50 bg-green-500/5' : 'border-red-500/50 bg-red-500/5'}>
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              {isCorrect ? (
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600 mt-0.5 shrink-0" />
              )}
              <div className="flex-1">
                <p className={`font-semibold ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                  {isCorrect ? 'Correct!' : 'Incorrect'}
                </p>
                {!isCorrect && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    Answer: <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">{String(answer)}</code>
                  </p>
                )}
              </div>
            </div>
          </CardContent>
          <Separator />
          <CardFooter className="p-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Try again
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
