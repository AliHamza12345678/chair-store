import { prisma } from "@/lib/prisma"
import { OrdersClient } from "./OrdersClient"

export default async function OrdersPage() {
  const orders = await prisma.order.findMany({
    include: {
      user: true,
      address: true,
      coupon: true,
      installmentPlan: {
        include: {
          installments: {
            orderBy: { dueDate: "asc" }
          }
        }
      },
      orderItems: {
        include: {
          product: true,
          variant: true
        }
      }
    },
    orderBy: { createdAt: "desc" }
  })

  // Serialize dates safely for client component
  const serializedOrders = orders.map(order => ({
    ...order,
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
    address: order.address ? {
      ...order.address,
      createdAt: order.address.createdAt.toISOString(),
      updatedAt: order.address.updatedAt.toISOString()
    } : null,
    coupon: order.coupon ? {
      ...order.coupon,
      createdAt: order.coupon.createdAt.toISOString(),
      updatedAt: order.coupon.updatedAt.toISOString(),
      startsAt: order.coupon.startsAt?.toISOString() || null,
      expiresAt: order.coupon.expiresAt?.toISOString() || null,
    } : null,
    installmentPlan: order.installmentPlan ? {
      ...order.installmentPlan,
      createdAt: order.installmentPlan.createdAt.toISOString(),
      updatedAt: order.installmentPlan.updatedAt.toISOString(),
      installments: order.installmentPlan.installments.map(inst => ({
        ...inst,
        dueDate: inst.dueDate.toISOString(),
        paidAt: inst.paidAt?.toISOString() || null,
        reminderSentAt: inst.reminderSentAt?.toISOString() || null,
        createdAt: inst.createdAt.toISOString(),
        updatedAt: inst.updatedAt.toISOString(),
      }))
    } : null
  }))

  return <OrdersClient orders={serializedOrders as any} />
}
