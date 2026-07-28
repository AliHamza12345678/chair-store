import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { getOrderById } from "@/features/orders/queries"
import { formatCurrency } from "@/lib/format-currency"
import { Badge } from "@/components/ui/badge"

const statusVariant = {
  PENDING: "secondary", PROCESSING: "default", SHIPPED: "default",
  DELIVERED: "success", CANCELLED: "destructive",
} as const

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
  const order = await getOrderById(params.id)
  if (!order) notFound()

  return (
    <div className="container mx-auto px-6 py-12 max-w-3xl">
      <Link href="/account/orders" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to orders
      </Link>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Order #{order.id.slice(-8).toUpperCase()}</h1>
          <p className="text-sm text-muted-foreground mt-1">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
        </div>
        <Badge variant={(statusVariant as any)[order.status] || "secondary"}>{order.status}</Badge>
      </div>

      <div className="border rounded-2xl divide-y mb-8">
        {order.orderItems.map((item) => (
          <div key={item.id} className="flex items-center gap-4 p-4">
            <div className="w-16 h-16 bg-secondary rounded-lg overflow-hidden flex-shrink-0">
              {item.product.images[0] && (
                <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
              )}
            </div>
            <div className="flex-1">
              <p className="font-medium">{item.product.name}</p>
              <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
            </div>
            <p className="font-medium">{formatCurrency(item.price * item.quantity)}</p>
          </div>
        ))}
      </div>

      <div className="border rounded-2xl p-6 space-y-2 mb-8">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span>{formatCurrency(order.subtotal)}</span>
        </div>
        {order.discount > 0 && (
          <div className="flex justify-between text-sm text-primary">
            <span>Discount {order.coupon ? `(${order.coupon.code})` : ""}</span>
            <span>-{formatCurrency(order.discount)}</span>
          </div>
        )}
        <div className="flex justify-between font-medium pt-2 border-t">
          <span>Total</span>
          <span>{formatCurrency(order.total)}</span>
        </div>
        <p className="text-xs text-muted-foreground pt-2">
          Payment method: {order.paymentMethod} {order.isPaid ? "· Paid" : "· Unpaid"}
        </p>
      </div>

      {order.installmentPlan && (
        <div className="border rounded-2xl p-6">
          <h2 className="font-semibold mb-4">Installment Plan ({order.installmentPlan.numberOfMonths} months)</h2>
          <div className="space-y-3">
            {order.installmentPlan.installments.map((inst) => (
              <div key={inst.id} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{new Date(inst.dueDate).toLocaleDateString()}</span>
                <span>{formatCurrency(inst.amount)}</span>
                <Badge variant={inst.status === "PAID" ? "success" : inst.status === "OVERDUE" ? "destructive" : "secondary"}>
                  {inst.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
