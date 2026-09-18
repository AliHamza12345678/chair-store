import { CheckCircle2, XCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

/**
 * Read-only status page — this is not a payment gateway dashboard (JazzCash
 * and Stripe both have their own for that). It just shows whether each
 * integration's required env vars are set on this deployment, so an admin
 * can tell at a glance why COD/Installments/Card payments might not be working.
 */
function EnvStatus({ name, isConfigured }: { name: string; isConfigured: boolean }) {
  return (
    <div className="flex items-center justify-between p-4 border rounded-xl">
      <span className="font-medium">{name}</span>
      {isConfigured ? (
        <Badge variant="success" className="gap-1"><CheckCircle2 className="w-3 h-3" /> Configured</Badge>
      ) : (
        <Badge variant="destructive" className="gap-1"><XCircle className="w-3 h-3" /> Not configured</Badge>
      )}
    </div>
  )
}

export default function AdminPaymentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
        <p className="text-muted-foreground mt-2">
          Integration status for this deployment. Manage plans and transactions in the{" "}
          <a href="/admin/coupons" className="underline">Coupons</a>,{" "}
          <a href="/admin/installments" className="underline">Installments</a>, and Stripe/JazzCash dashboards directly.
        </p>
      </div>

      <div className="space-y-3 max-w-lg">
        <EnvStatus name="Stripe (card payments)" isConfigured={!!process.env.STRIPE_SECRET_KEY} />
        <EnvStatus name="JazzCash (installments)" isConfigured={!!process.env.JAZZCASH_INTEGRITY_SALT && !!process.env.JAZZCASH_MERCHANT_ID} />
        <EnvStatus name="Resend (transactional email)" isConfigured={!!process.env.RESEND_API_KEY} />
      </div>

      <div className="max-w-lg text-sm text-muted-foreground border rounded-xl p-4">
        Cash on Delivery is always available and needs no configuration.
      </div>
    </div>
  )
}
