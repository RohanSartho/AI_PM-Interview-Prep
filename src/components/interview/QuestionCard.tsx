import { useState } from 'react'
import type { Question } from '@/types/database'

interface StructuredFeedback {
  score: number
  strengths: string
  weaknesses: string
  suggestion: string
}

function parseFeedback(raw: string | null): StructuredFeedback | null {
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw)
    if (parsed.strengths && parsed.weaknesses) return parsed
    // Legacy plain-text feedback: wrap in structure
    if (parsed.feedback) {
      return { score: parsed.score ?? 0, strengths: parsed.feedback, weaknesses: '', suggestion: '' }
    }
    return null
  } catch {
    // Plain text fallback (pre-structured data)
    return { score: 0, strengths: raw, weaknesses: '', suggestion: '' }
  }
}

function scoreBadgeColor(score: number): string {
  if (score >= 8) return 'bg-green-100 text-green-700'
  if (score >= 5) return 'bg-amber-100 text-amber-700'
  return 'bg-red-100 text-red-700'
}

interface QuestionCardProps {
  question: Question
  onSubmit: (answer: string) => void
  loading: boolean
  readOnly?: boolean
}

export default function QuestionCard({ question, onSubmit, loading, readOnly }: QuestionCardProps) {
  const [answer, setAnswer] = useState(question.user_answer ?? '')
  const [editing, setEditing] = useState(false)
  const isAnswered = question.user_answer !== null
  const feedback = parseFeedback(question.ai_feedback)
  const showInput = (!isAnswered || editing) && !readOnly

  const handleSubmit = () => {
    onSubmit(answer)
    setEditing(false)
  }

  return (
    <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-6">
      <div className="flex items-center gap-2">
        <span className="rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
          {question.question_type}
        </span>
        <span className="rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
          {question.difficulty}
        </span>
        {question.score !== null && (
          <span className={`ml-auto rounded-full px-2.5 py-0.5 text-xs font-semibold ${scoreBadgeColor(question.score)}`}>
            {question.score}/10
          </span>
        )}
      </div>

      <p className="text-gray-900">{question.question_text}</p>

      {showInput ? (
        <>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer..."
            rows={6}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSubmit}
              disabled={!answer.trim() || loading}
              className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-50"
            >
              {loading ? 'Evaluating...' : editing ? 'Resubmit Answer' : 'Submit Answer'}
            </button>
            {editing && (
              <button
                onClick={() => { setEditing(false); setAnswer(question.user_answer ?? '') }}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
            )}
          </div>
        </>
      ) : isAnswered ? (
        <div className="space-y-3">
          {/* User's answer */}
          <div className="rounded-md bg-gray-50 p-4">
            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-400">Your Answer</p>
            <p className="text-sm text-gray-700">{question.user_answer}</p>
          </div>

          {/* Structured feedback */}
          {feedback ? (
            <div className="space-y-2">
              {feedback.strengths && (
                <div className="rounded-md bg-green-50 p-3">
                  <p className="mb-0.5 text-xs font-medium text-green-700">Strengths</p>
                  <p className="text-sm text-green-800">{feedback.strengths}</p>
                </div>
              )}
              {feedback.weaknesses && (
                <div className="rounded-md bg-amber-50 p-3">
                  <p className="mb-0.5 text-xs font-medium text-amber-700">Areas to Improve</p>
                  <p className="text-sm text-amber-800">{feedback.weaknesses}</p>
                </div>
              )}
              {feedback.suggestion && (
                <div className="rounded-md bg-blue-50 p-3">
                  <p className="mb-0.5 text-xs font-medium text-blue-700">Suggestion</p>
                  <p className="text-sm text-blue-800">{feedback.suggestion}</p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-400">No feedback yet</p>
          )}

          {/* Edit button */}
          {!readOnly && (
            <button
              onClick={() => setEditing(true)}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Edit Answer
            </button>
          )}
        </div>
      ) : null}
    </div>
  )
}
