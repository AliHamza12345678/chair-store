import { prisma } from "@/lib/prisma"

export async function getUserWishlist(userId: string) {
  return prisma.wishlistItem.findMany({
    where: { userId },
    include: { product: true },
    orderBy: { createdAt: "desc" },
  })
}

export async function isProductWishlisted(userId: string, productId: string) {
  const item = await prisma.wishlistItem.findUnique({
    where: { userId_productId: { userId, productId } },
  })
  return !!item
}
