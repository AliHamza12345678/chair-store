"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { requireUser } from "@/lib/permissions"

export async function toggleWishlist(productId: string) {
  const user = await requireUser()

  const existing = await prisma.wishlistItem.findUnique({
    where: { userId_productId: { userId: user.id, productId } },
  })

  if (existing) {
    await prisma.wishlistItem.delete({ where: { id: existing.id } })
    revalidatePath("/wishlist")
    return { success: true as const, wishlisted: false }
  }

  await prisma.wishlistItem.create({ data: { userId: user.id, productId } })
  revalidatePath("/wishlist")
  return { success: true as const, wishlisted: true }
}

export async function removeFromWishlist(id: string) {
  const user = await requireUser()
  const item = await prisma.wishlistItem.findUnique({ where: { id } })
  if (!item || item.userId !== user.id) {
    return { success: false as const, error: "Item not found." }
  }
  await prisma.wishlistItem.delete({ where: { id } })
  revalidatePath("/wishlist")
  return { success: true as const }
}
