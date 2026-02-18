import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import AuthGuard from '@/components/auth/AuthGuard'
import { useJDStore } from '@/stores/jdStore'

export default function Dashboard() {
  const { analyses, loading, fetchAnalyses } = useJDStore()

  useEffect(() => {
    fetchAnalyses()
  }, [fetchAnalyses])

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
            {analyses.map((a) => (
              <div
                key={a.id}
                className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4"
              >
                <div>
                  <p className="font-medium text-gray-900">
                    {a.role_title ?? 'Untitled Role'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {a.company ?? 'Unknown Company'} &middot;{' '}
                    {new Date(a.created_at).toLocaleDateString()}
                  </p>
                </div>
                <Link
                  to={`/jd-parser?id=${a.id}`}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  View
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </AuthGuard>
  )
}
