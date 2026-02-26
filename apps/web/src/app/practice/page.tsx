'use client';

import { useState, useEffect, useCallback } from 'react';
import { chapters } from '@/lib/chapters';
import ExerciseCard from '@/components/ExerciseCard';
import MathDisplay from '@/components/MathDisplay';
import type { Difficulty, Exercise } from '@enge401-mastery/exercise-generator';
import {
  generateAlgebraExercise,
  generateTrigExercise,
  generateExponentialExercise,
  generateDifferentiationExercise,
  generateIntegrationExercise,
  generateDiffeqExercise,
} from '@enge401-mastery/exercise-generator';

const exerciseGenerators: Record<number, (difficulty: Difficulty) => Exercise> = {
  1: generateAlgebraExercise,
  2: generateTrigExercise,
  3: generateExponentialExercise,
  4: generateDifferentiationExercise,
  5: generateIntegrationExercise,
  6: generateDiffeqExercise,
};

export default function PracticePage() {
  const [selectedChapter, setSelectedChapter] = useState<number>(1);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('easy');
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [exerciseKey, setExerciseKey] = useState(0);

  const generateExercise = useCallback(() => {
    const generator = exerciseGenerators[selectedChapter];
    if (generator) {
      const newExercise = generator(selectedDifficulty);
      setExercise(newExercise);
      setExerciseKey((prev) => prev + 1);
    }
  }, [selectedChapter, selectedDifficulty]);

  // Generate exercise when chapter or difficulty changes
  useEffect(() => {
    generateExercise();
  }, [generateExercise]);

  const chapter = chapters.find((c) => c.id === selectedChapter)!;

  return (
    <div>
      <h1 className="mb-2 text-3xl font-bold text-gray-900">Practice Mode</h1>
      <p className="mb-8 text-gray-600">
        Generate randomised exercises. Select a chapter and difficulty, then answer
        the question.
      </p>

      {/* Controls */}
      <div className="mb-8 flex flex-wrap items-end gap-4">
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
        <button
          onClick={generateExercise}
          className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          New Question
        </button>
      </div>

      {/* Exercise display */}
      <section>
        <h2 className="mb-4 text-xl font-semibold text-gray-800">
          Chapter {chapter.id}: {chapter.title}
        </h2>
        {exercise ? (
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4 text-gray-800 font-medium">
              <MathDisplay latex={exercise.question.replace(/\$/g, '')} displayMode={true} />
            </div>
            <ExerciseCard
              key={exerciseKey}
              question=""
              answer={exercise.answer}
              hints={exercise.hints}
            />
          </div>
        ) : (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-center text-gray-500">
            Loading exercise...
          </div>
        )}
      </section>
    </div>
  );
}
