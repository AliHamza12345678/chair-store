import { Star } from "lucide-react"
import { getApprovedReviewsForProduct, getUserReviewForProduct } from "@/features/reviews/queries"
import { summarizeRatings } from "@/features/reviews/utils"
import { getCurrentUser } from "@/features/auth/queries"
import { Badge } from "@/components/ui/badge"
import { ReviewForm } from "./ReviewForm"

export async function ReviewsSection({ productId }: { productId: string }) {
  const [reviews, user] = await Promise.all([
    getApprovedReviewsForProduct(productId),
    getCurrentUser(),
  ])

  const summary = summarizeRatings(reviews)
  const existingReview = user ? await getUserReviewForProduct(productId, user.id) : null

  return (
    <div className="mt-20 border-t pt-12">
      <h2 className="text-2xl font-bold tracking-tighter mb-8">Customer Reviews</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Summary */}
        <div>
          <div className="text-5xl font-bold tracking-tighter mb-2">{summary.average || "—"}</div>
          <div className="flex items-center gap-1 mb-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className={`w-4 h-4 ${i < Math.round(summary.average) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`} />
            ))}
          </div>
          <p className="text-sm text-muted-foreground mb-8">
            Based on {summary.count} {summary.count === 1 ? "review" : "reviews"}
          </p>

          {user && !existingReview && <ReviewForm productId={productId} />}
          {existingReview && (
            <p className="text-sm text-muted-foreground">
              You've already reviewed this product
              {existingReview.status === "PENDING" && " (awaiting approval)."}
              {existingReview.status === "REJECTED" && "."}
            </p>
          )}
          {!user && (
            <p className="text-sm text-muted-foreground">
              <a href="/auth/login" className="underline hover:text-foreground">Sign in</a> to leave a review.
            </p>
          )}
        </div>

        {/* List */}
        <div className="md:col-span-2 space-y-6">
          {reviews.length === 0 ? (
            <p className="text-sm text-muted-foreground">No reviews yet — be the first to review this product.</p>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="border-b pb-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`} />
                    ))}
                  </div>
                  {review.isVerifiedPurchase && <Badge variant="outline" className="text-[10px]">Verified Purchase</Badge>}
                </div>
                {review.title && <h4 className="font-medium mb-1">{review.title}</h4>}
                <p className="text-sm text-muted-foreground mb-2">{review.comment}</p>
                <p className="text-xs text-muted-foreground">
                  {review.user.name || "Anonymous"} · {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
