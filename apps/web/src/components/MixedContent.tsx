'use client';

import { useEffect, useRef } from 'react';
import renderMathInElement from 'katex/dist/contrib/auto-render';

interface MixedContentProps {
  content: string;
  className?: string;
}

/**
 * Check if content contains mixed text and math (has $ delimiters)
 */
export function isMixedContent(content: string): boolean {
  return content.includes('$');
}

/**
 * MixedContent renders text with embedded math expressions using KaTeX auto-render.
 * Text is rendered as normal HTML, while math expressions ($...$ or $$...$$)
 * are automatically detected and rendered via KaTeX.
 */
export default function MixedContent({ content, className }: MixedContentProps) {
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      renderMathInElement(containerRef.current, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '$', right: '$', display: false }
        ],
        throwOnError: false
      });
    }
  }, [content]);

  return (
    <span ref={containerRef} className={className}>
      {content}
    </span>
  );
}
