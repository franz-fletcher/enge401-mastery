'use client';

import { useState } from 'react';
import { chapters } from '@/lib/chapters';
import ExerciseCard from '@/components/ExerciseCard';
import type { Difficulty } from '@enge401-mastery/exercise-generator';

export default function PracticePage() {
  const [selectedChapter, setSelectedChapter] = useState<number>(1);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('easy');

  const chapter = chapters.find((c) => c.id === selectedChapter)!;

  return (
    <div>
      <h1 className="mb-2 text-3xl font-bold text-gray-900">Practice Mode</h1>
      <p className="mb-8 text-gray-600">
        Generate randomised exercises. Select a chapter and difficulty, then answer
        the question.
      </p>

      {/* Controls */}
      <div className="mb-8 flex flex-wrap gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Chapter
          </label>
          <select
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedChapter}
            onChange={(e) => setSelectedChapter(Number(e.target.value))}
          >
            {chapters.map((ch) => (
              <option key={ch.id} value={ch.id}>
                {ch.id}. {ch.title}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Difficulty
          </label>
          <select
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value as Difficulty)}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      </div>

      {/* Exercise display */}
      <section>
        <h2 className="mb-4 text-xl font-semibold text-gray-800">
          Chapter {chapter.id}: {chapter.title}
        </h2>
        <ExerciseCard
          question={`Practice question for Chapter ${chapter.id} (${selectedDifficulty}) — exercises are generated dynamically.`}
          answer="Submit your answer to see the solution."
          hints={[
            `This is a ${selectedDifficulty} question from ${chapter.title}`,
            'More hints will appear after your attempt',
          ]}
        />
      </section>
    </div>
  );
}
