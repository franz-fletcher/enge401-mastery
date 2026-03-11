'use client';

import { MathJax } from 'better-react-mathjax';

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
  const mathContent = displayMode ? `$$${latex}$$` : `$${latex}$`;

  return (
    <span className={className}>
      <MathJax inline={!displayMode}>{mathContent}</MathJax>
    </span>
  );
}
