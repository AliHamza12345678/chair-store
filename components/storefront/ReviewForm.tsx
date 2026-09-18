"use client"

import { useState } from "react"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/Input"
import { createReview } from "@/features/reviews/actions"
import { toast } from "sonner"

export function ReviewForm({ productId }: { productId: string }) {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [title, setTitle] = useState("")
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0) {
      toast.error("Please select a star rating.")
      return
    }
    setIsSubmitting(true)
    const res = await createReview({ productId, rating, title: title || undefined, comment })
    setIsSubmitting(false)
    if (res.success) {
      toast.success("Thanks! Your review will appear after moderation.")
      setSubmitted(true)
    } else {
      toast.error(res.error || "Failed to submit review.")
    }
  }

  if (submitted) {
    return <p className="text-sm text-muted-foreground">Your review has been submitted for approval.</p>
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => {
          const value = i + 1
          return (
            <button
              key={i}
              type="button"
              onMouseEnter={() => setHoverRating(value)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(value)}
            >
              <Star className={`w-6 h-6 ${value <= (hoverRating || rating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`} />
            </button>
          )
        })}
      </div>
      <Input placeholder="Title (optional)" value={title} onChange={(e) => setTitle(e.target.value)} disabled={isSubmitting} />
      <Textarea
        placeholder="Share your experience with this product..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        disabled={isSubmitting}
        rows={4}
      />
      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Submitting..." : "Submit Review"}
      </Button>
    </form>
  )
}
