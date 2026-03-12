'use client';

import katex from 'katex';

interface MixedContentProps {
  content: string;
  className?: string;
}

type Segment =
  | { type: 'text'; content: string }
  | { type: 'math'; content: string; displayMode: boolean };

/**
 * Parse content with $...$ (inline) and $$...$$ (display) math delimiters
 * into segments of text and math.
 *
 * Example:
 *   "Solve $x^2 - 8x + 16 = 0$" ->
 *   [
 *     { type: 'text', content: 'Solve ' },
 *     { type: 'math', content: 'x^2 - 8x + 16 = 0', displayMode: false }
 *   ]
 */
function parseMixedContent(content: string): Segment[] {
  const segments: Segment[] = [];
  let i = 0;

  while (i < content.length) {
    // Look for display math delimiter $$
    if (content.slice(i, i + 2) === '$$') {
      const endIndex = content.indexOf('$$', i + 2);
      if (endIndex !== -1) {
        const mathContent = content.slice(i + 2, endIndex).trim();
        if (mathContent) {
          segments.push({ type: 'math', content: mathContent, displayMode: true });
        }
        i = endIndex + 2;
        continue;
      }
    }

    // Look for inline math delimiter $
    if (content[i] === '$') {
      const endIndex = content.indexOf('$', i + 1);
      if (endIndex !== -1) {
        const mathContent = content.slice(i + 1, endIndex).trim();
        if (mathContent) {
          segments.push({ type: 'math', content: mathContent, displayMode: false });
        }
        i = endIndex + 1;
        continue;
      }
    }

    // Collect text until next delimiter
    let textEnd = content.length;
    const nextInline = content.indexOf('$', i);
    const nextDisplay = content.indexOf('$$', i);

    if (nextInline !== -1) {
      textEnd = Math.min(textEnd, nextInline);
    }
    if (nextDisplay !== -1) {
      textEnd = Math.min(textEnd, nextDisplay);
    }

    const textContent = content.slice(i, textEnd);
    if (textContent) {
      segments.push({ type: 'text', content: textContent });
    }
    i = textEnd;
  }

  return segments;
}

/**
 * Check if content contains mixed text and math (has $ delimiters)
 */
export function isMixedContent(content: string): boolean {
  return content.includes('$');
}

/**
 * MixedContent renders text with embedded math expressions.
 * Text is rendered as normal HTML (preserving spaces),
 * while math expressions ($...$ or $$...$$) are rendered via KaTeX.
 */
export default function MixedContent({ content, className }: MixedContentProps) {
  const segments = parseMixedContent(content);

  return (
    <span className={className}>
      {segments.map((segment, index) => {
        if (segment.type === 'text') {
          // Preserve whitespace by using pre-wrap or rendering as-is
          return (
            <span key={index} style={{ whiteSpace: 'pre-wrap' }}>
              {segment.content}
            </span>
          );
        }

        // Math segment - render with KaTeX
        const html = katex.renderToString(segment.content, {
          throwOnError: false,
          displayMode: segment.displayMode,
        });

        return (
          <span
            key={index}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      })}
    </span>
  );
}
