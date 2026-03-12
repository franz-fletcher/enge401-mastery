'use client';

import MixedContent from '@/components/MixedContent';

/**
 * Static Math Display Test Page
 *
 * This page provides fixed math content for reliable visual regression testing.
 * Unlike the practice page which generates random exercises, this page has
 * deterministic content that produces consistent screenshots across test runs.
 */

export default function MathDisplayTestPage() {
  return (
    <div className="p-8 space-y-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Math Display Test Page</h1>

      {/* Section 1: Mixed Content - Text and Math */}
      <section
        data-testid="mixed-content-section"
        className="border rounded-lg p-6 bg-card"
      >
        <h2 className="text-xl font-semibold mb-4">Mixed Content</h2>
        <div className="space-y-2 text-lg">
          <p>
            <MixedContent content="Solve $x^2 - 8x + 16 = 0$ for $x$." />
          </p>
          <p>
            <MixedContent content="The derivative of $f(x) = x^3$ is $f'(x) = 3x^2$." />
          </p>
        </div>
      </section>

      {/* Section 2: Display Mode Math */}
      <section
        data-testid="display-math-section"
        className="border rounded-lg p-6 bg-card"
      >
        <h2 className="text-xl font-semibold mb-4">Display Mode</h2>
        <div className="space-y-4 text-lg">
          <MixedContent content="$$\\int_0^1 x^2 \\, dx = \\frac{1}{3}$$" />
          <MixedContent content="$$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$" />
        </div>
      </section>

      {/* Section 3: Linear Equation */}
      <section
        data-testid="linear-equation-section"
        className="border rounded-lg p-6 bg-card"
      >
        <h2 className="text-xl font-semibold mb-4">Linear Equation</h2>
        <div className="space-y-2 text-lg">
          <p>
            <MixedContent content="Solve $2x + 5 = 13$" />
          </p>
          <p>
            <MixedContent content="Subtract 5 from both sides: $2x = 8$" />
          </p>
          <p>
            <MixedContent content="Divide by 2: $x = 4$" />
          </p>
        </div>
      </section>

      {/* Section 4: Quadratic Equation */}
      <section
        data-testid="quadratic-equation-section"
        className="border rounded-lg p-6 bg-card"
      >
        <h2 className="text-xl font-semibold mb-4">Quadratic Equation</h2>
        <div className="space-y-2 text-lg">
          <p>
            <MixedContent content="Solve $x^2 - 5x + 6 = 0$" />
          </p>
          <p>Using the quadratic formula:</p>
          <MixedContent content="$$x = \\frac{5 \\pm \\sqrt{25 - 24}}{2}$$" />
          <p>
            <MixedContent content="Solutions: $x = 2$ or $x = 3$" />
          </p>
        </div>
      </section>

      {/* Section 5: Step-by-Step Solution */}
      <section
        data-testid="solution-steps-section"
        className="border rounded-lg p-6 bg-card"
      >
        <h2 className="text-xl font-semibold mb-4">Solution Steps</h2>
        <div className="space-y-4">
          <div className="p-3 bg-muted rounded">
            <strong>Step 1:</strong>{' '}
            <MixedContent content="Original equation $2x + 5 = 13$" />
          </div>
          <div className="p-3 bg-muted rounded">
            <strong>Step 2:</strong>{' '}
            <MixedContent content="Subtract 5 from both sides $2x = 8$" />
          </div>
          <div className="p-3 bg-muted rounded">
            <strong>Step 3:</strong>{' '}
            <MixedContent content="Divide by 2 $x = 4$" />
          </div>
        </div>
      </section>

      {/* Section 6: Final Answer */}
      <section
        data-testid="final-answer-section"
        className="border rounded-lg p-6 bg-card"
      >
        <h2 className="text-xl font-semibold mb-4">Final Answer</h2>
        <div className="bg-primary/10 p-4 rounded-lg">
          <p className="text-lg">
            <MixedContent content="The solution is $x = 4$" />
          </p>
        </div>
      </section>
    </div>
  );
}
