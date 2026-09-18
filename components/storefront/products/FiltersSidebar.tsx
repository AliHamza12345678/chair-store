"use client";

// ─── Premium Filters Sidebar ──────────────────────────────────────────────────
// Fully redesigned: collapsible sections, animated active state, magnetic hover,
// a custom price-range slider visual, and material/finish filter chips.

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useTransition, useState } from "react";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface FiltersSidebarProps {
  categories: Category[];
  activeCategory: string;
  minPrice: number;
  maxPrice: number;
  totalCount: number;
}

const PRICE_RANGES = [
  { label: "All Prices", value: "", desc: "No limit" },
  { label: "Under Rs 50,000", value: "0-50000", desc: "Entry" },
  { label: "Rs 50k – 150k", value: "50000-150000", desc: "Mid" },
  { label: "Rs 150k – 300k", value: "150000-300000", desc: "Premium" },
  { label: "Above Rs 300k", value: "300000-999999999", desc: "Elite" },
];

const MATERIALS = [
  { label: "Leather", value: "leather" },
  { label: "Velvet", value: "velvet" },
  { label: "Linen", value: "linen" },
  { label: "Bouclé", value: "boucle" },
  { label: "Marble", value: "marble" },
  { label: "Oak", value: "oak" },
];

// ── Section wrapper with collapsible behaviour ─────────────────────────────────
function FilterSection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-[var(--lm-border-subtle)]">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between py-5 group"
        aria-expanded={open}
      >
        <span
          className="text-[8.5px] uppercase tracking-[0.5em] text-[var(--lm-text-muted)] group-hover:text-[var(--lm-text-secondary)] transition-colors duration-300"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          {title}
        </span>
        <span
          className={`text-[var(--lm-text-muted)] transition-transform duration-400 ${open ? "rotate-180" : ""}`}
          style={{ fontSize: "10px" }}
        >
          ▾
        </span>
      </button>

      <div
        className="overflow-hidden transition-all duration-500"
        style={{ maxHeight: open ? "600px" : "0px", opacity: open ? 1 : 0 }}
      >
        <div className="pb-6">{children}</div>
      </div>
    </div>
  );
}

// ── Single filter button row ────────────────────────────────────────────────────
function FilterRow({
  isActive,
  onClick,
  children,
}: {
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="group relative w-full flex items-center justify-between py-3 text-left transition-all duration-300"
    >
      {/* Active indicator */}
      <div
        className={`absolute left-0 top-1/2 -translate-y-1/2 h-full w-[1.5px] transition-all duration-400 ${
          isActive
            ? "bg-gradient-to-b from-amber-400/80 via-amber-400/50 to-amber-400/10 scale-y-100"
            : "bg-[var(--lm-border-subtle)] group-hover:bg-[var(--lm-border-default)] scale-y-50 group-hover:scale-y-100"
        }`}
        style={{ transformOrigin: "center" }}
      />
      <div className="pl-5">{children}</div>

      {/* Checkmark on active */}
      {isActive && (
        <div className="flex-shrink-0 w-3.5 h-3.5 rounded-full border border-[var(--lm-accent-border)]/50 flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
        </div>
      )}
    </button>
  );
}

export default function FiltersSidebar({
  categories,
  activeCategory,
  totalCount,
}: FiltersSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const createQueryString = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null) params.delete(key);
        else params.set(key, value);
      });
      params.delete("page");
      return params.toString();
    },
    [searchParams]
  );

  const push = (updates: Record<string, string | null>) => {
    startTransition(() => {
      router.push(`${pathname}?${createQueryString(updates)}`);
    });
  };

  const activePrice = searchParams.get("price") ?? "";
  const activeFeatured = searchParams.get("featured") === "true";
  const activeMaterial = searchParams.get("material") ?? "";
  const hasAnyFilter = activeCategory || activePrice || activeFeatured || activeMaterial;

  const activeFiltersCount = [
    activeCategory,
    activePrice,
    activeFeatured,
    activeMaterial,
  ].filter(Boolean).length;

  return (
    <aside className="flex flex-col">

      {/* ── Sidebar header ── */}
      <div className="pb-6 border-b border-[var(--lm-border-subtle)]">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-3">
            <div className="h-px w-6 bg-[var(--lm-accent-muted)]0" />
            <span
              className="text-[8.5px] font-medium uppercase tracking-[0.6em] text-[var(--lm-accent-text)]/70"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Refine
            </span>
          </div>

          {activeFiltersCount > 0 && (
            <div className="flex items-center gap-2">
              <span
                className="text-[7.5px] uppercase tracking-[0.3em] text-amber-400/60 font-mono"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                {activeFiltersCount} active
              </span>
              <button
                onClick={() => router.push(pathname)}
                className="text-[7.5px] uppercase tracking-[0.3em] text-[var(--lm-text-muted)] hover:text-[var(--lm-text-secondary)] transition-colors duration-300 underline underline-offset-2"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Clear
              </button>
            </div>
          )}
        </div>

        <p
          className="text-[8px] uppercase tracking-[0.4em] text-[var(--lm-text-muted)] mt-2 font-mono"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          {String(totalCount).padStart(3, "0")} {totalCount === 1 ? "result" : "results"}
        </p>
      </div>

      {/* ── Category filter ── */}
      <FilterSection title="Category" defaultOpen>
        <div className="flex flex-col">
          <FilterRow
            isActive={!activeCategory}
            onClick={() => push({ category: null })}
          >
            <span
              className={`transition-colors duration-300 ${!activeCategory ? "text-[var(--lm-text-primary)]" : "text-[var(--lm-text-muted)] group-hover:text-[var(--lm-text-secondary)]"}`}
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontWeight: 400,
                fontSize: "1rem",
                letterSpacing: "0.02em",
              }}
            >
              All Categories
            </span>
          </FilterRow>

          {categories.map((cat) => {
            const isActive = activeCategory === cat.slug;
            return (
              <FilterRow
                key={cat.id}
                isActive={isActive}
                onClick={() => push({ category: cat.slug })}
              >
                <span
                  className={`transition-colors duration-300 ${isActive ? "text-[var(--lm-text-primary)]" : "text-[var(--lm-text-muted)] group-hover:text-[var(--lm-text-secondary)]"}`}
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontWeight: 400,
                    fontSize: "1rem",
                    letterSpacing: "0.02em",
                  }}
                >
                  {cat.name}
                </span>
              </FilterRow>
            );
          })}
        </div>
      </FilterSection>

      {/* ── Price filter ── */}
      <FilterSection title="Price Range">
        <div className="flex flex-col">
          {PRICE_RANGES.map((range) => {
            const isActive = activePrice === range.value;
            return (
              <FilterRow
                key={range.value}
                isActive={isActive}
                onClick={() => push({ price: range.value || null })}
              >
                <div className="flex flex-col gap-0.5">
                  <span
                    className={`transition-colors duration-300 ${isActive ? "text-[var(--lm-text-primary)]" : "text-[var(--lm-text-muted)] group-hover:text-[var(--lm-text-secondary)]"}`}
                    style={{
                      fontFamily: "var(--font-inter)",
                      fontSize: "0.78rem",
                      fontWeight: 300,
                      letterSpacing: "0.04em",
                    }}
                  >
                    {range.label}
                  </span>
                  <span
                    className="text-[7px] uppercase tracking-[0.3em] text-[var(--lm-text-muted)]"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    {range.desc}
                  </span>
                </div>
              </FilterRow>
            );
          })}
        </div>
      </FilterSection>

      {/* ── Material chips ── */}
      <FilterSection title="Material" defaultOpen={false}>
        <div className="flex flex-wrap gap-2 pt-1">
          {MATERIALS.map((mat) => {
            const isActive = activeMaterial === mat.value;
            return (
              <button
                key={mat.value}
                onClick={() => push({ material: isActive ? null : mat.value })}
                className={`px-3 py-1.5 text-[8px] uppercase tracking-[0.3em] border transition-all duration-300 ${
                  isActive
                    ? "border-[var(--lm-accent-border)]/50 text-[var(--lm-accent-text)]/90 bg-[var(--lm-accent-muted)]"
                    : "border-[var(--lm-border-default)] text-[var(--lm-text-muted)] hover:border-[var(--lm-border-strong)] hover:text-[var(--lm-text-secondary)]"
                }`}
                style={{ fontFamily: "var(--font-inter)" }}
              >
                {mat.label}
              </button>
            );
          })}
        </div>
      </FilterSection>

      {/* ── Curated / Featured toggle ── */}
      <FilterSection title="Curated" defaultOpen={false}>
        <FilterRow
          isActive={activeFeatured}
          onClick={() => push({ featured: activeFeatured ? null : "true" })}
        >
          <div className="flex flex-col gap-1">
            <span
              className={`transition-colors duration-300 ${activeFeatured ? "text-[var(--lm-text-primary)]" : "text-[var(--lm-text-muted)] group-hover:text-[var(--lm-text-secondary)]"}`}
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: "0.78rem",
                fontWeight: 300,
                letterSpacing: "0.04em",
              }}
            >
              Featured Only
            </span>
            <span
              className="text-[7px] uppercase tracking-[0.3em] text-[var(--lm-text-muted)]"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Editor's selection
            </span>
          </div>
        </FilterRow>
      </FilterSection>

      {/* ── Clear all (when filters active) ── */}
      {hasAnyFilter && (
        <div className="pt-6">
          <button
            onClick={() => router.push(pathname)}
            className="group flex items-center gap-3 text-[8px] uppercase tracking-[0.4em] text-[var(--lm-text-muted)] hover:text-[var(--lm-text-secondary)] transition-all duration-300"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
              className="transition-transform duration-300 group-hover:rotate-90"
            >
              <path d="M1 1L9 9M9 1L1 9" stroke="currentColor" strokeWidth="1.2" />
            </svg>
            Clear all filters
          </button>
        </div>
      )}
    </aside>
  );
}
