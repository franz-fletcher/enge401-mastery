'use client';

import { useEffect, useRef } from 'react';
import renderMathInElement from 'katex/dist/contrib/auto-render';
import { cn } from '@/lib/utils';

interface ChapterContentProps {
  html: string;
  className?: string;
}

/**
 * Default prose styling for chapter content.
 * Provides consistent typography for markdown-rendered content.
 */
const defaultProseClasses =
  'prose prose-sm max-w-none dark:prose-invert prose-headings:font-semibold prose-h1:text-xl prose-h2:text-lg prose-h3:text-base prose-p:text-muted-foreground prose-strong:text-foreground prose-code:text-primary prose-pre:bg-muted prose-pre:text-muted-foreground prose-table:text-sm prose-th:text-foreground prose-td:text-muted-foreground';

/**
 * ChapterContent renders markdown HTML content with KaTeX math rendering.
 * Uses dangerouslySetInnerHTML for the markdown content and auto-renders
 * math expressions using KaTeX.
 *
 * Default prose styling is applied. Use className to override or extend.
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
      className={cn(defaultProseClasses, className)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
