"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { requireAdmin, requireUser } from "@/lib/permissions"
import { generateInstallmentSchedule } from "./utils"
import { installmentPlanSchema, InstallmentPlanFormValues } from "./validations"

/**
 * Creates an installment plan for an order that was just placed with
 * paymentMethod = "INSTALLMENT". Called from features/checkout/actions.ts
 * right after the order is created, inside the same request (not the same
 * DB transaction, since JazzCash isn't confirmed yet at this point —
 * the plan exists but every installment starts PENDING until JazzCash
 * confirms each charge via the webhook).
 */
export async function createInstallmentPlan(data: InstallmentPlanFormValues) {
  const user = await requireUser()

  const parsed = installmentPlanSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false as const, error: parsed.error.issues[0]?.message ?? "Invalid plan." }
  }

  const order = await prisma.order.findUnique({ where: { id: parsed.data.orderId } })
  if (!order || order.userId !== user.id) {
    return { success: false as const, error: "Order not found." }
  }

  const schedule = generateInstallmentSchedule(order.total, parsed.data.numberOfMonths)

  const plan = await prisma.installmentPlan.create({
    data: {
      orderId: order.id,
      userId: user.id,
      totalAmount: order.total,
      numberOfMonths: parsed.data.numberOfMonths,
      status: "ACTIVE",
      installments: {
        create: schedule.map((s) => ({ amount: s.amount, dueDate: s.dueDate, status: "PENDING" })),
      },
    },
    include: { installments: true },
  })

  await prisma.order.update({ where: { id: order.id }, data: { paymentMethod: "INSTALLMENT" } })

  return { success: true as const, plan }
}

/**
 * Called by the JazzCash webhook route once a signature-verified callback
 * confirms a specific installment was paid. Not exposed to the client —
 * only ever invoked from app/api/webhooks/jazzcash/route.ts.
 */
export async function markInstallmentPaidByRef(installmentId: string, jazzCashTxnRef: string) {
  const installment = await prisma.installment.update({
    where: { id: installmentId },
    data: { status: "PAID", paidAt: new Date(), jazzCashTxnRef },
    include: { plan: { include: { installments: true } } },
  })

  const allPaid = installment.plan.installments.every(
    (i) => i.id === installment.id || i.status === "PAID"
  )

  if (allPaid) {
    await prisma.installmentPlan.update({ where: { id: installment.plan.id }, data: { status: "COMPLETED" } })
    await prisma.order.update({ where: { id: installment.plan.orderId }, data: { isPaid: true } })
  }

  return installment
}

// ── Admin ────────────────────────────────────────────────────

/** Manual override for cash/bank-transfer installment payments collected outside JazzCash. */
export async function markInstallmentPaidManually(installmentId: string) {
  await requireAdmin()
  await markInstallmentPaidByRef(installmentId, "MANUAL")
  revalidatePath("/admin/installments")
  return { success: true as const }
}

export async function cancelInstallmentPlan(planId: string) {
  await requireAdmin()
  await prisma.installmentPlan.update({ where: { id: planId }, data: { status: "CANCELLED" } })
  revalidatePath("/admin/installments")
  return { success: true as const }
}
