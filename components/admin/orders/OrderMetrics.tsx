"use client"

import * as React from "react"
import { DollarSign, ShoppingBag, TrendingUp, RefreshCw, CheckCircle2, Clock, Truck, ShieldAlert } from "lucide-react"
import { formatCurrency } from "@/lib/format-currency"

interface OrderMetricsProps {
  orders: any[]
}

export function OrderMetrics({ orders }: OrderMetricsProps) {
  const totalOrders = orders.length
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0)
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0
  
  const pendingCount = orders.filter(o => o.status === "PENDING").length
  const processingCount = orders.filter(o => o.status === "PROCESSING").length
  const shippedCount = orders.filter(o => o.status === "SHIPPED").length
  const deliveredCount = orders.filter(o => o.status === "DELIVERED").length
  const cancelledCount = orders.filter(o => o.status === "CANCELLED").length

  const fulfillmentRate = totalOrders > 0 ? Math.round((deliveredCount / totalOrders) * 100) : 0

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Gross Revenue Card */}
      <div className="group relative rounded-3xl border border-[var(--lm-border-default)] bg-[var(--lm-surface-elevated)] glass-card p-5 overflow-hidden transition-all duration-500 hover:shadow-xl hover:border-[var(--lm-accent-border)] hover:-translate-y-1 animate-scale-spring">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--lm-text-muted)]">Total Revenue</p>
            <h3 className="text-2xl font-black tracking-tight text-[var(--lm-text-primary)] mt-1 tabular-nums">
              {formatCurrency(totalRevenue)}
            </h3>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              +14.2% from last month
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[var(--lm-accent-muted)] border border-[var(--lm-accent-border)] flex items-center justify-center text-[var(--lm-accent-text)] shadow-sm shrink-0">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Total Orders Card */}
      <div className="group relative rounded-3xl border border-[var(--lm-border-default)] bg-[var(--lm-surface-elevated)] glass-card p-5 overflow-hidden transition-all duration-500 hover:shadow-xl hover:border-[var(--lm-accent-border)] hover:-translate-y-1 animate-scale-spring" style={{ animationDelay: "50ms" }}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--lm-text-muted)]">Total Orders</p>
            <h3 className="text-2xl font-black tracking-tight text-[var(--lm-text-primary)] mt-1 tabular-nums">
              {totalOrders}
            </h3>
            <p className="text-[11px] text-[var(--lm-text-muted)] mt-1 font-medium">
              <span className="text-amber-500 font-bold">{pendingCount + processingCount} active</span> • {deliveredCount} delivered
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500 shadow-sm shrink-0">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Average Order Value (AOV) */}
      <div className="group relative rounded-3xl border border-[var(--lm-border-default)] bg-[var(--lm-surface-elevated)] glass-card p-5 overflow-hidden transition-all duration-500 hover:shadow-xl hover:border-[var(--lm-accent-border)] hover:-translate-y-1 animate-scale-spring" style={{ animationDelay: "100ms" }}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--lm-text-muted)]">Average Order Value</p>
            <h3 className="text-2xl font-black tracking-tight text-[var(--lm-text-primary)] mt-1 tabular-nums">
              {formatCurrency(avgOrderValue)}
            </h3>
            <p className="text-[11px] text-[var(--lm-text-muted)] mt-1 font-medium">
              Per customer transaction
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-500 shadow-sm shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Fulfillment Rate */}
      <div className="group relative rounded-3xl border border-[var(--lm-border-default)] bg-[var(--lm-surface-elevated)] glass-card p-5 overflow-hidden transition-all duration-500 hover:shadow-xl hover:border-[var(--lm-accent-border)] hover:-translate-y-1 animate-scale-spring" style={{ animationDelay: "150ms" }}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--lm-text-muted)]">Fulfillment Rate</p>
            <h3 className="text-2xl font-black tracking-tight text-[var(--lm-text-primary)] mt-1 tabular-nums">
              {fulfillmentRate}%
            </h3>
            <p className="text-[11px] text-[var(--lm-text-muted)] mt-1 font-medium">
              {cancelledCount} cancelled / refunded
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shadow-sm shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>
    </div>
  )
}
