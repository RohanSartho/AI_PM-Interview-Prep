import { Link } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'

export default function Header() {
  const { user, signOut } = useAuthStore()

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link to="/" className="text-lg font-semibold text-gray-900">
          AI PM Interview Prep
        </Link>

        <nav className="flex items-center gap-4">
          {user ? (
            <>
              <Link to="/app/dashboard" className="text-sm text-gray-600 hover:text-gray-900">
                Dashboard
              </Link>
              <Link to="/app" className="text-sm text-gray-600 hover:text-gray-900">
                New Interview
              </Link>
              <button
                onClick={() => signOut()}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="rounded-md bg-gray-900 px-3 py-1.5 text-sm text-white hover:bg-gray-700"
            >
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
