"use client";

// ─── Dedicated Cart Page ───────────────────────────────────────────────────────
// Full-screen luxury cart page featuring:
//   • Free shipping estimator progress bar
//   • Item list with quantity steppers and variant indicators
//   • Privilege coupon input with dynamic discount deduction
//   • Premium Order Summary sticky panel
//   • Art-directed empty state
//   • Trust badges (Free delivery, secure checkout, 14-day returns)

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCartStore } from "@/features/cart/store";
import { formatCurrency } from "@/lib/format-currency";
import FreeShippingBar from "@/components/storefront/cart/FreeShippingBar";
import CartCouponInput from "@/components/storefront/cart/CartCouponInput";
import CartQuantityStepper from "@/components/storefront/cart/CartQuantityStepper";
import CartEmptyState from "@/components/storefront/cart/CartEmptyState";

export default function CartPage() {
  const { items, removeItem, updateQuantity, cartTotal } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [coupon, setCoupon] = useState<{ code: string; discountPct: number } | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div className="bg-[var(--lm-surface-elevated)] text-[var(--lm-text-primary)] min-h-screen pt-36 pb-24 flex items-center justify-center">
        <CartEmptyState />
      </div>
    );
  }

  const rawSubtotal = cartTotal();
  const discountAmount = coupon ? (rawSubtotal * coupon.discountPct) / 100 : 0;
  const finalTotal = Math.max(0, rawSubtotal - discountAmount);

  return (
    <div className="bg-[var(--lm-surface-elevated)] text-[var(--lm-text-primary)] min-h-screen pt-36 pb-28">
      <div className="mx-auto max-w-7xl px-6 sm:px-12 lg:px-20">
        
        {/* ── Page Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 pb-6 border-b border-[var(--lm-border-default)] gap-4">
          <div>
            <div className="flex items-center gap-4 mb-3">
              <div className="h-px w-10 bg-[var(--lm-accent-primary)] opacity-50" />
              <span
                className="text-[9px] uppercase tracking-[0.6em] text-[var(--lm-accent-text)] opacity-70"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Shopping Collection
              </span>
            </div>
            <h1
              className="text-[var(--lm-text-primary)] text-4xl sm:text-5xl font-light tracking-tight leading-none"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
              }}
            >
              Your Selection
            </h1>
          </div>

          <span
            className="text-[8.5px] uppercase tracking-[0.4em] text-[var(--lm-text-muted)] font-mono"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            {items.length} {items.length === 1 ? "piece" : "pieces"} in cart
          </span>
        </div>

        {/* ── Free Shipping Progress Estimator ── */}
        <div className="mb-12">
          <FreeShippingBar currentTotal={rawSubtotal} />
        </div>

        {/* ── Main Layout: Item List + Summary ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Left: Item List */}
          <div className="lg:col-span-7 flex flex-col divide-y divide-[var(--lm-border-subtle)]">
            {items.map((item) => (
              <div key={item.id} className="py-8 flex gap-6 sm:gap-8 group">
                
                {/* Image */}
                <Link
                  href={`/products/${item.productId}`}
                  className="w-28 h-36 bg-[var(--lm-surface-secondary)] border border-[var(--lm-border-default)] overflow-hidden flex-shrink-0 relative block"
                >
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      style={{ filter: "saturate(0.8)" }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[8px] uppercase tracking-[0.2em] text-[var(--lm-text-muted)]">
                      No Image
                    </div>
                  )}
                </Link>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div>
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3
                        className="text-[var(--lm-text-primary)] transition-colors"
                        style={{
                          fontFamily: "'Cormorant Garamond', Georgia, serif",
                          fontSize: "1.35rem",
                          fontWeight: 400,
                        }}
                      >
                        <Link href={`/products/${item.productId}`}>{item.name}</Link>
                      </h3>

                      <span
                        className="text-[var(--lm-text-primary)] tabular-nums font-mono text-base flex-shrink-0"
                        style={{ fontFamily: "var(--font-inter)" }}
                      >
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>

                    {item.variantTitle && (
                      <p
                        className="text-[8px] uppercase tracking-[0.35em] text-[var(--lm-text-muted)] mb-2"
                        style={{ fontFamily: "var(--font-inter)" }}
                      >
                        Variant: {item.variantTitle}
                      </p>
                    )}

                    <p
                      className="text-[var(--lm-text-muted)] text-xs tabular-nums"
                      style={{ fontFamily: "var(--font-inter)" }}
                    >
                      {formatCurrency(item.price)} each
                    </p>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="pt-4 flex items-center justify-between border-t border-[var(--lm-border-subtle)]">
                    <CartQuantityStepper
                      quantity={item.quantity}
                      onUpdate={(q) => updateQuantity(item.id, q)}
                      onRemove={() => removeItem(item.id)}
                      size="md"
                    />

                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-[8px] uppercase tracking-[0.3em] text-[var(--lm-text-muted)] hover:text-red-400 transition-colors"
                      style={{ fontFamily: "var(--font-inter)" }}
                    >
                      Remove Piece
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>

          {/* Right: Sticky Order Summary */}
          <div className="lg:col-span-5 lg:sticky lg:top-36 space-y-8">
            <div className="bg-[var(--lm-surface-secondary)] p-8 border border-[var(--lm-border-default)] space-y-6">
              
              <h2
                className="text-[var(--lm-text-primary)] text-2xl font-light pb-4 border-b border-[var(--lm-border-subtle)]"
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  letterSpacing: "0.02em",
                }}
              >
                Order Summary
              </h2>

              {/* Coupon */}
              <CartCouponInput appliedCoupon={coupon} onApply={setCoupon} />

              {/* Calculation Rows */}
              <div className="space-y-3 pt-2">
                <div className="flex justify-between text-xs text-[var(--lm-text-secondary)]">
                  <span className="uppercase tracking-[0.3em]" style={{ fontFamily: "var(--font-inter)", fontSize: "8px" }}>
                    Subtotal
                  </span>
                  <span className="tabular-nums font-mono text-sm">{formatCurrency(rawSubtotal)}</span>
                </div>

                {coupon && (
                  <div className="flex justify-between text-xs text-[var(--lm-accent-text)]">
                    <span className="uppercase tracking-[0.3em]" style={{ fontFamily: "var(--font-inter)", fontSize: "8px" }}>
                      Privilege Discount ({coupon.code})
                    </span>
                    <span className="tabular-nums font-mono text-sm">−{formatCurrency(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-xs text-[var(--lm-text-secondary)]">
                  <span className="uppercase tracking-[0.3em]" style={{ fontFamily: "var(--font-inter)", fontSize: "8px" }}>
                    Estimated Delivery
                  </span>
                  <span className="uppercase tracking-[0.2em] text-[var(--lm-text-muted)]" style={{ fontFamily: "var(--font-inter)", fontSize: "8px" }}>
                    {rawSubtotal >= 50000 ? "Free Standard" : "Calculated at checkout"}
                  </span>
                </div>

                <div className="flex justify-between text-xs text-[var(--lm-text-secondary)]">
                  <span className="uppercase tracking-[0.3em]" style={{ fontFamily: "var(--font-inter)", fontSize: "8px" }}>
                    Taxes
                  </span>
                  <span className="uppercase tracking-[0.2em] text-[var(--lm-text-muted)]" style={{ fontFamily: "var(--font-inter)", fontSize: "8px" }}>
                    Included
                  </span>
                </div>
              </div>

              {/* Total Row */}
              <div className="pt-6 border-t border-[var(--lm-border-default)] flex justify-between items-baseline">
                <span
                  className="text-[var(--lm-text-primary)] text-xl font-light"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                >
                  Grand Total
                </span>
                <span
                  className="text-[var(--lm-text-primary)] text-2xl tabular-nums"
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontWeight: 300,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {formatCurrency(finalTotal)}
                </span>
              </div>

              {/* Primary Checkout CTA */}
              <Link
                href="/checkout"
                className="group flex items-center justify-center gap-3 w-full py-4 border border-[var(--lm-accent-border)] bg-[var(--lm-accent-muted)] text-[9px] uppercase tracking-[0.45em] text-[var(--lm-accent-text)] hover:bg-[var(--lm-accent-muted)] transition-all text-center"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Proceed to Checkout
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 11 11"
                  fill="none"
                  className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                >
                  <path d="M1 10L10 1M10 1H3M10 1V8" stroke="currentColor" strokeWidth="1.1" />
                </svg>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 p-5 bg-[var(--lm-surface-secondary)] border border-[var(--lm-border-subtle)] text-center">
              <div>
                <span className="text-[7.5px] uppercase tracking-[0.3em] text-[var(--lm-text-muted)] block mb-1 font-mono">
                  100% Authentic
                </span>
                <span className="text-[7px] text-[var(--lm-text-muted)]">Guaranteed quality</span>
              </div>
              <div>
                <span className="text-[7.5px] uppercase tracking-[0.3em] text-[var(--lm-text-muted)] block mb-1 font-mono">
                  Insured Delivery
                </span>
                <span className="text-[7px] text-[var(--lm-text-muted)]">Free over Rs 50k</span>
              </div>
              <div>
                <span className="text-[7.5px] uppercase tracking-[0.3em] text-[var(--lm-text-muted)] block mb-1 font-mono">
                  14-Day Returns
                </span>
                <span className="text-[7px] text-[var(--lm-text-muted)]">Hassle-free policy</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
