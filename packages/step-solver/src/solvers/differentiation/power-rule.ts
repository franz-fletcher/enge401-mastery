import type { Exercise, Solution, StepSolver, Step } from '../../types.js';
import { SolverError } from '../../types.js';
import { StepBuilder } from '../../utils/step-builder.js';

/**
 * Represents a polynomial term: coefficient * x^exponent
 */
interface PolynomialTerm {
  coefficient: number;
  exponent: number;
}

/**
 * Represents a parsed differentiation expression
 */
interface ParsedExpression {
  type: 'polynomial' | 'trig' | 'exponential' | 'sum' | 'constant';
  terms: PolynomialTerm[];
  trigFunction?: string;
  trigArgument?: string;
  expBase?: string;
  original: string;
}

/**
 * Solver for differentiation exercises using power rule, trig derivatives,
 * and basic differentiation rules.
 */
export class DifferentiationSolver implements StepSolver {
  canSolve(exercise: Exercise): boolean {
    const topic = exercise.topic.toLowerCase();
    const question = exercise.question.toLowerCase();

    // Check for differentiation-related topics
    if (topic.includes('differentiation') || topic.includes('derivative')) {
      return true;
    }

    // Check for differentiation notation in question
    if (question.includes('d/dx') || question.includes('\\frac{d}{dx}')) {
      return true;
    }

    return false;
  }

  solve(exercise: Exercise): Solution {
    const question = exercise.question;

    // Parse the expression to differentiate
    const parsed = this.parseExpression(question);
    if (!parsed) {
      throw new SolverError(
        `Failed to parse differentiation expression "${question}". Expected format: Find d/dx[expression]`,
        exercise.id
      );
    }

    const builder = new StepBuilder();
    const steps: Step[] = [];

    // Step 1: Original Expression
    const originalLatex = this.formatOriginalExpression(parsed);
    steps.push(
      builder.addStep({
        title: 'Original Expression',
        explanation: 'Start with the function to differentiate.',
        expression: originalLatex,
        changeType: 'INITIAL_STATE',
        beforeState: '',
        afterState: originalLatex,
      }).build()[0]
    );

    // Step 2: Identify Rule
    const ruleInfo = this.identifyRule(parsed);
    steps.push(
      builder.addStep({
        title: 'Identify Differentiation Rule',
        explanation: ruleInfo.explanation,
        expression: ruleInfo.formula,
        changeType: 'APPLY_POWER_RULE',
        beforeState: originalLatex,
        afterState: ruleInfo.formula,
        metadata: {
          rule: ruleInfo.ruleName,
          formula: ruleInfo.formula,
        },
      }).build()[steps.length]
    );

    // Step 3: Apply Rule
    const applicationResult = this.applyRule(parsed);
    steps.push(
      builder.addStep({
        title: 'Apply the Rule',
        explanation: applicationResult.explanation,
        expression: applicationResult.expression,
        changeType: 'APPLY_POWER_RULE',
        beforeState: ruleInfo.formula,
        afterState: applicationResult.expression,
      }).build()[steps.length]
    );

    // Step 4: Final Answer
    const finalAnswer = this.formatDerivative(parsed);
    steps.push(
      builder.addStep({
        title: 'Final Answer',
        explanation: 'The derivative of the function.',
        expression: finalAnswer,
        changeType: 'CALCULATE_SOLUTIONS',
        beforeState: applicationResult.expression,
        afterState: finalAnswer,
      }).build()[steps.length]
    );

    return {
      exerciseId: exercise.id,
      steps,
      finalAnswer: this.extractFinalAnswer(finalAnswer),
      totalSteps: steps.length,
    };
  }

  /**
   * Parse a differentiation question to extract the expression
   */
  private parseExpression(question: string): ParsedExpression | null {
    // Remove LaTeX delimiters
    let clean = question.replace(/\$/g, '');

    // Extract expression from d/dx[...] or \frac{d}{dx}\left[...\right]
    const patterns = [
      // \frac{d}{dx}\left[expression\right]
      /\\frac\{d\}\{dx\}\\left\[(.+?)\\right\]/,
      // d/dx[expression]
      /\{?d\}\/\{?dx\}?\[(.+?)\]/,
      // Find d/dx[expression]
      /Find\s+\\frac\{d\}\{dx\}\\left\[(.+?)\\right\]/i,
      // Find derivative of expression
      /Find\s+the\s+derivative\s+of\s+(.+?)(?:\s+with\s+respect\s+to|$)/i,
    ];

    for (const pattern of patterns) {
      const match = clean.match(pattern);
      if (match) {
        const expr = match[1].trim();
        return this.parseInnerExpression(expr);
      }
    }

    return null;
  }

  /**
   * Parse the inner expression (inside the brackets)
   */
  private parseInnerExpression(expr: string): ParsedExpression | null {
    // Remove LaTeX formatting but preserve structure
    let clean = expr
      .replace(/\\/g, '')
      .replace(/\{\}/g, '')
      .replace(/\^\{(\d+)\}/g, '^$1')
      .replace(/\^([a-zA-Z])/g, '^$1')
      .trim();

    // Check for trigonometric functions
    const trigMatch = clean.match(/^(sin|cos|tan|sec|csc|cot)\(([^)]+)\)$/);
    if (trigMatch) {
      return {
        type: 'trig',
        terms: [],
        trigFunction: trigMatch[1],
        trigArgument: trigMatch[2],
        original: expr,
      };
    }

    // Check for exponential function
    if (clean.includes('exp') || clean.includes('e^')) {
      return {
        type: 'exponential',
        terms: [],
        expBase: 'e',
        original: expr,
      };
    }

    // Parse polynomial expression
    const terms = this.parsePolynomial(clean);
    if (terms.length > 0) {
      return {
        type: terms.length > 1 ? 'sum' : 'polynomial',
        terms,
        original: expr,
      };
    }

    return null;
  }

  /**
   * Parse a polynomial expression into terms
   */
  private parsePolynomial(expr: string): PolynomialTerm[] {
    const terms: PolynomialTerm[] = [];

    // Normalize the expression: remove spaces, handle implicit multiplication
    let normalized = expr.replace(/\s/g, '');

    // Handle implicit multiplication like "2x" -> "2*x"
    normalized = normalized.replace(/(\d)(x)/g, '$1*$2');

    // Split by + or -, keeping the sign
    // Match terms like: +3x^2, -2x, +5, -x^3, etc.
    const termStrings: string[] = [];
    let currentTerm = '';

    for (let i = 0; i < normalized.length; i++) {
      const char = normalized[i];
      if ((char === '+' || char === '-') && i > 0) {
        if (currentTerm) {
          termStrings.push(currentTerm);
        }
        currentTerm = char;
      } else {
        currentTerm += char;
      }
    }
    if (currentTerm) {
      termStrings.push(currentTerm);
    }

    for (const termStr of termStrings) {
      const term = this.parseTerm(termStr.trim());
      if (term) {
        terms.push(term);
      }
    }

    return terms;
  }

  /**
   * Parse a single term like "3x^2", "x", "-5", "2x"
   */
  private parseTerm(termStr: string): PolynomialTerm | null {
    // Handle constant terms (no x)
    if (!termStr.includes('x')) {
      const coeff = parseFloat(termStr);
      if (!isNaN(coeff)) {
        return { coefficient: coeff, exponent: 0 };
      }
      return null;
    }

    // Match patterns: ax^n, ax, x^n, x, -ax, etc.
    const patterns = [
      // ax^n or ax^2
      /^([+-]?\d*)\*?x\^(\d+)$/,
      // ax
      /^([+-]?\d*)\*?x$/,
    ];

    for (const pattern of patterns) {
      const match = termStr.match(pattern);
      if (match) {
        let coefficient: number;
        const coeffStr = match[1];

        if (coeffStr === '' || coeffStr === '+') {
          coefficient = 1;
        } else if (coeffStr === '-') {
          coefficient = -1;
        } else {
          coefficient = parseFloat(coeffStr);
        }

        let exponent = 1;
        if (match[2]) {
          exponent = parseInt(match[2], 10);
        }

        return { coefficient, exponent };
      }
    }

    return null;
  }

  /**
   * Format the original expression in LaTeX
   */
  private formatOriginalExpression(parsed: ParsedExpression): string {
    if (parsed.type === 'trig' && parsed.trigFunction) {
      return `f(x) = \\\\${parsed.trigFunction}(${parsed.trigArgument || 'x'})`;
    }

    if (parsed.type === 'exponential') {
      return 'f(x) = e^x';
    }

    if (parsed.terms.length > 0) {
      const termsLatex = this.formatPolynomialTerms(parsed.terms);
      return `f(x) = ${termsLatex}`;
    }

    // Handle raw expression that couldn't be parsed as polynomial
    if (parsed.original) {
      return `f(x) = ${parsed.original}`;
    }

    return `f(x) = ${parsed.original}`;
  }

  /**
   * Format polynomial terms as LaTeX
   */
  private formatPolynomialTerms(terms: PolynomialTerm[]): string {
    return terms
      .map((term, index) => {
        let termStr = '';

        // Handle sign
        if (index > 0) {
          termStr += term.coefficient >= 0 ? ' + ' : ' - ';
        } else if (term.coefficient < 0) {
          termStr += '-';
        }

        const absCoeff = Math.abs(term.coefficient);

        // Format based on exponent
        if (term.exponent === 0) {
          termStr += absCoeff;
        } else if (term.exponent === 1) {
          if (absCoeff !== 1) {
            termStr += absCoeff;
          }
          termStr += 'x';
        } else {
          if (absCoeff !== 1) {
            termStr += absCoeff;
          }
          termStr += `x^{${term.exponent}}`;
        }

        return termStr;
      })
      .join('');
  }

  /**
   * Identify which differentiation rule applies
   */
  private identifyRule(parsed: ParsedExpression): {
    ruleName: string;
    explanation: string;
    formula: string;
  } {
    if (parsed.type === 'trig') {
      const trigRules: Record<string, string> = {
        sin: '\\frac{d}{dx}[\\sin(x)] = \\cos(x)',
        cos: '\\frac{d}{dx}[\\cos(x)] = -\\sin(x)',
        tan: '\\frac{d}{dx}[\\tan(x)] = \\sec^2(x)',
        sec: '\\frac{d}{dx}[\\sec(x)] = \\sec(x)\\tan(x)',
        csc: '\\frac{d}{dx}[\\csc(x)] = -\\csc(x)\\cot(x)',
        cot: '\\frac{d}{dx}[\\cot(x)] = -\\csc^2(x)',
      };

      const formula = trigRules[parsed.trigFunction || ''] || 'Trigonometric derivative rule';
      return {
        ruleName: 'Trigonometric Derivative',
        explanation: `Apply the trigonometric derivative rule for ${parsed.trigFunction}(x).`,
        formula,
      };
    }

    if (parsed.type === 'exponential') {
      return {
        ruleName: 'Exponential Derivative',
        explanation: 'Apply the exponential derivative rule.',
        formula: '\\frac{d}{dx}[e^x] = e^x',
      };
    }

    if (parsed.type === 'sum' || parsed.terms.length > 1) {
      return {
        ruleName: 'Sum Rule and Power Rule',
        explanation: 'Apply the Sum Rule: differentiate each term separately, using the Power Rule for each term.',
        formula: '\\frac{d}{dx}[f(x) + g(x)] = f\'(x) + g\'(x)',
      };
    }

    // Single term - use Power Rule
    const term = parsed.terms[0];
    if (term) {
      if (term.exponent === 0) {
        return {
          ruleName: 'Constant Rule',
          explanation: 'The derivative of a constant is zero.',
          formula: '\\frac{d}{dx}[c] = 0',
        };
      }

      return {
        ruleName: 'Power Rule',
        explanation: 'Apply the Power Rule for differentiation.',
        formula: '\\frac{d}{dx}[x^n] = nx^{n-1}',
      };
    }

    return {
      ruleName: 'Basic Differentiation',
      explanation: 'Apply basic differentiation rules.',
      formula: '\\frac{d}{dx}[f(x)]',
    };
  }

  /**
   * Apply the differentiation rule and show the work
   */
  private applyRule(parsed: ParsedExpression): {
    explanation: string;
    expression: string;
  } {
    if (parsed.type === 'trig' && parsed.trigFunction) {
      const derivatives: Record<string, string> = {
        sin: '\\cos(x)',
        cos: '-\\sin(x)',
        tan: '\\sec^2(x)',
        sec: '\\sec(x)\\tan(x)',
        csc: '-\\csc(x)\\cot(x)',
        cot: '-\\csc^2(x)',
      };

      const derivative = derivatives[parsed.trigFunction] || '\\text{derivative}';
      return {
        explanation: `The derivative of ${parsed.trigFunction}(x) is ${derivative}.`,
        expression: `\\frac{d}{dx}[${parsed.trigFunction}(x)] = ${derivative}`,
      };
    }

    if (parsed.type === 'exponential') {
      return {
        explanation: 'The exponential function e^x is its own derivative.',
        expression: '\\frac{d}{dx}[e^x] = e^x',
      };
    }

    if (parsed.terms.length > 0) {
      const termSteps = parsed.terms.map((term, index) => {
        return this.differentiateTerm(term, index + 1);
      });

      const combinedExpression = termSteps.map(s => s.expression).join(' + ').replace(/\+\s*-/g, '- ');

      return {
        explanation: termSteps.map(s => s.explanation).join(' '),expression: combinedExpression,
      };
    }

    return {
      explanation: 'Apply differentiation rules.',
      expression: 'f\'(x)',
    };
  }

  /**
   * Differentiate a single term and return the step
   */
  private differentiateTerm(
    term: PolynomialTerm,
    termNum: number
  ): { explanation: string; expression: string } {
    // Constant term
    if (term.exponent === 0) {
      return {
        explanation: `Term ${termNum}: The derivative of ${term.coefficient} is 0.`,
        expression: '0',
      };
    }

    // Power rule: d/dx[c*x^n] = c*n*x^(n-1)
    const newCoeff = term.coefficient * term.exponent;
    const newExp = term.exponent - 1;

    let expression: string;
    if (newExp === 0) {
      expression = `${newCoeff}`;
    } else if (newExp === 1) {
      expression = newCoeff === 1 ? 'x' : `${newCoeff}x`;
    } else {
      expression = newCoeff === 1 ? `x^{${newExp}}` : `${newCoeff}x^{${newExp}}`;
    }

    const originalTerm = this.formatTermLatex(term);

    return {
      explanation: `Term ${termNum}: \\frac{d}{dx}[${originalTerm}] = ${term.coefficient} \\cdot ${term.exponent}x^{${term.exponent}-1} = ${expression}.`,
      expression,
    };
  }

  /**
   * Format a single term in LaTeX
   */
  private formatTermLatex(term: PolynomialTerm): string {
    if (term.exponent === 0) {
      return `${term.coefficient}`;
    }

    let coeffStr = '';
    if (term.coefficient === -1) {
      coeffStr = '-';
    } else if (term.coefficient !== 1) {
      coeffStr = `${term.coefficient}`;
    }

    if (term.exponent === 1) {
      return `${coeffStr}x`;
    }

    return `${coeffStr}x^{${term.exponent}}`;
  }

  /**
   * Format the final derivative
   */
  private formatDerivative(parsed: ParsedExpression): string {
    if (parsed.type === 'trig' && parsed.trigFunction) {
      const derivatives: Record<string, string> = {
        sin: '\\cos(x)',
        cos: '-\\sin(x)',
        tan: '\\sec^2(x)',
        sec: '\\sec(x)\\tan(x)',
        csc: '-\\csc(x)\\cot(x)',
        cot: '-\\csc^2(x)',
      };
      return `f'(x) = ${derivatives[parsed.trigFunction] || '\\text{derivative}'}`;
    }

    if (parsed.type === 'exponential') {
      return "f'(x) = e^x";
    }

    if (parsed.terms.length > 0) {
      const differentiatedTerms = parsed.terms
        .map(term => this.differentiateTermToLatex(term))
        .filter(t => t !== '0');

      if (differentiatedTerms.length === 0) {
        return "f'(x) = 0";
      }

      const termsLatex = this.combineTerms(differentiatedTerms);
      return `f'(x) = ${termsLatex}`;
    }

    return "f'(x) = \\text{?}";
  }

  /**
   * Differentiate a term and return LaTeX
   */
  private differentiateTermToLatex(term: PolynomialTerm): string {
    if (term.exponent === 0) {
      return '0';
    }

    const newCoeff = term.coefficient * term.exponent;
    const newExp = term.exponent - 1;

    if (newExp === 0) {
      return `${newCoeff}`;
    }

    if (newExp === 1) {
      return newCoeff === 1 ? 'x' : `${newCoeff}x`;
    }

    return newCoeff === 1 ? `x^{${newExp}}` : `${newCoeff}x^{${newExp}}`;
  }

  /**
   * Combine terms with proper signs
   */
  private combineTerms(terms: string[]): string {
    if (terms.length === 0) return '0';
    if (terms.length === 1) return terms[0];

    return terms
      .map((term, index) => {
        if (index === 0) return term;
        if (term.startsWith('-')) {
          return ` - ${term.substring(1)}`;
        }
        return ` + ${term}`;
      })
      .join('');
  }

  /**
   * Extract just the answer part from the final LaTeX
   */
  private extractFinalAnswer(latex: string): string {
    const match = latex.match(/=\s*(.+)$/);
    return match ? match[1].trim() : latex;
  }
}
