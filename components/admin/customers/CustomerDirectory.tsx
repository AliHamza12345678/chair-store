"use client"

import * as React from "react"
import { useState, useMemo } from "react"
import { Search, LayoutGrid, List, Download, Crown, ShoppingBag, X, Users, MapPin, Sparkles, Filter } from "lucide-react"
import { formatCurrency } from "@/lib/format-currency"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/badge"
import { CustomerCard } from "./CustomerCard"
import { CustomerProfileDrawer } from "./CustomerProfileDrawer"

interface CustomerDirectoryProps {
  customers: any[]
}

type SegmentFilter = "ALL" | "VIP" | "REPEAT" | "NEW" | "WISHLIST" | "AT_RISK"
type ViewMode = "grid" | "table"

export function CustomerDirectory({ customers }: CustomerDirectoryProps) {
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [selectedSegment, setSelectedSegment] = useState<SegmentFilter>("ALL")
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null)

  // Compute segmented customer counts
  const segmentCounts = useMemo(() => {
    let vip = 0
    let repeat = 0
    let newClients = 0
    let wishlist = 0
    let atRisk = 0

    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    customers.forEach(c => {
      const ltv = c.totalSpent || 0
      const ordersCount = c.orders?.length || c._count?.orders || 0
      const wishlistCount = c.wishlist?.length || c._count?.wishlist || 0

      if (ltv >= 100000 || ordersCount >= 5) vip++
      if (ordersCount > 1) repeat++
      if (new Date(c.createdAt) >= thirtyDaysAgo) newClients++
      if (wishlistCount > 0) wishlist++
      if (ordersCount === 0) atRisk++
    })

    return {
      ALL: customers.length,
      VIP: vip,
      REPEAT: repeat,
      NEW: newClients,
      WISHLIST: wishlist,
      AT_RISK: atRisk,
    }
  }, [customers])

  // Filtered customer list
  const filteredCustomers = useMemo(() => {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    return customers.filter(c => {
      const ltv = c.totalSpent || 0
      const ordersCount = c.orders?.length || c._count?.orders || 0
      const wishlistCount = c.wishlist?.length || c._count?.wishlist || 0

      // Segment check
      if (selectedSegment === "VIP" && !(ltv >= 100000 || ordersCount >= 5)) return false
      if (selectedSegment === "REPEAT" && ordersCount <= 1) return false
      if (selectedSegment === "NEW" && new Date(c.createdAt) < thirtyDaysAgo) return false
      if (selectedSegment === "WISHLIST" && wishlistCount === 0) return false
      if (selectedSegment === "AT_RISK" && ordersCount > 0) return false

      // Search query check
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        const matchName = (c.name || "").toLowerCase().includes(q)
        const matchEmail = (c.email || "").toLowerCase().includes(q)
        const matchTag = (c.tags || []).some((t: string) => t.toLowerCase().includes(q))
        const defaultAddr = c.addresses?.find((a: any) => a.isDefault) || c.addresses?.[0]
        const matchCity = (defaultAddr?.city || "").toLowerCase().includes(q)

        if (!matchName && !matchEmail && !matchTag && !matchCity) return false
      }

      return true
    })
  }, [customers, selectedSegment, searchQuery])

  // Export Customer List to CSV
  const handleExportCSV = () => {
    const headers = ["ID", "Name", "Email", "Total Spent (PKR)", "Total Orders", "Joined Date", "Default City", "Tags"]
    const rows = filteredCustomers.map(c => {
      const defaultAddr = c.addresses?.find((a: any) => a.isDefault) || c.addresses?.[0]
      return [
        c.id,
        `"${c.name || 'Guest'}"`,
        `"${c.email}"`,
        c.totalSpent || 0,
        c.orders?.length || c._count?.orders || 0,
        new Date(c.createdAt).toISOString().split('T')[0],
        `"${defaultAddr?.city || 'N/A'}"`,
        `"${(c.tags || []).join(';')}"`,
      ]
    })

    const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", `lumina_crm_customers_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-5">
      {/* Controls & Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-3.5 rounded-3xl border border-[var(--lm-border-default)] bg-[var(--lm-surface-elevated)] glass-card shadow-sm">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--lm-text-muted)]" />
          <input
            type="text"
            placeholder="Search customers by name, email, city, or tag..."
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

        {/* Segment Filter Pills */}
        <div className="flex items-center gap-1 overflow-x-auto custom-scrollbar p-1">
          {[
            { id: "ALL", label: "All Clients" },
            { id: "VIP", label: "VIP Spenders" },
            { id: "REPEAT", label: "Repeat Buyers" },
            { id: "NEW", label: "New Clients" },
            { id: "WISHLIST", label: "Wishlist Active" },
            { id: "AT_RISK", label: "Leads / Inactive" },
          ].map(seg => {
            const isActive = selectedSegment === seg.id
            return (
              <button
                key={seg.id}
                type="button"
                onClick={() => setSelectedSegment(seg.id as SegmentFilter)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 flex items-center gap-1.5 transition-all duration-300 ${isActive ? 'bg-[var(--lm-accent-primary)] text-[var(--lm-text-on-accent)] shadow-md' : 'text-[var(--lm-text-muted)] hover:bg-[var(--lm-surface-hover)]'}`}
              >
                <span>{seg.label}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-bold ${isActive ? 'bg-black/20 text-white' : 'bg-[var(--lm-surface-secondary)] text-[var(--lm-text-muted)]'}`}>
                  {segmentCounts[seg.id as SegmentFilter]}
                </span>
              </button>
            )
          })}
        </div>

        {/* View Mode & Export Controls */}
        <div className="flex items-center gap-2 border-l border-[var(--lm-border-subtle)] pl-3 shrink-0">
          <div className="flex items-center p-1 rounded-2xl bg-[var(--lm-surface-secondary)] border border-[var(--lm-border-subtle)]">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-xl text-xs transition-colors ${viewMode === "grid" ? "bg-[var(--lm-surface-elevated)] text-[var(--lm-accent-text)] shadow-sm" : "text-[var(--lm-text-muted)]"}`}
              title="Grid Cards View"
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
            variant="outline"
            onClick={handleExportCSV}
            className="h-9 text-xs rounded-2xl gap-1.5 font-semibold"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Directory Contents */}
      {filteredCustomers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center rounded-3xl border border-[var(--lm-border-default)] bg-[var(--lm-surface-elevated)] glass-card">
          <div className="p-4 rounded-3xl bg-[var(--lm-surface-secondary)] border border-[var(--lm-border-default)] mb-3 animate-float">
            <Users className="w-8 h-8 text-[var(--lm-accent-text)]" />
          </div>
          <h4 className="text-sm font-bold text-[var(--lm-text-primary)]">No matching customer profiles</h4>
          <p className="text-xs text-[var(--lm-text-muted)] mt-1 max-w-xs">
            {searchQuery || selectedSegment !== "ALL"
              ? "Try clearing your search filters or selecting a different segment."
              : "No customer accounts have registered yet."}
          </p>
        </div>
      ) : viewMode === "grid" ? (
        /* GRID VIEW: Apple Customer Cards */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredCustomers.map(customer => (
            <CustomerCard key={customer.id} customer={customer} onOpenProfile={setSelectedCustomer} />
          ))}
        </div>
      ) : (
        /* TABLE VIEW: Compact Data Table */
        <div className="rounded-3xl border border-[var(--lm-border-default)] bg-[var(--lm-surface-elevated)] glass-card overflow-hidden shadow-sm">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[var(--lm-border-default)] bg-[var(--lm-surface-secondary)] text-[10px] font-bold uppercase tracking-wider text-[var(--lm-text-muted)]">
                  <th className="px-4 py-3.5">Customer</th>
                  <th className="px-4 py-3.5">Segment Tier</th>
                  <th className="px-4 py-3.5">Lifetime Spend</th>
                  <th className="px-4 py-3.5">Orders</th>
                  <th className="px-4 py-3.5">Location</th>
                  <th className="px-4 py-3.5">Joined Date</th>
                  <th className="px-4 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--lm-border-subtle)]">
                {filteredCustomers.map(c => {
                  const ltv = c.totalSpent || 0
                  const ordersCount = c.orders?.length || c._count?.orders || 0
                  const isVip = ltv >= 100000 || ordersCount >= 5
                  const defaultAddr = c.addresses?.find((a: any) => a.isDefault) || c.addresses?.[0]

                  return (
                    <tr
                      key={c.id}
                      onClick={() => setSelectedCustomer(c)}
                      className="group cursor-pointer transition-colors hover:bg-[var(--lm-surface-hover)]"
                    >
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-[var(--lm-accent-primary)] text-[var(--lm-text-on-accent)] font-bold text-xs flex items-center justify-center shrink-0">
                            {(c.name || c.email || "C").charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-[var(--lm-text-primary)]">{c.name || "Customer Account"}</p>
                            <p className="text-[10px] text-[var(--lm-text-muted)]">{c.email}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3.5">
                        {isVip ? (
                          <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30 text-[10px] font-bold">
                            VIP Client
                          </Badge>
                        ) : ordersCount > 1 ? (
                          <Badge className="bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30 text-[10px] font-bold">
                            Repeat Buyer
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="text-[10px]">Standard</Badge>
                        )}
                      </td>

                      <td className="px-4 py-3.5 font-bold text-[var(--lm-text-primary)] tabular-nums">
                        {formatCurrency(ltv)}
                      </td>

                      <td className="px-4 py-3.5 font-medium tabular-nums text-[var(--lm-text-primary)]">
                        {ordersCount} orders
                      </td>

                      <td className="px-4 py-3.5 text-[11px] text-[var(--lm-text-muted)]">
                        {defaultAddr ? `${defaultAddr.city}, ${defaultAddr.country || 'PK'}` : 'N/A'}
                      </td>

                      <td className="px-4 py-3.5 text-[11px] text-[var(--lm-text-muted)] font-mono">
                        {new Date(c.createdAt).toLocaleDateString()}
                      </td>

                      <td className="px-4 py-3.5 text-right">
                        <Button type="button" size="sm" variant="ghost" className="h-7 text-[11px] text-[var(--lm-accent-text)]">
                          View CRM Profile
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Customer Profile Drawer / Modal */}
      <CustomerProfileDrawer
        isOpen={!!selectedCustomer}
        onClose={() => setSelectedCustomer(null)}
        customer={selectedCustomer}
      />
    </div>
  )
}
