import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

// Create a new ratelimiter, that allows 10 requests per 10 seconds
let ratelimit: Ratelimit | null = null

try {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    ratelimit = new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(10, "10 s"),
      analytics: true,
    })
  }
} catch (error) {
  console.warn("Failed to initialize Upstash Redis. Rate limiting will be bypassed.")
}

/**
 * Validates a request against the rate limiter.
 * Falls back gracefully (returns success) if Upstash is not configured.
 */
export async function checkRateLimit(identifier: string) {
  if (!ratelimit) {
    return { success: true }
  }

  try {
    const { success, limit, reset, remaining } = await ratelimit.limit(identifier)
    return { success, limit, reset, remaining }
  } catch (error) {
    console.error("Rate limit check failed:", error)
    return { success: true } // Fail open
  }
}
