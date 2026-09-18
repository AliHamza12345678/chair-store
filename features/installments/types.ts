import type { Installment, InstallmentPlan, InstallmentPlanStatus, InstallmentStatus } from "@prisma/client"

export type { Installment, InstallmentPlan, InstallmentPlanStatus, InstallmentStatus }

export interface InstallmentPlanWithSchedule extends InstallmentPlan {
  installments: Installment[]
}
