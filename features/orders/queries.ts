"use server"

import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/features/auth/queries"

export async function getUserOrders() {
  const user = await getCurrentUser()
  if (!user) return []

  return await prisma.order.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: { orderItems: { include: { product: true } } }
  })
}

export async function getAllOrders() {
  const user = await getCurrentUser()
  if (user?.role !== "ADMIN") return []

  return await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: true, orderItems: { include: { product: true } } }
  })
}

/** Single order for the customer's order-detail page — only returns it if it belongs to the current user. */
export async function getOrderById(orderId: string) {
  const user = await getCurrentUser()
  if (!user) return null

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      orderItems: { include: { product: true } },
      address: true,
      coupon: true,
      installmentPlan: { include: { installments: { orderBy: { dueDate: "asc" } } } },
    },
  })

  if (!order || order.userId !== user.id) return null
  return order
}
