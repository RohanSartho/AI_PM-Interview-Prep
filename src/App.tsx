import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from '@/components/layout/Layout'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

const Home = lazy(() => import('./pages/Home'))
const Login = lazy(() => import('./pages/Login'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const JDParser = lazy(() => import('./pages/JDParser'))
const Interview = lazy(() => import('./pages/Interview'))

export default function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/jd-parser" element={<JDParser />} />
          <Route path="/interview/:sessionId" element={<Interview />} />
        </Route>
      </Routes>
    </Suspense>
  )
}
