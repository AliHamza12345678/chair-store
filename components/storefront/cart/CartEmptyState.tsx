"use client";

// ─── Luxury Cart Empty State ──────────────────────────────────────────────────
// Art-directed empty cart graphics with rotating geometric rings and action link.

import Link from "next/link";

interface CartEmptyStateProps {
  onClose?: () => void;
}

export default function CartEmptyState({ onClose }: CartEmptyStateProps) {
  return (
    <div className="h-full flex flex-col items-center justify-center p-8 text-center min-h-[450px]">
      
      {/* Geometric mark */}
      <div className="relative w-28 h-28 mb-8 flex-shrink-0">
        <div
          className="absolute inset-0 rounded-full border border-[var(--lm-border-subtle)]"
          style={{ animation: "spin 20s linear infinite" }}
        />
        <div
          className="absolute inset-3 rounded-full border border-[var(--lm-accent-border)]"
          style={{ animation: "spin 12s linear infinite reverse" }}
        />
        <div className="absolute inset-0 flex items-center justify-center text-[var(--lm-accent-text)] opacity-40">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path
              d="M7 17.5C7 17.5 7 7 14 7C21 7 21 17.5 21 17.5M4 17.5H24M8.75 22.75V17.5M19.25 22.75V17.5"
              stroke="currentColor"
              strokeWidth="1.1"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      <span
        className="text-[8.5px] uppercase tracking-[0.55em] text-[var(--lm-accent-text)] opacity-60 mb-3"
        style={{ fontFamily: "var(--font-inter)" }}
      >
        Your Atelier
      </span>

      <h3
        className="text-[var(--lm-text-primary)] text-2xl font-light mb-3"
        style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          letterSpacing: "0.02em",
        }}
      >
        Your collection is empty
      </h3>

      <p
        className="text-[var(--lm-text-muted)] text-xs leading-relaxed max-w-xs mb-8"
        style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}
      >
        Explore our curated pieces and begin curating your ideal interior atmosphere.
      </p>

      <Link
        href="/products"
        onClick={onClose}
        className="group inline-flex items-center gap-3 border border-[var(--lm-border-strong)] px-7 py-3.5 text-[8.5px] uppercase tracking-[0.4em] text-[var(--lm-text-primary)] hover:border-[var(--lm-border-default)] hover:bg-[var(--lm-surface-hover)] transition-all duration-300"
        style={{ fontFamily: "var(--font-inter)" }}
      >
        Explore Catalog
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        >
          <path d="M1 9L9 1M9 1H3M9 1V7" stroke="currentColor" strokeWidth="1.1" />
        </svg>
      </Link>
    </div>
  );
}
