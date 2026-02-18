import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'
import { checkServerRateLimit } from './rateLimitStore.js'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

export { supabase }

interface SessionInfo {
  userId: string | null // non-null if authenticated
  sessionId: string     // always present (userId or anon X-Session-Id)
  isAuthenticated: boolean
}

/**
 * Extract session identity from request headers.
 * If Authorization header is present and valid, returns authenticated user ID.
 * Otherwise falls back to X-Session-Id (anonymous).
 */
export async function getSessionInfo(req: VercelRequest): Promise<SessionInfo> {
  const authHeader = req.headers['authorization']
  const anonSessionId = (req.headers['x-session-id'] as string) ?? 'unknown'

  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.slice(7)
    const { data, error } = await supabase.auth.getUser(token)
    if (!error && data.user) {
      return {
        userId: data.user.id,
        sessionId: data.user.id,
        isAuthenticated: true,
      }
    }
  }

  return {
    userId: null,
    sessionId: anonSessionId,
    isAuthenticated: false,
  }
}

/**
 * Apply rate limiting for anonymous users.
 * Returns true if the request should be blocked (429 sent).
 * Authenticated users always pass through.
 */
export function applyRateLimit(
  session: SessionInfo,
  res: VercelResponse,
  limit: number = 5,
): boolean {
  if (session.isAuthenticated) return false

  const { allowed, remaining, resetAt } = checkServerRateLimit(session.sessionId, limit)

  // Always set rate limit headers for anonymous users
  res.setHeader('X-RateLimit-Remaining', remaining.toString())
  res.setHeader('X-RateLimit-Reset', resetAt)

  if (!allowed) {
    res.status(429).json({
      message: "You've reached the free limit (5 per day). Sign up to continue!",
      resetAt,
    })
    return true
  }

  return false
}
