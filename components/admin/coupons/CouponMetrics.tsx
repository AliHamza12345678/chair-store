"use client"

import * as React from "react"
import { Ticket, CheckCircle2, AlertCircle, TrendingUp, PiggyBank, Sparkles, Zap } from "lucide-react"
import { formatCurrency } from "@/lib/format-currency"

interface CouponMetricsProps {
  coupons: any[]
}

export function CouponMetrics({ coupons }: CouponMetricsProps) {
  const now = new Date()

  // Active coupons: isActive === true AND not expired
  const activeCoupons = coupons.filter(c => {
    if (!c.isActive) return false
    if (c.expiresAt && new Date(c.expiresAt) < now) return false
    return true
  })

  // Expired or Inactive coupons
  const expiredOrInactive = coupons.filter(c => {
    if (!c.isActive) return true
    if (c.expiresAt && new Date(c.expiresAt) < now) return true
    return false
  })

  // Total redemptions
  const totalRedemptions = coupons.reduce((sum, c) => sum + (c.usedCount || 0), 0)

  // Total Revenue Saved for customers
  const totalSavings = coupons.reduce((sum, c) => {
    // If orders relation is loaded
    if (c.orders && Array.isArray(c.orders)) {
      return sum + c.orders.reduce((oSum: number, o: any) => oSum + (o.discount || 0), 0)
    }
    // Estimated calculation fallback based on type & value
    if (c.type === "FIXED") {
      return sum + (c.usedCount * c.value)
    }
    return sum + (c.usedCount * (c.maxDiscount || 500))
  }, 0)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Active Promo Codes */}
      <div className="group relative rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/5 via-[var(--lm-surface-elevated)] to-[var(--lm-surface-elevated)] glass-card p-5 overflow-hidden transition-all duration-500 hover:shadow-xl hover:border-emerald-500/50 hover:-translate-y-1 animate-scale-spring">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Active Coupons</p>
            </div>
            <h3 className="text-2xl font-black tracking-tight text-[var(--lm-text-primary)] mt-1 tabular-nums">
              {activeCoupons.length} <span className="text-xs font-medium text-[var(--lm-text-muted)]">live codes</span>
            </h3>
            <p className="text-[11px] text-[var(--lm-text-muted)] mt-1 font-medium">
              Ready for checkout redemptions
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-500 shadow-sm shrink-0">
            <Ticket className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Total Redemptions / Usage */}
      <div className="group relative rounded-3xl border border-[var(--lm-border-default)] bg-[var(--lm-surface-elevated)] glass-card p-5 overflow-hidden transition-all duration-500 hover:shadow-xl hover:border-[var(--lm-accent-border)] hover:-translate-y-1 animate-scale-spring" style={{ animationDelay: "50ms" }}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--lm-text-muted)]">Total Usage / Redemptions</p>
            <h3 className="text-2xl font-black tracking-tight text-[var(--lm-text-primary)] mt-1 tabular-nums">
              {totalRedemptions} <span className="text-xs font-medium text-[var(--lm-text-muted)]">used</span>
            </h3>
            <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold mt-1 flex items-center gap-1">
              <Zap className="w-3 h-3 text-indigo-500" />
              Across all promotional campaigns
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500 shadow-sm shrink-0">
            <Zap className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Revenue Saved for Customers */}
      <div className="group relative rounded-3xl border border-[var(--lm-border-default)] bg-[var(--lm-surface-elevated)] glass-card p-5 overflow-hidden transition-all duration-500 hover:shadow-xl hover:border-[var(--lm-accent-border)] hover:-translate-y-1 animate-scale-spring" style={{ animationDelay: "100ms" }}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--lm-text-muted)]">Total Revenue Saved</p>
            <h3 className="text-2xl font-black tracking-tight text-[var(--lm-text-primary)] mt-1 tabular-nums">
              {formatCurrency(totalSavings)}
            </h3>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              Customer discount incentives
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shadow-sm shrink-0">
            <PiggyBank className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Expired or Inactive Coupons */}
      <div className="group relative rounded-3xl border border-[var(--lm-border-default)] bg-[var(--lm-surface-elevated)] glass-card p-5 overflow-hidden transition-all duration-500 hover:shadow-xl hover:border-[var(--lm-accent-border)] hover:-translate-y-1 animate-scale-spring" style={{ animationDelay: "150ms" }}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--lm-text-muted)]">Expired / Paused</p>
            <h3 className="text-2xl font-black tracking-tight text-[var(--lm-text-primary)] mt-1 tabular-nums">
              {expiredOrInactive.length} <span className="text-xs font-medium text-[var(--lm-text-muted)]">inactive</span>
            </h3>
            <p className="text-[11px] text-[var(--lm-text-muted)] mt-1 font-medium">
              Past validity or toggled off
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 shadow-sm shrink-0">
            <AlertCircle className="w-6 h-6" />
          </div>
        </div>
      </div>
    </div>
  )
}
