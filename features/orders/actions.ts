"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { checkAdminStatus } from "@/features/auth/queries"
import { OrderStatus } from "@prisma/client"

export async function updateOrderStatus(id: string, status: OrderStatus) {
  const isAdmin = await checkAdminStatus()
  if (!isAdmin) return { error: "Unauthorized access" }

  try {
    await prisma.order.update({
      where: { id },
      data: { status }
    })
    revalidatePath("/admin/orders")
    return { success: true }
  } catch (error: any) {
    return { error: error.message || "Failed to update order status" }
  }
}

export async function updateOrderTracking(id: string, trackingNumber: string, carrier: string) {
  const isAdmin = await checkAdminStatus()
  if (!isAdmin) return { error: "Unauthorized access" }

  try {
    await prisma.order.update({
      where: { id },
      data: {
        trackingNumber,
        carrier,
        status: "SHIPPED",
      }
    })
    revalidatePath("/admin/orders")
    return { success: true, trackingNumber, carrier }
  } catch (error: any) {
    return { error: error.message || "Failed to update tracking details" }
  }
}

export async function processOrderRefund(id: string, amount: number, reason: string, restock: boolean, note?: string) {
  const isAdmin = await checkAdminStatus()
  if (!isAdmin) return { error: "Unauthorized access" }

  try {
    const existingOrder = await prisma.order.findUnique({
      where: { id },
      select: { notes: true }
    })

    const updatedNote = note
      ? `${existingOrder?.notes ? existingOrder.notes + "\n" : ""}[Refund Log]: ${reason} - Amount: ${amount}${note ? ` (${note})` : ""}`
      : existingOrder?.notes || undefined

    await prisma.order.update({
      where: { id },
      data: {
        status: "CANCELLED",
        isPaid: false,
        notes: updatedNote,
      }
    })

    revalidatePath("/admin/orders")
    return { success: true, refundedAmount: amount }
  } catch (error: any) {
    return { error: error.message || "Failed to process refund" }
  }
}

export async function saveOrderInternalNotes(id: string, notes: string) {
  const isAdmin = await checkAdminStatus()
  if (!isAdmin) return { error: "Unauthorized access" }

  try {
    await prisma.order.update({
      where: { id },
      data: { notes }
    })
    revalidatePath("/admin/orders")
    return { success: true }
  } catch (error: any) {
    return { error: error.message || "Failed to save internal notes" }
  }
}
