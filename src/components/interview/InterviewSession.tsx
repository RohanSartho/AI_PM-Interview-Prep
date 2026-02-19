import { useState, useEffect } from 'react'
import { useInterviewStore } from '@/stores/interviewStore'
import QuestionCard from './QuestionCard'
import QuestionDropdown from './QuestionDropdown'

export default function InterviewSession() {
  const { session, questions, loading, mode, submitAnswer, advanceQuestion } =
    useInterviewStore()

  // LOCAL state for navigation — guarantees re-render on every change
  const [currentIndex, setCurrentIndex] = useState(0)

  // Reset index when questions change (new session loaded)
  useEffect(() => {
    setCurrentIndex(0)
  }, [session?.id])

  // Navigation helper
  const goTo = (index: number) => {
    const clamped = Math.max(0, Math.min(questions.length - 1, index))
    setCurrentIndex(clamped)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Keyboard navigation (arrow keys)
  useEffect(() => {
    if (mode !== 'review') return

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't capture when typing in a textarea or input
      if (e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLInputElement) {
        return
      }

      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        setCurrentIndex((prev) => Math.max(0, prev - 1))
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }

      if (e.key === 'ArrowRight') {
        e.preventDefault()
        setCurrentIndex((prev) => Math.max(0, Math.min(questions.length - 1, prev + 1)))
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [mode, questions.length])

  if (!session || questions.length === 0) {
    return <p className="text-gray-500">No session loaded.</p>
  }

  // ─── ACTIVE MODE: linear stepper ───
  if (mode === 'active') {
    const activeIndex = session.current_question_index
    const activeQuestion = questions[activeIndex]
    const isComplete = activeIndex >= questions.length

    if (isComplete) {
      return <CompletionSummary questions={questions} onReview={() => setCurrentIndex(0)} />
    }

    return (
      <div className="space-y-4">
        <p className="text-sm text-gray-500">
          Question {activeIndex + 1} of {questions.length}
        </p>
        {activeQuestion && (
          <QuestionCard
            key={activeQuestion.id}
            question={activeQuestion}
            loading={loading}
            onSubmit={async (answer) => {
              await submitAnswer(activeQuestion.id, answer)
              advanceQuestion()
            }}
          />
        )}
      </div>
    )
  }

  // ─── REVIEW MODE ───
  const currentQuestion = questions[currentIndex]
  const progressPercent = ((currentIndex + 1) / questions.length) * 100

  return (
    <div className="space-y-6 pb-28">
      <CompletionSummary questions={questions} />

      {/* Progress bar */}
      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className="h-full rounded-full bg-gray-900 transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Header: question counter + dropdown */}
      <div className="flex items-center justify-between gap-4">
        <p className="text-lg font-semibold text-gray-900">
          Question {currentIndex + 1} of {questions.length}
        </p>
        <QuestionDropdown
          questions={questions}
          currentIndex={currentIndex}
          onSelect={goTo}
        />
      </div>

      {/* Breadcrumb pills */}
      <div className="flex flex-wrap gap-1.5">
        {questions.map((q, i) => {
          const isActive = i === currentIndex
          const answered = q.score !== null

          let cls: string
          if (isActive) {
            cls = 'bg-gray-900 text-white'
          } else if (answered) {
            cls =
              (q.score ?? 0) >= 8
                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                : (q.score ?? 0) >= 5
                  ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                  : 'bg-red-100 text-red-700 hover:bg-red-200'
          } else {
            cls = 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          }

          return (
            <button
              key={q.id}
              onClick={() => goTo(i)}
              title={`${q.question_type} · ${q.difficulty}${answered ? ` · ${q.score}/10` : ''}`}
              className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold transition-colors ${cls}`}
            >
              {answered && !isActive ? '\u2713' : i + 1}
            </button>
          )
        })}
      </div>

      {/* Current question card */}
      {currentQuestion && (
        <div key={currentIndex}>
          <QuestionCard
            key={currentQuestion.id}
            question={currentQuestion}
            loading={loading}
            readOnly
            onSubmit={() => {}}
          />
        </div>
      )}

      {/* Fixed bottom navigation bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white shadow-lg">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
          <button
            onClick={() => goTo(currentIndex - 1)}
            disabled={currentIndex === 0}
            className="rounded-md border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-30 min-w-[110px]"
          >
            &larr; Previous
          </button>
          <span className="text-sm font-medium text-gray-500">
            {currentIndex + 1} / {questions.length}
          </span>
          <button
            onClick={() => goTo(currentIndex + 1)}
            disabled={currentIndex === questions.length - 1}
            className="rounded-md border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-30 min-w-[110px]"
          >
            Next &rarr;
          </button>
        </div>
      </nav>
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
