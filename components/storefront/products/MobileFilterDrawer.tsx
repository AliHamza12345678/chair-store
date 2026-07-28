"use client";

// ─── Mobile Filter Drawer ──────────────────────────────────────────────────────
// Full-screen slide-in drawer for mobile, triggered by a filter button
// in the SortToolbar area. Contains the full FiltersSidebar.

import { useState, useEffect } from "react";
import FiltersSidebar from "./FiltersSidebar";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface MobileFilterDrawerProps {
  categories: Category[];
  activeCategory: string;
  minPrice: number;
  maxPrice: number;
  totalCount: number;
}

export default function MobileFilterDrawer(props: MobileFilterDrawerProps) {
  const [open, setOpen] = useState(false);

  // Lock body scroll when drawer open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      {/* ── Trigger button ── */}
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden flex items-center gap-2.5 border border-[var(--lm-border-strong)] px-4 py-2.5 text-[8px] uppercase tracking-[0.4em] text-[var(--lm-text-muted)] hover:text-[var(--lm-text-primary)] hover:border-[var(--lm-border-strong)] transition-all duration-300"
        style={{ fontFamily: "var(--font-inter)" }}
      >
        <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
          <path d="M0 1H12M2 5H10M4 9H8" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
        </svg>
        Filters
      </button>

      {/* ── Backdrop ── */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-40 bg-black/80 transition-opacity duration-400 lg:hidden ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        style={{ backdropFilter: "blur(4px)" }}
        aria-hidden="true"
      />

      {/* ── Drawer panel ── */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-80 bg-[var(--lm-surface-primary)] border-r border-[var(--lm-border-default)] overflow-y-auto transition-transform duration-400 ease-out lg:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-6 border-b border-[var(--lm-border-subtle)] sticky top-0 bg-[var(--lm-surface-primary)] z-10">
          <div className="flex items-center gap-3">
            <div className="h-px w-6 bg-[var(--lm-accent-muted)]0" />
            <span
              className="text-[8.5px] uppercase tracking-[0.6em] text-[var(--lm-accent-text)]/70"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Refine
            </span>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="text-[var(--lm-text-muted)] hover:text-[var(--lm-text-primary)] transition-colors duration-300 p-1"
            aria-label="Close filters"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          </button>
        </div>

        {/* Sidebar content */}
        <div className="px-6 py-6">
          <FiltersSidebar {...props} />
        </div>
      </div>
    </>
  );
}
