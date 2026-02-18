import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import Header from './Header'

export default function Layout() {
  const initialize = useAuthStore((s) => s.initialize)
  const loading = useAuthStore((s) => s.loading)

  useEffect(() => {
    initialize()
  }, [initialize])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}
