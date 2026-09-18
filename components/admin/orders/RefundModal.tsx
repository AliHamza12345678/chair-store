"use client"

import * as React from "react"
import { useState } from "react"
import { X, RefreshCcw, AlertTriangle, CheckCircle2, DollarSign, ShieldAlert } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { formatCurrency } from "@/lib/format-currency"
import { toast } from "sonner"
import { processOrderRefund } from "@/features/orders/actions"

interface RefundModalProps {
  isOpen: boolean
  onClose: () => void
  order: any
}

export function RefundModal({ isOpen, onClose, order }: RefundModalProps) {
  const [refundAmount, setRefundAmount] = useState<number>(order?.total || 0)
  const [reason, setReason] = useState<string>("Customer Requested Cancellation")
  const [restockInventory, setRestockInventory] = useState<boolean>(true)
  const [internalNote, setInternalNote] = useState<string>("")
  const [isProcessing, setIsProcessing] = useState<boolean>(false)

  if (!isOpen || !order) return null

  const handleRefundSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)
    const t = toast.loading("Processing refund via Stripe/Gateway...")

    try {
      const res = await processOrderRefund(order.id, refundAmount, reason, restockInventory, internalNote)
      if (res.success) {
        toast.success(`Refund of ${formatCurrency(refundAmount)} processed successfully`, { id: t })
        onClose()
      } else {
        toast.error(res.error || "Failed to process refund", { id: t })
      }
    } catch {
      toast.error("Error submitting refund request", { id: t })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/70 backdrop-blur-md transition-opacity" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-lg bg-[var(--lm-surface-elevated)] border border-[var(--lm-border-default)] rounded-3xl p-6 shadow-2xl space-y-5 animate-scale-spring glass-card">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--lm-border-default)] pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/15 text-amber-500 border border-amber-500/20">
              <RefreshCcw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[var(--lm-text-primary)]">Issue Refund</h3>
              <p className="text-[11px] text-[var(--lm-text-muted)]">Order #{order.id.slice(-8)} • Original Total {formatCurrency(order.total)}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-[var(--lm-surface-hover)] text-[var(--lm-text-muted)] hover:text-[var(--lm-text-primary)]">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleRefundSubmit} className="space-y-4">
          {/* Refund Amount Input */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold text-[var(--lm-text-secondary)]">Refund Amount (PKR)</label>
              <button
                type="button"
                onClick={() => setRefundAmount(order.total)}
                className="text-[10px] text-[var(--lm-accent-text)] font-semibold hover:underline"
              >
                Set Full Refund ({formatCurrency(order.total)})
              </button>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[var(--lm-text-muted)]">₨</span>
              <Input
                type="number"
                step="0.01"
                max={order.total}
                value={refundAmount}
                onChange={e => setRefundAmount(parseFloat(e.target.value) || 0)}
                className="pl-8 bg-[var(--lm-surface-secondary)] text-xs h-10 font-mono font-bold"
              />
            </div>
          </div>

          {/* Reason Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[var(--lm-text-secondary)]">Primary Refund Reason</label>
            <select
              value={reason}
              onChange={e => setReason(e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-input bg-[var(--lm-surface-secondary)] text-xs focus:outline-none focus:ring-2 focus:ring-[var(--lm-accent-primary)]/40"
            >
              <option value="Customer Requested Cancellation">Customer Requested Cancellation</option>
              <option value="Damaged or Defective Item">Damaged or Defective Item Received</option>
              <option value="Item Out of Stock">Item Out of Stock / Unfulfillable</option>
              <option value="Duplicate Charge / Payment Error">Duplicate Charge / Payment Error</option>
              <option value="Fraudulent Activity">Fraudulent Activity Flagged</option>
            </select>
          </div>

          {/* Restock Inventory Toggle */}
          <div
            onClick={() => setRestockInventory(!restockInventory)}
            className="flex items-center justify-between p-3 rounded-2xl bg-[var(--lm-surface-secondary)] border border-[var(--lm-border-subtle)] cursor-pointer hover:bg-[var(--lm-surface-hover)] transition-colors"
          >
            <div>
              <p className="text-xs font-semibold text-[var(--lm-text-primary)]">Restock Inventory</p>
              <p className="text-[10px] text-[var(--lm-text-muted)]">Automatically return items back to available stock</p>
            </div>
            <div className={`relative w-9 h-5 rounded-full transition-colors duration-300 ${restockInventory ? 'bg-emerald-500' : 'bg-neutral-400'}`}>
              <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform duration-300 ${restockInventory ? 'translate-x-4' : 'translate-x-0.5'}`} />
            </div>
          </div>

          {/* Internal Refund Note */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[var(--lm-text-secondary)]">Internal Refund Notes</label>
            <textarea
              value={internalNote}
              onChange={e => setInternalNote(e.target.value)}
              placeholder="Add audit notes for finance or admin staff..."
              rows={2}
              className="w-full p-2.5 rounded-xl border border-input bg-[var(--lm-surface-secondary)] text-xs focus:outline-none focus:ring-2 focus:ring-[var(--lm-accent-primary)]/40 resize-none"
            />
          </div>

          {/* Modal Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--lm-border-default)]">
            <Button type="button" variant="outline" onClick={onClose} disabled={isProcessing} className="rounded-xl text-xs h-9">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isProcessing || refundAmount <= 0}
              className="bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs rounded-xl h-9 px-4 gap-1.5 shadow-md"
            >
              {isProcessing ? "Processing..." : `Refund ${formatCurrency(refundAmount)}`}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
