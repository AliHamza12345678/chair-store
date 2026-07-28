"use client"

import * as React from "react"
import { Copy, Check, Edit3, Trash2, Calendar, ShieldCheck, Ticket, Percent, DollarSign, Clock, Sparkles } from "lucide-react"
import { formatCurrency } from "@/lib/format-currency"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

interface CouponCardProps {
  coupon: any
  onEdit: (coupon: any) => void
  onDelete: (id: string) => void
}

export function CouponCard({ coupon, onEdit, onDelete }: CouponCardProps) {
  const [copied, setCopied] = React.useState(false)

  const handleCopyCode = (e: React.MouseEvent) => {
    e.stopPropagation()
    navigator.clipboard.writeText(coupon.code)
    setCopied(true)
    toast.success(`Coupon code ${coupon.code} copied to clipboard!`)
    setTimeout(() => setCopied(false), 2000)
  }

  const now = new Date()
  const isExpired = coupon.expiresAt && new Date(coupon.expiresAt) < now
  const isLive = coupon.isActive && !isExpired

  const discountDisplay = coupon.type === "PERCENTAGE" ? `${coupon.value}% OFF` : `${formatCurrency(coupon.value)} OFF`

  const usagePercent = coupon.usageLimit
    ? Math.min(100, Math.round(((coupon.usedCount || 0) / coupon.usageLimit) * 100))
    : 0

  return (
    <div className={`group relative rounded-3xl border ${isLive ? 'border-[var(--lm-border-default)] hover:border-[var(--lm-accent-border)] bg-[var(--lm-surface-elevated)]' : 'border-rose-500/20 bg-[var(--lm-surface-secondary)]/50 opacity-80'} glass-card p-5 space-y-4 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden animate-scale-spring flex flex-col justify-between`}>
      {/* Top Header: Code Badge + Status */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-xl bg-[var(--lm-accent-muted)] border border-[var(--lm-accent-border)] text-[var(--lm-accent-text)] font-mono font-black text-sm tracking-wider flex items-center gap-1.5 shadow-sm">
              <Ticket className="w-3.5 h-3.5" />
              {coupon.code}
            </span>
            <button
              onClick={handleCopyCode}
              className="p-1.5 rounded-xl hover:bg-[var(--lm-surface-hover)] text-[var(--lm-text-muted)] hover:text-[var(--lm-text-primary)] transition-colors"
              title="Copy Code"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
          {coupon.description && (
            <p className="text-[11px] text-[var(--lm-text-muted)] mt-1.5 line-clamp-1">{coupon.description}</p>
          )}
        </div>

        {/* Live Status Badge */}
        {isLive ? (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            Active
          </span>
        ) : (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30 shrink-0">
            {isExpired ? "Expired" : "Inactive"}
          </span>
        )}
      </div>

      {/* Main Discount Amount Hero */}
      <div className="p-3.5 rounded-2xl bg-[var(--lm-surface-secondary)] border border-[var(--lm-border-subtle)] flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--lm-text-muted)]">Discount Value</p>
          <p className="text-xl font-black text-[var(--lm-text-primary)] mt-0.5 tabular-nums">
            {discountDisplay}
          </p>
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${coupon.type === 'PERCENTAGE' ? 'bg-indigo-500/15 text-indigo-500 border border-indigo-500/20' : 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/20'}`}>
          {coupon.type === 'PERCENTAGE' ? <Percent className="w-5 h-5" /> : <DollarSign className="w-5 h-5" />}
        </div>
      </div>

      {/* Constraints & Caps Tags */}
      <div className="flex flex-wrap gap-1.5 text-[10px]">
        {coupon.minOrderValue && (
          <span className="px-2 py-0.5 rounded-lg bg-[var(--lm-surface-secondary)] border border-[var(--lm-border-subtle)] text-[var(--lm-text-secondary)] font-medium">
            Min Order: <strong className="text-[var(--lm-text-primary)]">{formatCurrency(coupon.minOrderValue)}</strong>
          </span>
        )}
        {coupon.maxDiscount && (
          <span className="px-2 py-0.5 rounded-lg bg-[var(--lm-surface-secondary)] border border-[var(--lm-border-subtle)] text-[var(--lm-text-secondary)] font-medium">
            Max Cap: <strong className="text-[var(--lm-text-primary)]">{formatCurrency(coupon.maxDiscount)}</strong>
          </span>
        )}
      </div>

      {/* Usage Limit Progress Bar */}
      <div className="space-y-1 pt-1">
        <div className="flex justify-between items-center text-[10px]">
          <span className="text-[var(--lm-text-muted)] font-medium">Redemptions Used:</span>
          <span className="font-bold text-[var(--lm-text-primary)] tabular-nums">
            {coupon.usedCount} {coupon.usageLimit ? `/ ${coupon.usageLimit}` : "used (unlimited)"}
          </span>
        </div>
        {coupon.usageLimit ? (
          <div className="w-full h-1.5 rounded-full bg-[var(--lm-surface-secondary)] overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${usagePercent >= 100 ? 'bg-rose-500' : 'bg-[var(--lm-accent-primary)]'}`}
              style={{ width: `${usagePercent}%` }}
            />
          </div>
        ) : (
          <div className="w-full h-1.5 rounded-full bg-emerald-500/30" />
        )}
      </div>

      {/* Footer: Date Range + Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-[var(--lm-border-subtle)] text-[10px]">
        <span className="text-[var(--lm-text-muted)] flex items-center gap-1 font-mono">
          <Calendar className="w-3 h-3 text-[var(--lm-accent-text)]" />
          {coupon.expiresAt ? `Expires ${new Date(coupon.expiresAt).toLocaleDateString()}` : "No expiry date"}
        </span>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(coupon)}
            className="p-1.5 rounded-lg hover:bg-[var(--lm-surface-hover)] text-blue-500 hover:text-blue-600 transition-colors"
            title="Edit Coupon"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(coupon.id)}
            className="p-1.5 rounded-lg hover:bg-rose-500/10 text-rose-500 hover:text-rose-600 transition-colors"
            title="Delete Coupon"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
