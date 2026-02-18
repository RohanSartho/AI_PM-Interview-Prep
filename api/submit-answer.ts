import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getSessionInfo, applyRateLimit, supabase } from '../lib/server/auth.js'
import { callLLM } from '../lib/server/llmService.js'
import type { LLMProvider } from '../lib/server/llmService.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  // Auth + rate limit
  const session = await getSessionInfo(req)
  if (applyRateLimit(session, res)) return

  try {
    const { questionId, userAnswer, provider = 'anthropic' } = req.body

    // Fetch the question
    const { data: question, error: qError } = await supabase
      .from('questions')
      .select('*')
      .eq('id', questionId)
      .single()

    if (qError || !question) {
      return res.status(404).json({ message: 'Question not found' })
    }

    // Evaluate answer via LLM
    const prompt = `You are an expert PM interview coach. Evaluate the following answer.

Question: ${question.question_text}
Question Type: ${question.question_type}
Candidate's Answer: ${userAnswer}

Provide:
1. A score from 0-10
2. Constructive feedback (2-3 sentences) on what was good and what could be improved

Return ONLY a JSON object with fields: "score" (number) and "feedback" (string). No other text.`

    const response = await callLLM(provider as LLMProvider, prompt, 512)

    const text = response.content.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim()
    const { score, feedback } = JSON.parse(text)

    // Update question with answer and feedback
    const { error: updateError } = await supabase
      .from('questions')
      .update({
        user_answer: userAnswer,
        ai_feedback: feedback,
        score,
      })
      .eq('id', questionId)

    if (updateError) {
      return res.status(500).json({ message: 'Failed to save feedback' })
    }

    return res.status(200).json({ score, feedback })
  } catch (error) {
    console.error('submit-answer error:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}
