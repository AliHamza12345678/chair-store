"use client"

import * as React from "react"
import { BarChart3, Percent, DollarSign, Award, Flame, Zap } from "lucide-react"
import { formatCurrency } from "@/lib/format-currency"

interface CouponAnalyticsChartsProps {
  coupons: any[]
}

export function CouponAnalyticsCharts({ coupons }: CouponAnalyticsChartsProps) {
  const totalCoupons = coupons.length || 1

  // Percentage vs Fixed Amount count
  const percentageCoupons = coupons.filter(c => c.type === "PERCENTAGE")
  const fixedCoupons = coupons.filter(c => c.type === "FIXED")

  const percentageShare = Math.round((percentageCoupons.length / totalCoupons) * 100)
  const fixedShare = 100 - percentageShare

  // Sort coupons by redemptions / used count
  const topCoupons = [...coupons]
    .sort((a, b) => (b.usedCount || 0) - (a.usedCount || 0))
    .slice(0, 4)

  const maxRedemptions = Math.max(...topCoupons.map(c => c.usedCount || 0), 1)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* 1. Discount Type Distribution */}
      <div className="rounded-3xl border border-[var(--lm-border-default)] bg-[var(--lm-surface-elevated)] glass-card p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500">
              <Percent className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[var(--lm-text-primary)]">Discount Type Distribution</h4>
              <p className="text-[10px] text-[var(--lm-text-muted)]">Percentage vs Fixed Amount Promos</p>
            </div>
          </div>
          <span className="text-[10px] font-bold text-indigo-500 bg-indigo-500/10 px-2 py-0.5 rounded-full">
            {coupons.length} Total Codes
          </span>
        </div>

        {/* Visual Progress Split Bar */}
        <div className="space-y-3 pt-2">
          <div className="w-full h-3 rounded-full bg-[var(--lm-surface-secondary)] overflow-hidden flex">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-l-full transition-all duration-700"
              style={{ width: `${percentageShare}%` }}
              title={`Percentage: ${percentageShare}%`}
            />
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-r-full transition-all duration-700"
              style={{ width: `${fixedShare}%` }}
              title={`Fixed Amount: ${fixedShare}%`}
            />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="p-3 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 text-xs">
              <div className="flex items-center gap-1.5 text-indigo-500 font-bold">
                <Percent className="w-3.5 h-3.5" />
                <span>Percentage (%)</span>
              </div>
              <p className="text-lg font-black text-[var(--lm-text-primary)] mt-1 tabular-nums">{percentageCoupons.length} <span className="text-[10px] text-[var(--lm-text-muted)]">({percentageShare}%)</span></p>
            </div>

            <div className="p-3 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 text-xs">
              <div className="flex items-center gap-1.5 text-emerald-500 font-bold">
                <DollarSign className="w-3.5 h-3.5" />
                <span>Fixed Amount (PKR)</span>
              </div>
              <p className="text-lg font-black text-[var(--lm-text-primary)] mt-1 tabular-nums">{fixedCoupons.length} <span className="text-[10px] text-[var(--lm-text-muted)]">({fixedShare}%)</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Top Performing Promo Codes */}
      <div className="lg:col-span-2 rounded-3xl border border-[var(--lm-border-default)] bg-[var(--lm-surface-elevated)] glass-card p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[var(--lm-text-primary)]">Most Redeemed Promo Codes</h4>
              <p className="text-[10px] text-[var(--lm-text-muted)]">Campaign Leaderboard by Customer Redemptions</p>
            </div>
          </div>
          <span className="text-[10px] font-mono text-[var(--lm-text-muted)]">Leaderboard</span>
        </div>

        {/* Top 4 Coupons Progress Bar List */}
        <div className="space-y-3 pt-1">
          {topCoupons.length === 0 ? (
            <p className="text-xs text-[var(--lm-text-muted)] italic py-4 text-center">No coupon usage recorded yet.</p>
          ) : (
            topCoupons.map((c, i) => {
              const pct = Math.round(((c.usedCount || 0) / maxRedemptions) * 100)
              const discountText = c.type === "PERCENTAGE" ? `${c.value}% OFF` : `${formatCurrency(c.value)} OFF`

              return (
                <div key={c.id || i} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-lg bg-[var(--lm-accent-muted)] text-[var(--lm-accent-text)] font-bold text-[10px] flex items-center justify-center">
                        #{i + 1}
                      </span>
                      <span className="font-mono font-bold text-[var(--lm-text-primary)]">{c.code}</span>
                      <span className="text-[10px] px-2 py-0.2 rounded-md bg-[var(--lm-surface-secondary)] text-[var(--lm-text-muted)] font-semibold">
                        {discountText}
                      </span>
                    </div>
                    <span className="font-mono font-bold text-[var(--lm-text-primary)]">{c.usedCount || 0} redemptions</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[var(--lm-surface-secondary)] overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-700"
                      style={{ width: `${Math.max(pct, 8)}%` }}
                    />
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
