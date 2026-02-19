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

    // Evaluate answer via LLM with structured feedback
    const prompt = `You are an expert PM interview coach. Evaluate the following answer in detail.

Question: ${question.question_text}
Question Type: ${question.question_type}
Candidate's Answer: ${userAnswer}

Evaluate and provide structured feedback:
1. Score (0-10)
2. Strengths - what the candidate did well (1-2 sentences)
3. Weaknesses - what needs improvement (1-2 sentences)
4. Suggestion - a specific example of how to improve the answer (1-2 sentences)

Return ONLY a JSON object with these fields:
{
  "score": <number 0-10>,
  "strengths": "<string>",
  "weaknesses": "<string>",
  "suggestion": "<string>"
}

No other text.`

    const response = await callLLM(provider as LLMProvider, prompt, 512)

    const text = response.content.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim()
    const parsed = JSON.parse(text)
    const { score } = parsed

    // Store full structured feedback as JSON string
    const feedbackJson = JSON.stringify(parsed)

    // Update question with answer and feedback
    const { error: updateError } = await supabase
      .from('questions')
      .update({
        user_answer: userAnswer,
        ai_feedback: feedbackJson,
        score,
      })
      .eq('id', questionId)

    if (updateError) {
      return res.status(500).json({ message: 'Failed to save feedback' })
    }

    return res.status(200).json(parsed)
  } catch (error) {
    console.error('submit-answer error:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}
