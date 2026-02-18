import Anthropic from '@anthropic-ai/sdk'

export type LLMProvider = 'anthropic' | 'groq' | 'openrouter'

export interface LLMResponse {
  content: string
}

const MODELS: Record<LLMProvider, string> = {
  anthropic: 'claude-sonnet-4-20250514',
  groq: 'llama-3.3-70b-versatile',
  openrouter: 'anthropic/claude-3.5-sonnet',
}

async function callAnthropic(prompt: string, maxTokens: number): Promise<LLMResponse> {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  const message = await client.messages.create({
    model: MODELS.anthropic,
    max_tokens: maxTokens,
    messages: [{ role: 'user', content: prompt }],
  })

  const block = message.content[0]
  if (block.type !== 'text') {
    throw new Error('Unexpected AI response format')
  }
  return { content: block.text }
}

async function callOpenAICompatible(
  baseUrl: string,
  apiKey: string,
  model: string,
  prompt: string,
  maxTokens: number,
  extraHeaders?: Record<string, string>,
): Promise<LLMResponse> {
  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      ...extraHeaders,
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: { message: `HTTP ${res.status}` } }))
    const msg = error.error?.message ?? `Provider returned ${res.status}`
    if (res.status === 429) throw new ProviderRateLimitError(msg)
    if (res.status === 401) throw new ProviderAuthError(msg)
    throw new Error(msg)
  }

  const data = await res.json()
  const content = data.choices?.[0]?.message?.content
  if (!content) throw new Error('Empty response from AI provider')
  return { content }
}

export class ProviderRateLimitError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ProviderRateLimitError'
  }
}

export class ProviderAuthError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ProviderAuthError'
  }
}

export async function callLLM(
  provider: LLMProvider,
  prompt: string,
  maxTokens: number = 1024,
): Promise<LLMResponse> {
  switch (provider) {
    case 'anthropic':
      return callAnthropic(prompt, maxTokens)

    case 'groq':
      return callOpenAICompatible(
        'https://api.groq.com/openai/v1',
        process.env.GROQ_API_KEY!,
        MODELS.groq,
        prompt,
        maxTokens,
      )

    case 'openrouter':
      return callOpenAICompatible(
        'https://openrouter.ai/api/v1',
        process.env.OPENROUTER_API_KEY!,
        MODELS.openrouter,
        prompt,
        maxTokens,
        { 'HTTP-Referer': 'https://aipminterviewprep.vercel.app' },
      )

    default:
      throw new Error(`Unknown LLM provider: ${provider}`)
  }
}
