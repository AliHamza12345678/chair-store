"use client";

// ─── Sticky Checkout Order Summary Panel ──────────────────────────────────────
// Luxury sidebar panel showing item thumbnail badges, coupon promo box,
// itemized costs, shipping calculation, and grand total.

import { CartItem } from "@/features/cart/store";
import { formatCurrency } from "@/lib/format-currency";
import CartCouponInput from "@/components/storefront/cart/CartCouponInput";

interface CheckoutSummaryProps {
  items: CartItem[];
  subtotal: number;
  flatShipping: number;
  deliveryMethod: "STANDARD" | "WHITE_GLOVE";
  appliedCoupon: { code: string; discountPct: number } | null;
  onApplyCoupon: (coupon: { code: string; discountPct: number } | null) => void;
  isProcessing: boolean;
}

export default function CheckoutSummary({
  items,
  subtotal,
  flatShipping,
  deliveryMethod,
  appliedCoupon,
  onApplyCoupon,
  isProcessing,
}: CheckoutSummaryProps) {
  const shippingFee = deliveryMethod === "WHITE_GLOVE" ? flatShipping + 2500 : flatShipping;
  const discountAmount = appliedCoupon ? (subtotal * appliedCoupon.discountPct) / 100 : 0;
  const grandTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  return (
    <div className="bg-[var(--lm-surface-secondary)] p-8 border border-[var(--lm-border-default)] space-y-6 sticky top-36">
      <h2
        className="text-[var(--lm-text-primary)] text-2xl font-light pb-4 border-b border-[var(--lm-border-subtle)]"
        style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
      >
        Collection Summary
      </h2>

      {/* Item thumbnails scroll list */}
      <div className="space-y-4 max-h-[320px] overflow-y-auto pr-1 scrollbar-none divide-y divide-[var(--lm-border-subtle)]">
        {items.map((item) => (
          <div key={item.id} className="pt-3 first:pt-0 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative flex-shrink-0">
                <div className="w-14 h-16 bg-[var(--lm-surface-secondary)] border border-[var(--lm-border-default)] overflow-hidden">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[7px] uppercase tracking-[0.2em] text-[var(--lm-text-muted)]">
                      Item
                    </div>
                  )}
                </div>
                <span className="absolute -top-2 -right-2 bg-amber-400 text-black text-[8px] font-mono font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {item.quantity}
                </span>
              </div>

              <div className="min-w-0">
                <h4
                  className="text-[var(--lm-text-primary)] text-sm truncate"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "1rem" }}
                >
                  {item.name}
                </h4>
                {item.variantTitle && (
                  <span className="text-[7.5px] uppercase tracking-[0.3em] text-[var(--lm-text-muted)] block" style={{ fontFamily: "var(--font-inter)" }}>
                    {item.variantTitle}
                  </span>
                )}
              </div>
            </div>

            <span className="text-[var(--lm-text-primary)] font-mono text-xs tabular-nums flex-shrink-0">
              {formatCurrency(item.price * item.quantity)}
            </span>
          </div>
        ))}
      </div>

      {/* Coupon */}
      <div className="pt-2">
        <CartCouponInput appliedCoupon={appliedCoupon} onApply={onApplyCoupon} />
      </div>

      {/* Itemized Calculation */}
      <div className="space-y-3 pt-4 border-t border-[var(--lm-border-default)]">
        <div className="flex justify-between text-xs text-[var(--lm-text-secondary)]">
          <span className="uppercase tracking-[0.3em]" style={{ fontFamily: "var(--font-inter)", fontSize: "8px" }}>
            Subtotal ({items.length} {items.length === 1 ? "item" : "items"})
          </span>
          <span className="tabular-nums font-mono">{formatCurrency(subtotal)}</span>
        </div>

        {appliedCoupon && (
          <div className="flex justify-between text-xs text-[var(--lm-accent-text)]">
            <span className="uppercase tracking-[0.3em]" style={{ fontFamily: "var(--font-inter)", fontSize: "8px" }}>
              Privilege Discount ({appliedCoupon.code})
            </span>
            <span className="tabular-nums font-mono">−{formatCurrency(discountAmount)}</span>
          </div>
        )}

        <div className="flex justify-between text-xs text-[var(--lm-text-secondary)]">
          <span className="uppercase tracking-[0.3em]" style={{ fontFamily: "var(--font-inter)", fontSize: "8px" }}>
            Delivery ({deliveryMethod === "WHITE_GLOVE" ? "White Glove" : "Standard"})
          </span>
          <span className="tabular-nums font-mono">{formatCurrency(shippingFee)}</span>
        </div>

        <div className="flex justify-between text-xs text-[var(--lm-text-secondary)]">
          <span className="uppercase tracking-[0.3em]" style={{ fontFamily: "var(--font-inter)", fontSize: "8px" }}>
            Estimated Tax
          </span>
          <span className="uppercase tracking-[0.2em] text-[var(--lm-text-muted)]" style={{ fontFamily: "var(--font-inter)", fontSize: "8px" }}>
            Included
          </span>
        </div>
      </div>

      {/* Grand Total */}
      <div className="pt-4 border-t border-[var(--lm-border-default)] flex justify-between items-baseline">
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
            letterSpacing: "-0.01em",
          }}
        >
          {formatCurrency(grandTotal)}
        </span>
      </div>

      {/* Security badge */}
      <div className="pt-2 flex items-center justify-center gap-2 text-center text-[var(--lm-text-muted)]">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-amber-400/50">
          <path d="M6 1L1.5 3V6.5C1.5 8.75 6 11 6 11C6 11 10.5 8.75 10.5 6.5V3L6 1Z" stroke="currentColor" strokeWidth="1" />
        </svg>
        <span className="text-[7.5px] uppercase tracking-[0.3em]" style={{ fontFamily: "var(--font-inter)" }}>
          256-Bit Encrypted Secure Checkout
        </span>
      </div>
    </div>
  );
}
