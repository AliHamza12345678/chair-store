import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getUpcomingUnremindedInstallments, getPastDuePendingInstallments } from "@/features/installments/queries"
import { sendInstallmentReminderEmail } from "@/lib/email"

/**
 * Meant to run once daily via a scheduler (Vercel Cron, cron-job.org, etc.).
 * Protected with CRON_SECRET so it can't be triggered by randoms hitting the URL.
 *
 * Vercel Cron setup (vercel.json):
 *   { "crons": [{ "path": "/api/cron/installment-reminders", "schedule": "0 9 * * *" }] }
 * Vercel automatically sends the Authorization header for its own crons;
 * for any other scheduler, call this URL with:
 *   Authorization: Bearer <CRON_SECRET>
 */
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization")
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  // 1. Flip anything past its due date to OVERDUE.
  const overdue = await getPastDuePendingInstallments()
  if (overdue.length) {
    await prisma.installment.updateMany({
      where: { id: { in: overdue.map((i) => i.id) } },
      data: { status: "OVERDUE" },
    })
  }

  // 2. Send reminders for installments due within 3 days that haven't been reminded yet.
  const upcoming = await getUpcomingUnremindedInstallments()
  let sent = 0

  for (const installment of upcoming) {
    const { email, name } = installment.plan.user
    if (!email) continue

    const result = await sendInstallmentReminderEmail(email, name || "", installment.amount, installment.dueDate)
    if (result.success) {
      await prisma.installment.update({
        where: { id: installment.id },
        data: { reminderSentAt: new Date() },
      })
      sent++
    }
  }

  return NextResponse.json({
    message: "OK",
    markedOverdue: overdue.length,
    remindersSent: sent,
  })
}
