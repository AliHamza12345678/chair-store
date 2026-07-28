// ─── Empty State ───────────────────────────────────────────────────────────────
// Editorial, art-directed empty state — no generic "no results" text.

"use client";

import { useRouter, usePathname } from "next/navigation";

interface ProductsEmptyStateProps {
  hasFilters?: boolean;
}

export default function ProductsEmptyState({ hasFilters = false }: ProductsEmptyStateProps) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="flex flex-col items-center justify-center py-32 px-6 text-center min-h-[50vh]">

      {/* ── Geometric art mark ── */}
      <div className="relative w-32 h-32 mb-12 flex-shrink-0">
        {/* Outer ring */}
        <div
          className="absolute inset-0 rounded-full border border-[var(--lm-border-subtle)]"
          style={{ animation: "spin 20s linear infinite" }}
        />
        {/* Middle ring */}
        <div
          className="absolute inset-4 rounded-full border border-[var(--lm-accent-border)]/10"
          style={{ animation: "spin 14s linear infinite reverse" }}
        />
        {/* Core mark */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            {/* Chair silhouette */}
            <path
              d="M8 20V12M24 20V12M8 16H24M10 26H22M13 12V8M19 12V8M10 8H22"
              stroke="rgba(180,140,60,0.3)"
              strokeWidth="1"
              strokeLinecap="round"
            />
          </svg>
        </div>
        {/* Corner marks */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[var(--lm-accent-muted)]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[var(--lm-accent-muted)]" />
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-[var(--lm-accent-muted)]" />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-[var(--lm-accent-muted)]" />
      </div>

      {/* ── Eyebrow ── */}
      <div className="flex items-center gap-4 mb-6">
        <div className="h-px w-10 bg-amber-400/30" />
        <span
          className="text-[8.5px] uppercase tracking-[0.6em] text-[var(--lm-accent-text)]/50"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          {hasFilters ? "No matches" : "Empty collection"}
        </span>
        <div className="h-px w-10 bg-amber-400/30" />
      </div>

      {/* ── Headline ── */}
      <h2
        className="text-[var(--lm-text-primary)] mb-4 leading-tight"
        style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontWeight: 300,
          fontSize: "clamp(2rem, 4vw, 3.5rem)",
          letterSpacing: "-0.01em",
        }}
      >
        {hasFilters ? (
          <>
            Nothing found{" "}
            <em style={{ fontStyle: "italic", color: "rgba(163,163,163,0.5)" }}>here.</em>
          </>
        ) : (
          <>
            The atelier is{" "}
            <em style={{ fontStyle: "italic", color: "rgba(163,163,163,0.5)" }}>preparing.</em>
          </>
        )}
      </h2>

      {/* ── Body ── */}
      <p
        className="text-[var(--lm-text-muted)] max-w-xs mb-10"
        style={{
          fontFamily: "var(--font-inter)",
          fontSize: "0.82rem",
          fontWeight: 300,
          lineHeight: 1.8,
          letterSpacing: "0.04em",
        }}
      >
        {hasFilters
          ? "Try adjusting your filters — our collection spans across categories and price ranges."
          : "New pieces are being prepared for this season. Check back shortly."}
      </p>

      {/* ── CTA ── */}
      {hasFilters ? (
        <button
          onClick={() => router.push(pathname)}
          className="group flex items-center gap-4 border border-[var(--lm-border-strong)] px-8 py-4 text-[8.5px] uppercase tracking-[0.45em] text-[var(--lm-text-secondary)] hover:border-white/30 hover:text-[var(--lm-text-primary)] transition-all duration-400"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          Clear filters
          <svg
            width="11"
            height="11"
            viewBox="0 0 11 11"
            fill="none"
            className="transition-transform duration-300 group-hover:rotate-45"
          >
            <path d="M1 10L10 1M10 1H3M10 1V8" stroke="currentColor" strokeWidth="1.1" />
          </svg>
        </button>
      ) : (
        <a
          href="/"
          className="group flex items-center gap-4 border border-[var(--lm-border-strong)] px-8 py-4 text-[8.5px] uppercase tracking-[0.45em] text-[var(--lm-text-secondary)] hover:border-white/30 hover:text-[var(--lm-text-primary)] transition-all duration-400"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          Return home
          <svg
            width="11"
            height="11"
            viewBox="0 0 11 11"
            fill="none"
            className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          >
            <path d="M1 10L10 1M10 1H3M10 1V8" stroke="currentColor" strokeWidth="1.1" />
          </svg>
        </a>
      )}
    </div>
  );
}
