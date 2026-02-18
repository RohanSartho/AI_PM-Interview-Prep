import { create } from 'zustand'
import type { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

const ANON_SESSION_KEY = 'anon_session_id'

function getOrCreateAnonId(): string {
  const existing = localStorage.getItem(ANON_SESSION_KEY)
  if (existing) return existing
  const id = crypto.randomUUID()
  localStorage.setItem(ANON_SESSION_KEY, id)
  return id
}

interface AuthState {
  user: User | null
  session: Session | null
  anonSessionId: string | null
  loading: boolean
  initialize: () => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  getSessionIdentifier: () => string
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  anonSessionId: null,
  loading: true,

  initialize: async () => {
    const anonSessionId = getOrCreateAnonId()
    const { data } = await supabase.auth.getSession()
    set({
      session: data.session,
      user: data.session?.user ?? null,
      anonSessionId,
      loading: false,
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      set({ session, user: session?.user ?? null })
    })
  },

  signUp: async (email, password) => {
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) throw error
  },

  signIn: async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    set({ user: null, session: null })
  },

  getSessionIdentifier: () => {
    const { user, anonSessionId } = get()
    return user?.id ?? anonSessionId ?? 'unknown'
  },
}))
