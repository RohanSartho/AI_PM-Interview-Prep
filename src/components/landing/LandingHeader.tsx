import { Link } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'

export default function LandingHeader() {
  const user = useAuthStore((s) => s.user)

  return (
    <header className="absolute top-0 left-0 right-0 z-50">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link to="/" className="text-lg font-semibold text-white">
          AI PM Interview Prep
        </Link>

        <nav className="flex items-center gap-6">
          <a
            href="#how-it-works"
            className="hidden text-sm text-gray-300 hover:text-white sm:block"
          >
            How It Works
          </a>
          <a
            href="#pricing"
            className="hidden text-sm text-gray-300 hover:text-white sm:block"
          >
            Pricing
          </a>

          {user ? (
            <Link
              to="/app/dashboard"
              className="rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm text-gray-300 hover:text-white"
              >
                Sign In
              </Link>
              <Link
                to="/app"
                className="rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100"
              >
                Try Free
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
