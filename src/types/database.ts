// Re-export row types from generated Supabase types for convenience.
// The generated file (supabase.ts) is the source of truth.
import type { Tables } from './supabase'

export type Profile = Tables<'profiles'>
export type JDAnalysis = Tables<'jd_analyses'>
export type InterviewSession = Tables<'interview_sessions'>
export type Question = Tables<'questions'>
