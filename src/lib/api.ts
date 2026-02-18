const API_BASE = '/api'

async function request<T>(endpoint: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Request failed' }))
    throw new Error(error.message ?? `API error: ${res.status}`)
  }

  return res.json() as Promise<T>
}

export const api = {
  generateInterview: (body: {
    jdAnalysisId: string
    interviewType: string
    questionCount: number
  }) => request<{ sessionId: string }>('/generate-interview', body),

  submitAnswer: (body: { questionId: string; userAnswer: string }) =>
    request<{ score: number; feedback: string }>('/submit-answer', body),
}
