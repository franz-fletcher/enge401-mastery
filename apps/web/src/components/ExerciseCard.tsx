'use client';

import { useState } from 'react';
import MathDisplay from './MathDisplay';

interface ExerciseCardProps {
  question: string;
  answer: string | number;
  hints?: string[];
}

export default function ExerciseCard({
  question,
  answer,
  hints = [],
}: ExerciseCardProps) {
  const [userAnswer, setUserAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [hintsShown, setHintsShown] = useState(0);

  const isCorrect =
    submitted &&
    userAnswer.trim().toLowerCase() === String(answer).trim().toLowerCase();

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <p className="mb-4 text-gray-800 font-medium">{question}</p>

      {/* Hints */}
      {hints.length > 0 && !submitted && (
        <div className="mb-4">
          {hints.slice(0, hintsShown).map((hint, i) => (
            <div key={i} className="mb-1 rounded bg-yellow-50 px-3 py-2 text-sm text-yellow-800">
              <span className="mr-1">💡 Hint {i + 1}:</span>
              <MathDisplay latex={hint.replace(/\$/g, '')} />
            </div>
          ))}
          {hintsShown < hints.length && (
            <button
              onClick={() => setHintsShown((n) => n + 1)}
              className="text-sm text-blue-600 hover:underline"
            >
              Show hint {hintsShown + 1}
            </button>
          )}
        </div>
      )}

      {/* Answer input */}
      {!submitted ? (
        <div className="flex gap-3">
          <input
            type="text"
            className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Your answer…"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && setSubmitted(true)}
          />
          <button
            onClick={() => setSubmitted(true)}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white font-medium hover:bg-blue-700"
          >
            Submit
          </button>
        </div>
      ) : (
        <div
          className={`rounded-md p-4 ${
            isCorrect
              ? 'bg-green-50 border border-green-200'
              : 'bg-red-50 border border-red-200'
          }`}
        >
          <p
            className={`font-semibold ${isCorrect ? 'text-green-800' : 'text-red-800'}`}
          >
            {isCorrect ? '✓ Correct!' : '✗ Incorrect'}
          </p>
          {!isCorrect && (
            <p className="mt-1 text-sm text-gray-700">
              Answer: <span className="font-mono font-bold">{String(answer)}</span>
            </p>
          )}
          <button
            onClick={() => {
              setSubmitted(false);
              setUserAnswer('');
              setHintsShown(0);
            }}
            className="mt-3 text-sm text-blue-600 hover:underline"
          >
            Try again
          </button>
        </div>
      )}
    </div>
  );
}
