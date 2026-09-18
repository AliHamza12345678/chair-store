import { prisma } from "@/lib/prisma"

/** Storefront: only approved reviews are ever shown publicly. */
export async function getApprovedReviewsForProduct(productId: string) {
  return prisma.review.findMany({
    where: { productId, status: "APPROVED" },
    include: { user: { select: { name: true, image: true } } },
    orderBy: { createdAt: "desc" },
  })
}

export async function getUserReviewForProduct(productId: string, userId: string) {
  return prisma.review.findUnique({
    where: { productId_userId: { productId, userId } },
  })
}

/** Admin moderation queue — defaults to pending, but accepts any status. */
export async function getReviewsForAdmin(status?: "PENDING" | "APPROVED" | "REJECTED") {
  return prisma.review.findMany({
    where: status ? { status } : undefined,
    include: {
      user: { select: { name: true, email: true } },
      product: { select: { name: true, slug: true } },
    },
    orderBy: { createdAt: "desc" },
  })
}
