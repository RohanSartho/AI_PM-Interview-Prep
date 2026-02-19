import { useEffect, useCallback } from 'react'
import { useInterviewStore } from '@/stores/interviewStore'
import QuestionCard from './QuestionCard'

const TYPE_COLORS: Record<string, string> = {
  behavioral: 'border-blue-300',
  technical: 'border-purple-300',
  situational: 'border-orange-300',
}

export default function InterviewSession() {
  const { session, questions, loading, mode, reviewIndex, submitAnswer, advanceQuestion, setReviewIndex } =
    useInterviewStore()

  const goTo = useCallback(
    (index: number) => {
      setReviewIndex(Math.max(0, Math.min(questions.length - 1, index)))
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    [questions.length, setReviewIndex],
  )

  // Keyboard navigation
  useEffect(() => {
    if (mode !== 'review') return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goTo(reviewIndex - 1)
      if (e.key === 'ArrowRight') goTo(reviewIndex + 1)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [mode, reviewIndex, goTo])

  if (!session || questions.length === 0) {
    return <p className="text-gray-500">No session loaded.</p>
  }

  // Active mode: linear stepper
  if (mode === 'active') {
    const currentIndex = session.current_question_index
    const currentQuestion = questions[currentIndex]
    const isComplete = currentIndex >= questions.length

    if (isComplete) {
      return <CompletionSummary questions={questions} onReview={() => goTo(0)} />
    }

    return (
      <div className="space-y-4">
        <p className="text-sm text-gray-500">
          Question {currentIndex + 1} of {questions.length}
        </p>

        {currentQuestion && (
          <QuestionCard
            key={currentQuestion.id}
            question={currentQuestion}
            loading={loading}
            onSubmit={async (answer) => {
              await submitAnswer(currentQuestion.id, answer)
              advanceQuestion()
            }}
          />
        )}
      </div>
    )
  }

  // Review mode
  const reviewQuestion = questions[reviewIndex]

  return (
    <div className="space-y-6 pb-24">
      <CompletionSummary questions={questions} />

      {/* Breadcrumb navigation */}
      <div className="rounded-lg border border-gray-200 bg-white p-3">
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-400">
          Questions — use arrow keys or click to navigate
        </p>
        <div className="flex flex-wrap gap-1.5">
          {questions.map((q, i) => {
            const isActive = i === reviewIndex
            const answered = q.score !== null
            const typeColor = TYPE_COLORS[q.question_type] ?? 'border-gray-300'

            let bg: string
            if (isActive) {
              bg = 'bg-gray-900 text-white border-gray-900'
            } else if (answered) {
              bg =
                (q.score ?? 0) >= 8
                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                  : (q.score ?? 0) >= 5
                    ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                    : 'bg-red-100 text-red-700 hover:bg-red-200'
              bg += ` border-2 ${typeColor}`
            } else {
              bg = `bg-gray-100 text-gray-500 hover:bg-gray-200 border-2 ${typeColor}`
            }

            return (
              <button
                key={q.id}
                onClick={() => goTo(i)}
                title={`${q.question_type} · ${q.difficulty}${answered ? ` · ${q.score}/10` : ''}`}
                className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold transition-colors ${bg}`}
              >
                {answered && !isActive ? '\u2713' : i + 1}
              </button>
            )
          })}
        </div>
      </div>

      {/* Current question */}
      {reviewQuestion && (
        <div className="transition-opacity duration-200">
          <QuestionCard
            key={reviewQuestion.id}
            question={reviewQuestion}
            loading={loading}
            readOnly
            onSubmit={() => {}}
          />
        </div>
      )}

      {/* Fixed bottom navigation bar */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white shadow-lg">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
          <button
            onClick={() => goTo(reviewIndex - 1)}
            disabled={reviewIndex === 0}
            className="rounded-md border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-30 min-w-[100px]"
          >
            &larr; Previous
          </button>
          <span className="text-sm font-medium text-gray-500">
            Question {reviewIndex + 1} of {questions.length}
          </span>
          <button
            onClick={() => goTo(reviewIndex + 1)}
            disabled={reviewIndex === questions.length - 1}
            className="rounded-md border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-30 min-w-[100px]"
          >
            Next &rarr;
          </button>
        </div>
      </div>
    </div>
  )
}

function CompletionSummary({
  questions,
  onReview,
}: {
  questions: { score: number | null; question_text: string }[]
  onReview?: () => void
}) {
  const answered = questions.filter((q) => q.score !== null)
  const avgScore =
    answered.length > 0
      ? (answered.reduce((sum, q) => sum + (q.score ?? 0), 0) / answered.length).toFixed(1)
      : '\u2014'

  const best = answered.length > 0
    ? answered.reduce((a, b) => ((a.score ?? 0) >= (b.score ?? 0) ? a : b))
    : null
  const worst = answered.length > 0
    ? answered.reduce((a, b) => ((a.score ?? 0) <= (b.score ?? 0) ? a : b))
    : null

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 space-y-3">
      <h2 className="text-lg font-semibold text-gray-900">Interview Complete</h2>
      <p className="text-2xl font-bold text-gray-900">
        {avgScore}<span className="text-base font-normal text-gray-400">/10 avg</span>
      </p>
      <p className="text-sm text-gray-500">{answered.length} of {questions.length} questions answered</p>

      {best && best.score !== null && (
        <p className="text-sm text-green-700">
          Strongest: &ldquo;{best.question_text.slice(0, 60)}&hellip;&rdquo; ({best.score}/10)
        </p>
      )}
      {worst && worst.score !== null && best !== worst && (
        <p className="text-sm text-amber-700">
          Focus on: &ldquo;{worst.question_text.slice(0, 60)}&hellip;&rdquo; ({worst.score}/10)
        </p>
      )}

      {onReview && (
        <button
          onClick={onReview}
          className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
        >
          Review All Answers
        </button>
      )}
    </div>
  )
}
