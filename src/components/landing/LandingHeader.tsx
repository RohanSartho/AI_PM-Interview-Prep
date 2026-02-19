import { Link } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'

export default function LandingHeader() {
  const user = useAuthStore((s) => s.user)

  return (
    <header className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
        <Link to="/" className="text-xl font-bold text-gray-900">
          AI PM Interview Prep
        </Link>

        <nav className="flex items-center gap-6">
          <a
            href="#how-it-works"
            className="hidden sm:block text-sm text-gray-600 hover:text-gray-900"
          >
            How It Works
          </a>
          <a
            href="#pricing"
            className="hidden sm:block text-sm text-gray-600 hover:text-gray-900"
          >
            Pricing
          </a>

          {user ? (
            <>
              <Link
                to="/app/dashboard"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Dashboard
              </Link>
              <Link
                to="/app"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
              >
                New Interview
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Sign In
              </Link>
              <Link
                to="/app"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
              >
                Get Started
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
