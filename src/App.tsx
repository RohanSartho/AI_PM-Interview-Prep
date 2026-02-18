import { Routes, Route } from 'react-router-dom'
import Layout from '@/components/layout/Layout'
import Home from '@/pages/Home'
import Login from '@/pages/Login'
import Dashboard from '@/pages/Dashboard'
import JDParser from '@/pages/JDParser'
import Interview from '@/pages/Interview'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/jd-parser" element={<JDParser />} />
        <Route path="/interview/:sessionId" element={<Interview />} />
      </Route>
    </Routes>
  )
}
