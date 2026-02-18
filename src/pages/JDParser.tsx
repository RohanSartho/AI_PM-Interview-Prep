import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthGuard from '@/components/auth/AuthGuard'
import JDInput from '@/components/jd-parser/JDInput'
import { useJDStore } from '@/stores/jdStore'
import { useInterviewStore } from '@/stores/interviewStore'
import type { ParsedJD } from '@/types/interview'

export default function JDParser() {
  const [parsed, setParsed] = useState<ParsedJD | null>(null)
  const [interviewType, setInterviewType] = useState<'behavioral' | 'technical' | 'mixed'>('mixed')
  const [questionCount, setQuestionCount] = useState(5)

  const { saveAnalysis, loading: jdLoading } = useJDStore()
  const { createSession, loading: interviewLoading } = useInterviewStore()
  const navigate = useNavigate()

  const handleAnalyze = async (rawText: string) => {
    // TODO: Call AI to parse the JD — for now, store raw text with placeholder parsed data
    const placeholder: ParsedJD = {
      company: '',
      roleTitle: '',
      skills: [],
      responsibilities: [],
      qualifications: [],
      seniorityLevel: '',
    }

    const analysis = await saveAnalysis(rawText, placeholder)
    setParsed({
      ...placeholder,
      company: analysis.company ?? '',
      roleTitle: analysis.role_title ?? '',
    })
  }

  const handleStartInterview = async () => {
    const currentAnalysis = useJDStore.getState().currentAnalysis
    if (!currentAnalysis) return

    const sessionId = await createSession(
      currentAnalysis.id,
      interviewType,
      questionCount,
    )
    navigate(`/interview/${sessionId}`)
  }

  const loading = jdLoading || interviewLoading

  return (
    <AuthGuard>
      <div className="mx-auto max-w-2xl space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Analyze Job Description</h1>

        {!parsed ? (
          <JDInput onSubmit={handleAnalyze} loading={loading} />
        ) : (
          <div className="space-y-4">
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <p className="text-sm text-gray-500">Analysis saved. Configure your interview:</p>
            </div>

            <div className="flex gap-4">
              <select
                value={interviewType}
                onChange={(e) => setInterviewType(e.target.value as typeof interviewType)}
                className="rounded-md border border-gray-300 px-3 py-2 text-sm"
              >
                <option value="mixed">Mixed</option>
                <option value="behavioral">Behavioral</option>
                <option value="technical">Technical</option>
              </select>

              <select
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
                className="rounded-md border border-gray-300 px-3 py-2 text-sm"
              >
                {[3, 5, 8, 10].map((n) => (
                  <option key={n} value={n}>
                    {n} questions
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleStartInterview}
              disabled={loading}
              className="w-full rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-50"
            >
              {loading ? 'Generating...' : 'Start Mock Interview'}
            </button>
          </div>
        )}
      </div>
    </AuthGuard>
  )
}
