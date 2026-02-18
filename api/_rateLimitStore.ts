// In-memory rate limit store for Vercel serverless functions.
// NOTE: Each cold start resets the map. For production, use Redis or Supabase.
// This is sufficient for MVP anonymous abuse prevention.

interface RateLimitEntry {
  count: number
  resetAt: number // epoch ms
}

const store = new Map<string, RateLimitEntry>()

function startOfNextDay(): number {
  const now = new Date()
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
  return tomorrow.getTime()
}

export function checkServerRateLimit(
  sessionId: string,
  limit: number = 5,
): { allowed: boolean; remaining: number; resetAt: string } {
  const now = Date.now()
  let entry = store.get(sessionId)

  // Reset if past the reset time or no entry
  if (!entry || now >= entry.resetAt) {
    entry = { count: 0, resetAt: startOfNextDay() }
  }

  const remaining = Math.max(0, limit - entry.count)
  const resetAt = new Date(entry.resetAt).toISOString()

  if (entry.count >= limit) {
    store.set(sessionId, entry)
    return { allowed: false, remaining: 0, resetAt }
  }

  entry.count += 1
  store.set(sessionId, entry)

  return { allowed: true, remaining: remaining - 1, resetAt }
}
