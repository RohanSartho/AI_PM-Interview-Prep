import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getSessionInfo, applyRateLimit } from '../lib/server/auth.js'
import { callLLM, ProviderRateLimitError, ProviderAuthError } from '../lib/server/llmService.js'
import type { LLMProvider } from '../lib/server/llmService.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  // Auth + rate limit
  const session = await getSessionInfo(req)
  if (applyRateLimit(session, res)) return

  const { rawText, resumeText, provider = 'anthropic' } = req.body ?? {}

  if (!rawText || typeof rawText !== 'string' || rawText.trim().length < 20) {
    return res.status(400).json({ message: 'rawText is required and must be at least 20 characters' })
  }

  try {
    const resumeSection = resumeText
      ? `User's resume:\n${resumeText}\n\nTailor the analysis to their background.\n\n`
      : ''

    const prompt = `You are a job description parser for PM interview prep. Extract the following from this JD:
- company (string)
- role_title (string)
- parsed_skills (string array of technical and soft skills)
- parsed_responsibilities (string array of top 5-7 key responsibilities)
- parsed_qualifications (string array of requirements and nice-to-haves)
- seniority_level (one of: "Entry", "Mid", "Senior", "Lead", "Executive")

${resumeSection}Job Description:
${rawText}

Return ONLY valid JSON matching the schema above. No markdown, no explanation.`

    const response = await callLLM(provider as LLMProvider, prompt, 1024)

    // Strip markdown fences if the model wraps the JSON
    const text = response.content.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim()

    let parsed
    try {
      parsed = JSON.parse(text)
    } catch {
      return res.status(502).json({ message: 'AI returned invalid JSON', raw: response.content })
    }

    // Validate required fields exist
    const required = ['company', 'role_title', 'parsed_skills', 'parsed_responsibilities', 'parsed_qualifications', 'seniority_level']
    for (const field of required) {
      if (!(field in parsed)) {
        return res.status(502).json({ message: `AI response missing field: ${field}`, raw: parsed })
      }
    }

    return res.status(200).json(parsed)
  } catch (error: unknown) {
    if (error instanceof ProviderRateLimitError) {
      return res.status(429).json({ message: 'Rate limited by AI provider. Please try again in a moment.' })
    }
    if (error instanceof ProviderAuthError) {
      return res.status(500).json({ message: 'AI API key misconfigured' })
    }
    console.error('parse-jd error:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}
