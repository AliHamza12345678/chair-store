"use client"

import { useState } from "react"
import { Heart } from "lucide-react"
import { toggleWishlist } from "@/features/wishlist/actions"
import { toast } from "sonner"
import { cn } from "@/lib/clsx"

export function WishlistButton({ productId, initialWishlisted }: { productId: string; initialWishlisted: boolean }) {
  const [wishlisted, setWishlisted] = useState(initialWishlisted)
  const [isPending, setIsPending] = useState(false)

  const handleClick = async () => {
    setIsPending(true)
    const res = await toggleWishlist(productId)
    setIsPending(false)
    if (res.success) {
      setWishlisted(res.wishlisted)
      toast.success(res.wishlisted ? "Added to wishlist" : "Removed from wishlist")
    } else {
      toast.error("Please sign in to use your wishlist.")
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className="w-12 h-12 rounded-full border flex items-center justify-center hover:bg-secondary transition-colors flex-shrink-0"
      aria-label="Toggle wishlist"
    >
      <Heart className={cn("w-5 h-5", wishlisted && "fill-red-500 text-red-500")} />
    </button>
  )
}
