"use client";

// ─── Luxury Sort Toolbar ───────────────────────────────────────────────────────
// Redesigned with animated underline pills, view-mode toggle with 3 densities,
// magnetic active states, result count with animated transition flash.

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useTransition } from "react";

interface SortToolbarProps {
  totalCount: number;
  currentSort: string;
  currentView: "grid" | "grid-dense" | "list";
}

const SORT_OPTIONS = [
  { value: "newest", label: "New Arrivals" },
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price ↑" },
  { value: "price-desc", label: "Price ↓" },
];

// ── Grid icon (3-col) ──────────────────────────────────────────────────────────
function GridIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <rect x="0" y="0" width="6" height="6" rx="0.4" fill="currentColor" />
      <rect x="8.5" y="0" width="6" height="6" rx="0.4" fill="currentColor" />
      <rect x="0" y="8.5" width="6" height="6" rx="0.4" fill="currentColor" />
      <rect x="8.5" y="8.5" width="6" height="6" rx="0.4" fill="currentColor" />
    </svg>
  );
}

// ── Grid Dense icon (4-col) ────────────────────────────────────────────────────
function GridDenseIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <rect x="0" y="0" width="4" height="4" rx="0.3" fill="currentColor" />
      <rect x="5.5" y="0" width="4" height="4" rx="0.3" fill="currentColor" />
      <rect x="11" y="0" width="4" height="4" rx="0.3" fill="currentColor" />
      <rect x="0" y="5.5" width="4" height="4" rx="0.3" fill="currentColor" />
      <rect x="5.5" y="5.5" width="4" height="4" rx="0.3" fill="currentColor" />
      <rect x="11" y="5.5" width="4" height="4" rx="0.3" fill="currentColor" />
      <rect x="0" y="11" width="4" height="4" rx="0.3" fill="currentColor" />
      <rect x="5.5" y="11" width="4" height="4" rx="0.3" fill="currentColor" />
      <rect x="11" y="11" width="4" height="4" rx="0.3" fill="currentColor" />
    </svg>
  );
}

// ── List icon ─────────────────────────────────────────────────────────────────
function ListIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <rect x="0" y="0" width="4" height="4" rx="0.4" fill="currentColor" />
      <rect x="6" y="1" width="9" height="2" rx="0.5" fill="currentColor" />
      <rect x="0" y="5.5" width="4" height="4" rx="0.4" fill="currentColor" />
      <rect x="6" y="6.5" width="9" height="2" rx="0.5" fill="currentColor" />
      <rect x="0" y="11" width="4" height="4" rx="0.4" fill="currentColor" />
      <rect x="6" y="12" width="9" height="2" rx="0.5" fill="currentColor" />
    </svg>
  );
}

export default function SortToolbar({
  totalCount,
  currentSort,
  currentView,
}: SortToolbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const createQueryString = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null) params.delete(key);
        else params.set(key, value);
      });
      return params.toString();
    },
    [searchParams]
  );

  const push = (updates: Record<string, string | null>) => {
    startTransition(() => {
      router.push(`${pathname}?${createQueryString(updates)}`);
    });
  };

  const viewOptions: { value: SortToolbarProps["currentView"]; Icon: React.FC; label: string }[] = [
    { value: "grid", Icon: GridIcon, label: "Standard grid" },
    { value: "grid-dense", Icon: GridDenseIcon, label: "Dense grid" },
    { value: "list", Icon: ListIcon, label: "List view" },
  ];

  return (
    <div
      className={`relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-b border-[var(--lm-border-subtle)] transition-opacity duration-500 ${
        isPending ? "opacity-40 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* ── Left: result count ── */}
      <div className="flex items-center gap-4">
        <div
          className={`font-mono text-[8.5px] uppercase tracking-[0.45em] transition-all duration-300 ${
            isPending ? "text-amber-400/40" : "text-[var(--lm-text-muted)]"
          }`}
          style={{ fontFamily: "var(--font-inter)" }}
        >
          <span className="text-[var(--lm-text-secondary)]">{String(totalCount).padStart(3, "0")}</span>
          {" "}
          <span className="text-[var(--lm-text-muted)]">{totalCount === 1 ? "piece" : "pieces"}</span>
        </div>

        {/* Loading indicator */}
        {isPending && (
          <div className="flex items-center gap-1.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-1 h-1 rounded-full bg-[var(--lm-accent-muted)]0"
                style={{
                  animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
                }}
              />
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-5">

        {/* ── Sort pills ── */}
        <div className="flex items-center gap-0.5 relative">
          {SORT_OPTIONS.map((opt) => {
            const isActive = currentSort === opt.value || (!currentSort && opt.value === "newest");
            return (
              <button
                key={opt.value}
                onClick={() => push({ sort: opt.value })}
                className={`relative px-3.5 py-2 text-[8px] uppercase tracking-[0.35em] transition-all duration-300 ${
                  isActive
                    ? "text-[var(--lm-text-primary)]"
                    : "text-[var(--lm-text-muted)] hover:text-[var(--lm-text-secondary)]"
                }`}
                style={{ fontFamily: "var(--font-inter)" }}
              >
                {/* Active background pill */}
                {isActive && (
                  <span
                    className="absolute inset-0 border border-[var(--lm-border-strong)] bg-[var(--lm-border-subtle)]"
                    style={{ borderRadius: "1px" }}
                  />
                )}
                <span className="relative z-10">{opt.label}</span>

                {/* Active underline bar */}
                {isActive && (
                  <span
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 h-px bg-amber-400/60 transition-all duration-400"
                    style={{ width: "calc(100% - 16px)" }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* ── Divider ── */}
        <div className="h-5 w-px bg-[var(--lm-border-subtle)]" />

        {/* ── View toggle ── */}
        <div className="flex items-center gap-0.5">
          {viewOptions.map(({ value, Icon, label }) => {
            const isActive = currentView === value || (!currentView && value === "grid");
            return (
              <button
                key={value}
                onClick={() => push({ view: value })}
                aria-label={label}
                className={`relative p-2.5 transition-all duration-300 border ${
                  isActive
                    ? "border-[var(--lm-border-strong)] text-[var(--lm-text-primary)] bg-[var(--lm-border-subtle)]"
                    : "border-transparent text-[var(--lm-text-muted)] hover:text-[var(--lm-text-secondary)] hover:border-[var(--lm-border-default)]"
                }`}
              >
                <Icon />
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-px bg-amber-400/60" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
