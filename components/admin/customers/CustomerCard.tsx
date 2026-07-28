"use client"

import * as React from "react"
import { Crown, ShoppingBag, MapPin, Heart, Star, Tag, ChevronRight, ShieldCheck, Clock, MessageSquare } from "lucide-react"
import { formatCurrency } from "@/lib/format-currency"
import { Badge } from "@/components/ui/badge"

interface CustomerCardProps {
  customer: any
  onOpenProfile: (customer: any) => void
}

export function CustomerCard({ customer, onOpenProfile }: CustomerCardProps) {
  const ltv = customer.totalSpent || 0
  const ordersCount = customer.orders?.length || customer._count?.orders || 0
  const isVip = ltv >= 100000 || ordersCount >= 5

  const initial = (customer.name || customer.email || "C").charAt(0).toUpperCase()
  const defaultAddress = customer.addresses?.find((a: any) => a.isDefault) || customer.addresses?.[0]
  const locationStr = defaultAddress ? `${defaultAddress.city}${defaultAddress.country ? `, ${defaultAddress.country}` : ''}` : "Location N/A"

  // Segment tag
  let segmentLabel = "Standard Client"
  let segmentColor = "bg-neutral-500/10 text-neutral-600 dark:text-neutral-400 border-neutral-500/20"

  if (isVip) {
    segmentLabel = "VIP Elite"
    segmentColor = "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30"
  } else if (ordersCount > 1) {
    segmentLabel = "Repeat Buyer"
    segmentColor = "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30"
  } else if (ordersCount === 1) {
    segmentLabel = "First Buyer"
    segmentColor = "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30"
  }

  const tags = customer.tags || []

  return (
    <div
      onClick={() => onOpenProfile(customer)}
      className={`group relative rounded-3xl border ${isVip ? 'border-amber-500/40 bg-gradient-to-b from-amber-500/5 via-[var(--lm-surface-elevated)] to-[var(--lm-surface-elevated)]' : 'border-[var(--lm-border-default)] bg-[var(--lm-surface-elevated)]'} glass-card p-5 space-y-4 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden animate-scale-spring`}
    >
      {/* Top Header: Avatar, Name, VIP Badge */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative shrink-0">
            {customer.image ? (
              <img src={customer.image} alt={customer.name} className="w-12 h-12 rounded-2xl object-cover border border-[var(--lm-border-default)] shadow-sm" />
            ) : (
              <div className={`w-12 h-12 rounded-2xl ${isVip ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-black' : 'bg-[var(--lm-accent-primary)] text-[var(--lm-text-on-accent)]'} font-black text-lg flex items-center justify-center shadow-md`}>
                {initial}
              </div>
            )}
            {isVip && (
              <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-amber-500 text-black flex items-center justify-center shadow-md">
                <Crown className="w-3 h-3 fill-black" />
              </div>
            )}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h4 className="text-sm font-bold text-[var(--lm-text-primary)] truncate group-hover:text-[var(--lm-accent-text)] transition-colors">
                {customer.name || "Customer Account"}
              </h4>
              {isVip && (
                <span className="px-1.5 py-0.2 rounded-full text-[8px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/40">
                  VIP
                </span>
              )}
            </div>
            <p className="text-[11px] text-[var(--lm-text-muted)] truncate mt-0.5">{customer.email}</p>
          </div>
        </div>

        <div className="p-1.5 rounded-xl bg-[var(--lm-surface-secondary)] group-hover:bg-[var(--lm-accent-muted)] group-hover:text-[var(--lm-accent-text)] text-[var(--lm-text-muted)] transition-colors shrink-0">
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>

      {/* Lifetime Value & Orders Counter */}
      <div className="p-3 rounded-2xl bg-[var(--lm-surface-secondary)] border border-[var(--lm-border-subtle)] flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--lm-text-muted)]">Lifetime Spend</p>
          <p className="text-lg font-black text-[var(--lm-text-primary)] tabular-nums mt-0.5">
            {formatCurrency(ltv)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--lm-text-muted)]">Orders</p>
          <div className="flex items-center gap-1 mt-0.5 justify-end">
            <ShoppingBag className="w-3.5 h-3.5 text-[var(--lm-accent-text)]" />
            <span className="text-sm font-black text-[var(--lm-text-primary)] tabular-nums">{ordersCount}</span>
          </div>
        </div>
      </div>

      {/* Segment Badge & Location */}
      <div className="flex items-center justify-between text-xs pt-1">
        <Badge variant="outline" className={`text-[10px] font-bold rounded-xl ${segmentColor}`}>
          {segmentLabel}
        </Badge>
        <span className="text-[11px] text-[var(--lm-text-muted)] flex items-center gap-1 truncate max-w-[150px]">
          <MapPin className="w-3 h-3 shrink-0" />
          <span className="truncate">{locationStr}</span>
        </span>
      </div>

      {/* Custom Tags & Activity Indicators */}
      <div className="flex items-center justify-between pt-2 border-t border-[var(--lm-border-subtle)] text-[10px] text-[var(--lm-text-muted)]">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1"><Heart className="w-3 h-3 text-rose-500" /> {customer.wishlist?.length || customer._count?.wishlist || 0}</span>
          <span className="flex items-center gap-1"><Star className="w-3 h-3 text-amber-500" /> {customer.reviews?.length || customer._count?.reviews || 0}</span>
          {customer.notes && <span className="flex items-center gap-1 text-purple-500"><MessageSquare className="w-3 h-3" /> Note</span>}
        </div>
        <span className="font-mono">Joined {new Date(customer.createdAt).toLocaleDateString("en-US", { month: "short", year: "2-digit" })}</span>
      </div>
    </div>
  )
}
