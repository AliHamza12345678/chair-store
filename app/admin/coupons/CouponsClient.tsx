"use client"

import * as React from "react"
import { CouponMetrics } from "@/components/admin/coupons/CouponMetrics"
import { CouponAnalyticsCharts } from "@/components/admin/coupons/CouponAnalyticsCharts"
import { CouponDirectory } from "@/components/admin/coupons/CouponDirectory"
import { Ticket, Sparkles, Tag } from "lucide-react"

interface CouponsClientProps {
  coupons: any[]
}

export function CouponsClient({ coupons }: CouponsClientProps) {
  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--lm-border-default)] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[var(--lm-accent-muted)] text-[var(--lm-accent-text)] border border-[var(--lm-accent-border)] uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Promotions & Voucher Suite
            </span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-[var(--lm-text-primary)] mt-2">
            Coupons & Promotional Campaigns
          </h1>
          <p className="text-xs text-[var(--lm-text-muted)] mt-1">
            Create percentage & fixed-amount discount codes, set usage limits, track revenue savings, and monitor campaign performance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-2xl bg-[var(--lm-surface-elevated)] border border-[var(--lm-border-default)] glass-card flex items-center gap-2">
            <Ticket className="w-4 h-4 text-[var(--lm-accent-text)]" />
            <span className="text-xs font-semibold text-[var(--lm-text-secondary)]">{coupons.length} Active Codes</span>
          </div>
        </div>
      </div>

      {/* 1. Revenue & Usage Metrics */}
      <CouponMetrics coupons={coupons} />

      {/* 2. Coupon Analytics Charts */}
      <CouponAnalyticsCharts coupons={coupons} />

      {/* 3. Coupon Cards Grid & Modern Table Directory */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-[var(--lm-text-primary)] tracking-tight flex items-center gap-2">
            <Tag className="w-4 h-4 text-[var(--lm-accent-text)]" />
            Promotional Codes Directory ({coupons.length})
          </h2>
        </div>

        <CouponDirectory coupons={coupons} />
      </div>
    </div>
  )
}
