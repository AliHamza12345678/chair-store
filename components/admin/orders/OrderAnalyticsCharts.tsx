"use client"

import * as React from "react"
import { BarChart3, Globe, Filter, TrendingUp } from "lucide-react"

interface OrderAnalyticsChartsProps {
  orders: any[]
}

export function OrderAnalyticsCharts({ orders }: OrderAnalyticsChartsProps) {
  // Compute Funnel Counts
  const total = orders.length || 1
  const paidCount = orders.filter(o => o.isPaid || o.status !== "PENDING").length
  const processingCount = orders.filter(o => o.status === "PROCESSING" || o.status === "SHIPPED" || o.status === "DELIVERED").length
  const shippedCount = orders.filter(o => o.status === "SHIPPED" || o.status === "DELIVERED").length
  const deliveredCount = orders.filter(o => o.status === "DELIVERED").length

  // Country Breakdown
  const countryMap: Record<string, number> = {}
  orders.forEach(o => {
    const country = o.address?.country || "Pakistan"
    countryMap[country] = (countryMap[country] || 0) + 1
  })
  
  const countries = Object.entries(countryMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  if (countries.length === 0) {
    countries.push(["Pakistan", orders.length || 1])
  }

  // Simulated daily sales bars (last 7 intervals)
  const salesBars = [
    { label: "Mon", val: 35, amount: "₨120k" },
    { label: "Tue", val: 55, amount: "₨180k" },
    { label: "Wed", val: 40, amount: "₨140k" },
    { label: "Thu", val: 80, amount: "₨290k" },
    { label: "Fri", val: 65, amount: "₨210k" },
    { label: "Sat", val: 95, amount: "₨340k" },
    { label: "Sun", val: 75, amount: "₨260k" },
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Sales Trend Bar Chart */}
      <div className="rounded-3xl border border-[var(--lm-border-default)] bg-[var(--lm-surface-elevated)] glass-card p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[var(--lm-text-primary)]">Sales & Revenue Trend</h4>
              <p className="text-[10px] text-[var(--lm-text-muted)]">7-Day Order Volume Breakdown</p>
            </div>
          </div>
          <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
            +18% Peak
          </span>
        </div>

        {/* Custom Bar Visualization */}
        <div className="h-32 flex items-end justify-between gap-2 pt-4">
          {salesBars.map((bar, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1.5 group">
              <div className="relative w-full bg-[var(--lm-surface-secondary)] rounded-t-xl overflow-hidden flex items-end h-24">
                <div
                  className="w-full bg-[var(--lm-accent-primary)] rounded-t-xl transition-all duration-700 group-hover:brightness-110"
                  style={{ height: `${bar.val}%` }}
                />
              </div>
              <span className="text-[10px] font-medium text-[var(--lm-text-muted)]">{bar.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Country Geographic Distribution */}
      <div className="rounded-3xl border border-[var(--lm-border-default)] bg-[var(--lm-surface-elevated)] glass-card p-5 space-y-4 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
            <Globe className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[var(--lm-text-primary)]">Geographic Orders Distribution</h4>
            <p className="text-[10px] text-[var(--lm-text-muted)]">Top Customer Shipping Destinations</p>
          </div>
        </div>

        <div className="space-y-3 pt-1">
          {countries.map(([country, count], i) => {
            const pct = Math.round((count / total) * 100)
            return (
              <div key={i} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-[var(--lm-text-primary)]">{country}</span>
                  <span className="text-[10px] text-[var(--lm-text-muted)] font-mono">{count} orders ({pct}%)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[var(--lm-surface-secondary)] overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all duration-700"
                    style={{ width: `${Math.max(pct, 12)}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Order Fulfillment Funnel */}
      <div className="rounded-3xl border border-[var(--lm-border-default)] bg-[var(--lm-surface-elevated)] glass-card p-5 space-y-4 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500">
            <Filter className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[var(--lm-text-primary)]">Order Fulfillment Funnel</h4>
            <p className="text-[10px] text-[var(--lm-text-muted)]">Lifecycle Step Conversion</p>
          </div>
        </div>

        <div className="space-y-2.5 pt-1">
          {[
            { label: "Orders Placed", count: total, color: "bg-neutral-500" },
            { label: "Payment Verified", count: paidCount, color: "bg-indigo-500" },
            { label: "Processing", count: processingCount, color: "bg-amber-500" },
            { label: "Shipped", count: shippedCount, color: "bg-blue-500" },
            { label: "Delivered", count: deliveredCount, color: "bg-emerald-500" },
          ].map((step, i) => {
            const percentage = Math.round((step.count / total) * 100)
            return (
              <div key={i} className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-medium text-[var(--lm-text-secondary)]">{step.label}</span>
                  <span className="font-bold text-[var(--lm-text-primary)] tabular-nums">{step.count} ({percentage}%)</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[var(--lm-surface-secondary)] overflow-hidden">
                  <div
                    className={`h-full ${step.color} rounded-full transition-all duration-700`}
                    style={{ width: `${Math.max(percentage, 5)}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
