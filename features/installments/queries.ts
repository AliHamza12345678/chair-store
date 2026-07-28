import { prisma } from "@/lib/prisma"

export async function getInstallmentPlanForOrder(orderId: string) {
  return prisma.installmentPlan.findUnique({
    where: { orderId },
    include: { installments: { orderBy: { dueDate: "asc" } } },
  })
}

export async function getInstallmentPlansForUser(userId: string) {
  return prisma.installmentPlan.findMany({
    where: { userId },
    include: { installments: { orderBy: { dueDate: "asc" } }, order: true },
    orderBy: { createdAt: "desc" },
  })
}

/** Admin: every plan, most recent first. */
export async function getAllInstallmentPlans() {
  return prisma.installmentPlan.findMany({
    include: {
      installments: { orderBy: { dueDate: "asc" } },
      user: { select: { name: true, email: true } },
      order: { select: { id: true, total: true } },
    },
    orderBy: { createdAt: "desc" },
  })
}

/** Used by the reminder cron: installments due within the next 3 days that haven't been reminded yet. */
export async function getUpcomingUnremindedInstallments() {
  const threeDaysOut = new Date()
  threeDaysOut.setDate(threeDaysOut.getDate() + 3)

  return prisma.installment.findMany({
    where: {
      status: "PENDING",
      dueDate: { lte: threeDaysOut },
      reminderSentAt: null,
    },
    include: {
      plan: { include: { user: { select: { email: true, name: true } } } },
    },
  })
}

/** Used by a daily job to flip PENDING → OVERDUE once the due date has passed. */
export async function getPastDuePendingInstallments() {
  return prisma.installment.findMany({
    where: { status: "PENDING", dueDate: { lt: new Date() } },
  })
}
