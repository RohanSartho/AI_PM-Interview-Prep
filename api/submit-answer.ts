import type { VercelRequest, VercelResponse } from '@vercel/node'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { questionId, userAnswer } = req.body

    // Fetch the question
    const { data: question, error: qError } = await supabase
      .from('questions')
      .select('*')
      .eq('id', questionId)
      .single()

    if (qError || !question) {
      return res.status(404).json({ message: 'Question not found' })
    }

    // Evaluate answer via Claude
    const prompt = `You are an expert PM interview coach. Evaluate the following answer.

Question: ${question.question_text}
Question Type: ${question.question_type}
Candidate's Answer: ${userAnswer}

Provide:
1. A score from 0-10
2. Constructive feedback (2-3 sentences) on what was good and what could be improved

Return ONLY a JSON object with fields: "score" (number) and "feedback" (string). No other text.`

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 512,
      messages: [{ role: 'user', content: prompt }],
    })

    const content = message.content[0]
    if (content.type !== 'text') {
      return res.status(500).json({ message: 'Unexpected AI response format' })
    }

    const { score, feedback } = JSON.parse(content.text)

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
