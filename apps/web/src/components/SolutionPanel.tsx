'use client';

import { BookOpen, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import StepDisplay from './StepDisplay';
import MathDisplay from './MathDisplay';
import type { Solution } from '@enge401-mastery/step-solver';

interface SolutionPanelProps {
  solution: Solution;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SolutionPanel({
  solution,
  isOpen,
  onOpenChange,
}: SolutionPanelProps) {
  if (!solution || !solution.steps || solution.steps.length === 0) {
    return null;
  }

  return (
    <Collapsible open={isOpen} onOpenChange={onOpenChange}>
      <CollapsibleTrigger asChild>
        <Button
          variant="outline"
          className="w-full gap-2"
          data-testid="solution-toggle"
          aria-expanded={isOpen}
        >
          <BookOpen className="h-4 w-4" />
          {isOpen ? 'Hide Solution' : 'Show Step-by-Step Solution'}
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
          >
            <ChevronDown className="h-4 w-4 ml-1" />
          </motion.div>
        </Button>
      </CollapsibleTrigger>

      <CollapsibleContent className="mt-4" data-testid="solution-content">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
            <Card data-testid="solution-card">
            <CardHeader>
              <CardTitle className="text-lg" data-testid="solution-title">Solution</CardTitle>
              <CardDescription data-testid="solution-description">
                Click each step to reveal the explanation and see how to solve this problem.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <StepDisplay
                steps={solution.steps}
                onStepReveal={(stepNumber) => {
                  // Analytics or tracking could be added here
                  console.log(`Step ${stepNumber} revealed`);
                }}
              />
            </CardContent>

            <CardFooter className="flex flex-col items-start gap-2 border-t pt-4" data-testid="solution-footer">
              <div className="text-sm font-medium text-muted-foreground" data-testid="final-answer-label">
                Final Answer:
              </div>
              <div className="bg-primary/10 text-primary px-4 py-2 rounded-lg font-medium" data-testid="final-answer-value">
                <MathDisplay latex={solution.finalAnswer} displayMode />
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      </CollapsibleContent>
    </Collapsible>
  );
}
