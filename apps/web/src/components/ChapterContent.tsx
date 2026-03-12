'use client';

import { useEffect, useRef } from 'react';
import renderMathInElement from 'katex/dist/contrib/auto-render';

interface ChapterContentProps {
  html: string;
  className?: string;
}

/**
 * ChapterContent renders markdown HTML content with KaTeX math rendering.
 * Uses dangerouslySetInnerHTML for the markdown content and auto-renders
 * math expressions using KaTeX.
 */
export default function ChapterContent({ html, className }: ChapterContentProps) {
  const containerRef = useRef<HTMLDivElement>(null);

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
  }, [html]);

  return (
    <div
      ref={containerRef}
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
