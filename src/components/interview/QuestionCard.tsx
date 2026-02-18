import { useState } from 'react'
import type { Question } from '@/types/database'

interface QuestionCardProps {
  question: Question
  onSubmit: (answer: string) => void
  loading: boolean
}

export default function QuestionCard({ question, onSubmit, loading }: QuestionCardProps) {
  const [answer, setAnswer] = useState(question.user_answer ?? '')
  const isAnswered = question.user_answer !== null

  return (
    <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-6">
      <div className="flex items-center gap-2">
        <span className="rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
          {question.question_type}
        </span>
        <span className="rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
          {question.difficulty}
        </span>
      </div>

      <p className="text-gray-900">{question.question_text}</p>

      {!isAnswered ? (
        <>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer..."
            rows={6}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
          />
          <button
            onClick={() => onSubmit(answer)}
            disabled={!answer.trim() || loading}
            className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-50"
          >
            {loading ? 'Evaluating...' : 'Submit Answer'}
          </button>
        </>
      ) : (
        <div className="space-y-3 rounded-md bg-gray-50 p-4">
          <p className="text-sm text-gray-700">
            <span className="font-medium">Your answer:</span> {question.user_answer}
          </p>
          {question.ai_feedback && (
            <p className="text-sm text-gray-700">
              <span className="font-medium">Feedback:</span> {question.ai_feedback}
            </p>
          )}
          {question.score !== null && (
            <p className="text-sm font-medium text-gray-900">
              Score: {question.score}/10
            </p>
          )}
        </div>
      )}
    </div>
  )
}
