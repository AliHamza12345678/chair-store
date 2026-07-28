import { getAllInstallmentPlans } from "@/features/installments/queries"
import { InstallmentsClient } from "./InstallmentsClient"

export default async function AdminInstallmentsPage() {
  const plans = await getAllInstallmentPlans()
  return <InstallmentsClient plans={plans} />
}
