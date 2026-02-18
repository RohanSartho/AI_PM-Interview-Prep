const STORAGE_KEY = 'rate_limit_data'

interface RateLimitData {
  [sessionId: string]: { count: number; resetAt: string }
}

function getStore(): RateLimitData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveStore(data: RateLimitData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

function startOfNextDay(): string {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).toISOString()
}

export function checkRateLimit(
  sessionId: string,
  limit: number = 5,
): { allowed: boolean; remaining: number; resetAt: Date } {
  const store = getStore()
  let entry = store[sessionId]

  // Reset if past the reset time or no entry
  if (!entry || new Date(entry.resetAt).getTime() <= Date.now()) {
    entry = { count: 0, resetAt: startOfNextDay() }
  }

  const remaining = Math.max(0, limit - entry.count)
  const resetAt = new Date(entry.resetAt)

  if (entry.count >= limit) {
    store[sessionId] = entry
    saveStore(store)
    return { allowed: false, remaining: 0, resetAt }
  }

  return { allowed: true, remaining, resetAt }
}

export function incrementRateLimit(sessionId: string) {
  const store = getStore()
  let entry = store[sessionId]

  if (!entry || new Date(entry.resetAt).getTime() <= Date.now()) {
    entry = { count: 0, resetAt: startOfNextDay() }
  }

  entry.count += 1
  store[sessionId] = entry
  saveStore(store)
}
