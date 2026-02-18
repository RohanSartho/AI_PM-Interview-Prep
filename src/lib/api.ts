import { useAuthStore } from '@/stores/authStore'
import type { ParsedJD, LLMProvider } from '@/types/interview'

const API_BASE = '/api'

export class RateLimitError extends Error {
  resetAt: string
  constructor(message: string, resetAt: string) {
    super(message)
    this.name = 'RateLimitError'
    this.resetAt = resetAt
  }
}

async function request<T>(endpoint: string, body: unknown): Promise<T> {
  const state = useAuthStore.getState()
  const sessionId = state.getSessionIdentifier()
  const accessToken = state.session?.access_token

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Session-Id': sessionId,
  }
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Request failed' }))
    if (res.status === 429) {
      throw new RateLimitError(
        error.message ?? 'Rate limit exceeded',
        error.resetAt ?? '',
      )
    }
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
  parseJD: async (rawText: string, resumeText?: string, provider?: LLMProvider): Promise<ParsedJD> => {
    const data = await request<ParseJDResponse>('/parse-jd', { rawText, resumeText, provider })
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
    provider?: LLMProvider
  }) => request<{ sessionId: string }>('/generate-interview', body),

  submitAnswer: (body: { questionId: string; userAnswer: string; provider?: LLMProvider }) =>
    request<{ score: number; feedback: string }>('/submit-answer', body),
}
