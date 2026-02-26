import Link from 'next/link';
import { notFound } from 'next/navigation';
import { chapters } from '@/lib/chapters';
import ExerciseCard from '@/components/ExerciseCard';

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

  return (
    <div>
      <nav className="mb-6 text-sm text-gray-500">
        <Link href="/" className="hover:underline">Home</Link>
        {' / '}
        <span className="text-gray-800">Chapter {chapter.id}: {chapter.title}</span>
      </nav>

      <h1 className="mb-2 text-3xl font-bold text-gray-900">
        Chapter {chapter.id}: {chapter.title}
      </h1>
      <p className="mb-8 text-gray-600">{chapter.description}</p>

      {/* Theory placeholder */}
      <section className="mb-10 rounded-lg border border-gray-200 bg-gray-50 p-6">
        <h2 className="mb-3 text-xl font-semibold text-gray-800">Theory</h2>
        <p className="text-gray-500 italic">
          Theory content for Chapter {chapter.id} will appear here. Refer to the{' '}
          <a
            href="https://github.com/millecodex/ENGE401"
            className="text-blue-600 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            ENGE401 course manual
          </a>{' '}
          for detailed explanations.
        </p>
      </section>

      {/* Exercise section */}
      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold text-gray-800">Sample Exercises</h2>
        <ExerciseCard
          question={`Sample question for Chapter ${chapter.id}: ${chapter.title}`}
          answer="See solution"
          hints={['Think about the core concept', 'Apply the relevant formula']}
        />
      </section>

      <div className="flex gap-4">
        <Link
          href={`/practice?chapter=${chapter.id}`}
          className="rounded-md bg-blue-600 px-5 py-2 text-white font-medium hover:bg-blue-700"
        >
          Start Practice
        </Link>
        {chapter.id < 6 && (
          <Link
            href={`/chapter/${chapter.id + 1}`}
            className="rounded-md border border-gray-300 px-5 py-2 text-gray-700 font-medium hover:bg-gray-50"
          >
            Next Chapter →
          </Link>
        )}
      </div>
    </div>
  );
}
