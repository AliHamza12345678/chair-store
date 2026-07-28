"use client"

import * as React from "react"
import { useState } from "react"
import { Package, MapPin, CreditCard, Clock, FileText, Check, Printer, RefreshCcw, Truck, MessageSquare } from "lucide-react"
import { formatCurrency } from "@/lib/format-currency"
import { Button } from "@/components/ui/Button"
import { toast } from "sonner"
import { saveOrderInternalNotes } from "@/features/orders/actions"

interface OrderExpandableDetailsProps {
  order: any
  onOpenInvoice: (order: any) => void
  onOpenRefund: (order: any) => void
  onOpenTracking: (order: any) => void
}

export function OrderExpandableDetails({
  order,
  onOpenInvoice,
  onOpenRefund,
  onOpenTracking
}: OrderExpandableDetailsProps) {
  const [internalNotes, setInternalNotes] = useState<string>(order.notes || "")
  const [isSavingNotes, setIsSavingNotes] = useState<boolean>(false)

  const handleSaveNotes = async () => {
    setIsSavingNotes(true)
    const t = toast.loading("Saving internal note...")
    try {
      await saveOrderInternalNotes(order.id, internalNotes)
      toast.success("Internal note saved", { id: t })
    } catch {
      toast.error("Failed to save note", { id: t })
    } finally {
      setIsSavingNotes(false)
    }
  }

  return (
    <div className="p-5 rounded-2xl bg-[var(--lm-surface-secondary)] border border-[var(--lm-border-default)] my-2 space-y-5 animate-scale-spring">
      {/* Top Header Row with Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--lm-border-subtle)] pb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[var(--lm-text-primary)]">Order #{order.id}</span>
          <span className="text-[10px] text-[var(--lm-text-muted)] font-mono">
            Placed on {new Date(order.createdAt).toLocaleString()}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => onOpenInvoice(order)}
            className="h-8 text-xs rounded-xl gap-1.5"
          >
            <Printer className="w-3.5 h-3.5 text-[var(--lm-accent-text)]" />
            Invoice
          </Button>

          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => onOpenTracking(order)}
            className="h-8 text-xs rounded-xl gap-1.5"
          >
            <Truck className="w-3.5 h-3.5 text-blue-500" />
            Tracking
          </Button>

          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => onOpenRefund(order)}
            className="h-8 text-xs rounded-xl gap-1.5 border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10"
          >
            <RefreshCcw className="w-3.5 h-3.5" />
            Refund
          </Button>
        </div>
      </div>

      {/* Main Grid: Products, Address, Notes & Timeline */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Column 1: Ordered Products List */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--lm-text-muted)] flex items-center gap-1.5">
            <Package className="w-3.5 h-3.5 text-[var(--lm-accent-text)]" />
            Ordered Items ({(order.orderItems || []).length})
          </h4>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
            {(order.orderItems || []).map((item: any, i: number) => (
              <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl bg-[var(--lm-surface-elevated)] border border-[var(--lm-border-subtle)]">
                <div className="w-10 h-10 rounded-lg overflow-hidden bg-[var(--lm-surface-secondary)] border border-[var(--lm-border-subtle)] shrink-0">
                  {item.product?.images?.[0] ? (
                    <img src={item.product.images[0]} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-4 h-4 text-[var(--lm-text-muted)]" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-[var(--lm-text-primary)] truncate">{item.product?.name || "Product"}</p>
                  <p className="text-[10px] text-[var(--lm-text-muted)]">{item.quantity} × {formatCurrency(item.price)}</p>
                </div>
                <span className="text-xs font-bold text-[var(--lm-text-primary)] tabular-nums">
                  {formatCurrency(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Column 2: Customer Address & Payment Details */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--lm-text-muted)] flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-blue-500" />
            Shipping & Customer Info
          </h4>
          <div className="p-3 rounded-xl bg-[var(--lm-surface-elevated)] border border-[var(--lm-border-subtle)] space-y-2 text-xs">
            <div>
              <p className="font-bold text-[var(--lm-text-primary)]">{order.user?.name || "Customer"}</p>
              <p className="text-[11px] text-[var(--lm-text-muted)]">{order.user?.email}</p>
            </div>

            {order.address ? (
              <div className="pt-2 border-t border-[var(--lm-border-subtle)] text-[11px] text-[var(--lm-text-secondary)] space-y-0.5">
                <p className="font-medium text-[var(--lm-text-primary)]">{order.address.fullName}</p>
                <p>{order.address.addressLine1}</p>
                <p>{order.address.city}, {order.address.province} {order.address.postalCode}</p>
                <p className="font-semibold text-[var(--lm-accent-text)]">{order.address.phone}</p>
              </div>
            ) : (
              <p className="text-[11px] text-[var(--lm-text-muted)] italic">No shipping address recorded</p>
            )}

            <div className="pt-2 border-t border-[var(--lm-border-subtle)] flex items-center justify-between text-[11px]">
              <span className="text-[var(--lm-text-muted)]">Payment Method:</span>
              <span className="font-bold text-[var(--lm-text-primary)]">{order.paymentMethod || "COD"}</span>
            </div>
          </div>
        </div>

        {/* Column 3: Internal Admin Notes & Quick Save */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--lm-text-muted)] flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-purple-500" />
            Internal Staff Notes
          </h4>
          <div className="space-y-2">
            <textarea
              value={internalNotes}
              onChange={e => setInternalNotes(e.target.value)}
              placeholder="Write confidential internal notes for store staff..."
              rows={4}
              className="w-full p-3 rounded-xl border border-input bg-[var(--lm-surface-elevated)] text-xs focus:outline-none focus:ring-2 focus:ring-[var(--lm-accent-primary)]/40 resize-none"
            />
            <Button
              type="button"
              size="sm"
              onClick={handleSaveNotes}
              disabled={isSavingNotes}
              className="w-full h-8 text-xs bg-[var(--lm-accent-primary)] text-[var(--lm-text-on-accent)] font-semibold rounded-xl"
            >
              {isSavingNotes ? "Saving Note..." : "Save Internal Note"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
