import type { Question } from '@/types/database'

interface Props {
  questions: Question[]
  currentIndex: number
  onSelect: (index: number) => void
}

export default function QuestionDropdown({ questions, currentIndex, onSelect }: Props) {
  return (
    <select
      value={currentIndex}
      onChange={(e) => onSelect(Number(e.target.value))}
      className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
    >
      {questions.map((q, i) => {
        const answered = q.score !== null
        const prefix = answered ? '\u2713 ' : '  '
        const label = q.question_text.length > 50
          ? q.question_text.slice(0, 50) + '...'
          : q.question_text
        return (
          <option key={q.id} value={i}>
            {prefix}Q{i + 1}: {label}
          </option>
        )
      })}
    </select>
  )
}
