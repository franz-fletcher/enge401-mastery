import Link from 'next/link';
import { chapters } from '@/lib/chapters';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { BookOpen, Calculator, TrendingUp, ArrowRight, Sparkles } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-background border px-6 py-12 md:px-12 md:py-16">
        <div className="relative z-10 max-w-2xl">
          <Badge variant="secondary" className="mb-4">
            <Sparkles className="mr-1 h-3 w-3" />
            AUT ENGE401 Course
          </Badge>
          <h1 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl">
            ENGE401 Mastery
          </h1>
          <p className="mb-6 text-base text-muted-foreground md:text-lg">
            Interactive Engineering Mathematics — based on the{' '}
            <a
              href="https://github.com/millecodex/ENGE401"
              className="text-primary underline-offset-4 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              AUT ENGE401 course manual
            </a>
            . Practice with randomised exercises, track your progress with spaced
            repetition.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/practice">
                Start Practising
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/dashboard">View Dashboard</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Overview */}
      <section>
        <h2 className="mb-4 text-xl font-semibold tracking-tight">Overview</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Chapters</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{chapters.length}</div>
              <p className="text-xs text-muted-foreground">
                Covering algebra to differential equations
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Exercise Types</CardTitle>
              <Calculator className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">
                Easy, Medium, and Hard difficulties
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Learning Method</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Spaced Repetition</div>
              <p className="text-xs text-muted-foreground">
                Optimised review scheduling
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator />

      {/* Chapter Grid */}
      <section>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Chapters</h2>
            <p className="text-sm text-muted-foreground">
              Select a chapter to start learning
            </p>
          </div>
          <Button asChild variant="ghost" size="sm">
            <Link href="/dashboard">View all progress</Link>
          </Button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {chapters.map((ch) => (
            <Link key={ch.id} href={`/chapter/${ch.id}`} className="group">
              <Card className="h-full transition-colors hover:bg-muted/50">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                      {ch.id}
                    </div>
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-base leading-tight group-hover:text-primary">
                        {ch.title}
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-3">
                  <CardDescription className="line-clamp-2">
                    {ch.description}
                  </CardDescription>
                </CardContent>
                <CardFooter className="pt-0">
                  <Badge variant="outline" className="text-xs">
                    Chapter {ch.id}
                  </Badge>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="rounded-xl bg-muted/50 px-6 py-8 text-center">
        <h3 className="mb-2 text-lg font-semibold">Ready to practice?</h3>
        <p className="mb-4 text-sm text-muted-foreground">
          Generate randomised exercises from any chapter and difficulty level.
        </p>
        <Button asChild>
          <Link href="/practice">
            Go to Practice Mode
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </section>
    </div>
  );
}
