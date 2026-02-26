'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  description?: string;
  icon?: React.ElementType;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  loading?: boolean;
}

export function StatCard({
  label,
  value,
  unit,
  description,
  icon: Icon,
  trend,
  trendValue,
  loading = false,
}: StatCardProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-16 mb-1" />
          <Skeleton className="h-3 w-12" />
        </CardContent>
      </Card>
    );
  }

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-muted-foreground';

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{label}</CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <div className="text-2xl font-bold">{value}</div>
          {unit && (
            <span className="text-xs text-muted-foreground uppercase tracking-wide">
              {unit}
            </span>
          )}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
        {trend && trendValue && (
          <div className={`flex items-center gap-1 mt-2 text-xs ${trendColor}`}>
            <TrendIcon className="h-3 w-3" />
            <span>{trendValue}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface StatsGridProps {
  stats: StatCardProps[];
  columns?: 2 | 3 | 4;
  loading?: boolean;
}

export function StatsGrid({ stats, columns = 4, loading = false }: StatsGridProps) {
  const gridCols = {
    2: 'sm:grid-cols-2',
    3: 'sm:grid-cols-2 lg:grid-cols-3',
    4: 'sm:grid-cols-2 lg:grid-cols-4',
  };

  if (loading) {
    return (
      <div className={`grid gap-4 ${gridCols[columns]}`}>
        {Array.from({ length: columns }).map((_, i) => (
          <StatCard
            key={i}
            label="Loading..."
            value="—"
            loading={true}
          />
        ))}
      </div>
    );
  }

  return (
    <div className={`grid gap-4 ${gridCols[columns]}`}>
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
}

interface ChapterProgressCardProps {
  chapterId: number;
  chapterTitle: string;
  completed: number;
  total: number;
  lastAccessed?: string;
  loading?: boolean;
}

export function ChapterProgressCard({
  chapterId,
  chapterTitle,
  completed,
  total,
  lastAccessed,
  loading = false,
}: ChapterProgressCardProps) {
  const percent = total > 0 ? (completed / total) * 100 : 0;

  if (loading) {
    return (
      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-2 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:bg-muted/50 transition-colors">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
              {chapterId}
            </span>
            <span className="font-medium text-sm">{chapterTitle}</span>
          </div>
          <Badge variant="outline" className="text-xs">
            {completed}/{total}
          </Badge>
        </div>
        <div className="space-y-1">
          <div className="h-2 w-full rounded-full bg-primary/20 overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${percent}%` }}
            />
          </div>
          {lastAccessed && (
            <p className="text-xs text-muted-foreground">
              Last accessed: {lastAccessed}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
