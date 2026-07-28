"use client";

// ─── Category Navigation Switcher ─────────────────────────────────────────────
// Pill/tab bar allowing seamless navigation across all categories with active state indicators.

import Link from "next/link";
import { cn } from "@/lib/clsx";

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
}

interface CategoryNavProps {
  categories: CategoryItem[];
  currentSlug: string;
}

export default function CategoryNav({ categories, currentSlug }: CategoryNavProps) {
  if (!categories || categories.length === 0) return null;

  return (
    <div className="py-6 border-b border-[var(--lm-border-subtle)] overflow-x-auto scrollbar-none">
      <div className="flex items-center gap-2">
        <span
          className="text-[8px] uppercase tracking-[0.5em] text-[var(--lm-text-muted)] mr-4 flex-shrink-0"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          Salons:
        </span>

        <Link
          href="/products"
          className={cn(
            "relative px-4 py-2 text-[8px] uppercase tracking-[0.35em] transition-all duration-300 flex-shrink-0 border",
            !currentSlug
              ? "border-[var(--lm-accent-primary)]/40 text-[var(--lm-text-primary)] bg-[var(--lm-accent-primary)]/5"
              : "border-transparent text-[var(--lm-text-muted)] hover:text-[var(--lm-text-secondary)] hover:border-[var(--lm-border-default)]"
          )}
          style={{ fontFamily: "var(--font-inter)" }}
        >
          All Pieces
        </Link>

        {categories.map((cat) => {
          const isActive = cat.slug === currentSlug;
          return (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className={cn(
                "relative px-4 py-2 text-[8px] uppercase tracking-[0.35em] transition-all duration-300 flex-shrink-0 border",
                isActive
                  ? "border-[var(--lm-accent-primary)]/40 text-[var(--lm-text-primary)] bg-[var(--lm-accent-primary)]/5"
                  : "border-transparent text-[var(--lm-text-muted)] hover:text-[var(--lm-text-secondary)] hover:border-[var(--lm-border-default)]"
              )}
              style={{ fontFamily: "var(--font-inter)" }}
            >
              {isActive && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-px bg-[var(--lm-accent-primary)]/60" />
              )}
              {cat.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
