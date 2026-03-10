import type { Exercise, Solution, StepSolver, Step } from '../../types.js';
import { SolverError } from '../../types.js';
import { StepBuilder } from '../../utils/step-builder.js';

export class IntegrationSolver implements StepSolver {
  canSolve(exercise: Exercise): boolean {
    const topic = exercise.topic.toLowerCase();
    return topic.includes('integration') || topic.includes('integral');
  }

  solve(exercise: Exercise): Solution {
    const question = exercise.question;
    
    // Parse the integrand from "Find $\int ... \, dx$"
    const integrand = this.parseIntegrand(question);
    if (!integrand) {
      throw new SolverError('Could not parse integral', exercise.id);
    }

    const builder = new StepBuilder();
    const steps: Step[] = [];

    // Step 1: Original Integral
    steps.push(builder.addStep({
      title: 'Original Integral',
      explanation: 'Start with the integral to evaluate.',
      expression: `\\int ${integrand} \\, dx`,
      changeType: 'INITIAL_STATE',
      beforeState: '',
      afterState: `\\int ${integrand} \\, dx`,
    }).build()[0]);

    // Step 2: Identify Rule
    const rule = this.identifyRule(integrand);
    steps.push(builder.addStep({
      title: 'Identify Integration Rule',
      explanation: rule.explanation,
      expression: rule.formula,
      changeType: 'APPLY_POWER_RULE',
      beforeState: `\\int ${integrand} \\, dx`,
      afterState: rule.formula,
      metadata: { rule: rule.name, formula: rule.formula },
    }).build()[steps.length]);

    // Step 3: Apply Rule
    const result = this.applyRule(integrand);
    steps.push(builder.addStep({
      title: 'Apply the Rule',
      explanation: result.explanation,
      expression: result.work,
      changeType: 'COMBINE_LIKE_TERMS',
      beforeState: rule.formula,
      afterState: result.result,
    }).build()[steps.length]);

    // Step 4: Final Answer with + C
    steps.push(builder.addStep({
      title: 'Final Answer',
      explanation: 'Don\'t forget the constant of integration!',
      expression: `${result.result} + C`,
      changeType: 'CALCULATE_SOLUTIONS',
      beforeState: result.result,
      afterState: `${result.result} + C`,
    }).build()[steps.length]);

    return {
      exerciseId: exercise.id,
      steps,
      finalAnswer: `${result.result} + C`,
      totalSteps: steps.length,
    };
  }

  private parseIntegrand(question: string): string | null {
    // Extract expression from "Find $\int ... \, dx$" or similar
    // Also handle Unicode integral symbol ∫ and plain text formats
    // The integrand is captured before \, or dx
    const match = question.match(/\\int\s+(.+?)\s*(?:\\,)?\s*dx/i) ||
                  question.match(/integral of \$(.+?)\$/i) ||
                  question.match(/∫\s*(.+?)\s*dx/i) ||
                  question.match(/∫\s*(.+)/i);
    return match ? match[1].trim() : null;
  }

  private identifyRule(integrand: string): { name: string; explanation: string; formula: string } {
    if (integrand.includes('sin')) {
      return {
        name: 'Trigonometric Integral',
        explanation: 'Use the standard integral for sine.',
        formula: '\\int \\sin(x) \\, dx = -\\cos(x) + C',
      };
    }
    if (integrand.includes('cos')) {
      return {
        name: 'Trigonometric Integral',
        explanation: 'Use the standard integral for cosine.',
        formula: '\\int \\cos(x) \\, dx = \\sin(x) + C',
      };
    }
    return {
      name: 'Power Rule',
      explanation: 'Apply the power rule for integration.',
      formula: '\\int x^n \\, dx = \\frac{x^{n+1}}{n+1} + C',
    };
  }

  private applyRule(integrand: string): { explanation: string; work: string; result: string } {
    // Handle sin(x)
    if (integrand.includes('sin')) {
      return {
        explanation: 'The integral of sine is negative cosine.',
        work: '\\int \\sin(x) \\, dx = -\\cos(x)',
        result: '-\\cos(x)',
      };
    }
    
    // Handle cos(x)
    if (integrand.includes('cos')) {
      return {
        explanation: 'The integral of cosine is sine.',
        work: '\\int \\cos(x) \\, dx = \\sin(x)',
        result: '\\sin(x)',
      };
    }
    
    // Handle coefficient * x^n like 2*x^2 or 2x^2 or 3*x^2
    // This must be checked BEFORE plain x^n to avoid matching just the x^2 part
    const coeffPowerMatch = integrand.match(/(\d+)\*?x\^(\d+)/);
    if (coeffPowerMatch) {
      const coeff = parseInt(coeffPowerMatch[1]);
      const n = parseInt(coeffPowerMatch[2]);
      const newPower = n + 1;
      const newCoeffNum = coeff;
      const newCoeffDen = newPower;
      
      // Format the result as a fraction
      if (newCoeffNum === newCoeffDen) {
        return {
          explanation: `Apply the power rule and multiply by the coefficient.`,
          work: `\\int ${coeff}x^${n} \\, dx = ${coeff} \\cdot \\frac{x^${newPower}}{${newPower}} = x^${newPower}`,
          result: `x^${newPower}`,
        };
      } else {
        return {
          explanation: `Apply the power rule and multiply by the coefficient.`,
          work: `\\int ${coeff}x^${n} \\, dx = ${coeff} \\cdot \\frac{x^${newPower}}{${newPower}} = \\frac{${newCoeffNum}x^${newPower}}{${newCoeffDen}}`,
          result: `\\frac{${newCoeffNum}x^${newPower}}{${newCoeffDen}}`,
        };
      }
    }
    
    // Handle power rule: x^n (no coefficient)
    const powerMatch = integrand.match(/^x\^(\d+)$/);
    if (powerMatch) {
      const n = parseInt(powerMatch[1]);
      const newPower = n + 1;
      return {
        explanation: `Increase the power by 1 and divide by the new power.`,
        work: `\\int x^${n} \\, dx = \\frac{x^${newPower}}{${newPower}}`,
        result: `\\frac{x^${newPower}}{${newPower}}`,
      };
    }
    
    // Handle x (which is x^1)
    if (integrand === 'x') {
      return {
        explanation: 'Increase the power by 1 and divide by the new power.',
        work: '\\int x \\, dx = \\frac{x^2}{2}',
        result: '\\frac{x^2}{2}',
      };
    }
    
    // Handle coefficient * x like 2*x or 2x
    const coeffMatch = integrand.match(/(\d+)\*?x$/);
    if (coeffMatch) {
      const coeff = parseInt(coeffMatch[1]);
      return {
        explanation: 'Apply the power rule with coefficient.',
        work: `\\int ${coeff}x \\, dx = ${coeff} \\cdot \\frac{x^2}{2} = \\frac{${coeff}x^2}{2}`,
        result: `\\frac{${coeff}x^2}{2}`,
      };
    }
    
    throw new SolverError(`Cannot integrate: ${integrand}`, 'unknown');
  }
}
