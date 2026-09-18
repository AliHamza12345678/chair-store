"use client"

import * as React from "react"
import { CheckCircle2, Circle, Clock, ShoppingBag, Star, Heart, MapPin, Sparkles, TrendingUp, Calendar } from "lucide-react"
import { formatCurrency } from "@/lib/format-currency"

interface CustomerJourneyTabProps {
  customer: any
}

export function CustomerJourneyTab({ customer }: CustomerJourneyTabProps) {
  const ltv = customer.totalSpent || 0
  const ordersCount = customer.orders?.length || 0
  const reviewsCount = customer.reviews?.length || 0
  const wishlistCount = customer.wishlist?.length || 0
  const isVip = ltv >= 100000 || ordersCount >= 5

  // Journey Steps
  const journeySteps = [
    { label: "Account Registered", desc: new Date(customer.createdAt).toLocaleDateString(), done: true },
    { label: "First Purchase", desc: ordersCount >= 1 ? `Placed 1st order` : "Pending first purchase", done: ordersCount >= 1 },
    { label: "Repeat Loyalty", desc: ordersCount >= 2 ? `${ordersCount} total orders` : "Single order customer", done: ordersCount >= 2 },
    { label: "VIP Status Unlocked", desc: isVip ? "Qualified for VIP tier" : "Target: ₨100k LTV", done: isVip },
  ]

  // Simulated 52-week activity heatmap (12 months x 4 weeks)
  const weeks = Array.from({ length: 52 }, (_, i) => {
    // Generate activity level 0-4 based on order dates or deterministic hash
    const hasOrder = ordersCount > 0 && (i % Math.max(1, Math.floor(52 / ordersCount)) === 0)
    const hasReview = reviewsCount > 0 && (i % 7 === 0)
    const level = hasOrder ? (i % 2 === 0 ? 3 : 4) : hasReview ? 2 : (i % 9 === 0) ? 1 : 0
    return { weekIndex: i, level }
  })

  // Timeline events array sorted by date
  const events: any[] = []

  // Add Account Creation
  events.push({
    type: "account",
    title: "Account Created",
    desc: `Registered with email ${customer.email}`,
    date: new Date(customer.createdAt),
    icon: Calendar,
    color: "bg-blue-500/15 text-blue-500",
  })

  // Add Orders
  ;(customer.orders || []).forEach((o: any) => {
    events.push({
      type: "order",
      title: `Order #${o.id.slice(-8)} Placed`,
      desc: `Total: ${formatCurrency(o.total)} • Status: ${o.status}`,
      date: new Date(o.createdAt),
      icon: ShoppingBag,
      color: "bg-emerald-500/15 text-emerald-500",
    })
  })

  // Add Reviews
  ;(customer.reviews || []).forEach((r: any) => {
    events.push({
      type: "review",
      title: `Reviewed Product: ${r.product?.name || "Product"}`,
      desc: `Rating: ${r.rating}/5 stars — "${r.comment?.slice(0, 60)}..."`,
      date: new Date(r.createdAt),
      icon: Star,
      color: "bg-amber-500/15 text-amber-500",
    })
  })

  // Sort events newest first
  events.sort((a, b) => b.date.getTime() - a.date.getTime())

  return (
    <div className="space-y-6">
      {/* 1. Customer Journey Pipeline Tracker */}
      <div className="p-5 rounded-3xl border border-[var(--lm-border-default)] bg-[var(--lm-surface-elevated)] glass-card space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[var(--lm-accent-muted)] text-[var(--lm-accent-text)]">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-[var(--lm-text-primary)] uppercase tracking-wider">Customer Lifecycle Pipeline</h4>
          </div>
          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
            {isVip ? "VIP Tier Achieved" : ordersCount >= 2 ? "Repeat Customer" : ordersCount === 1 ? "Active Customer" : "Lead"}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
          {journeySteps.map((step, i) => (
            <div
              key={i}
              className={`p-3 rounded-2xl border ${step.done ? 'border-emerald-500/30 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400' : 'border-[var(--lm-border-default)] bg-[var(--lm-surface-secondary)] text-[var(--lm-text-muted)]'} flex flex-col justify-between space-y-2`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase">Step 0{i + 1}</span>
                {step.done ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Circle className="w-4 h-4 text-[var(--lm-text-muted)]" />}
              </div>
              <div>
                <p className="text-xs font-bold text-[var(--lm-text-primary)]">{step.label}</p>
                <p className="text-[10px] text-[var(--lm-text-muted)] mt-0.5">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. 52-Week Engagement Heatmap */}
      <div className="p-5 rounded-3xl border border-[var(--lm-border-default)] bg-[var(--lm-surface-elevated)] glass-card space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[var(--lm-text-primary)] uppercase tracking-wider">Annual Activity & Purchase Heatmap</h4>
              <p className="text-[10px] text-[var(--lm-text-muted)]">52-Week interaction intensity profile</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-[9px] text-[var(--lm-text-muted)] font-mono">
            <span>Less</span>
            <div className="w-2.5 h-2.5 rounded bg-[var(--lm-surface-secondary)]" />
            <div className="w-2.5 h-2.5 rounded bg-emerald-500/30" />
            <div className="w-2.5 h-2.5 rounded bg-emerald-500/60" />
            <div className="w-2.5 h-2.5 rounded bg-emerald-500" />
            <span>More</span>
          </div>
        </div>

        {/* Heatmap Grid */}
        <div className="overflow-x-auto custom-scrollbar pt-2">
          <div className="grid grid-rows-4 grid-flow-col gap-1.5 min-w-[500px]">
            {weeks.map((w) => {
              const bgClass =
                w.level === 4
                  ? "bg-emerald-500 shadow-sm"
                  : w.level === 3
                  ? "bg-emerald-500/70"
                  : w.level === 2
                  ? "bg-emerald-500/40"
                  : w.level === 1
                  ? "bg-emerald-500/20"
                  : "bg-[var(--lm-surface-secondary)]"

              return (
                <div
                  key={w.weekIndex}
                  title={`Week ${w.weekIndex + 1}: Activity Level ${w.level}`}
                  className={`w-3.5 h-3.5 rounded-sm ${bgClass} transition-transform hover:scale-125 cursor-pointer`}
                />
              )
            })}
          </div>
        </div>
      </div>

      {/* 3. Chronological Activity Stream Timeline */}
      <div className="p-5 rounded-3xl border border-[var(--lm-border-default)] bg-[var(--lm-surface-elevated)] glass-card space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500">
              <Clock className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-[var(--lm-text-primary)] uppercase tracking-wider">Customer Audit Timeline</h4>
          </div>
          <span className="text-[10px] text-[var(--lm-text-muted)] font-mono">{events.length} events logged</span>
        </div>

        <div className="relative space-y-4 pl-4 pt-1">
          <div className="absolute top-2 bottom-2 left-6 w-0.5 bg-[var(--lm-border-default)]" />

          {events.map((ev, i) => {
            const Icon = ev.icon
            return (
              <div key={i} className="flex items-start gap-4 relative z-10">
                <div className={`w-8 h-8 rounded-xl ${ev.color} border border-current/20 flex items-center justify-center shrink-0 shadow-sm`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0 p-3 rounded-2xl bg-[var(--lm-surface-secondary)] border border-[var(--lm-border-subtle)]">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-[var(--lm-text-primary)]">{ev.title}</p>
                    <span className="text-[10px] text-[var(--lm-text-muted)] font-mono">{ev.date.toLocaleDateString()}</span>
                  </div>
                  <p className="text-[11px] text-[var(--lm-text-muted)] mt-0.5">{ev.desc}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
