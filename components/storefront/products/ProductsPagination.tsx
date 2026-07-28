"use client";

// ─── Luxury Pagination ─────────────────────────────────────────────────────────
// Architectural pagination with progress bar, page numbers, and prev/next.

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useTransition } from "react";

interface ProductsPaginationProps {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  perPage: number;
}

export default function ProductsPagination({
  currentPage,
  totalPages,
  totalCount,
  perPage,
}: ProductsPaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const createQueryString = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams.toString());
      if (page === 1) params.delete("page");
      else params.set("page", String(page));
      return params.toString();
    },
    [searchParams]
  );

  const goTo = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    startTransition(() => {
      const qs = createQueryString(page);
      router.push(`${pathname}${qs ? "?" + qs : ""}`);
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  };

  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * perPage + 1;
  const endItem = Math.min(currentPage * perPage, totalCount);
  const progressPct = (currentPage / totalPages) * 100;

  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages: (number | "...")[] = [];
    if (currentPage <= 3) {
      pages.push(1, 2, 3, 4, "...", totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
    }
    return pages;
  };

  return (
    <div className={`mt-24 flex flex-col items-center gap-8 transition-opacity duration-300 ${isPending ? "opacity-50" : "opacity-100"}`}>

      {/* ── Progress bar ── */}
      <div className="w-full max-w-xs">
        <div className="relative h-px bg-[var(--lm-surface-hover)] w-full">
          <div
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-amber-400/60 to-amber-400/20 transition-all duration-700"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <div className="flex items-center justify-between mt-3">
          <span
            className="text-[8px] uppercase tracking-[0.4em] text-[var(--lm-text-muted)] font-mono"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            {String(startItem).padStart(2, "0")}–{String(endItem).padStart(2, "0")}
          </span>
          <span
            className="text-[8px] uppercase tracking-[0.4em] text-[var(--lm-text-muted)] font-mono"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            of {String(totalCount).padStart(3, "0")}
          </span>
        </div>
      </div>

      {/* ── Page controls ── */}
      <div className="flex items-center gap-1">

        {/* Prev */}
        <button
          onClick={() => goTo(currentPage - 1)}
          disabled={currentPage === 1 || isPending}
          className="group p-3 border border-transparent text-[var(--lm-text-muted)] hover:text-[var(--lm-text-primary)] hover:border-[var(--lm-border-strong)] transition-all duration-300 disabled:opacity-20 disabled:pointer-events-none"
          aria-label="Previous page"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="transition-transform duration-300 group-hover:-translate-x-0.5">
            <path d="M8 1L3 6L8 11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </button>

        {/* Page numbers */}
        {getPageNumbers().map((page, i) => {
          if (page === "...") {
            return (
              <span
                key={`ellipsis-${i}`}
                className="px-2 py-3 text-[var(--lm-text-muted)]"
                style={{ fontFamily: "var(--font-inter)", fontSize: "0.75rem" }}
              >
                ···
              </span>
            );
          }

          const isActive = page === currentPage;
          return (
            <button
              key={page}
              onClick={() => goTo(page as number)}
              disabled={isPending}
              className={`relative min-w-[36px] h-9 px-2 text-[8.5px] font-mono tracking-[0.2em] transition-all duration-300 border ${
                isActive
                  ? "border-[var(--lm-accent-border)] text-[var(--lm-text-primary)]"
                  : "border-transparent text-[var(--lm-text-muted)] hover:text-[var(--lm-text-secondary)] hover:border-[var(--lm-border-strong)]"
              }`}
              style={{ fontFamily: "var(--font-inter)" }}
            >
              {isActive && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-px bg-amber-400/60" />
              )}
              {String(page).padStart(2, "0")}
            </button>
          );
        })}

        {/* Next */}
        <button
          onClick={() => goTo(currentPage + 1)}
          disabled={currentPage === totalPages || isPending}
          className="group p-3 border border-transparent text-[var(--lm-text-muted)] hover:text-[var(--lm-text-primary)] hover:border-[var(--lm-border-strong)] transition-all duration-300 disabled:opacity-20 disabled:pointer-events-none"
          aria-label="Next page"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="transition-transform duration-300 group-hover:translate-x-0.5">
            <path d="M4 1L9 6L4 11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* ── Page indicator ── */}
      <span
        className="text-[8px] uppercase tracking-[0.45em] text-[var(--lm-text-muted)]"
        style={{ fontFamily: "var(--font-inter)" }}
      >
        Page {String(currentPage).padStart(2, "0")} of {String(totalPages).padStart(2, "0")}
      </span>
    </div>
  );
}
