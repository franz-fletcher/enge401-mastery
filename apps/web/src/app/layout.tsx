import type { Metadata } from 'next';
import 'katex/dist/katex.min.css';
import './globals.css';
import ChapterNav from '@/components/ChapterNav';

export const metadata: Metadata = {
  title: 'ENGE401 Mastery',
  description: 'Interactive Engineering Mathematics — AUT ENGE401',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <header className="border-b bg-white shadow-sm">
          <div className="mx-auto max-w-6xl px-4 py-3">
            <ChapterNav />
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
