"use client"

import * as React from "react"
import { OrderMetrics } from "@/components/admin/orders/OrderMetrics"
import { OrderAnalyticsCharts } from "@/components/admin/orders/OrderAnalyticsCharts"
import { LiveOrdersStream } from "@/components/admin/orders/LiveOrdersStream"
import { OrderTable } from "@/components/admin/orders/OrderTable"
import { ShoppingBag, Sparkles } from "lucide-react"

interface OrdersClientProps {
  orders: any[]
}

export function OrdersClient({ orders }: OrdersClientProps) {
  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--lm-border-default)] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[var(--lm-accent-muted)] text-[var(--lm-accent-text)] border border-[var(--lm-accent-border)] uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Stripe Enterprise Suite
            </span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-[var(--lm-text-primary)] mt-2">
            Orders & Fulfillment Management
          </h1>
          <p className="text-xs text-[var(--lm-text-muted)] mt-1">
            Monitor transactions, analyze revenue streams, manage logistics tracking, issue refunds, and generate official customer invoices.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-2xl bg-[var(--lm-surface-elevated)] border border-[var(--lm-border-default)] glass-card flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-[var(--lm-text-secondary)]">Live Sync Active</span>
          </div>
        </div>
      </div>

      {/* 1. Revenue & Performance Cards */}
      <OrderMetrics orders={orders} />

      {/* 2. Visualizations & Activity Stream */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div className="xl:col-span-3">
          <OrderAnalyticsCharts orders={orders} />
        </div>
        <div className="xl:col-span-1">
          <LiveOrdersStream orders={orders} />
        </div>
      </div>

      {/* 3. Interactive Order Table & Management */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-[var(--lm-text-primary)] tracking-tight flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-[var(--lm-accent-text)]" />
            Customer Orders Directory ({orders.length})
          </h2>
        </div>
        <OrderTable orders={orders} />
      </div>
    </div>
  )
}
