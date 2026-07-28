"use client"

import * as React from "react"
import { useState, useMemo } from "react"
import { OrderStatus } from "@prisma/client"
import { Search, Filter, ChevronDown, ChevronUp, Package, Eye, Edit3, Printer, RefreshCcw, Truck, UserCheck, CheckCircle2, Clock, X, Sparkles } from "lucide-react"
import { formatCurrency } from "@/lib/format-currency"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/Button"
import { toast } from "sonner"
import { updateOrderStatus } from "@/features/orders/actions"
import { OrderExpandableDetails } from "./OrderExpandableDetails"
import { InvoiceModal } from "./InvoiceModal"
import { RefundModal } from "./RefundModal"
import { ShipmentTrackingModal } from "./ShipmentTrackingModal"

interface OrderTableProps {
  orders: any[]
}

type StatusFilter = "ALL" | OrderStatus

export function OrderTable({ orders }: OrderTableProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<StatusFilter>("ALL")
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null)
  const [isUpdating, setIsUpdating] = useState<string | null>(null)

  // Modals state
  const [invoiceOrder, setInvoiceOrder] = useState<any | null>(null)
  const [refundOrder, setRefundOrder] = useState<any | null>(null)
  const [trackingOrder, setTrackingOrder] = useState<any | null>(null)

  // Count by status
  const counts = useMemo(() => {
    const res = {
      ALL: orders.length,
      PENDING: 0,
      PROCESSING: 0,
      SHIPPED: 0,
      DELIVERED: 0,
      CANCELLED: 0,
    }
    orders.forEach(o => {
      if (res[o.status as OrderStatus] !== undefined) {
        res[o.status as OrderStatus]++
      }
    })
    return res
  }, [orders])

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      if (selectedStatus !== "ALL" && o.status !== selectedStatus) return false

      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        const matchId = o.id.toLowerCase().includes(q)
        const matchName = (o.user?.name || "").toLowerCase().includes(q)
        const matchEmail = (o.user?.email || "").toLowerCase().includes(q)
        const matchCity = (o.address?.city || "").toLowerCase().includes(q)
        if (!matchId && !matchName && !matchEmail && !matchCity) return false
      }
      return true
    })
  }, [orders, selectedStatus, searchQuery])

  const handleStatusChange = async (id: string, newStatus: OrderStatus) => {
    setIsUpdating(id)
    const t = toast.loading("Updating status...")

    const res = await updateOrderStatus(id, newStatus)
    setIsUpdating(null)
    if (res.success) {
      toast.success(`Order status updated to ${newStatus}`, { id: t })
    } else {
      toast.error(res.error || "Failed to update status", { id: t })
    }
  }

  const toggleExpand = (id: string) => {
    setExpandedOrderId(prev => prev === id ? null : id)
  }

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "PENDING":
        return <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30 text-[10px] font-bold">PENDING</Badge>
      case "PROCESSING":
        return <Badge className="bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30 text-[10px] font-bold">PROCESSING</Badge>
      case "SHIPPED":
        return <Badge className="bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30 text-[10px] font-bold">SHIPPED</Badge>
      case "DELIVERED":
        return <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[10px] font-bold">DELIVERED</Badge>
      case "CANCELLED":
        return <Badge className="bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30 text-[10px] font-bold">CANCELLED / REFUNDED</Badge>
      default:
        return <Badge variant="secondary" className="text-[10px]">{status}</Badge>
    }
  }

  return (
    <div className="space-y-4">
      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-3xl border border-[var(--lm-border-default)] bg-[var(--lm-surface-elevated)] glass-card shadow-sm">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--lm-text-muted)]" />
          <input
            type="text"
            placeholder="Search orders by ID, customer name, email, city..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-2xl border border-[var(--lm-border-default)] bg-[var(--lm-surface-primary)] text-xs text-[var(--lm-text-primary)] placeholder:text-[var(--lm-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--lm-accent-primary)]/40 transition-all"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--lm-text-muted)] hover:text-[var(--lm-text-primary)]">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 overflow-x-auto custom-scrollbar p-1">
          {(["ALL", "PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"] as StatusFilter[]).map(status => (
            <button
              key={status}
              type="button"
              onClick={() => setSelectedStatus(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 flex items-center gap-1.5 transition-all duration-300 ${selectedStatus === status ? 'bg-[var(--lm-accent-primary)] text-[var(--lm-text-on-accent)] shadow-md' : 'text-[var(--lm-text-muted)] hover:bg-[var(--lm-surface-hover)]'}`}
            >
              <span>{status === "ALL" ? "All Orders" : status}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-bold ${selectedStatus === status ? 'bg-black/20 text-white' : 'bg-[var(--lm-surface-secondary)] text-[var(--lm-text-muted)]'}`}>
                {counts[status]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Orders Table */}
      <div className="rounded-3xl border border-[var(--lm-border-default)] bg-[var(--lm-surface-elevated)] glass-card overflow-hidden shadow-sm">
        {filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="p-4 rounded-3xl bg-[var(--lm-surface-secondary)] border border-[var(--lm-border-default)] mb-3 animate-float">
              <Package className="w-8 h-8 text-[var(--lm-accent-text)]" />
            </div>
            <h4 className="text-sm font-bold text-[var(--lm-text-primary)]">No orders found</h4>
            <p className="text-xs text-[var(--lm-text-muted)] mt-1 max-w-xs">
              {searchQuery || selectedStatus !== "ALL"
                ? "Try clearing your search query or switching status filters."
                : "No customer orders have been placed yet."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--lm-border-default)] bg-[var(--lm-surface-secondary)] text-[10px] font-bold uppercase tracking-wider text-[var(--lm-text-muted)]">
                  <th className="px-4 py-3.5 w-8"></th>
                  <th className="px-4 py-3.5">Order Ref</th>
                  <th className="px-4 py-3.5">Customer</th>
                  <th className="px-4 py-3.5">Destination</th>
                  <th className="px-4 py-3.5">Items</th>
                  <th className="px-4 py-3.5">Total Amount</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5">Order Date</th>
                  <th className="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--lm-border-subtle)] text-xs">
                {filteredOrders.map(order => {
                  const isExpanded = expandedOrderId === order.id
                  const initial = (order.user?.name || "C").charAt(0).toUpperCase()

                  return (
                    <React.Fragment key={order.id}>
                      <tr
                        onClick={() => toggleExpand(order.id)}
                        className={`group cursor-pointer transition-colors hover:bg-[var(--lm-surface-hover)] ${isExpanded ? 'bg-[var(--lm-accent-muted)]' : ''}`}
                      >
                        {/* Expand Toggle Chevron */}
                        <td className="px-4 py-3.5 text-center">
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-[var(--lm-accent-text)]" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-[var(--lm-text-muted)] group-hover:text-[var(--lm-text-primary)]" />
                          )}
                        </td>

                        {/* Order ID */}
                        <td className="px-4 py-3.5">
                          <span className="font-mono font-bold text-[var(--lm-text-primary)]">#{order.id.slice(-8)}</span>
                        </td>

                        {/* Customer Avatar & Name */}
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-[var(--lm-accent-primary)] text-[var(--lm-text-on-accent)] font-bold text-xs flex items-center justify-center shadow-sm shrink-0">
                              {initial}
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-[var(--lm-text-primary)] truncate">{order.user?.name || "Guest"}</p>
                              <p className="text-[10px] text-[var(--lm-text-muted)] truncate">{order.user?.email}</p>
                            </div>
                          </div>
                        </td>

                        {/* Destination */}
                        <td className="px-4 py-3.5 text-xs text-[var(--lm-text-secondary)]">
                          {order.address?.city ? `${order.address.city}, ${order.address.country || 'PK'}` : 'N/A'}
                        </td>

                        {/* Items count */}
                        <td className="px-4 py-3.5 font-medium tabular-nums text-[var(--lm-text-primary)]">
                          {(order.orderItems || []).length} items
                        </td>

                        {/* Total Amount */}
                        <td className="px-4 py-3.5 font-black text-[var(--lm-text-primary)] tabular-nums">
                          {formatCurrency(order.total)}
                        </td>

                        {/* Status dropdown */}
                        <td className="px-4 py-3.5" onClick={e => e.stopPropagation()}>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(order.status)}
                            <select
                              disabled={isUpdating === order.id}
                              value={order.status}
                              onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                              className="h-7 px-2 rounded-lg border border-[var(--lm-border-default)] bg-[var(--lm-surface-primary)] text-[10px] font-semibold focus:outline-none focus:ring-1 focus:ring-[var(--lm-accent-primary)]"
                            >
                              {Object.values(OrderStatus).map(st => (
                                <option key={st} value={st}>{st}</option>
                              ))}
                            </select>
                          </div>
                        </td>

                        {/* Date */}
                        <td className="px-4 py-3.5 text-[11px] text-[var(--lm-text-muted)] font-mono">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3.5 text-right" onClick={e => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => setInvoiceOrder(order)}
                              className="p-1.5 rounded-lg hover:bg-[var(--lm-surface-active)] text-[var(--lm-text-muted)] hover:text-[var(--lm-text-primary)]"
                              title="Print Invoice"
                            >
                              <Printer className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setTrackingOrder(order)}
                              className="p-1.5 rounded-lg hover:bg-[var(--lm-surface-active)] text-[var(--lm-text-muted)] hover:text-[var(--lm-text-primary)]"
                              title="Tracking"
                            >
                              <Truck className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setRefundOrder(order)}
                              className="p-1.5 rounded-lg hover:bg-amber-500/15 text-amber-500"
                              title="Issue Refund"
                            >
                              <RefreshCcw className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Expanded Details Row */}
                      {isExpanded && (
                        <tr>
                          <td colSpan={9} className="px-4 py-2 bg-[var(--lm-surface-primary)]">
                            <OrderExpandableDetails
                              order={order}
                              onOpenInvoice={setInvoiceOrder}
                              onOpenRefund={setRefundOrder}
                              onOpenTracking={setTrackingOrder}
                            />
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      <InvoiceModal isOpen={!!invoiceOrder} onClose={() => setInvoiceOrder(null)} order={invoiceOrder} />
      <RefundModal isOpen={!!refundOrder} onClose={() => setRefundOrder(null)} order={refundOrder} />
      <ShipmentTrackingModal isOpen={!!trackingOrder} onClose={() => setTrackingOrder(null)} order={trackingOrder} />
    </div>
  )
}
