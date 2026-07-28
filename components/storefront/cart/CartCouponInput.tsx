"use client";

// ─── Luxury Cart Coupon Input ──────────────────────────────────────────────────
// Interactive coupon input field with code validation, instant discount calculation,
// and removable tag badge.

import { useState } from "react";
import { toast } from "sonner";

interface CartCouponInputProps {
  appliedCoupon: { code: string; discountPct: number } | null;
  onApply: (coupon: { code: string; discountPct: number } | null) => void;
}

const VALID_COUPONS: Record<string, number> = {
  ATELIER10: 10,
  LUMINA15: 15,
  WELCOME5: 5,
  VIP20: 20,
};

export default function CartCouponInput({ appliedCoupon, onApply }: CartCouponInputProps) {
  const [code, setCode] = useState("");
  const [isExpanding, setIsExpanding] = useState(false);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    const formatted = code.trim().toUpperCase();
    if (!formatted) return;

    if (VALID_COUPONS[formatted]) {
      const pct = VALID_COUPONS[formatted];
      onApply({ code: formatted, discountPct: pct });
      toast.success(`Coupon "${formatted}" applied (${pct}% OFF)`);
      setCode("");
    } else {
      toast.error(`Invalid promo code. Try "ATELIER10" or "LUMINA15"`);
    }
  };

  const handleRemove = () => {
    onApply(null);
    toast.info("Coupon removed");
  };

  if (appliedCoupon) {
    return (
      <div className="flex items-center justify-between py-2.5 px-4 bg-[var(--lm-accent-muted)] border border-[var(--lm-accent-border)]">
        <div className="flex items-center gap-2.5">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-[var(--lm-accent-primary)]">
            <path d="M2.5 6L5 8.5L9.5 3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
          <div>
            <span
              className="text-[8px] uppercase tracking-[0.4em] text-[var(--lm-accent-text)] font-mono"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              {appliedCoupon.code}
            </span>
            <span className="text-[7.5px] uppercase tracking-[0.2em] text-[var(--lm-text-muted)] block">
              {appliedCoupon.discountPct}% Discount Applied
            </span>
          </div>
        </div>

        <button
          onClick={handleRemove}
          className="text-[var(--lm-text-muted)] hover:text-[var(--lm-text-primary)] text-[8px] uppercase tracking-[0.3em] transition-colors p-1"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          Remove
        </button>
      </div>
    );
  }

  return (
    <div>
      {!isExpanding ? (
        <button
          onClick={() => setIsExpanding(true)}
          className="text-[8px] uppercase tracking-[0.4em] text-[var(--lm-text-muted)] hover:text-[var(--lm-text-primary)] transition-colors flex items-center gap-2"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M5 1V9M1 5H9" stroke="currentColor" strokeWidth="1.1" />
          </svg>
          Have a privilege code?
        </button>
      ) : (
        <form onSubmit={handleApply} className="flex gap-2">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="PROMO CODE (e.g. ATELIER10)"
            className="flex-1 bg-[var(--lm-surface-secondary)] border border-[var(--lm-border-default)] px-3 py-2 text-[8px] uppercase tracking-[0.3em] text-[var(--lm-text-primary)] placeholder:text-[var(--lm-text-muted)] focus:outline-none focus:border-[var(--lm-accent-border)]"
            style={{ fontFamily: "var(--font-inter)" }}
          />
          <button
            type="submit"
            className="px-4 py-2 border border-[var(--lm-border-strong)] text-[8px] uppercase tracking-[0.35em] text-[var(--lm-text-secondary)] hover:text-[var(--lm-text-primary)] hover:border-[var(--lm-border-default)] transition-all"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Apply
          </button>
        </form>
      )}
    </div>
  );
}
