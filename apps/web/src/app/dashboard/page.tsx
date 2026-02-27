import Link from 'next/link';
import { chapters } from '@/lib/chapters';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  BookOpen,
  Target,
  TrendingUp,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Flame,
  BarChart3,
  RotateCcw,
} from 'lucide-react';

// Mock data - replace with actual data fetching
const mockStats = {
  dueForReview: 0,
  accuracy: null as number | null,
  streak: 0,
  totalExercises: 0,
  completedExercises: 0,
};

const mockRecentActivity: Array<{
  id: string;
  type: 'completed' | 'reviewed' | 'started';
  chapter: string;
  timestamp: string;
}> = [];

const mockUpcomingReviews: Array<{
  id: string;
  chapter: string;
  dueDate: string;
}> = [];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2" data-testid="dashboard-header">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl">
          Track your progress across all chapters and manage your spaced repetition
          review schedule.
        </p>
      </div>

      {/* Stats Overview */}
      <section data-testid="stats-cards">
        <h2 className="mb-4 text-lg font-semibold tracking-tight">Overview</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Due for Review"
            value={mockStats.dueForReview.toString()}
            unit="cards"
            icon={RotateCcw}
            description="Exercises ready for review"
          />
          <StatCard
            label="Accuracy"
            value={mockStats.accuracy?.toString() ?? '—'}
            unit="%"
            icon={Target}
            description="Overall answer accuracy"
          />
          <StatCard
            label="Streak"
            value={mockStats.streak.toString()}
            unit="days"
            icon={Flame}
            description="Consecutive study days"
          />
          <StatCard
            label="Completed"
            value={mockStats.completedExercises.toString()}
            unit="exercises"
            icon={CheckCircle2}
            description="Total exercises completed"
          />
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Chapter Progress */}
        <section className="lg:col-span-2 space-y-4" data-testid="progress-by-chapter">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold tracking-tight">Progress by Chapter</h2>
            </div>
            <Badge variant="outline">{chapters.length} Chapters</Badge>
          </div>
          
          <Card>
            <CardContent className="p-0">
              <ScrollArea className="h-[400px]">
                <div className="p-4 space-y-4">
                  {chapters.map((ch) => (
                    <div key={ch.id} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                            {ch.id}
                          </span>
                          <span className="font-medium">{ch.title}</span>
                        </div>
                        <span className="text-muted-foreground text-xs">
                          0 / 0 completed
                        </span>
                      </div>
                      <Progress value={0} className="h-2" />
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </section>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Upcoming Reviews */}
          <section className="space-y-4" data-testid="upcoming-reviews">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold tracking-tight">Upcoming Reviews</h2>
            </div>
            
            <Card>
              <CardContent className="p-4">
                {mockUpcomingReviews.length > 0 ? (
                  <div className="space-y-3">
                    {mockUpcomingReviews.map((review) => (
                      <div
                        key={review.id}
                        className="flex items-center justify-between py-2 border-b last:border-0"
                      >
                        <div>
                          <p className="text-sm font-medium">{review.chapter}</p>
                          <p className="text-xs text-muted-foreground">
                            Due {review.dueDate}
                          </p>
                        </div>
                        <Button size="sm" variant="ghost">
                          Review
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      No reviews scheduled
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Complete exercises to start tracking
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </section>

          {/* Recent Activity */}
          <section className="space-y-4" data-testid="recent-activity">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold tracking-tight">Recent Activity</h2>
            </div>
            
            <Card>
              <CardContent className="p-4">
                {mockRecentActivity.length > 0 ? (
                  <div className="space-y-3">
                    {mockRecentActivity.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-start gap-3 py-2 border-b last:border-0"
                      >
                        <div className="mt-0.5">
                          {activity.type === 'completed' && (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          )}
                          {activity.type === 'reviewed' && (
                            <RotateCcw className="h-4 w-4 text-blue-500" />
                          )}
                          {activity.type === 'started' && (
                            <BookOpen className="h-4 w-4 text-yellow-500" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm">
                            {activity.type === 'completed' && 'Completed exercise in '}
                            {activity.type === 'reviewed' && 'Reviewed '}
                            {activity.type === 'started' && 'Started '}
                            <span className="font-medium">{activity.chapter}</span>
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {activity.timestamp}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <TrendingUp className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      No recent activity
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Start practicing to see your progress
                    </p>
                  </div>
                )}
              </CardContent>
              <Separator />
              <CardFooter className="p-3">
                <Button asChild variant="ghost" size="sm" className="w-full">
                  <Link href="/practice">
                    Start Practicing
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  unit,
  icon: Icon,
  description,
}: {
  label: string;
  value: string;
  unit: string;
  icon: React.ElementType;
  description: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{label}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground uppercase tracking-wide">{unit}</p>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  );
}
