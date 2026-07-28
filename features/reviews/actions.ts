"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { requireAdmin, requireUser } from "@/lib/permissions"
import { reviewSchema, ReviewFormValues } from "./validations"

/**
 * Customer submits a review. New reviews start as PENDING and only appear
 * on the storefront once an admin approves them (see admin/reviews page).
 */
export async function createReview(data: ReviewFormValues) {
  const user = await requireUser()

  const parsed = reviewSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false as const, error: parsed.error.issues[0]?.message ?? "Invalid review." }
  }
  const { productId, rating, title, comment } = parsed.data

  // A verified purchase = the user has at least one order containing this
  // product. Doesn't require the order to be delivered — COD orders are
  // marked PENDING/PROCESSING for a while and we don't want to block
  // reviews on that in a small store.
  const hasPurchased = await prisma.orderItem.findFirst({
    where: { productId, order: { userId: user.id } },
  })

  try {
    await prisma.review.create({
      data: {
        productId,
        userId: user.id,
        rating,
        title,
        comment,
        status: "PENDING",
        isVerifiedPurchase: !!hasPurchased,
      },
    })
    revalidatePath(`/products`)
    return { success: true as const }
  } catch (err: any) {
    if (err?.code === "P2002") {
      return { success: false as const, error: "You've already reviewed this product." }
    }
    return { success: false as const, error: "Failed to submit review." }
  }
}

// ── Admin moderation ────────────────────────────────────────

export async function approveReview(id: string) {
  await requireAdmin()
  await prisma.review.update({ where: { id }, data: { status: "APPROVED" } })
  revalidatePath("/admin/reviews")
  revalidatePath("/products")
  return { success: true as const }
}

export async function rejectReview(id: string) {
  await requireAdmin()
  await prisma.review.update({ where: { id }, data: { status: "REJECTED" } })
  revalidatePath("/admin/reviews")
  return { success: true as const }
}

export async function deleteReview(id: string) {
  await requireAdmin()
  await prisma.review.delete({ where: { id } })
  revalidatePath("/admin/reviews")
  revalidatePath("/products")
  return { success: true as const }
}
