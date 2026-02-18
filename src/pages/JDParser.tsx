import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthGuard from '@/components/auth/AuthGuard'
import JDInput from '@/components/jd-parser/JDInput'
import { api } from '@/lib/api'
import { useJDStore } from '@/stores/jdStore'
import { useInterviewStore } from '@/stores/interviewStore'
import type { ParsedJD } from '@/types/interview'

export default function JDParser() {
  const [parsed, setParsed] = useState<ParsedJD | null>(null)
  const [parseLoading, setParseLoading] = useState(false)
  const [parseError, setParseError] = useState<string | null>(null)
  const [interviewType, setInterviewType] = useState<'behavioral' | 'technical' | 'mixed'>('mixed')
  const [questionCount, setQuestionCount] = useState(5)

  const { saveAnalysis, loading: jdLoading } = useJDStore()
  const { createSession, loading: interviewLoading } = useInterviewStore()
  const navigate = useNavigate()

  const handleAnalyze = async (jdText: string, resumeText?: string) => {
    setParseLoading(true)
    setParseError(null)

    try {
      const result = await api.parseJD(jdText, resumeText)
      setParsed(result)

      // Save to Supabase
      await saveAnalysis(jdText, result)
    } catch (e) {
      setParseError(e instanceof Error ? e.message : 'Failed to parse job description')
    } finally {
      setParseLoading(false)
    }
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

  const handleReset = () => {
    setParsed(null)
    setParseError(null)
  }

  const loading = parseLoading || jdLoading || interviewLoading

  return (
    <AuthGuard>
      <div className="mx-auto max-w-2xl space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Analyze Job Description</h1>

        {!parsed ? (
          <>
            <JDInput onSubmit={handleAnalyze} loading={loading} />
            {parseError && (
              <p className="text-sm text-red-600">{parseError}</p>
            )}
          </>
        ) : (
          <div className="space-y-4">
            {/* Preview Card */}
            <div className="rounded-lg border border-gray-200 bg-white p-5 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {parsed.roleTitle || 'Untitled Role'}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {parsed.company || 'Unknown Company'}
                    {parsed.seniorityLevel && ` · ${parsed.seniorityLevel}`}
                  </p>
                </div>
                <button
                  onClick={handleReset}
                  className="text-xs text-gray-400 hover:text-gray-600"
                >
                  Re-analyze
                </button>
              </div>

              {parsed.skills.length > 0 && (
                <div>
                  <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-gray-400">
                    Skills
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {parsed.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-700"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {parsed.responsibilities.length > 0 && (
                <div>
                  <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-gray-400">
                    Key Responsibilities
                  </p>
                  <ul className="space-y-1 text-sm text-gray-600">
                    {parsed.responsibilities.map((r) => (
                      <li key={r} className="flex gap-2">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gray-400" />
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {parsed.qualifications.length > 0 && (
                <div>
                  <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-gray-400">
                    Qualifications
                  </p>
                  <ul className="space-y-1 text-sm text-gray-600">
                    {parsed.qualifications.map((q) => (
                      <li key={q} className="flex gap-2">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gray-400" />
                        {q}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Interview Configuration */}
            <div className="rounded-lg border border-gray-200 bg-white p-4 space-y-3">
              <p className="text-sm font-medium text-gray-700">Configure your mock interview</p>
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
            </div>

            <button
              onClick={handleStartInterview}
              disabled={loading}
              className="w-full rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-50"
            >
              {interviewLoading ? 'Generating...' : 'Start Mock Interview'}
            </button>
          </div>
        )}
      </div>
    </AuthGuard>
  )
}
