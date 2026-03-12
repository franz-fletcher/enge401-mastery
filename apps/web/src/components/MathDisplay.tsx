'use client';

import katex from 'katex';
import MixedContent, { isMixedContent } from './MixedContent';

interface MathDisplayProps {
  latex: string;
  displayMode?: boolean;
  className?: string;
}

/**
 * MathDisplay renders mathematical content.
 *
 * For pure math content (no $ delimiters), it wraps the content in math mode.
 * For mixed content (contains $ delimiters), it uses MixedContent to properly
 * render text and math segments while preserving spacing.
 */
export default function MathDisplay({
  latex,
  displayMode = false,
  className,
}: MathDisplayProps) {
  // Check if this is mixed content (contains $ delimiters outside of math)
  if (isMixedContent(latex)) {
    return <MixedContent content={latex} className={className} />;
  }

  // Check if content has any math delimiters or LaTeX commands
  // If not, render as plain text (not math)
  const hasMathDelimiters = /\$\$.*?\$\$|\$[^\$]+\$/.test(latex);
  const hasLatexCommands = /\\[a-zA-Z]+/.test(latex);
  if (!hasMathDelimiters && !hasLatexCommands) {
    return <span className={className}>{latex}</span>;
  }

  // Pure math content - render with KaTeX
  const html = katex.renderToString(latex, {
    throwOnError: false,
    displayMode,
  });

  return (
    <span
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
