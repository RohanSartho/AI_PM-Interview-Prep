import { useInterviewStore } from '@/stores/interviewStore'
import QuestionCard from './QuestionCard'

export default function InterviewSession() {
  const { session, questions, loading, submitAnswer, advanceQuestion } =
    useInterviewStore()

  if (!session || questions.length === 0) {
    return <p className="text-gray-500">No session loaded.</p>
  }

  const currentIndex = session.current_question_index
  const currentQuestion = questions[currentIndex]
  const isComplete = currentIndex >= questions.length

  if (isComplete) {
    const answered = questions.filter((q) => q.score !== null)
    const avgScore =
      answered.length > 0
        ? (answered.reduce((sum, q) => sum + (q.score ?? 0), 0) / answered.length).toFixed(1)
        : '—'

    return (
      <div className="space-y-4 text-center">
        <h2 className="text-xl font-semibold text-gray-900">Interview Complete</h2>
        <p className="text-gray-600">
          Average score: {avgScore}/10 across {answered.length} questions
        </p>
      </div>
    )
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
