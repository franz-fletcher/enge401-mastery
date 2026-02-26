import Link from 'next/link';
import { chapters } from '@/lib/chapters';

export default function ChapterNav() {
  return (
    <nav className="flex flex-wrap items-center gap-x-6 gap-y-2">
      <Link href="/" className="font-bold text-blue-700 hover:text-blue-900">
        ENGE401 Mastery
      </Link>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
        {chapters.map((ch) => (
          <Link
            key={ch.id}
            href={`/chapter/${ch.id}`}
            className="hover:text-blue-600"
          >
            Ch {ch.id}
          </Link>
        ))}
        <Link href="/practice" className="hover:text-blue-600">
          Practice
        </Link>
        <Link href="/dashboard" className="hover:text-blue-600">
          Dashboard
        </Link>
      </div>
    </nav>
  );
}
