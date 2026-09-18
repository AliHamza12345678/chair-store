"use client"

import * as React from "react"
import { useState, useMemo } from "react"
import { Search, LayoutGrid, List, Plus, Ticket, Copy, Check, Edit3, Trash2, X, Percent, DollarSign } from "lucide-react"
import { formatCurrency } from "@/lib/format-currency"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { deleteCoupon } from "@/features/coupons/actions"
import { CouponCard } from "./CouponCard"
import { CouponModal } from "./CouponModal"

interface CouponDirectoryProps {
  coupons: any[]
}

type FilterType = "ALL" | "ACTIVE" | "EXPIRED" | "PERCENTAGE" | "FIXED"
type ViewMode = "grid" | "table"

export function CouponDirectory({ coupons }: CouponDirectoryProps) {
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [selectedFilter, setSelectedFilter] = useState<FilterType>("ALL")
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [editingCoupon, setEditingCoupon] = useState<any | null>(null)
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null)

  const now = new Date()

  // Compute filter counts
  const filterCounts = useMemo(() => {
    let active = 0
    let expired = 0
    let percentage = 0
    let fixed = 0

    coupons.forEach(c => {
      const isExp = c.expiresAt && new Date(c.expiresAt) < now
      const isAct = c.isActive && !isExp

      if (isAct) active++
      if (!c.isActive || isExp) expired++
      if (c.type === "PERCENTAGE") percentage++
      if (c.type === "FIXED") fixed++
    })

    return {
      ALL: coupons.length,
      ACTIVE: active,
      EXPIRED: expired,
      PERCENTAGE: percentage,
      FIXED: fixed,
    }
  }, [coupons, now])

  // Filtered coupons list
  const filteredCoupons = useMemo(() => {
    return coupons.filter(c => {
      const isExp = c.expiresAt && new Date(c.expiresAt) < now
      const isAct = c.isActive && !isExp

      if (selectedFilter === "ACTIVE" && !isAct) return false
      if (selectedFilter === "EXPIRED" && isAct) return false
      if (selectedFilter === "PERCENTAGE" && c.type !== "PERCENTAGE") return false
      if (selectedFilter === "FIXED" && c.type !== "FIXED") return false

      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        const matchCode = (c.code || "").toLowerCase().includes(q)
        const matchDesc = (c.description || "").toLowerCase().includes(q)
        const matchValue = String(c.value).includes(q)

        if (!matchCode && !matchDesc && !matchValue) return false
      }

      return true
    })
  }, [coupons, selectedFilter, searchQuery, now])

  const handleOpenNew = () => {
    setEditingCoupon(null)
    setIsModalOpen(true)
  }

  const handleOpenEdit = (coupon: any) => {
    setEditingCoupon(coupon)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this promotional coupon?")) return
    const t = toast.loading("Deleting promo coupon...")
    try {
      const res = await deleteCoupon(id)
      if (res.success) {
        toast.success("Coupon deleted successfully", { id: t })
      } else {
        toast.error(res.error || "Failed to delete coupon", { id: t })
      }
    } catch {
      toast.error("Error deleting coupon", { id: t })
    }
  }

  const handleCopyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCodeId(id)
    toast.success(`Code ${code} copied to clipboard!`)
    setTimeout(() => setCopiedCodeId(null), 2000)
  }

  return (
    <div className="space-y-5">
      {/* Search, Filter Pills & Add Button Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-3.5 rounded-3xl border border-[var(--lm-border-default)] bg-[var(--lm-surface-elevated)] glass-card shadow-sm">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--lm-text-muted)]" />
          <input
            type="text"
            placeholder="Search coupons by code, description, or value..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-8 rounded-2xl border border-[var(--lm-border-default)] bg-[var(--lm-surface-primary)] text-xs text-[var(--lm-text-primary)] placeholder:text-[var(--lm-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--lm-accent-primary)]/40 transition-all"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--lm-text-muted)] hover:text-[var(--lm-text-primary)]">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 overflow-x-auto custom-scrollbar p-1">
          {[
            { id: "ALL", label: "All Coupons" },
            { id: "ACTIVE", label: "Active" },
            { id: "EXPIRED", label: "Expired / Paused" },
            { id: "PERCENTAGE", label: "Percentage (%)" },
            { id: "FIXED", label: "Fixed Amount (PKR)" },
          ].map(f => {
            const isActive = selectedFilter === f.id
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setSelectedFilter(f.id as FilterType)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 flex items-center gap-1.5 transition-all duration-300 ${isActive ? 'bg-[var(--lm-accent-primary)] text-[var(--lm-text-on-accent)] shadow-md' : 'text-[var(--lm-text-muted)] hover:bg-[var(--lm-surface-hover)]'}`}
              >
                <span>{f.label}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-bold ${isActive ? 'bg-black/20 text-white' : 'bg-[var(--lm-surface-secondary)] text-[var(--lm-text-muted)]'}`}>
                  {filterCounts[f.id as FilterType]}
                </span>
              </button>
            )
          })}
        </div>

        {/* View Switcher & Add Button */}
        <div className="flex items-center gap-2 border-l border-[var(--lm-border-subtle)] pl-3 shrink-0">
          <div className="flex items-center p-1 rounded-2xl bg-[var(--lm-surface-secondary)] border border-[var(--lm-border-subtle)]">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-xl text-xs transition-colors ${viewMode === "grid" ? "bg-[var(--lm-surface-elevated)] text-[var(--lm-accent-text)] shadow-sm" : "text-[var(--lm-text-muted)]"}`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-xl text-xs transition-colors ${viewMode === "table" ? "bg-[var(--lm-surface-elevated)] text-[var(--lm-accent-text)] shadow-sm" : "text-[var(--lm-text-muted)]"}`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <Button
            type="button"
            size="sm"
            onClick={handleOpenNew}
            className="bg-[var(--lm-accent-primary)] text-[var(--lm-text-on-accent)] font-bold text-xs rounded-2xl h-9 px-4 gap-1.5 shadow-md"
          >
            <Plus className="w-4 h-4" />
            Add Coupon
          </Button>
        </div>
      </div>

      {/* Directory Contents */}
      {filteredCoupons.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center rounded-3xl border border-[var(--lm-border-default)] bg-[var(--lm-surface-elevated)] glass-card">
          <div className="p-4 rounded-3xl bg-[var(--lm-surface-secondary)] border border-[var(--lm-border-default)] mb-3 animate-float">
            <Ticket className="w-8 h-8 text-[var(--lm-accent-text)]" />
          </div>
          <h4 className="text-sm font-bold text-[var(--lm-text-primary)]">No promotional coupons found</h4>
          <p className="text-xs text-[var(--lm-text-muted)] mt-1 max-w-xs">
            {searchQuery || selectedFilter !== "ALL"
              ? "Try adjusting your search criteria or switching status filters."
              : "Create your first promotional discount coupon code to boost customer sales."}
          </p>
          <Button onClick={handleOpenNew} className="mt-4 bg-[var(--lm-accent-primary)] text-[var(--lm-text-on-accent)] font-bold text-xs rounded-xl h-9 px-4">
            <Plus className="w-4 h-4 mr-1.5" />
            Create Promo Coupon
          </Button>
        </div>
      ) : viewMode === "grid" ? (
        /* GRID VIEW: Coupon Cards */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredCoupons.map(coupon => (
            <CouponCard
              key={coupon.id}
              coupon={coupon}
              onEdit={handleOpenEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        /* TABLE VIEW: Modern Table */
        <div className="rounded-3xl border border-[var(--lm-border-default)] bg-[var(--lm-surface-elevated)] glass-card overflow-hidden shadow-sm">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[var(--lm-border-default)] bg-[var(--lm-surface-secondary)] text-[10px] font-bold uppercase tracking-wider text-[var(--lm-text-muted)]">
                  <th className="px-4 py-3.5">Promo Code</th>
                  <th className="px-4 py-3.5">Discount Value</th>
                  <th className="px-4 py-3.5">Redemptions</th>
                  <th className="px-4 py-3.5">Min Order / Cap</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5">Expiry Date</th>
                  <th className="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--lm-border-subtle)]">
                {filteredCoupons.map(c => {
                  const isExp = c.expiresAt && new Date(c.expiresAt) < now
                  const isAct = c.isActive && !isExp

                  return (
                    <tr key={c.id} className="group transition-colors hover:bg-[var(--lm-surface-hover)]">
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black text-[var(--lm-text-primary)] text-xs px-2 py-0.5 rounded-lg bg-[var(--lm-surface-secondary)] border border-[var(--lm-border-subtle)]">
                            {c.code}
                          </span>
                          <button
                            onClick={() => handleCopyCode(c.id, c.code)}
                            className="p-1 rounded-md hover:bg-[var(--lm-surface-active)] text-[var(--lm-text-muted)] hover:text-[var(--lm-text-primary)]"
                          >
                            {copiedCodeId === c.id ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                      </td>

                      <td className="px-4 py-3.5 font-bold text-[var(--lm-text-primary)] tabular-nums">
                        {c.type === "PERCENTAGE" ? `${c.value}% OFF` : `${formatCurrency(c.value)} OFF`}
                      </td>

                      <td className="px-4 py-3.5 font-medium tabular-nums text-[var(--lm-text-primary)]">
                        {c.usedCount} {c.usageLimit ? `/ ${c.usageLimit}` : "(unlimited)"}
                      </td>

                      <td className="px-4 py-3.5 text-[11px] text-[var(--lm-text-secondary)]">
                        {c.minOrderValue ? `Min ${formatCurrency(c.minOrderValue)}` : "No Min"}
                        {c.maxDiscount ? ` (Cap ${formatCurrency(c.maxDiscount)})` : ""}
                      </td>

                      <td className="px-4 py-3.5">
                        {isAct ? (
                          <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[10px] font-bold">
                            Active
                          </Badge>
                        ) : (
                          <Badge className="bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30 text-[10px] font-bold">
                            {isExp ? "Expired" : "Inactive"}
                          </Badge>
                        )}
                      </td>

                      <td className="px-4 py-3.5 text-[11px] text-[var(--lm-text-muted)] font-mono">
                        {c.expiresAt ? new Date(c.expiresAt).toLocaleDateString() : "Never"}
                      </td>

                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenEdit(c)}
                            className="p-1.5 rounded-lg hover:bg-[var(--lm-surface-active)] text-blue-500"
                            title="Edit"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(c.id)}
                            className="p-1.5 rounded-lg hover:bg-rose-500/15 text-rose-500"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Form */}
      <CouponModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingCoupon={editingCoupon}
      />
    </div>
  )
}
