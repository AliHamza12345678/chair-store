"use client";

// ─── Order Confirmation Success Screen ────────────────────────────────────────
// Luxury order confirmation screen with rotating gold marks, order reference code,
// order summary breakdown, and return links.

import Link from "next/link";
import { useRouter } from "next/navigation";

interface CheckoutSuccessProps {
  orderId: string;
}

export default function CheckoutSuccess({ orderId }: CheckoutSuccessProps) {
  const router = useRouter();
  const refCode = orderId.slice(-8).toUpperCase();

  return (
    <div className="bg-[var(--lm-surface-elevated)] text-[var(--lm-text-primary)] min-h-screen pt-36 pb-28 flex items-center justify-center">
      <div className="mx-auto max-w-xl px-6 text-center">
        
        {/* Animated Rotating Gold Seal */}
        <div className="relative w-32 h-32 mx-auto mb-10">
          <div
            className="absolute inset-0 rounded-full border border-[var(--lm-accent-border)]/20"
            style={{ animation: "spin 25s linear infinite" }}
          />
          <div
            className="absolute inset-4 rounded-full border border-[var(--lm-accent-border)]/40"
            style={{ animation: "spin 15s linear infinite reverse" }}
          />
          <div className="absolute inset-0 flex items-center justify-center text-[var(--lm-accent-primary)]">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path
                d="M6 16L12.5 22.5L26 9"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Eyebrow */}
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="h-px w-8 bg-amber-400/40" />
          <span
            className="text-[9px] font-medium uppercase tracking-[0.65em] text-[var(--lm-accent-text)]/80"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Order Confirmed
          </span>
          <div className="h-px w-8 bg-amber-400/40" />
        </div>

        {/* Headline */}
        <h1
          className="text-[var(--lm-text-primary)] text-4xl sm:text-5xl font-light mb-4 leading-tight"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
        >
          Thank you for your order.
        </h1>

        <p
          className="text-[var(--lm-text-secondary)] text-xs sm:text-sm leading-relaxed max-w-md mx-auto mb-8"
          style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}
        >
          Your collection request has been logged into the Lumina Atelier registry. Our concierge team is now preparing your shipment.
        </p>

        {/* Reference Box */}
        <div className="p-6 bg-[var(--lm-surface-secondary)] border border-[var(--lm-border-default)] mb-10 max-w-md mx-auto space-y-2">
          <span
            className="text-[8px] uppercase tracking-[0.4em] text-[var(--lm-text-muted)] block"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Official Order Reference
          </span>
          <span
            className="text-[var(--lm-accent-text)] font-mono text-xl tracking-[0.25em] block"
          >
            #{refCode}
          </span>
          <span
            className="text-[7.5px] uppercase tracking-[0.2em] text-[var(--lm-text-muted)] block pt-1"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Confirmation email dispatched
          </span>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => router.push("/account")}
            className="group flex items-center justify-center gap-3 border border-[var(--lm-accent-border)]/60 bg-[var(--lm-accent-muted)] px-8 py-4 text-[8.5px] uppercase tracking-[0.45em] text-[var(--lm-accent-text)] hover:bg-[var(--lm-accent-muted)] transition-all w-full sm:w-auto"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            View Account &amp; Orders
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              <path d="M1 5H9M9 5L5 1M9 5L5 9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </button>

          <Link
            href="/products"
            className="flex items-center justify-center py-4 px-8 border border-[var(--lm-border-strong)] text-[8.5px] uppercase tracking-[0.4em] text-[var(--lm-text-secondary)] hover:text-[var(--lm-text-primary)] hover:border-white/30 transition-all w-full sm:w-auto"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Return to Store
          </Link>
        </div>

      </div>
    </div>
  );
}
