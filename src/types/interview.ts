export interface ParsedJD {
  company: string
  roleTitle: string
  skills: string[]
  responsibilities: string[]
  qualifications: string[]
  seniorityLevel: string
}

export interface GenerateInterviewRequest {
  jdAnalysisId: string
  interviewType: 'behavioral' | 'technical' | 'mixed'
  questionCount: number
}

export interface GenerateInterviewResponse {
  sessionId: string
  questions: GeneratedQuestion[]
}

export interface GeneratedQuestion {
  questionText: string
  questionType: 'behavioral' | 'technical' | 'situational'
  difficulty: 'easy' | 'medium' | 'hard'
  skillTags: string[]
}

export interface FeedbackRequest {
  questionId: string
  userAnswer: string
}

export interface FeedbackResponse {
  score: number
  feedback: string
}
