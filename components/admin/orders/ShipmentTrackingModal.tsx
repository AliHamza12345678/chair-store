"use client"

import * as React from "react"
import { useState } from "react"
import { X, Truck, Package, CheckCircle2, Clock, MapPin, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { toast } from "sonner"
import { updateOrderTracking, updateOrderStatus } from "@/features/orders/actions"

interface ShipmentTrackingModalProps {
  isOpen: boolean
  onClose: () => void
  order: any
}

export function ShipmentTrackingModal({ isOpen, onClose, order }: ShipmentTrackingModalProps) {
  const [carrier, setCarrier] = useState<string>("TCS Express")
  const [trackingNumber, setTrackingNumber] = useState<string>(`LUM-${order?.id.slice(-6).toUpperCase()}-PK`)
  const [isUpdating, setIsUpdating] = useState<boolean>(false)

  if (!isOpen || !order) return null

  const handleTrackingSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdating(true)
    const t = toast.loading("Updating shipment tracking details...")

    try {
      await updateOrderTracking(order.id, trackingNumber, carrier)
      await updateOrderStatus(order.id, "SHIPPED")
      toast.success("Shipment tracking updated to SHIPPED", { id: t })
      onClose()
    } catch {
      toast.error("Failed to update tracking details", { id: t })
    } finally {
      setIsUpdating(false)
    }
  }

  // Tracking Timeline Steps
  const steps = [
    { label: "Order Placed", desc: new Date(order.createdAt).toLocaleString(), done: true },
    { label: "Payment Verified", desc: order.isPaid ? "Payment confirmed" : "COD order verified", done: true },
    { label: "Processing & Packaging", desc: "Items picked from Lumina warehouse", done: order.status !== "PENDING" },
    { label: "Handed to Courier", desc: `${carrier} • Tracking #${trackingNumber}`, done: order.status === "SHIPPED" || order.status === "DELIVERED" },
    { label: "Delivered", desc: "Package delivered to customer destination", done: order.status === "DELIVERED" },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/70 backdrop-blur-md transition-opacity" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative z-10 w-full max-w-lg bg-[var(--lm-surface-elevated)] border border-[var(--lm-border-default)] rounded-3xl p-6 shadow-2xl space-y-5 animate-scale-spring glass-card">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--lm-border-default)] pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-blue-500/15 text-blue-500 border border-blue-500/20">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[var(--lm-text-primary)]">Shipment & Logistics Tracking</h3>
              <p className="text-[11px] text-[var(--lm-text-muted)]">Order #{order.id.slice(-8)} • Customer: {order.user?.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-[var(--lm-surface-hover)] text-[var(--lm-text-muted)] hover:text-[var(--lm-text-primary)]">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tracking Timeline Visualizer */}
        <div className="p-4 rounded-2xl bg-[var(--lm-surface-secondary)] border border-[var(--lm-border-subtle)] space-y-3">
          <h4 className="text-xs font-bold text-[var(--lm-text-primary)] uppercase tracking-wider">Courier Timeline Status</h4>
          <div className="relative space-y-3 pl-3">
            <div className="absolute top-2 bottom-2 left-5 w-0.5 bg-[var(--lm-border-default)]" />
            {steps.map((step, i) => (
              <div key={i} className="flex items-start gap-3 relative z-10">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0 ${step.done ? 'bg-blue-500 text-white font-bold' : 'bg-[var(--lm-surface-elevated)] border border-[var(--lm-border-strong)] text-[var(--lm-text-muted)]'}`}>
                  {step.done ? <CheckCircle2 className="w-3.5 h-3.5" /> : i + 1}
                </div>
                <div>
                  <p className={`text-xs font-bold ${step.done ? 'text-[var(--lm-text-primary)]' : 'text-[var(--lm-text-muted)]'}`}>{step.label}</p>
                  <p className="text-[10px] text-[var(--lm-text-muted)]">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form to Update Tracking Number & Carrier */}
        <form onSubmit={handleTrackingSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--lm-text-secondary)]">Logistics Carrier</label>
              <select
                value={carrier}
                onChange={e => setCarrier(e.target.value)}
                className="w-full h-9 px-3 rounded-xl border border-input bg-[var(--lm-surface-secondary)] text-xs focus:outline-none focus:ring-2 focus:ring-[var(--lm-accent-primary)]/40"
              >
                <option value="TCS Express">TCS Express</option>
                <option value="Leopard Courier">Leopard Courier</option>
                <option value="M&P Express">M&P Express</option>
                <option value="DHL Express">DHL Express</option>
                <option value="FedEx">FedEx International</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--lm-text-secondary)]">Tracking Number / AWB</label>
              <Input
                value={trackingNumber}
                onChange={e => setTrackingNumber(e.target.value)}
                className="bg-[var(--lm-surface-secondary)] text-xs h-9 font-mono"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--lm-border-default)]">
            <Button type="button" variant="outline" onClick={onClose} disabled={isUpdating} className="rounded-xl text-xs h-9">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isUpdating}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl h-9 px-4 gap-1.5 shadow-md"
            >
              {isUpdating ? "Updating..." : "Update Shipment Tracking"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
