interface ProgressBarProps {
  percent: number;
  className?: string;
}

export default function ProgressBar({ percent, className = '' }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, percent));
  return (
    <div className={`h-2 w-full overflow-hidden rounded-full bg-gray-200 ${className}`}>
      <div
        className="h-full rounded-full bg-blue-500 transition-all"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
