"use client";

import Link from "next/link";
import { formatCurrency } from "@/lib/format-currency";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  images: string[];
}

interface FeaturedProductsProps {
  products: Product[];
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  return (
    <section className="relative bg-[var(--lm-surface-primary)] py-44 overflow-hidden">

      {/* ── Decorative horizontal rule at top ── */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--lm-border-default)] to-transparent" />

      <div className="mx-auto max-w-7xl px-6 sm:px-12 lg:px-20">

        {/* ── Section Header ── */}
        <div className="mb-24 flex flex-col lg:flex-row lg:items-end justify-between gap-12">
          <div>
            <div className="flex items-center gap-4 mb-8">
              <span
                className="text-[9px] font-medium uppercase tracking-[0.6em] text-[var(--lm-accent-text)]/70"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Chapter III
              </span>
              <div className="h-px w-16 bg-[var(--lm-accent-primary)]/15" />
            </div>

            <h2
              className="leading-none text-[var(--lm-text-primary)]"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontWeight: 300,
                fontSize: "clamp(2.75rem, 5.5vw, 5.5rem)",
                letterSpacing: "-0.01em",
              }}
            >
              Featured
              <br />
              <em style={{ fontStyle: "italic", color: "var(--lm-text-muted)", fontWeight: 300 }}>
                Selections.
              </em>
            </h2>
          </div>

          <Link
            href="/products"
            className="group self-start hidden md:inline-flex items-center gap-3 text-[9.5px] uppercase tracking-[0.4em] text-[var(--lm-text-muted)] transition-all duration-400 hover:text-[var(--lm-text-primary)] pb-1 border-b border-[var(--lm-border-default)] hover:border-[var(--lm-text-primary)]"
          >
            View All Pieces
            <svg
              width="11"
              height="11"
              viewBox="0 0 11 11"
              fill="none"
              className="transition-transform duration-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            >
              <path d="M1 10L10 1M10 1H3M10 1V8" stroke="currentColor" strokeWidth="1.1" />
            </svg>
          </Link>
        </div>

        {/* ── Product Grid ── */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-4">
          {products.map((product, index) => (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              className={`group flex flex-col ${index % 2 === 1 ? "xl:mt-16" : ""}`}
            >
              {/* Image Container */}
              <div className="relative aspect-[4/5] overflow-hidden bg-[var(--lm-surface-secondary)]">

                {product.images?.[0] ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="absolute inset-0 h-full w-full object-cover transition-all duration-[1200ms] ease-out group-hover:scale-[1.05]"
                    style={{ filter: "saturate(0.8)" }}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-[9px] uppercase tracking-[0.3em] text-[var(--lm-text-muted)]">
                    No Image
                  </div>
                )}

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-50 transition-opacity duration-700 group-hover:opacity-70" />

                {/* Top-right index number */}
                <div className="absolute top-5 left-5">
                  <span
                    className="text-[8.5px] font-mono tracking-[0.4em] text-[var(--lm-text-muted)] group-hover:text-[var(--lm-accent-primary)]/50 transition-colors duration-500"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                {/* Hover action icon */}
                <div
                  className="absolute right-5 bottom-5 flex h-10 w-10 items-center justify-center border border-transparent transition-all duration-500 group-hover:border-[var(--lm-border-strong)] group-hover:bg-[var(--lm-surface-hover)] translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100"
                  style={{ backdropFilter: "blur(8px)" }}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-[var(--lm-text-primary)]">
                    <path d="M2 12L12 2M12 2H5M12 2V9" stroke="currentColor" strokeWidth="1.2" />
                  </svg>
                </div>

                {/* Border on hover */}
                <div className="absolute inset-0 border border-transparent transition-all duration-700 group-hover:border-[var(--lm-border-default)] pointer-events-none" />
              </div>

              {/* ── Product Info ── */}
              <div className="mt-6 space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <h3
                    className="text-[var(--lm-text-primary)] transition-colors duration-300 group-hover:text-[var(--lm-text-primary)]"
                    style={{
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                      fontWeight: 400,
                      fontSize: "1.2rem",
                      letterSpacing: "0.02em",
                    }}
                  >
                    {product.name}
                  </h3>
                </div>

                {/* Accent rule — animates width on hover */}
                <div className="h-px w-8 bg-[var(--lm-accent-primary)]/40 transition-all duration-500 group-hover:w-14 group-hover:bg-[var(--lm-accent-primary)]/70" />

                <p
                  className="text-[var(--lm-text-muted)] transition-colors duration-300 group-hover:text-[var(--lm-text-secondary)]"
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontSize: "0.8rem",
                    letterSpacing: "0.12em",
                    fontWeight: 400,
                  }}
                >
                  {formatCurrency(product.price)}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* ── Mobile view-all ── */}
        <div className="mt-16 flex justify-center md:hidden">
          <Link
            href="/products"
            className="inline-flex items-center gap-3 border border-[var(--lm-border-strong)] px-8 py-4 text-[9.5px] uppercase tracking-[0.4em] text-[var(--lm-text-secondary)] transition-all duration-300 hover:border-[var(--lm-text-primary)] hover:text-[var(--lm-text-primary)]"
          >
            View All Pieces
          </Link>
        </div>

      </div>
    </section>
  );
}