import Link from 'next/link';
import { notFound } from 'next/navigation';
import { chapters } from '@/lib/chapters';
import ExerciseCard from '@/components/ExerciseCard';
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  BookOpen,
  Calculator,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  GraduationCap,
  Target,
  ExternalLink,
} from 'lucide-react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return chapters.map((ch) => ({ id: String(ch.id) }));
}

export default async function ChapterPage({ params }: PageProps) {
  const { id } = await params;
  const chapter = chapters.find((ch) => ch.id === Number(id));
  if (!chapter) notFound();

  const prevChapter = chapters.find((ch) => ch.id === chapter.id - 1);
  const nextChapter = chapters.find((ch) => ch.id === chapter.id + 1);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Badge variant="outline">Chapter {chapter.id}</Badge>
          <span>/</span>
          <span>{chapters.length} Chapters</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {chapter.title}
        </h1>
        <p className="text-muted-foreground max-w-2xl">{chapter.description}</p>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Target className="h-4 w-4" />
            Chapter Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Completion</span>
            <span className="font-medium">0%</span>
          </div>
          <Progress value={0} className="h-2" />
          <p className="text-xs text-muted-foreground">
            Complete exercises to track your progress
          </p>
        </CardContent>
      </Card>

      {/* Theory Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold tracking-tight">Theory</h2>
        </div>
        
        <Collapsible defaultOpen>
          <Card>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Chapter Overview</CardTitle>
                  <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform duration-200 data-[state=open]:rotate-180" />
                </div>
                <CardDescription>
                  Key concepts and learning objectives
                </CardDescription>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Theory content for Chapter {chapter.id} will appear here. This section
                  will cover the fundamental concepts, formulas, and techniques needed
                  to master {chapter.title.toLowerCase()}.
                </p>
                <div className="rounded-lg bg-muted p-4">
                  <p className="text-sm text-muted-foreground">
                    Refer to the{' '}
                    <a
                      href="https://github.com/millecodex/ENGE401"
                      className="text-primary underline-offset-4 hover:underline inline-flex items-center gap-1"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      ENGE401 course manual
                      <ExternalLink className="h-3 w-3" />
                    </a>{' '}
                    for detailed explanations and worked examples.
                  </p>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      </section>

      <Separator />

      {/* Exercise Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold tracking-tight">Sample Exercises</h2>
        </div>
        
        <ExerciseCard
          question={`Sample question for Chapter ${chapter.id}: ${chapter.title}`}
          answer="See solution"
          hints={['Think about the core concept', 'Apply the relevant formula']}
        />
      </section>

      <Separator />

      {/* Related Exercises */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold tracking-tight">Practice Options</h2>
        </div>
        
        <div className="grid gap-4 sm:grid-cols-2">
          <Card className="hover:bg-muted/50 transition-colors">
            <CardHeader>
              <CardTitle className="text-base">Chapter Practice</CardTitle>
              <CardDescription>
                Practice exercises specific to this chapter
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button asChild variant="outline" className="w-full">
                <Link href={`/chapter/${chapter.id}/practice`}>
                  Start Chapter Practice
                </Link>
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="hover:bg-muted/50 transition-colors">
            <CardHeader>
              <CardTitle className="text-base">Review Mode</CardTitle>
              <CardDescription>
                Spaced repetition review for this chapter
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button asChild variant="outline" className="w-full">
                <Link href={`/chapter/${chapter.id}/review`}>
                  Start Review
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4">
        {prevChapter ? (
          <Button asChild variant="outline">
            <Link href={`/chapter/${prevChapter.id}`}>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Previous
            </Link>
          </Button>
        ) : (
          <div />
        )}
        
        <Button asChild>
          <Link href={`/practice?chapter=${chapter.id}`}>
            <Calculator className="mr-2 h-4 w-4" />
            Practice This Chapter
          </Link>
        </Button>
        
        {nextChapter ? (
          <Button asChild variant="outline">
            <Link href={`/chapter/${nextChapter.id}`}>
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
