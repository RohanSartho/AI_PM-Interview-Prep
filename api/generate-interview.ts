import type { VercelRequest, VercelResponse } from '@vercel/node'
import Anthropic from '@anthropic-ai/sdk'
import { getSessionInfo, applyRateLimit, supabase } from '../lib/server/auth.js'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  // Auth + rate limit
  const session = await getSessionInfo(req)
  if (applyRateLimit(session, res)) return

  try {
    const { jdAnalysisId, interviewType, questionCount } = req.body

    // Fetch the JD analysis
    const { data: jd, error: jdError } = await supabase
      .from('jd_analyses')
      .select('*')
      .eq('id', jdAnalysisId)
      .single()

    if (jdError || !jd) {
      return res.status(404).json({ message: 'JD analysis not found' })
    }

    // Generate questions via Claude
    const prompt = `You are an expert PM interviewer. Based on the following job description, generate exactly ${questionCount} interview questions.

Job Description:
${jd.raw_text}

Interview Type: ${interviewType}
Role: ${jd.role_title ?? 'Product Manager'}
Company: ${jd.company ?? 'Unknown'}

Return a JSON array of objects with these fields:
- questionText: the interview question
- questionType: "behavioral" | "technical" | "situational"
- difficulty: "easy" | "medium" | "hard"
- skillTags: string[] of relevant skills being tested

Return ONLY the JSON array, no other text.`

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 2048,
      messages: [{ role: 'user', content: prompt }],
    })

    const content = message.content[0]
    if (content.type !== 'text') {
      return res.status(500).json({ message: 'Unexpected AI response format' })
    }

    const text = content.text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim()
    const questions = JSON.parse(text)

    // Use authenticated user ID if available, otherwise use JD owner
    const userId = session.userId ?? jd.user_id

    // Create session
    const { data: interviewSession, error: sessionError } = await supabase
      .from('interview_sessions')
      .insert({
        user_id: userId,
        jd_analysis_id: jdAnalysisId,
        interview_type: interviewType,
        total_questions: questionCount,
        status: 'in_progress',
        started_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (sessionError || !interviewSession) {
      return res.status(500).json({ message: 'Failed to create session' })
    }

    // Insert questions
    const questionRows = questions.map((q: Record<string, unknown>, i: number) => ({
      session_id: interviewSession.id,
      question_text: q.questionText,
      question_type: q.questionType,
      difficulty: q.difficulty,
      skill_tags: q.skillTags,
      order_index: i,
    }))

    const { error: insertError } = await supabase
      .from('questions')
      .insert(questionRows)

    if (insertError) {
      return res.status(500).json({ message: 'Failed to save questions' })
    }

    return res.status(200).json({ sessionId: interviewSession.id })
  } catch (error) {
    console.error('generate-interview error:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}
