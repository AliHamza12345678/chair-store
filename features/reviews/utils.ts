import type { Review } from "@prisma/client"
import type { ProductRatingSummary } from "./types"

/** Aggregate approved reviews into an average + star breakdown for a product page. */
export function summarizeRatings(reviews: Pick<Review, "rating">[]): ProductRatingSummary {
  const breakdown: ProductRatingSummary["breakdown"] = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  for (const r of reviews) {
    const bucket = Math.min(5, Math.max(1, Math.round(r.rating))) as 1 | 2 | 3 | 4 | 5
    breakdown[bucket]++
  }
  const count = reviews.length
  const average = count === 0 ? 0 : reviews.reduce((sum, r) => sum + r.rating, 0) / count

  return { average: Math.round(average * 10) / 10, count, breakdown }
}
