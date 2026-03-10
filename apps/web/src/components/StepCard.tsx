'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import MathDisplay from './MathDisplay';
import type { Step, ChangeType } from '@enge401-mastery/step-solver';

interface StepCardProps {
  step: Step;
  isRevealed: boolean;
  onReveal: () => void;
  isLast: boolean;
}

const changeTypeLabels: Record<ChangeType, string> = {
  INITIAL_STATE: 'Initial',
  SUBTRACT_FROM_BOTH_SIDES: 'Subtract',
  DIVIDE_BOTH_SIDES: 'Divide',
  APPLY_QUADRATIC_FORMULA: 'Quadratic Formula',
  SIMPLIFY_DISCRIMINANT: 'Simplify',
  CALCULATE_SQUARE_ROOT: 'Square Root',
  CALCULATE_SOLUTIONS: 'Solutions',
  IDENTIFY_COEFFICIENTS: 'Identify',
  SUBSTITUTE_VALUES: 'Substitute',
  COMBINE_LIKE_TERMS: 'Combine Terms',
  DISTRIBUTE: 'Distribute',
  FACTOR: 'Factor',
  APPLY_POWER_RULE: 'Power Rule',
  APPLY_PRODUCT_RULE: 'Product Rule',
  APPLY_CHAIN_RULE: 'Chain Rule',
  APPLY_QUOTIENT_RULE: 'Quotient Rule',
  INTEGRATE_BY_SUBSTITUTION: 'Substitution',
  INTEGRATE_BY_PARTS: 'Parts',
  APPLY_TRIG_IDENTITY: 'Trig Identity',
  SIMPLIFY_TRIG_EXPRESSION: 'Simplify Trig',
  APPLY_EXPONENT_RULE: 'Exponent Rule',
  TAKE_NATURAL_LOG: 'Natural Log',
  SEPARATE_VARIABLES: 'Separate',
  INTEGRATE_BOTH_SIDES: 'Integrate',
  APPLY_INITIAL_CONDITION: 'Initial Condition',
};

export default function StepCard({ step, isRevealed, onReveal, isLast }: StepCardProps) {
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onReveal();
    }
  };

  return (
    <div
      className="border rounded-lg overflow-hidden bg-card"
      role="listitem"
      aria-expanded={isRevealed}
      data-testid="step-card"
      data-step-number={step.number}
    >
      <Button
        variant="ghost"
        className="w-full justify-between p-4 h-auto hover:bg-muted/50"
        onClick={onReveal}
        onKeyDown={handleKeyDown}
        aria-expanded={isRevealed}
        aria-controls={`step-content-${step.id}`}
        data-testid="step-button"
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold shrink-0"
            aria-hidden="true"
          >
            {step.number}
          </div>
          <div className="text-left">
            <div className="font-medium">{step.title}</div>
            {!isRevealed && (
              <div className="text-sm text-muted-foreground">
                Click to reveal
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isRevealed && changeTypeLabels[step.changeType] && (
            <Badge variant="secondary" className="hidden sm:inline-flex">
              {changeTypeLabels[step.changeType]}
            </Badge>
          )}
          <motion.div
            animate={{ rotate: isRevealed ? 90 : 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
          >
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </motion.div>
        </div>
      </Button>

      <AnimatePresence initial={false}>
        {isRevealed && (
          <motion.div
            id={`step-content-${step.id}`}
            data-testid="step-content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3" data-testid="step-inner-content">
              <div className="text-sm text-muted-foreground">
                {step.explanation}
              </div>

              {step.expression && (
                <div className="bg-muted p-4 rounded-lg">
                  <MathDisplay latex={step.expression} displayMode />
                </div>
              )}

              {step.metadata?.rule && (
                <div className="text-xs text-muted-foreground italic">
                  Rule applied: {step.metadata.rule}
                </div>
              )}

              {step.metadata?.formula && (
                <div className="bg-muted/50 p-3 rounded text-sm">
                  <span className="text-muted-foreground">Formula: </span>
                  <MathDisplay latex={step.metadata.formula} />
                </div>
              )}

              {step.substeps && step.substeps.length > 0 && (
                <div className="pl-4 border-l-2 border-muted space-y-2 mt-3">
                  {step.substeps.map((substep) => (
                    <div key={substep.id} className="text-sm">
                      <div className="font-medium text-muted-foreground">
                        {substep.title}
                      </div>
                      {substep.expression && (
                        <div className="mt-1">
                          <MathDisplay latex={substep.expression} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isLast && isRevealed && (
        <div className="px-4 pb-2">
          <div className="border-t border-dashed border-muted" />
        </div>
      )}
    </div>
  );
}
