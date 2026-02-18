import { Link } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'

export default function Home() {
  const user = useAuthStore((s) => s.user)

  return (
    <div className="space-y-6 py-12 text-center">
      <h1 className="text-3xl font-bold text-gray-900">AI PM Interview Prep</h1>
      <p className="mx-auto max-w-md text-gray-600">
        Paste a job description, get a tailored mock interview with AI-powered
        feedback. Practice behavioral, technical, and situational questions.
      </p>

      <div className="flex justify-center gap-3">
        {user ? (
          <Link
            to="/jd-parser"
            className="rounded-md bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-700"
          >
            Start New Interview
          </Link>
        ) : (
          <Link
            to="/login"
            className="rounded-md bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-700"
          >
            Get Started
          </Link>
        )}
      </div>
    </div>
  )
}
