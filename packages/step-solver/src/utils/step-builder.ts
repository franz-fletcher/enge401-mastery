import { nanoid } from 'nanoid';
import type { Step } from '../types.js';

export class StepBuilder {
  private steps: Step[] = [];
  private currentNumber = 0;

  addStep(config: Omit<Step, 'id' | 'number'>): this {
    this.currentNumber++;
    this.steps.push({
      id: nanoid(),
      number: this.currentNumber,
      ...config,
      substeps: config.substeps || [],
    });
    return this;
  }

  build(): Step[] {
    return this.steps;
  }
}
