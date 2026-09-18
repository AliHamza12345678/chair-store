"use client"

import { useState } from "react"
import { Star, Check, X, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/Button"
import { DataTable } from "@/components/ui/DataTable"
import { approveReview, rejectReview, deleteReview } from "@/features/reviews/actions"
import { toast } from "sonner"

interface ReviewRow {
  id: string
  rating: number
  title: string | null
  comment: string
  status: "PENDING" | "APPROVED" | "REJECTED"
  isVerifiedPurchase: boolean
  createdAt: Date
  user: { name: string | null; email: string | null }
  product: { name: string; slug: string }
}

export function ReviewsClient({ reviews }: { reviews: ReviewRow[] }) {
  const [busyId, setBusyId] = useState<string | null>(null)

  const run = async (id: string, fn: (id: string) => Promise<any>, successMsg: string) => {
    setBusyId(id)
    const res = await fn(id)
    setBusyId(null)
    if (res.success) toast.success(successMsg)
    else toast.error(res.error || "Something went wrong")
  }

  const statusVariant = { PENDING: "secondary", APPROVED: "success", REJECTED: "destructive" } as const

  const columns = [
    {
      header: "Product",
      cell: (item: ReviewRow) => <span className="font-medium">{item.product.name}</span>,
    },
    {
      header: "Customer",
      cell: (item: ReviewRow) => (
        <div>
          <div className="font-medium">{item.user.name || "Unknown"}</div>
          <div className="text-xs text-muted-foreground">{item.user.email}</div>
        </div>
      ),
    },
    {
      header: "Rating",
      cell: (item: ReviewRow) => (
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className={`w-3.5 h-3.5 ${i < item.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`} />
          ))}
        </div>
      ),
    },
    {
      header: "Review",
      cell: (item: ReviewRow) => (
        <div className="max-w-xs">
          {item.title && <p className="font-medium text-sm">{item.title}</p>}
          <p className="text-xs text-muted-foreground line-clamp-2">{item.comment}</p>
          {item.isVerifiedPurchase && <Badge variant="outline" className="mt-1 text-[10px]">Verified Purchase</Badge>}
        </div>
      ),
    },
    {
      header: "Status",
      cell: (item: ReviewRow) => <Badge variant={statusVariant[item.status]}>{item.status}</Badge>,
    },
    {
      header: "Actions",
      cell: (item: ReviewRow) => (
        <div className="flex gap-2">
          {item.status !== "APPROVED" && (
            <Button variant="ghost" size="icon" className="h-8 w-8" disabled={busyId === item.id}
              onClick={() => run(item.id, approveReview, "Review approved")}>
              <Check className="w-4 h-4 text-green-500" />
            </Button>
          )}
          {item.status !== "REJECTED" && (
            <Button variant="ghost" size="icon" className="h-8 w-8" disabled={busyId === item.id}
              onClick={() => run(item.id, rejectReview, "Review rejected")}>
              <X className="w-4 h-4 text-orange-500" />
            </Button>
          )}
          <Button variant="ghost" size="icon" className="h-8 w-8" disabled={busyId === item.id}
            onClick={() => { if (confirm("Delete this review permanently?")) run(item.id, deleteReview, "Review deleted") }}>
            <Trash2 className="w-4 h-4 text-red-500" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reviews</h1>
        <p className="text-muted-foreground mt-2">Moderate customer reviews before they appear on product pages.</p>
      </div>
      <DataTable columns={columns} data={reviews} />
    </div>
  )
}
