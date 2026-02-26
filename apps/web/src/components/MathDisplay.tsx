'use client';

import katex from 'katex';

interface MathDisplayProps {
  latex: string;
  displayMode?: boolean;
  className?: string;
}

export default function MathDisplay({
  latex,
  displayMode = false,
  className,
}: MathDisplayProps) {
  let html = '';
  try {
    html = katex.renderToString(latex, {
      displayMode,
      throwOnError: false,
    });
  } catch {
    html = `<span class="text-red-500">[Math error: ${latex}]</span>`;
  }

  return (
    <span
      className={className}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
