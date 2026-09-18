"use client";

// ─── Luxury Cart Sheet (Slide-Over Drawer) ────────────────────────────────────
// World-class slide-over cart drawer featuring:
//   • Free shipping estimator progress bar
//   • Beautiful quantity controls with micro-animations
//   • Applied coupon discount calculations
//   • "Complete the Room" in-cart cross-sells
//   • Art-directed empty state
//   • Direct checkout & view-cart CTA buttons

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCartStore } from "@/features/cart/store";
import { formatCurrency } from "@/lib/format-currency";
import FreeShippingBar from "@/components/storefront/cart/FreeShippingBar";
import CartCouponInput from "@/components/storefront/cart/CartCouponInput";
import CartQuantityStepper from "@/components/storefront/cart/CartQuantityStepper";
import CartRecommendations from "@/components/storefront/cart/CartRecommendations";
import CartEmptyState from "@/components/storefront/cart/CartEmptyState";

export function CartSheet() {
  const { isCartOpen, setCartOpen, items, updateQuantity, removeItem, cartTotal } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [coupon, setCoupon] = useState<{ code: string; discountPct: number } | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent background scroll when open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isCartOpen]);

  if (!mounted || !isCartOpen) return null;

  const rawSubtotal = cartTotal();
  const discountAmount = coupon ? (rawSubtotal * coupon.discountPct) / 100 : 0;
  const finalTotal = Math.max(0, rawSubtotal - discountAmount);

  return (
    <>
      {/* ── Backdrop ── */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 transition-opacity duration-500 animate-in fade-in"
        onClick={() => setCartOpen(false)}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 w-full sm:w-[460px] bg-[var(--lm-surface-primary)] border-l border-[var(--lm-border-default)] shadow-2xl z-50 flex flex-col slide-in-left duration-400">
        
        {/* ── Header ── */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--lm-border-subtle)] bg-[var(--lm-surface-primary)]">
          <div>
            <div className="flex items-center gap-3">
              <div className="h-px w-6 bg-[var(--lm-accent-primary)] opacity-50" />
              <span
                className="text-[8.5px] uppercase tracking-[0.6em] text-[var(--lm-accent-text)] opacity-70"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Your Collection
              </span>
            </div>
            <p
              className="text-[8px] uppercase tracking-[0.3em] text-[var(--lm-text-muted)] mt-1 font-mono"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              {items.length} {items.length === 1 ? "item" : "items"} selected
            </p>
          </div>

          <button
            onClick={() => setCartOpen(false)}
            className="p-2 text-[var(--lm-text-muted)] hover:text-[var(--lm-text-primary)] transition-colors duration-300 border border-transparent hover:border-[var(--lm-border-default)]"
            aria-label="Close cart"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          </button>
        </div>

        {/* ── Free Shipping Progress Bar ── */}
        {items.length > 0 && (
          <div className="px-6 pt-4 pb-2 border-b border-[var(--lm-border-subtle)]">
            <FreeShippingBar currentTotal={rawSubtotal} />
          </div>
        )}

        {/* ── Body: Item List or Empty State ── */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-none">
          {items.length === 0 ? (
            <CartEmptyState onClose={() => setCartOpen(false)} />
          ) : (
            <>
              {/* Item Rows */}
              <div className="flex flex-col gap-6">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 py-4 border-b border-[var(--lm-border-subtle)] group"
                  >
                    {/* Image */}
                    <Link
                      href={`/products/${item.productId}`}
                      onClick={() => setCartOpen(false)}
                      className="w-20 h-24 bg-[var(--lm-surface-secondary)] border border-[var(--lm-border-default)] overflow-hidden flex-shrink-0 relative block"
                    >
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          style={{ filter: "saturate(0.8)" }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[7px] uppercase tracking-[0.2em] text-[var(--lm-text-muted)]">
                          No Image
                        </div>
                      )}
                    </Link>

                    {/* Meta & Actions */}
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <div className="flex items-start justify-between gap-3">
                          <Link
                            href={`/products/${item.productId}`}
                            onClick={() => setCartOpen(false)}
                            className="text-[var(--lm-text-primary)] hover:text-[var(--lm-text-primary)] transition-colors truncate"
                            style={{
                              fontFamily: "'Cormorant Garamond', Georgia, serif",
                              fontSize: "1.1rem",
                              fontWeight: 400,
                            }}
                          >
                            {item.name}
                          </Link>
                          <span
                            className="text-[var(--lm-text-primary)] tabular-nums font-mono text-xs flex-shrink-0"
                            style={{ fontFamily: "var(--font-inter)" }}
                          >
                            {formatCurrency(item.price * item.quantity)}
                          </span>
                        </div>

                        {item.variantTitle && (
                          <p
                            className="text-[7.5px] uppercase tracking-[0.3em] text-[var(--lm-text-muted)] mt-0.5"
                            style={{ fontFamily: "var(--font-inter)" }}
                          >
                            {item.variantTitle}
                          </p>
                        )}
                      </div>

                      {/* Quantity Stepper */}
                      <div className="pt-3">
                        <CartQuantityStepper
                          quantity={item.quantity}
                          onUpdate={(q) => updateQuantity(item.id, q)}
                          onRemove={() => removeItem(item.id)}
                          size="sm"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* In-Cart Recommendations */}
              <CartRecommendations />
            </>
          )}
        </div>

        {/* ── Footer Summary & Checkout CTA ── */}
        {items.length > 0 && (
          <div className="p-6 border-t border-[var(--lm-border-default)] bg-[var(--lm-surface-secondary)] bg-opacity-80 space-y-4">
            
            {/* Coupon input */}
            <CartCouponInput appliedCoupon={coupon} onApply={setCoupon} />

            {/* Calculations */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-xs text-[var(--lm-text-muted)]">
                <span className="uppercase tracking-[0.3em]" style={{ fontFamily: "var(--font-inter)", fontSize: "7.5px" }}>
                  Subtotal
                </span>
                <span className="tabular-nums font-mono">{formatCurrency(rawSubtotal)}</span>
              </div>

              {coupon && (
                <div className="flex justify-between text-xs text-[var(--lm-accent-text)]">
                  <span className="uppercase tracking-[0.3em]" style={{ fontFamily: "var(--font-inter)", fontSize: "7.5px" }}>
                    Discount ({coupon.code})
                  </span>
                  <span className="tabular-nums font-mono">−{formatCurrency(discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between text-xs text-[var(--lm-text-muted)]">
                <span className="uppercase tracking-[0.3em]" style={{ fontFamily: "var(--font-inter)", fontSize: "7.5px" }}>
                  Shipping &amp; Taxes
                </span>
                <span className="uppercase tracking-[0.2em] text-[var(--lm-text-muted)]" style={{ fontFamily: "var(--font-inter)", fontSize: "7.5px" }}>
                  Calculated at checkout
                </span>
              </div>

              <div className="flex justify-between items-baseline pt-3 border-t border-[var(--lm-border-default)]">
                <span
                  className="text-[var(--lm-text-primary)] text-base"
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    letterSpacing: "0.02em",
                  }}
                >
                  Estimated Total
                </span>
                <span
                  className="text-[var(--lm-text-primary)] text-lg tabular-nums"
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontWeight: 300,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {formatCurrency(finalTotal)}
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <Link
                href="/cart"
                onClick={() => setCartOpen(false)}
                className="flex items-center justify-center py-3.5 border border-[var(--lm-border-strong)] text-[8.5px] uppercase tracking-[0.4em] text-[var(--lm-text-secondary)] hover:text-[var(--lm-text-primary)] hover:border-[var(--lm-border-default)] transition-all text-center"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                View Cart
              </Link>
              <Link
                href="/checkout"
                onClick={() => setCartOpen(false)}
                className="flex items-center justify-center gap-2 py-3.5 border border-[var(--lm-accent-border)] bg-[var(--lm-accent-muted)] text-[8.5px] uppercase tracking-[0.4em] text-[var(--lm-accent-text)] hover:bg-[var(--lm-accent-muted)] transition-all text-center"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Checkout
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M1 9L9 1M9 1H3M9 1V7" stroke="currentColor" strokeWidth="1.1" />
                </svg>
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
