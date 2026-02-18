import { jsPDF } from 'jspdf'
import type { Question } from '@/types/database'

export function generateInterviewReport(
  questions: Question[],
  roleTitle: string,
  company: string,
): jsPDF {
  const doc = new jsPDF()
  let y = 20

  // Header
  doc.setFontSize(18)
  doc.text('Interview Report', 105, y, { align: 'center' })
  y += 10

  doc.setFontSize(12)
  doc.text(`${roleTitle} at ${company}`, 105, y, { align: 'center' })
  y += 10

  doc.setFontSize(10)
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 105, y, { align: 'center' })
  y += 15

  // Summary
  const answered = questions.filter((q) => q.score !== null)
  const avgScore =
    answered.length > 0
      ? (answered.reduce((sum, q) => sum + (q.score ?? 0), 0) / answered.length).toFixed(1)
      : 'N/A'

  doc.setFontSize(12)
  doc.text(`Average Score: ${avgScore}/10`, 20, y)
  y += 10
  doc.text(`Questions Answered: ${answered.length}/${questions.length}`, 20, y)
  y += 15

  // Questions
  for (const q of questions) {
    if (y > 260) {
      doc.addPage()
      y = 20
    }

    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    const questionLines = doc.splitTextToSize(`Q: ${q.question_text}`, 170)
    doc.text(questionLines, 20, y)
    y += questionLines.length * 6

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)

    if (q.user_answer) {
      const answerLines = doc.splitTextToSize(`A: ${q.user_answer}`, 170)
      doc.text(answerLines, 20, y)
      y += answerLines.length * 5
    }

    if (q.ai_feedback) {
      const feedbackLines = doc.splitTextToSize(`Feedback: ${q.ai_feedback}`, 170)
      doc.text(feedbackLines, 20, y)
      y += feedbackLines.length * 5
    }

    if (q.score !== null) {
      doc.text(`Score: ${q.score}/10`, 20, y)
      y += 6
    }

    y += 8
  }

  return doc
}
