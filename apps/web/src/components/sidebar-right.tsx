'use client';

import * as React from 'react';
import { useState } from 'react';
import {
  Bell,
  CheckCircle,
  Flame,
  Target,
  Trophy,
  Calendar as CalendarIcon,
} from 'lucide-react';
import { format, startOfMonth, isSameDay } from 'date-fns';

import { cn } from '@/lib/utils';
import { useStats } from '@/hooks/use-stats';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  subtext?: string;
  color?: string;
  isLoading?: boolean;
}

function StatCard({ icon: Icon, label, value, subtext, color = 'text-primary', isLoading }: StatCardProps) {
  return (
    <div className="flex items-center gap-3 rounded-lg border bg-card p-3">
      <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg bg-muted', color)}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        {isLoading ? (
          <Skeleton className="h-5 w-12 mt-0.5" />
        ) : (
          <p className="text-lg font-semibold leading-tight">{value}</p>
        )}
        {subtext && !isLoading && (
          <p className="text-xs text-muted-foreground truncate">{subtext}</p>
        )}
      </div>
    </div>
  );
}

function StudyDayPopover({ date, studyDays }: { date: Date; studyDays: { date: Date; exercisesCompleted: number; reviewsCompleted: number }[] }) {
  const dayData = studyDays.find(d => isSameDay(d.date, date));
  
  if (!dayData) {
    return (
      <div className="text-sm text-muted-foreground">
        No study activity on this day
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="font-medium">{format(date, 'MMMM d, yyyy')}</p>
      <div className="space-y-1 text-sm">
        {dayData.exercisesCompleted > 0 && (
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>{dayData.exercisesCompleted} exercises completed</span>
          </div>
        )}
        {dayData.reviewsCompleted > 0 && (
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-yellow-500" />
            <span>{dayData.reviewsCompleted} reviews completed</span>
          </div>
        )}
      </div>
    </div>
  );
}

export function SidebarRight() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { stats, studyDays, reviewDueDates, isLoading } = useStats(currentMonth);

  // Custom day content renderer for calendar
  const renderDay = (day: Date) => {
    const hasStudy = studyDays.some(d => isSameDay(d.date, day));
    const hasReviewDue = reviewDueDates.some(d => isSameDay(d, day));
    
    return (
      <Popover>
        <PopoverTrigger asChild>
          <button
            className={cn(
              'relative h-full w-full rounded-md p-1 text-sm transition-colors hover:bg-accent',
              hasStudy && 'bg-green-100 hover:bg-green-200 dark:bg-green-900/30 dark:hover:bg-green-900/50',
              hasReviewDue && 'ring-2 ring-orange-400 ring-offset-1'
            )}
          >
            {format(day, 'd')}
            {hasStudy && (
              <span className="absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-green-500" />
            )}
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-56" align="center">
          <StudyDayPopover date={day} studyDays={studyDays} />
        </PopoverContent>
      </Popover>
    );
  };

  return (
    <Sidebar side="right" variant="inset" collapsible="icon" className="hidden" data-testid="sidebar-right">
      <SidebarHeader className="border-b border-sidebar-border" data-testid="quick-stats">
        <SidebarGroupLabel>Quick Stats</SidebarGroupLabel>
      </SidebarHeader>

      <SidebarContent>
        {/* Stats Grid */}
        <SidebarGroup>
          <SidebarGroupContent className="space-y-2 px-2">
            <StatCard
              icon={Flame}
              label="Day Streak"
              value={stats.streak}
              subtext={stats.streak > 0 ? 'Keep it up!' : 'Start today!'}
              color="text-orange-500"
              isLoading={isLoading}
            />
            <StatCard
              icon={Target}
              label="Accuracy"
              value={`${stats.accuracy}%`}
              subtext="Today's performance"
              color="text-blue-500"
              isLoading={isLoading}
            />
            <StatCard
              icon={CheckCircle}
              label="Completed"
              value={stats.completedToday}
              subtext="Exercises today"
              color="text-green-500"
              isLoading={isLoading}
            />
            <StatCard
              icon={Bell}
              label="Due for Review"
              value={stats.reviewsDue}
              subtext={stats.reviewsDue > 0 ? 'Reviews waiting' : 'All caught up!'}
              color="text-purple-500"
              isLoading={isLoading}
            />
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Mini Calendar */}
        <SidebarGroup data-testid="study-calendar">
          <SidebarGroupLabel className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            Study Calendar
          </SidebarGroupLabel>
          <SidebarGroupContent className="px-2">
            <Card className="border-sidebar-border">
              <CardContent className="p-2">
                <Calendar
                  mode="single"
                  month={currentMonth}
                  onMonthChange={setCurrentMonth}
                  className="w-full"
                  classNames={{
                    root: 'w-full',
                    months: 'w-full',
                    month: 'w-full',
                    table: 'w-full',
                    cell: 'h-8 w-8 p-0 text-center text-sm',
                    day: 'h-8 w-8 p-0 font-normal',
                    nav: 'space-x-1',
                    button_previous: 'h-7 w-7',
                    button_next: 'h-7 w-7',
                  }}
                  components={{
                    Day: ({ day, ...props }) => (
                      <td {...props} className="h-8 w-8 p-0">
                        {renderDay(day.date)}
                      </td>
                    ),
                  }}
                />
                <div className="mt-2 flex items-center justify-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-green-500" />
                    <span>Studied</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full ring-2 ring-orange-400" />
                    <span>Review Due</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Achievement Section */}
        <SidebarGroup>
          <SidebarGroupLabel>Achievements</SidebarGroupLabel>
          <SidebarGroupContent className="px-2">
            <Card className="border-sidebar-border">
              <CardContent className="p-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/30">
                    <Trophy className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Getting Started</p>
                    <p className="text-xs text-muted-foreground">Complete your first exercise</p>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">0/1</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div className="h-full w-0 rounded-full bg-yellow-500 transition-all" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <div className="px-4 py-2 text-center text-xs text-muted-foreground">
          <p>ENGE401 Mastery</p>
          <p>Engineering Mathematics</p>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
