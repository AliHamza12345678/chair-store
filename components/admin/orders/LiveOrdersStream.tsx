"use client"

import * as React from "react"
import { Activity, Clock, ShoppingCart, CheckCircle2, AlertCircle, ArrowUpRight } from "lucide-react"
import { formatCurrency } from "@/lib/format-currency"

interface LiveOrdersStreamProps {
  orders: any[]
}

export function LiveOrdersStream({ orders }: LiveOrdersStreamProps) {
  // Recent 6 activity events
  const activities = orders.slice(0, 6).map((o, i) => ({
    id: o.id,
    customer: o.user?.name || "Customer",
    total: o.total,
    status: o.status,
    time: i === 0 ? "2 mins ago" : i === 1 ? "14 mins ago" : i === 2 ? "1 hour ago" : i === 3 ? "3 hours ago" : `${i + 1} hours ago`,
    type: o.status === "DELIVERED" ? "delivered" : o.status === "SHIPPED" ? "shipped" : o.status === "CANCELLED" ? "cancelled" : "new"
  }))

  return (
    <div className="rounded-3xl border border-[var(--lm-border-default)] bg-[var(--lm-surface-elevated)] glass-card p-5 space-y-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping absolute inset-0" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 relative z-10" />
          </div>
          <h4 className="text-xs font-bold text-[var(--lm-text-primary)] uppercase tracking-wider">Live Activity Stream</h4>
        </div>
        <span className="text-[10px] text-[var(--lm-text-muted)] font-mono">Realtime feed</span>
      </div>

      <div className="space-y-2.5">
        {activities.map((act) => (
          <div key={act.id} className="flex items-center justify-between p-2.5 rounded-2xl bg-[var(--lm-surface-secondary)] border border-[var(--lm-border-subtle)] hover:bg-[var(--lm-surface-hover)] transition-colors">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${act.type === 'delivered' ? 'bg-emerald-500/15 text-emerald-500' : act.type === 'shipped' ? 'bg-blue-500/15 text-blue-500' : act.type === 'cancelled' ? 'bg-red-500/15 text-red-500' : 'bg-amber-500/15 text-amber-500'}`}>
                {act.type === 'delivered' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <ShoppingCart className="w-3.5 h-3.5" />}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-[var(--lm-text-primary)] truncate">{act.customer}</p>
                <p className="text-[10px] text-[var(--lm-text-muted)] truncate">Order #{act.id.slice(-6)} • {act.status}</p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xs font-bold text-[var(--lm-text-primary)] tabular-nums">{formatCurrency(act.total)}</p>
              <p className="text-[9px] text-[var(--lm-text-muted)]">{act.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
