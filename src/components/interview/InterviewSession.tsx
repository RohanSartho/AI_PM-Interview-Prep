import { useInterviewStore } from '@/stores/interviewStore'
import QuestionCard from './QuestionCard'

export default function InterviewSession() {
  const { session, questions, loading, mode, reviewIndex, submitAnswer, advanceQuestion, setReviewIndex } =
    useInterviewStore()

  if (!session || questions.length === 0) {
    return <p className="text-gray-500">No session loaded.</p>
  }

  // Active mode: linear stepper
  if (mode === 'active') {
    const currentIndex = session.current_question_index
    const currentQuestion = questions[currentIndex]
    const isComplete = currentIndex >= questions.length

    if (isComplete) {
      // This shouldn't happen since advanceQuestion switches to review mode,
      // but just in case
      return <CompletionSummary questions={questions} onReview={() => setReviewIndex(0)} />
    }

    return (
      <div className="space-y-4">
        <p className="text-sm text-gray-500">
          Question {currentIndex + 1} of {questions.length}
        </p>

        {currentQuestion && (
          <QuestionCard
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

  // Review mode: all questions with navigation
  const reviewQuestion = questions[reviewIndex]

  return (
    <div className="space-y-6">
      <CompletionSummary questions={questions} />

      {/* Question navigation breadcrumbs */}
      <div className="flex flex-wrap gap-1">
        {questions.map((q, i) => (
          <button
            key={q.id}
            onClick={() => setReviewIndex(i)}
            className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium transition-colors ${
              i === reviewIndex
                ? 'bg-gray-900 text-white'
                : q.score !== null
                  ? q.score >= 8
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : q.score >= 5
                      ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                      : 'bg-red-100 text-red-700 hover:bg-red-200'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Current review question */}
      {reviewQuestion && (
        <QuestionCard
          question={reviewQuestion}
          loading={loading}
          readOnly
          onSubmit={() => {}}
        />
      )}

      {/* Navigation buttons */}
      <div className="flex justify-between">
        <button
          onClick={() => setReviewIndex(Math.max(0, reviewIndex - 1))}
          disabled={reviewIndex === 0}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-30"
        >
          Previous
        </button>
        <button
          onClick={() => setReviewIndex(Math.min(questions.length - 1, reviewIndex + 1))}
          disabled={reviewIndex === questions.length - 1}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-30"
        >
          Next
        </button>
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
      : '—'

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
          Strongest: "{best.question_text.slice(0, 60)}..." ({best.score}/10)
        </p>
      )}
      {worst && worst.score !== null && best !== worst && (
        <p className="text-sm text-amber-700">
          Focus on: "{worst.question_text.slice(0, 60)}..." ({worst.score}/10)
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
