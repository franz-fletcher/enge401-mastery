import Link from 'next/link';
import { chapters } from '@/lib/chapters';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  BookOpen,
  Calculator,
  TrendingUp,
  ArrowRight,
  GraduationCap,
  Target,
  Brain,
  Code,
  ExternalLink,
  FileText,
} from 'lucide-react';

export const metadata = {
  title: 'About | ENGE401 Mastery',
  description: 'Learn about ENGE401 Mastery — an interactive engineering mathematics learning system based on the AUT ENGE401 course manual.',
};

export default function AboutPage() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-background border px-6 py-12 md:px-12 md:py-16">
        <div className="relative z-10 max-w-3xl">
          <Badge variant="secondary" className="mb-4">
            <GraduationCap className="mr-1 h-3 w-3" />
            About the Project
          </Badge>
          <h1 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl">
            ENGE401 Mastery
          </h1>
          <p className="text-lg text-muted-foreground md:text-xl">
            Interactive, self-paced engineering mathematics learning — 
            understand it well enough to code it.
          </p>
        </div>
      </section>

      {/* About the Project */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">About the Project</h2>
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p className="text-muted-foreground leading-relaxed">
            ENGE401 Mastery is an interactive, self-paced engineering mathematics learning system 
            designed to help students master the fundamentals of engineering math through active 
            practice and spaced repetition.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            The platform is based on the ENGE401 course manual from Auckland University of Technology 
            (AUT), covering essential topics from foundational algebra through to differential equations. 
            Rather than passive reading, students engage with randomized exercises that adapt to their 
            skill level, ensuring a deep understanding of each concept.
          </p>
        </div>
      </section>

      <Separator />

      {/* Course Content */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <BookOpen className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-semibold tracking-tight">Course Content</h2>
        </div>
        <p className="text-muted-foreground">
          The ENGE401 curriculum covers six fundamental chapters of engineering mathematics:
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {chapters.map((chapter) => (
            <Card key={chapter.id} className="h-full">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                    {chapter.id}
                  </div>
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-base leading-tight">
                      {chapter.title}
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="line-clamp-2">
                  {chapter.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator />

      {/* Features */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <Target className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-semibold tracking-tight">Features</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Interactive Exercises</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Practice with randomized exercises across three difficulty levels 
                (Easy, Medium, Hard). Each exercise is generated dynamically, 
                providing unlimited practice opportunities.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Practice Mode</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Focus on specific chapters and difficulty levels, or mix it up 
                with cross-chapter practice. Perfect for targeted study sessions 
                or comprehensive review.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Spaced Repetition</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Optimized review scheduling based on your performance. The system 
                tracks which concepts you have mastered and which need more review, 
                scheduling practice at optimal intervals for long-term retention.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Progress Tracking</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Visualize your learning journey with detailed progress metrics. 
                Track completion rates, streaks, and mastery levels across all 
                chapters to stay motivated and focused.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator />

      {/* Learning Approach */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <Code className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-semibold tracking-tight">Learning Approach</h2>
        </div>
        <div className="rounded-lg bg-muted/50 p-6">
          <blockquote className="text-lg font-medium italic text-foreground">
            &ldquo;Understand it well enough to code it.&rdquo;
          </blockquote>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            This platform embodies the philosophy that true understanding comes from 
            the ability to apply knowledge in new contexts. By working through 
            algorithmically-generated exercises, students develop a deeper, more 
            flexible understanding of mathematical concepts than traditional 
            memorization alone can provide.
          </p>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            The spaced repetition system ensures that knowledge is reinforced at 
            scientifically-optimal intervals, moving concepts from short-term memory 
            into long-term mastery. Combined with immediate feedback and step-by-step 
            solutions, this creates a powerful learning environment for engineering 
            mathematics.
          </p>
        </div>
      </section>

      <Separator />

      {/* Attribution & Credits */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <FileText className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-semibold tracking-tight">Attribution & Credits</h2>
        </div>
        <Card className="border-l-4 border-l-primary">
          <CardHeader>
            <CardTitle>Original Course Material</CardTitle>
            <CardDescription>
              This learning platform is based on the official ENGE401 course manual 
              from Auckland University of Technology.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm">
                <span className="font-medium">Source:</span>{' '}
                <span className="text-muted-foreground">
                  ENGE401 - Engineering Mathematics Course Manual
                </span>
              </p>
              <p className="text-sm">
                <span className="font-medium">Author:</span>{' '}
                <span className="text-muted-foreground">
                  Jeff Nijsse (Auckland University of Technology), 2023
                </span>
              </p>
              <p className="text-sm">
                <span className="font-medium">Based on work by:</span>{' '}
                <span className="text-muted-foreground">
                  Peter Watson, 2010
                </span>
              </p>
            </div>
            
            <Separator />
            
            <div className="space-y-3">
              <p className="text-sm font-medium">License</p>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">CC-BY-4.0</Badge>
                <span className="text-sm text-muted-foreground">
                  Creative Commons Attribution 4.0 International
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                This work is licensed under a Creative Commons Attribution 4.0 
                International License, which permits use, sharing, adaptation, 
                distribution and reproduction in any medium or format, as long as 
                appropriate credit is given to the original author.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Button variant="outline" size="sm" asChild>
                  <a
                    href="https://github.com/millecodex/ENGE401"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    View Source Repository
                  </a>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a
                    href="https://creativecommons.org/licenses/by/4.0/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    View License
                  </a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Call to Action */}
      <section className="rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-background border px-6 py-8 text-center">
        <h3 className="mb-2 text-lg font-semibold">Ready to start learning?</h3>
        <p className="mb-4 text-sm text-muted-foreground">
          Begin your engineering mathematics journey with interactive practice 
          and spaced repetition.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button asChild>
            <Link href="/practice">
              Start Practising
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
