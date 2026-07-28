"use client";

// ─── Free Shipping Estimator Bar ──────────────────────────────────────────────
// Dynamic progress bar calculating progress towards free delivery threshold.

import { formatCurrency } from "@/lib/format-currency";

const FREE_SHIPPING_THRESHOLD = 50000;

interface FreeShippingBarProps {
  currentTotal: number;
}

export default function FreeShippingBar({ currentTotal }: FreeShippingBarProps) {
  const diff = Math.max(0, FREE_SHIPPING_THRESHOLD - currentTotal);
  const progressPct = Math.min(100, (currentTotal / FREE_SHIPPING_THRESHOLD) * 100);
  const isUnlocked = diff === 0;

  return (
    <div className="py-4 px-5 bg-[var(--lm-surface-secondary)] border border-[var(--lm-border-default)] rounded-none">
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <svg
            width="14"
            height="14"
            viewBox="0 0 16 16"
            fill="none"
            className={isUnlocked ? "text-[var(--lm-accent-primary)]" : "text-[var(--lm-text-muted)]"}
          >
            <path
              d="M1 5H11M15 11H5M11 1V5M5 11V15"
              stroke="currentColor"
              strokeWidth="1.1"
              strokeLinecap="round"
            />
            <rect x="1" y="5" width="10" height="6" stroke="currentColor" strokeWidth="1.1" />
          </svg>
          <span
            className="text-[8px] uppercase tracking-[0.4em] text-[var(--lm-text-secondary)]"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            {isUnlocked ? "Free Delivery Unlocked" : "Complimentary Delivery"}
          </span>
        </div>

        <span
          className="text-[8px] font-mono tracking-[0.2em] text-[var(--lm-accent-text)]"
          style={{ fontFamily: "var(--font-inter)", opacity: 0.8 }}
        >
          {isUnlocked ? "100%" : `${Math.round(progressPct)}%`}
        </span>
      </div>

      {/* Progress Bar Track */}
      <div className="relative h-1 bg-[var(--lm-border-subtle)] overflow-hidden">
        <div
          className="absolute left-0 top-0 h-full bg-gradient-to-r from-[var(--lm-accent-primary)] to-[var(--lm-accent-text)] transition-all duration-700 ease-out"
          style={{ width: `${progressPct}%`, opacity: 0.8 }}
        />
      </div>

      {/* Status Message */}
      <p
        className="mt-2 text-[7.5px] uppercase tracking-[0.3em] text-[var(--lm-text-muted)]"
        style={{ fontFamily: "var(--font-inter)" }}
      >
        {isUnlocked ? (
          <span className="text-[var(--lm-accent-text)] font-medium">Your collection qualifies for free standard delivery</span>
        ) : (
          <>
            Add <span className="text-[var(--lm-text-secondary)]">{formatCurrency(diff)}</span> more to unlock free delivery
          </>
        )}
      </p>
    </div>
  );
}
