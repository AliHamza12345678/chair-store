import { getReviewsForAdmin } from "@/features/reviews/queries"
import { ReviewsClient } from "./ReviewsClient"

export default async function AdminReviewsPage() {
  const reviews = await getReviewsForAdmin()
  return <ReviewsClient reviews={reviews} />
}
