import { lazy, Suspense, useEffect } from 'react'
import { Routes, Route, Navigate, useParams } from 'react-router-dom'
import LandingLayout from '@/components/layout/LandingLayout'
import AppLayout from '@/components/layout/AppLayout'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { useAuthStore } from '@/stores/authStore'

const Landing = lazy(() => import('./pages/Landing'))
const Login = lazy(() => import('./pages/Login'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const JDParser = lazy(() => import('./pages/JDParser'))
const Interview = lazy(() => import('./pages/Interview'))

function InterviewRedirect() {
  const { sessionId } = useParams()
  return <Navigate to={`/app/interview/${sessionId}`} replace />
}

export default function App() {
  const initialize = useAuthStore((s) => s.initialize)

  useEffect(() => {
    initialize()
  }, [initialize])

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* Landing page */}
        <Route element={<LandingLayout />}>
          <Route path="/" element={<Landing />} />
        </Route>

        {/* App routes */}
        <Route element={<AppLayout />}>
          <Route path="/app" element={<JDParser />} />
          <Route path="/app/dashboard" element={<Dashboard />} />
          <Route path="/app/interview/:sessionId" element={<Interview />} />
          <Route path="/login" element={<Login />} />
        </Route>

        {/* Redirects from old routes */}
        <Route path="/jd-parser" element={<Navigate to="/app" replace />} />
        <Route path="/dashboard" element={<Navigate to="/app/dashboard" replace />} />
        <Route path="/interview/:sessionId" element={<InterviewRedirect />} />
      </Routes>
    </Suspense>
  )
}
