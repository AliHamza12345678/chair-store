"use client"

import * as React from "react"
import { Users, Crown, RefreshCw, Heart, Star, TrendingUp, Sparkles } from "lucide-react"
import { formatCurrency } from "@/lib/format-currency"

interface CustomerMetricsProps {
  customers: any[]
}

export function CustomerMetrics({ customers }: CustomerMetricsProps) {
  const totalCustomers = customers.length
  
  // High value VIPs (> 100k LTV or 5+ orders)
  const vipCustomers = customers.filter(c => {
    const ltv = c.totalSpent || 0
    const ordersCount = c.orders?.length || c._count?.orders || 0
    return ltv >= 100000 || ordersCount >= 5
  })
  
  const totalVIPs = vipCustomers.length
  const totalVipSpend = vipCustomers.reduce((sum, c) => sum + (c.totalSpent || 0), 0)
  const avgVipLtv = totalVIPs > 0 ? totalVipSpend / totalVIPs : 0

  // Repeat buyers (> 1 order)
  const repeatBuyers = customers.filter(c => (c.orders?.length || c._count?.orders || 0) > 1)
  const repeatRate = totalCustomers > 0 ? Math.round((repeatBuyers.length / totalCustomers) * 100) : 0

  // Total Wishlist & Review activity across customer base
  const totalWishlistItems = customers.reduce((sum, c) => sum + (c.wishlist?.length || c._count?.wishlist || 0), 0)
  const totalReviews = customers.reduce((sum, c) => sum + (c.reviews?.length || c._count?.reviews || 0), 0)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Card 1: Total Customer Base */}
      <div className="group relative rounded-3xl border border-[var(--lm-border-default)] bg-[var(--lm-surface-elevated)] glass-card p-5 overflow-hidden transition-all duration-500 hover:shadow-xl hover:border-[var(--lm-accent-border)] hover:-translate-y-1 animate-scale-spring">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--lm-text-muted)]">Total Accounts</p>
            <h3 className="text-2xl font-black tracking-tight text-[var(--lm-text-primary)] mt-1 tabular-nums">
              {totalCustomers}
            </h3>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              +12% new clients this month
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[var(--lm-accent-muted)] border border-[var(--lm-accent-border)] flex items-center justify-center text-[var(--lm-accent-text)] shadow-sm shrink-0">
            <Users className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Card 2: VIP High-Value Spenders */}
      <div className="group relative rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-500/5 via-[var(--lm-surface-elevated)] to-[var(--lm-surface-elevated)] glass-card p-5 overflow-hidden transition-all duration-500 hover:shadow-xl hover:border-amber-500/50 hover:-translate-y-1 animate-scale-spring" style={{ animationDelay: "50ms" }}>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">VIP Tier Clients</p>
              <Sparkles className="w-3 h-3 text-amber-500" />
            </div>
            <h3 className="text-2xl font-black tracking-tight text-[var(--lm-text-primary)] mt-1 tabular-nums">
              {totalVIPs} <span className="text-xs font-medium text-[var(--lm-text-muted)]">clients</span>
            </h3>
            <p className="text-[11px] text-[var(--lm-text-muted)] mt-1 font-medium">
              Avg VIP LTV: <span className="font-bold text-amber-600 dark:text-amber-400 tabular-nums">{formatCurrency(avgVipLtv)}</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500 shadow-sm shrink-0">
            <Crown className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Card 3: Repeat Purchase Rate */}
      <div className="group relative rounded-3xl border border-[var(--lm-border-default)] bg-[var(--lm-surface-elevated)] glass-card p-5 overflow-hidden transition-all duration-500 hover:shadow-xl hover:border-[var(--lm-accent-border)] hover:-translate-y-1 animate-scale-spring" style={{ animationDelay: "100ms" }}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--lm-text-muted)]">Repeat Buyer Rate</p>
            <h3 className="text-2xl font-black tracking-tight text-[var(--lm-text-primary)] mt-1 tabular-nums">
              {repeatRate}%
            </h3>
            <p className="text-[11px] text-[var(--lm-text-muted)] mt-1 font-medium">
              <span className="font-bold text-indigo-500">{repeatBuyers.length}</span> multi-order accounts
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500 shadow-sm shrink-0">
            <RefreshCw className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Card 4: Customer Engagement Index */}
      <div className="group relative rounded-3xl border border-[var(--lm-border-default)] bg-[var(--lm-surface-elevated)] glass-card p-5 overflow-hidden transition-all duration-500 hover:shadow-xl hover:border-[var(--lm-accent-border)] hover:-translate-y-1 animate-scale-spring" style={{ animationDelay: "150ms" }}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--lm-text-muted)]">Engagement Signals</p>
            <h3 className="text-2xl font-black tracking-tight text-[var(--lm-text-primary)] mt-1 tabular-nums">
              {totalWishlistItems + totalReviews}
            </h3>
            <p className="text-[11px] text-[var(--lm-text-muted)] mt-1 font-medium flex items-center gap-2">
              <span className="flex items-center gap-0.5 text-rose-500"><Heart className="w-3 h-3 fill-rose-500/20" /> {totalWishlistItems}</span> • 
              <span className="flex items-center gap-0.5 text-amber-500"><Star className="w-3 h-3 fill-amber-500/20" /> {totalReviews}</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 shadow-sm shrink-0">
            <Heart className="w-6 h-6" />
          </div>
        </div>
      </div>
    </div>
  )
}
