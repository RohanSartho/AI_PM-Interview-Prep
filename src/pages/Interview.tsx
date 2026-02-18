import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import AuthGuard from '@/components/auth/AuthGuard'
import InterviewSessionComponent from '@/components/interview/InterviewSession'
import { useInterviewStore } from '@/stores/interviewStore'

export default function Interview() {
  const { sessionId } = useParams<{ sessionId: string }>()
  const { loadSession, loading, error } = useInterviewStore()

  useEffect(() => {
    if (sessionId) {
      loadSession(sessionId)
    }
  }, [sessionId, loadSession])

  return (
    <AuthGuard>
      <div className="mx-auto max-w-2xl space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Mock Interview</h1>

        {loading && <p className="text-gray-500">Loading session...</p>}
        {error && <p className="text-red-600">{error}</p>}
        {!loading && !error && <InterviewSessionComponent />}
      </div>
    </AuthGuard>
  )
}
