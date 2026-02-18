import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import type { JDAnalysis } from '@/types/database'
import type { ParsedJD } from '@/types/interview'

interface JDState {
  analyses: JDAnalysis[]
  currentAnalysis: JDAnalysis | null
  loading: boolean
  error: string | null

  fetchAnalyses: () => Promise<void>
  saveAnalysis: (rawText: string, parsed: ParsedJD) => Promise<JDAnalysis>
  setCurrentAnalysis: (analysis: JDAnalysis | null) => void
}

export const useJDStore = create<JDState>((set, get) => ({
  analyses: [],
  currentAnalysis: null,
  loading: false,
  error: null,

  fetchAnalyses: async () => {
    set({ loading: true, error: null })
    const { data, error } = await supabase
      .from('jd_analyses')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      set({ error: error.message, loading: false })
      return
    }
    set({ analyses: data as JDAnalysis[], loading: false })
  },

  saveAnalysis: async (rawText, parsed) => {
    set({ loading: true, error: null })
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('jd_analyses')
      .insert({
        user_id: user.id,
        raw_text: rawText,
        company: parsed.company,
        role_title: parsed.roleTitle,
        parsed_skills: parsed.skills,
        parsed_responsibilities: parsed.responsibilities,
        parsed_qualifications: parsed.qualifications,
        seniority_level: parsed.seniorityLevel,
      })
      .select()
      .single()

    if (error) {
      set({ error: error.message, loading: false })
      throw error
    }

    const analysis = data as JDAnalysis
    set({
      analyses: [analysis, ...get().analyses],
      currentAnalysis: analysis,
      loading: false,
    })
    return analysis
  },

  setCurrentAnalysis: (analysis) => set({ currentAnalysis: analysis }),
}))
