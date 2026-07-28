"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/Button"
import { formatCurrency } from "@/lib/format-currency"
import { markInstallmentPaidManually, cancelInstallmentPlan } from "@/features/installments/actions"
import { toast } from "sonner"
import { ChevronDown, ChevronUp } from "lucide-react"

interface Installment {
  id: string
  amount: number
  dueDate: Date
  status: "PENDING" | "PAID" | "OVERDUE" | "FAILED"
}

interface Plan {
  id: string
  orderId: string
  totalAmount: number
  numberOfMonths: number
  status: "ACTIVE" | "COMPLETED" | "DEFAULTED" | "CANCELLED"
  installments: Installment[]
  user: { name: string | null; email: string | null }
  order: { id: string; total: number }
}

const statusVariant = {
  PENDING: "secondary", PAID: "success", OVERDUE: "destructive", FAILED: "destructive",
  ACTIVE: "default", COMPLETED: "success", DEFAULTED: "destructive", CANCELLED: "secondary",
} as const

export function InstallmentsClient({ plans }: { plans: Plan[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)

  const handleMarkPaid = async (installmentId: string) => {
    setBusyId(installmentId)
    const res = await markInstallmentPaidManually(installmentId)
    setBusyId(null)
    if (res.success) toast.success("Marked as paid")
    else toast.error("Failed to update")
  }

  const handleCancel = async (planId: string) => {
    if (!confirm("Cancel this installment plan?")) return
    setBusyId(planId)
    const res = await cancelInstallmentPlan(planId)
    setBusyId(null)
    if (res.success) toast.success("Plan cancelled")
    else toast.error("Failed to cancel")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Installment Plans</h1>
        <p className="text-muted-foreground mt-2">
          JazzCash BNPL plans. Payments confirmed automatically via webhook, or mark paid manually for cash/bank-transfer collections.
        </p>
      </div>

      <div className="border rounded-xl divide-y bg-card">
        {plans.length === 0 && (
          <p className="p-8 text-sm text-muted-foreground text-center">No installment plans yet.</p>
        )}
        {plans.map((plan) => (
          <div key={plan.id}>
            <button
              className="w-full flex items-center justify-between p-4 hover:bg-secondary/30 transition-colors text-left"
              onClick={() => setExpandedId(expandedId === plan.id ? null : plan.id)}
            >
              <div className="flex items-center gap-4">
                {expandedId === plan.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                <div>
                  <div className="font-medium">{plan.user.name || plan.user.email}</div>
                  <div className="text-xs text-muted-foreground">Order #{plan.orderId.slice(-8).toUpperCase()}</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">{formatCurrency(plan.totalAmount)}</span>
                <span className="text-xs text-muted-foreground">{plan.numberOfMonths} months</span>
                <Badge variant={statusVariant[plan.status]}>{plan.status}</Badge>
              </div>
            </button>

            {expandedId === plan.id && (
              <div className="px-4 pb-4">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-muted-foreground border-b">
                      <th className="pb-2 font-medium">Due Date</th>
                      <th className="pb-2 font-medium">Amount</th>
                      <th className="pb-2 font-medium">Status</th>
                      <th className="pb-2 font-medium"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {plan.installments.map((inst) => (
                      <tr key={inst.id} className="border-b last:border-0">
                        <td className="py-2">{new Date(inst.dueDate).toLocaleDateString()}</td>
                        <td className="py-2">{formatCurrency(inst.amount)}</td>
                        <td className="py-2"><Badge variant={statusVariant[inst.status]}>{inst.status}</Badge></td>
                        <td className="py-2 text-right">
                          {inst.status !== "PAID" && (
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={busyId === inst.id}
                              onClick={() => handleMarkPaid(inst.id)}
                            >
                              Mark Paid
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {plan.status === "ACTIVE" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-3 text-red-500"
                    disabled={busyId === plan.id}
                    onClick={() => handleCancel(plan.id)}
                  >
                    Cancel Plan
                  </Button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
