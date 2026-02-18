import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import AuthGuard from '@/components/auth/AuthGuard'
import InterviewSessionComponent from '@/components/interview/InterviewSession'
import { getProviderLabel } from '@/components/ui/LLMProviderSelect'
import { getSelectedProvider } from '@/components/ui/LLMProviderSelect'
import { useInterviewStore } from '@/stores/interviewStore'

export default function Interview() {
  const { sessionId } = useParams<{ sessionId: string }>()
  const { loadSession, loading, error } = useInterviewStore()
  const provider = getSelectedProvider()

  useEffect(() => {
    if (sessionId) {
      loadSession(sessionId)
    }
  }, [sessionId, loadSession])

  return (
    <AuthGuard>
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Mock Interview</h1>
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-500">
            {getProviderLabel(provider)}
          </span>
        </div>

        {loading && <p className="text-gray-500">Loading session...</p>}
        {error && <p className="text-red-600">{error}</p>}
        {!loading && !error && <InterviewSessionComponent />}
      </div>
    </AuthGuard>
  )
}
