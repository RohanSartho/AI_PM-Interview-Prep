import { useAuthStore } from '@/stores/authStore'
import type { ParsedJD } from '@/types/interview'

const API_BASE = '/api'

async function request<T>(endpoint: string, body: unknown): Promise<T> {
  const sessionId = useAuthStore.getState().getSessionIdentifier()

  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Session-Id': sessionId,
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Request failed' }))
    throw new Error(error.message ?? `API error: ${res.status}`)
  }

  return res.json() as Promise<T>
}

interface ParseJDResponse {
  company: string
  role_title: string
  parsed_skills: string[]
  parsed_responsibilities: string[]
  parsed_qualifications: string[]
  seniority_level: string
}

export const api = {
  parseJD: async (rawText: string, resumeText?: string): Promise<ParsedJD> => {
    const data = await request<ParseJDResponse>('/parse-jd', { rawText, resumeText })
    return {
      company: data.company,
      roleTitle: data.role_title,
      skills: data.parsed_skills,
      responsibilities: data.parsed_responsibilities,
      qualifications: data.parsed_qualifications,
      seniorityLevel: data.seniority_level,
    }
  },

  generateInterview: (body: {
    jdAnalysisId: string
    interviewType: string
    questionCount: number
  }) => request<{ sessionId: string }>('/generate-interview', body),

  submitAnswer: (body: { questionId: string; userAnswer: string }) =>
    request<{ score: number; feedback: string }>('/submit-answer', body),
}
