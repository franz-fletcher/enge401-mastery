'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Eye, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import StepCard from './StepCard';
import type { Step } from '@enge401-mastery/step-solver';

interface StepDisplayProps {
  steps: Step[];
  onStepReveal?: (stepNumber: number) => void;
}

export default function StepDisplay({ steps, onStepReveal }: StepDisplayProps) {
  const [revealedSteps, setRevealedSteps] = useState<Set<number>>(new Set());

  const handleRevealStep = useCallback((stepNumber: number) => {
    setRevealedSteps((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(stepNumber)) {
        newSet.delete(stepNumber);
      } else {
        newSet.add(stepNumber);
        onStepReveal?.(stepNumber);
      }
      return newSet;
    });
  }, [onStepReveal]);

  const handleRevealAll = useCallback(() => {
    const allStepNumbers = steps.map((step) => step.number);
    setRevealedSteps(new Set(allStepNumbers));
    
    // Notify for each newly revealed step
    allStepNumbers.forEach((stepNumber) => {
      if (!revealedSteps.has(stepNumber)) {
        onStepReveal?.(stepNumber);
      }
    });
  }, [steps, revealedSteps, onStepReveal]);

  const handleReset = useCallback(() => {
    setRevealedSteps(new Set());
  }, []);

  const revealedCount = revealedSteps.size;
  const totalSteps = steps.length;
  const progressPercentage = totalSteps > 0 ? (revealedCount / totalSteps) * 100 : 0;
  const allRevealed = revealedCount === totalSteps && totalSteps > 0;

  if (steps.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No steps available for this solution.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRevealAll}
            disabled={allRevealed}
            className="gap-2"
            data-testid="reveal-all-button"
          >
            <Eye className="h-4 w-4" />
            Reveal All
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            disabled={revealedCount === 0}
            className="gap-2"
            data-testid="reset-button"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </div>

        <div className="flex items-center gap-3 text-sm">
          <span
            className="text-muted-foreground whitespace-nowrap"
            data-testid="progress-indicator"
          >
            {revealedCount} of {totalSteps} steps revealed
          </span>
          <Progress
            value={progressPercentage}
            className="w-24 h-2"
            data-testid="progress-bar"
          />
        </div>
      </div>

      {/* Steps */}
      <motion.div
        className="space-y-2"
        role="list"
        aria-label="Solution steps"
        data-testid="steps-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {steps.map((step, index) => (
          <StepCard
            key={step.id}
            step={step}
            isRevealed={revealedSteps.has(step.number)}
            onReveal={() => handleRevealStep(step.number)}
            isLast={index === steps.length - 1}
          />
        ))}
      </motion.div>

      {/* Completion message */}
      {allRevealed && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="text-center text-sm text-muted-foreground py-2"
          data-testid="completion-message"
        >
          All steps revealed. Try solving the next exercise!
        </motion.div>
      )}
    </div>
  );
}
