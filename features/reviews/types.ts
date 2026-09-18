import type { Review, ReviewStatus } from "@prisma/client"

export type { Review, ReviewStatus }

export interface ReviewWithUser extends Review {
  user: { name: string | null; image: string | null }
}

export interface ProductRatingSummary {
  average: number
  count: number
  breakdown: Record<1 | 2 | 3 | 4 | 5, number>
}
