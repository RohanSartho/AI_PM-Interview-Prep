import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import { api } from '@/lib/api'
import type { InterviewSession, Question } from '@/types/database'
import type { LLMProvider } from '@/types/interview'

interface InterviewState {
  session: InterviewSession | null
  questions: Question[]
  loading: boolean
  error: string | null
  mode: 'active' | 'review'
  reviewIndex: number

  createSession: (
    jdAnalysisId: string,
    interviewType: 'behavioral' | 'technical' | 'mixed',
    questionCount: number,
    provider?: LLMProvider,
  ) => Promise<string>
  loadSession: (sessionId: string) => Promise<void>
  submitAnswer: (questionId: string, answer: string) => Promise<void>
  advanceQuestion: () => void
  setReviewIndex: (index: number) => void
  reset: () => void
}

export const useInterviewStore = create<InterviewState>((set, get) => ({
  session: null,
  questions: [],
  loading: false,
  error: null,
  mode: 'active',
  reviewIndex: 0,

  createSession: async (jdAnalysisId, interviewType, questionCount, provider) => {
    set({ loading: true, error: null })
    try {
      const { sessionId } = await api.generateInterview({
        jdAnalysisId,
        interviewType,
        questionCount,
        provider,
      })
      return sessionId
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to create session'
      set({ error: message, loading: false })
      throw e
    }
  },

  loadSession: async (sessionId) => {
    set({ loading: true, error: null })

    const [sessionRes, questionsRes] = await Promise.all([
      supabase.from('interview_sessions').select('*').eq('id', sessionId).single(),
      supabase.from('questions').select('*').eq('session_id', sessionId).order('order_index'),
    ])

    if (sessionRes.error || questionsRes.error) {
      set({
        error: sessionRes.error?.message ?? questionsRes.error?.message ?? 'Load failed',
        loading: false,
      })
      return
    }

    const session = sessionRes.data as InterviewSession
    const isCompleted = session.status === 'completed'

    set({
      session,
      questions: questionsRes.data as Question[],
      loading: false,
      mode: isCompleted ? 'review' : 'active',
      reviewIndex: 0,
    })
  },

  submitAnswer: async (questionId, answer) => {
    set({ loading: true })
    const stored = localStorage.getItem('llm_provider')
    const provider = (stored === 'groq' || stored === 'openrouter') ? stored : 'anthropic' as LLMProvider
    try {
      const result = await api.submitAnswer({
        questionId,
        userAnswer: answer,
        provider,
      })

      // Store structured feedback as JSON string in the local question state
      const feedbackJson = JSON.stringify(result)

      set({
        questions: get().questions.map((q) =>
          q.id === questionId
            ? { ...q, user_answer: answer, ai_feedback: feedbackJson, score: result.score }
            : q,
        ),
        loading: false,
      })
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to submit'
      set({ error: message, loading: false })
    }
  },

  advanceQuestion: () => {
    const { session, questions } = get()
    if (!session) return

    const nextIndex = session.current_question_index + 1
    const isNowComplete = nextIndex >= questions.length

    set({
      session: {
        ...session,
        current_question_index: nextIndex,
        status: isNowComplete ? 'completed' : session.status,
      },
      mode: isNowComplete ? 'review' : 'active',
      reviewIndex: 0,
    })

    // Mark session completed in DB if all questions answered
    if (isNowComplete) {
      supabase
        .from('interview_sessions')
        .update({ status: 'completed', completed_at: new Date().toISOString() })
        .eq('id', session.id)
        .then()
    }
  },

  setReviewIndex: (index) => set({ reviewIndex: index }),

  reset: () => set({ session: null, questions: [], error: null, mode: 'active', reviewIndex: 0 }),
}))
