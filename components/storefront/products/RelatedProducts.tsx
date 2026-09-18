"use client";

// ─── Related Products Carousel / Grid ──────────────────────────────────────────
// Shows curated related pieces from the same category or overall collection with premium cards.

import Link from "next/link";
import ProductCard, { ProductCardProduct } from "@/components/storefront/products/ProductCard";

interface RelatedProductsProps {
  products: ProductCardProduct[];
}

export default function RelatedProducts({ products }: RelatedProductsProps) {
  if (!products || products.length === 0) return null;

  return (
    <section className="mt-32 pt-20 border-t border-[var(--lm-border-default)]">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 gap-6">
        <div>
          <div className="flex items-center gap-4 mb-4">
            <span
              className="text-[9px] font-medium uppercase tracking-[0.6em] text-[var(--lm-accent-text)]/70"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Curated Selections
            </span>
            <div className="h-px w-12 bg-[var(--lm-accent-muted)]" />
          </div>

          <h2
            className="text-[var(--lm-text-primary)] leading-none"
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontWeight: 300,
              fontSize: "clamp(2rem, 4vw, 3.5rem)",
              letterSpacing: "-0.01em",
            }}
          >
            Complements{" "}
            <em style={{ fontStyle: "italic", color: "rgba(163,163,163,0.5)", fontWeight: 300 }}>
              &amp; Pairings.
            </em>
          </h2>
        </div>

        <Link
          href="/products"
          className="group inline-flex items-center gap-3 text-[9px] uppercase tracking-[0.4em] text-[var(--lm-text-muted)] hover:text-[var(--lm-text-primary)] transition-colors duration-300 pb-1 border-b border-[var(--lm-border-strong)] hover:border-white"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          View Full Catalog
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

      {/* ── Products Grid ── */}
      <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
        {products.slice(0, 4).map((product, index) => (
          <div
            key={product.id}
            className="animate-in"
            style={{ animationDelay: `${index * 80}ms`, animationFillMode: "both" }}
          >
            <ProductCard product={{ ...product, index }} view="grid" />
          </div>
        ))}
      </div>
    </section>
  );
}
