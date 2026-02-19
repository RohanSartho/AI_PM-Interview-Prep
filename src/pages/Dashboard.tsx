import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AuthGuard from '@/components/auth/AuthGuard'
import { useJDStore } from '@/stores/jdStore'
import { supabase } from '@/lib/supabase'

interface SessionInfo {
  id: string
  jd_analysis_id: string
  status: string
  created_at: string
}

export default function Dashboard() {
  const { analyses, loading, fetchAnalyses } = useJDStore()
  const [sessions, setSessions] = useState<SessionInfo[]>([])

  useEffect(() => {
    fetchAnalyses()
  }, [fetchAnalyses])

  // Fetch all sessions for the user
  useEffect(() => {
    async function fetchSessions() {
      const { data } = await supabase
        .from('interview_sessions')
        .select('id, jd_analysis_id, status, created_at')
        .order('created_at', { ascending: false })

      if (data) setSessions(data as SessionInfo[])
    }
    fetchSessions()
  }, [])

  // Group sessions by analysis ID
  const sessionsByAnalysis = sessions.reduce<Record<string, SessionInfo[]>>((acc, s) => {
    if (!acc[s.jd_analysis_id]) acc[s.jd_analysis_id] = []
    acc[s.jd_analysis_id].push(s)
    return acc
  }, {})

  return (
    <AuthGuard>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <Link
            to="/jd-parser"
            className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
          >
            New Interview
          </Link>
        </div>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : analyses.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
            <p className="text-gray-600">No interviews yet.</p>
            <p className="mt-1 text-sm text-gray-400">
              Paste a job description to generate your first mock interview.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {analyses.map((a) => {
              const analysisSessions = sessionsByAnalysis[a.id] ?? []
              const latestSession = analysisSessions[0]
              const attemptCount = analysisSessions.length

              return (
                <div
                  key={a.id}
                  className="rounded-lg border border-gray-200 bg-white p-4 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">
                        {a.role_title ?? 'Untitled Role'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {a.company ?? 'Unknown Company'} &middot;{' '}
                        {new Date(a.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      {attemptCount > 0 && (
                        <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-500">
                          {attemptCount} {attemptCount === 1 ? 'attempt' : 'attempts'}
                        </span>
                      )}
                      {latestSession ? (
                        <Link
                          to={`/interview/${latestSession.id}`}
                          className="text-sm font-medium text-gray-600 hover:text-gray-900"
                        >
                          {latestSession.status === 'completed' ? 'Review' : 'Continue'}
                        </Link>
                      ) : (
                        <Link
                          to={`/jd-parser?analysisId=${a.id}`}
                          className="text-sm font-medium text-gray-600 hover:text-gray-900"
                        >
                          Start
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </AuthGuard>
  )
}
