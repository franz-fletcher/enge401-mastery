import Link from 'next/link';
import { chapters } from '@/lib/chapters';

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900">
          ENGE401 Mastery
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-gray-600">
          Interactive Engineering Mathematics — based on the{' '}
          <a
            href="https://github.com/millecodex/ENGE401"
            className="text-blue-600 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            AUT ENGE401 course manual
          </a>
          . Practice with randomised exercises, track your progress with spaced
          repetition.
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <Link
            href="/practice"
            className="rounded-md bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-700"
          >
            Start Practising
          </Link>
          <Link
            href="/dashboard"
            className="rounded-md border border-gray-300 px-6 py-3 text-gray-700 font-semibold hover:bg-gray-50"
          >
            View Dashboard
          </Link>
        </div>
      </section>

      {/* Chapter grid */}
      <section>
        <h2 className="mb-6 text-2xl font-semibold text-gray-800">Chapters</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {chapters.map((ch) => (
            <Link
              key={ch.id}
              href={`/chapter/${ch.id}`}
              className="group rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              <div className="mb-2 flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                  {ch.id}
                </span>
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">
                  {ch.title}
                </h3>
              </div>
              <p className="text-sm text-gray-500">{ch.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
