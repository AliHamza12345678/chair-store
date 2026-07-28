"use client";

// ─── Orders Client Component ──────────────────────────────────────────────────
// Full order history with search, category filtering, detailed tracking timeline modal,
// and itemized pricing breakdown.

import { useState } from "react";
import Link from "next/link";
import { formatCurrency } from "@/lib/format-currency";
import { cn } from "@/lib/clsx";

interface OrderItemProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  images: string[];
}

interface OrderItemData {
  id: string;
  quantity: number;
  price: number;
  product: OrderItemProduct;
}

interface AddressData {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  province?: string | null;
  postalCode?: string | null;
  country: string;
}

export interface OrderData {
  id: string;
  createdAt: Date | string;
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  total: number;
  subtotal: number;
  discount: number;
  paymentMethod: string;
  isPaid: boolean;
  orderItems: OrderItemData[];
  address?: AddressData | null;
}

export function OrdersClient({ orders }: { orders: OrderData[] }) {
  const [activeTab, setActiveTab] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesTab =
      activeTab === "ALL" ? true : order.status === activeTab;
    const refMatch = order.id.toLowerCase().includes(searchQuery.toLowerCase());
    const itemMatch = order.orderItems.some((i) =>
      i.product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return matchesTab && (refMatch || itemMatch);
  });

  const getStepProgress = (status: string) => {
    switch (status) {
      case "PENDING":
        return 1;
      case "PROCESSING":
        return 2;
      case "SHIPPED":
        return 3;
      case "DELIVERED":
        return 4;
      case "CANCELLED":
        return 0;
      default:
        return 1;
    }
  };

  return (
    <div className="space-y-8 animate-in">
      
      {/* ── Page Title Header ── */}
      <div className="pb-6 border-b border-[var(--lm-border-default)] flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span
            className="text-[8.5px] uppercase tracking-[0.55em] text-[var(--lm-accent-text)]/80 block mb-2 font-mono"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Archive &amp; Registry
          </span>
          <h1
            className="text-[var(--lm-text-primary)] text-3xl sm:text-4xl font-light tracking-tight"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            Order History &amp; Tracking
          </h1>
          <p
            className="text-[var(--lm-text-secondary)] text-xs mt-2 font-light max-w-xl leading-relaxed"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Review past acquisitions, track active white-glove shipments, and view itemized receipts.
          </p>
        </div>

        <span className="text-[8.5px] uppercase tracking-[0.4em] text-[var(--lm-text-muted)] font-mono">
          {orders.length} Total {orders.length === 1 ? "Acquisition" : "Acquisitions"}
        </span>
      </div>

      {/* ── Search & Filter Tabs Bar ── */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-[var(--lm-surface-secondary)] p-3 border border-[var(--lm-border-default)]">
        {/* Status Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {["ALL", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-3.5 py-2 text-[8px] uppercase tracking-[0.3em] font-mono transition-all whitespace-nowrap",
                activeTab === tab
                  ? "border border-[var(--lm-accent-border)]/40 bg-[var(--lm-accent-muted)] text-[var(--lm-accent-text)]"
                  : "text-[var(--lm-text-muted)] hover:text-[var(--lm-text-secondary)] hover:bg-[var(--lm-surface-hover)]"
              )}
            >
              {tab === "ALL" ? "All Orders" : tab}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search Ref or Item..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black border border-[var(--lm-border-strong)] px-3.5 py-2 text-xs text-[var(--lm-text-primary)] placeholder:text-[var(--lm-text-muted)] focus:outline-none focus:border-[var(--lm-accent-border)]/50 font-mono"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--lm-text-muted)] text-xs hover:text-[var(--lm-text-primary)]"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* ── Orders List ── */}
      {filteredOrders.length === 0 ? (
        <div className="p-16 bg-[var(--lm-surface-secondary)] border border-[var(--lm-border-default)] text-center max-w-md mx-auto my-8">
          <span className="text-[8.5px] uppercase tracking-[0.55em] text-[var(--lm-accent-text)]/60 block mb-3 font-mono">
            No Orders Found
          </span>
          <h3
            className="text-[var(--lm-text-primary)] text-2xl font-light mb-3"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            No matching orders
          </h3>
          <p className="text-[var(--lm-text-secondary)] text-xs mb-8 leading-relaxed font-light">
            We couldn't find any orders matching your selected status filter or search criteria.
          </p>
          <button
            onClick={() => {
              setActiveTab("ALL");
              setSearchQuery("");
            }}
            className="px-6 py-3 border border-[var(--lm-accent-border)]/40 bg-[var(--lm-accent-muted)] text-[8.5px] uppercase tracking-[0.4em] text-[var(--lm-accent-text)] hover:bg-[var(--lm-accent-muted)] font-mono"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => {
            const step = getStepProgress(order.status);

            return (
              <div
                key={order.id}
                className="bg-[var(--lm-surface-secondary)] border border-[var(--lm-border-default)] hover:border-[var(--lm-accent-border)] transition-all p-6 sm:p-8 space-y-6 group"
              >
                {/* Header Metadata Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-6 border-b border-[var(--lm-border-subtle)]">
                  <div>
                    <span className="text-[7.5px] uppercase tracking-[0.4em] text-[var(--lm-text-muted)] font-mono block mb-1">
                      Order Reference
                    </span>
                    <span className="font-mono text-sm text-[var(--lm-accent-text)] tracking-wider">
                      #{order.id.slice(-8).toUpperCase()}
                    </span>
                  </div>

                  <div>
                    <span className="text-[7.5px] uppercase tracking-[0.4em] text-[var(--lm-text-muted)] font-mono block mb-1">
                      Acquisition Date
                    </span>
                    <span className="text-[var(--lm-text-secondary)] text-xs font-mono">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>

                  <div>
                    <span className="text-[7.5px] uppercase tracking-[0.4em] text-[var(--lm-text-muted)] font-mono block mb-1">
                      Total Cost
                    </span>
                    <span className="font-mono text-sm text-[var(--lm-text-primary)] tabular-nums">
                      {formatCurrency(order.total)}
                    </span>
                  </div>

                  <div className="flex flex-col items-start sm:items-end justify-center">
                    <span
                      className={cn(
                        "px-3 py-1 text-[7.5px] uppercase tracking-[0.3em] font-mono border",
                        order.status === "DELIVERED"
                          ? "border-emerald-500/40 text-emerald-400 bg-emerald-500/5"
                          : order.status === "CANCELLED"
                          ? "border-red-500/40 text-red-400 bg-red-500/5"
                          : "border-[var(--lm-accent-border)]/40 text-[var(--lm-accent-text)] bg-[var(--lm-accent-muted)]"
                      )}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* Items Preview */}
                <div className="space-y-4 divide-y divide-[var(--lm-border-subtle)]">
                  {order.orderItems.map((item) => (
                    <div key={item.id} className="pt-4 first:pt-0 flex items-center justify-between gap-6">
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="w-16 h-20 bg-black border border-[var(--lm-border-default)] overflow-hidden flex-shrink-0 relative">
                          {item.product.images[0] ? (
                            <img
                              src={item.product.images[0]}
                              alt={item.product.name}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              style={{ filter: "saturate(0.85)" }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[7px] text-[var(--lm-text-muted)] uppercase font-mono">
                              Piece
                            </div>
                          )}
                        </div>

                        <div className="min-w-0">
                          <Link
                            href={`/products/${item.product.slug}`}
                            className="text-[var(--lm-text-primary)] hover:text-[var(--lm-accent-text)] transition-colors block text-base truncate font-light"
                            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                          >
                            {item.product.name}
                          </Link>
                          <span className="text-[8px] uppercase tracking-[0.3em] text-[var(--lm-text-muted)] block font-mono mt-0.5">
                            Quantity: {item.quantity} • {formatCurrency(item.price)} each
                          </span>
                        </div>
                      </div>

                      <span className="font-mono text-xs text-[var(--lm-text-secondary)] tabular-nums flex-shrink-0">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Order Step Progress Bar */}
                {order.status !== "CANCELLED" && (
                  <div className="pt-4 border-t border-[var(--lm-border-subtle)] space-y-2">
                    <div className="flex items-center justify-between text-[7.5px] uppercase tracking-[0.3em] font-mono text-[var(--lm-text-muted)]">
                      <span className={step >= 1 ? "text-[var(--lm-accent-text)] font-medium" : ""}>1. Confirmed</span>
                      <span className={step >= 2 ? "text-[var(--lm-accent-text)] font-medium" : ""}>2. Atelier Crafting</span>
                      <span className={step >= 3 ? "text-[var(--lm-accent-text)] font-medium" : ""}>3. In Transit</span>
                      <span className={step >= 4 ? "text-emerald-400 font-medium" : ""}>4. White-Glove Delivered</span>
                    </div>
                    <div className="w-full bg-[var(--lm-surface-secondary)] h-1.5 rounded-full overflow-hidden flex">
                      <div
                        className="bg-gradient-to-r from-amber-500 to-amber-200 h-full transition-all duration-700"
                        style={{ width: `${(step / 4) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Actions Bar */}
                <div className="pt-2 flex items-center justify-between border-t border-[var(--lm-border-subtle)]">
                  <span className="text-[8px] uppercase tracking-[0.3em] text-[var(--lm-text-muted)] font-mono">
                    Payment Method: {order.paymentMethod}
                  </span>

                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="px-4 py-2 border border-[var(--lm-accent-border)]/40 bg-[var(--lm-accent-muted)] text-[8px] uppercase tracking-[0.35em] text-[var(--lm-accent-text)] hover:bg-amber-400/15 transition-all font-mono"
                  >
                    View Full Details &amp; Receipt →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Order Detail Modal ── */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-[var(--lm-surface-elevated)] border border-[var(--lm-accent-border)] w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative">
            
            {/* Close button */}
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-6 right-6 w-8 h-8 rounded-full border border-[var(--lm-border-strong)] bg-[var(--lm-surface-secondary)] flex items-center justify-center text-[var(--lm-text-secondary)] hover:text-[var(--lm-text-primary)] transition-colors"
            >
              ✕
            </button>

            {/* Modal Title */}
            <div>
              <span className="text-[8.5px] uppercase tracking-[0.55em] text-[var(--lm-accent-text)] font-mono block mb-1">
                Atelier Acquisition Receipt
              </span>
              <h2
                className="text-[var(--lm-text-primary)] text-2xl font-light tracking-tight"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
              >
                Order #{selectedOrder.id.slice(-8).toUpperCase()}
              </h2>
              <span className="text-[var(--lm-text-muted)] text-xs font-mono block mt-1">
                Placed on {new Date(selectedOrder.createdAt).toLocaleString()}
              </span>
            </div>

            {/* Status & Delivery Step */}
            <div className="p-4 bg-[var(--lm-surface-secondary)] border border-[var(--lm-border-default)] space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[var(--lm-text-secondary)]">Shipment Status</span>
                <span className="text-[var(--lm-accent-text)] font-medium">{selectedOrder.status}</span>
              </div>

              {selectedOrder.address && (
                <div className="pt-2 border-t border-[var(--lm-border-subtle)] text-xs font-mono space-y-1">
                  <span className="text-[var(--lm-text-muted)] text-[8px] uppercase tracking-[0.3em] block">
                    White-Glove Delivery Residence
                  </span>
                  <p className="text-[var(--lm-text-primary)] font-medium">{selectedOrder.address.fullName}</p>
                  <p className="text-[var(--lm-text-secondary)]">
                    {selectedOrder.address.addressLine1}
                    {selectedOrder.address.addressLine2 ? `, ${selectedOrder.address.addressLine2}` : ""},{" "}
                    {selectedOrder.address.city}, {selectedOrder.address.country}
                  </p>
                  <p className="text-[var(--lm-text-muted)]">Phone: {selectedOrder.address.phone}</p>
                </div>
              )}
            </div>

            {/* Itemized Table */}
            <div className="space-y-3">
              <span className="text-[8px] uppercase tracking-[0.4em] text-[var(--lm-text-muted)] font-mono block">
                Acquired Items
              </span>
              <div className="divide-y divide-white/[0.06] border-y border-[var(--lm-border-default)]">
                {selectedOrder.orderItems.map((item) => (
                  <div key={item.id} className="py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-14 bg-black border border-[var(--lm-border-strong)] overflow-hidden flex-shrink-0">
                        {item.product.images[0] && (
                          <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div>
                        <p className="text-[var(--lm-text-primary)] text-sm font-light" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                          {item.product.name}
                        </p>
                        <p className="text-[8px] text-[var(--lm-text-muted)] font-mono uppercase tracking-[0.2em]">
                          Qty: {item.quantity} × {formatCurrency(item.price)}
                        </p>
                      </div>
                    </div>
                    <span className="font-mono text-xs text-[var(--lm-text-primary)]">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Breakdown */}
            <div className="p-4 bg-black border border-[var(--lm-border-default)] space-y-2 text-xs font-mono">
              <div className="flex justify-between text-[var(--lm-text-secondary)]">
                <span>Subtotal</span>
                <span>{formatCurrency(selectedOrder.subtotal || selectedOrder.total)}</span>
              </div>
              {selectedOrder.discount > 0 && (
                <div className="flex justify-between text-[var(--lm-accent-text)]">
                  <span>Atelier Discount</span>
                  <span>-{formatCurrency(selectedOrder.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-[var(--lm-text-secondary)]">
                <span>White-Glove Shipping</span>
                <span className="text-[var(--lm-accent-text)]">Complimentary</span>
              </div>
              <div className="pt-2 border-t border-[var(--lm-border-strong)] flex justify-between text-sm text-[var(--lm-text-primary)] font-medium">
                <span>Total Paid</span>
                <span className="text-[var(--lm-accent-text)]">{formatCurrency(selectedOrder.total)}</span>
              </div>
            </div>

            {/* Footer buttons */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 border border-[var(--lm-border-strong)] text-[8px] uppercase tracking-[0.3em] text-[var(--lm-text-secondary)] hover:text-[var(--lm-text-primary)] font-mono"
              >
                Print Receipt
              </button>

              <button
                onClick={() => setSelectedOrder(null)}
                className="px-6 py-2.5 bg-[var(--lm-accent-muted)] border border-[var(--lm-accent-border)]/50 text-[var(--lm-accent-text)] text-[8px] uppercase tracking-[0.3em] font-mono hover:bg-amber-400/30"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
