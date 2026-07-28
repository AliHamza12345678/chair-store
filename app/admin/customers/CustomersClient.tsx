"use client"

import * as React from "react"
import { CustomerMetrics } from "@/components/admin/customers/CustomerMetrics"
import { CustomerDirectory } from "@/components/admin/customers/CustomerDirectory"
import { Users, Sparkles, ShieldCheck } from "lucide-react"

interface CustomersClientProps {
  customers: any[]
}

export function CustomersClient({ customers }: CustomersClientProps) {
  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--lm-border-default)] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-purple-500" />
              Apple CRM Intelligence Suite
            </span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-[var(--lm-text-primary)] mt-2">
            Enterprise Customer Relationship Management
          </h1>
          <p className="text-xs text-[var(--lm-text-muted)] mt-1">
            Track customer lifetime value, analyze 52-week activity heatmaps, manage VIP tiers, audit purchase timelines, and record internal staff notes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-2xl bg-[var(--lm-surface-elevated)] border border-[var(--lm-border-default)] glass-card flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-semibold text-[var(--lm-text-secondary)]">{customers.length} Client Profiles Syncing</span>
          </div>
        </div>
      </div>

      {/* 1. Customer Metrics Overview */}
      <CustomerMetrics customers={customers} />

      {/* 2. Customer Directory (Cards & Table with Filters & CRM Drawer) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-[var(--lm-text-primary)] tracking-tight flex items-center gap-2">
            <Users className="w-4 h-4 text-[var(--lm-accent-text)]" />
            Client Directory & Segments
          </h2>
        </div>

        <CustomerDirectory customers={customers} />
      </div>
    </div>
  )
}
