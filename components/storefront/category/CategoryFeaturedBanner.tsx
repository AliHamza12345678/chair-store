"use client";

// ─── Category Featured Spotlight Banner ────────────────────────────────────────
// High-impact editorial banner highlighting the flagship piece in the category.

import Link from "next/link";
import { formatCurrency } from "@/lib/format-currency";

interface FeaturedProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  description: string;
  images: string[];
}

interface CategoryFeaturedBannerProps {
  product: FeaturedProduct;
  categoryName: string;
}

export default function CategoryFeaturedBanner({
  product,
  categoryName,
}: CategoryFeaturedBannerProps) {
  if (!product) return null;

  return (
    <div className="my-20 relative overflow-hidden bg-[var(--lm-surface-secondary)] border border-[var(--lm-border-default)]">
      {/* ── Background subtle glow ── */}
      <div
        className="absolute -right-20 -bottom-20 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, rgba(180,140,60,0.08) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-0 items-center">
        
        {/* Left: Image showcase */}
        <div className="lg:col-span-7 relative aspect-[4/3] lg:aspect-[16/11] overflow-hidden bg-[var(--lm-surface-primary)]">
          {product.images[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-[1200ms] hover:scale-[1.03]"
              style={{ filter: "saturate(0.8)" }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[var(--lm-text-muted)] text-[9px] uppercase tracking-[0.3em]">
              Spotlight Piece
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--lm-surface-secondary)] via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-[var(--lm-surface-secondary)]" />
          
          {/* Badge */}
          <div className="absolute top-6 left-6 z-10">
            <span
              className="text-[7.5px] uppercase tracking-[0.4em] text-[var(--lm-accent-text)]/80 bg-[var(--lm-surface-primary)]/60 px-3 py-1 border border-[var(--lm-accent-muted)]"
              style={{ fontFamily: "var(--font-inter)", backdropFilter: "blur(6px)" }}
            >
              Category Cornerstone
            </span>
          </div>
        </div>

        {/* Right: Editorial callout */}
        <div className="lg:col-span-5 p-8 lg:p-14 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8 bg-[var(--lm-accent-primary)]/40" />
            <span
              className="text-[8.5px] uppercase tracking-[0.5em] text-[var(--lm-accent-text)]/60"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Featured in {categoryName}
            </span>
          </div>

          <h3
            className="text-[var(--lm-text-primary)] mb-4 leading-tight"
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontWeight: 300,
              fontSize: "clamp(2rem, 3.5vw, 3.2rem)",
              letterSpacing: "-0.01em",
            }}
          >
            {product.name}
          </h3>

          <p
            className="text-[var(--lm-text-muted)] mb-8 line-clamp-3 leading-relaxed"
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "0.82rem",
              fontWeight: 300,
              letterSpacing: "0.03em",
              lineHeight: 1.8,
            }}
          >
            {product.description}
          </p>

          <div className="flex items-center gap-8 pt-4 border-t border-[var(--lm-border-default)]">
            <div>
              <span
                className="text-[7.5px] uppercase tracking-[0.4em] text-[var(--lm-text-muted)] block mb-1"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Investment
              </span>
              <span
                className="text-[var(--lm-text-primary)] tabular-nums"
                style={{
                  fontFamily: "var(--font-inter)",
                  fontSize: "1.1rem",
                  fontWeight: 300,
                  letterSpacing: "0.05em",
                }}
              >
                {formatCurrency(product.price)}
              </span>
            </div>

            <Link
              href={`/products/${product.slug}`}
              className="group flex items-center gap-3 border border-[var(--lm-border-strong)] px-6 py-3.5 text-[8.5px] uppercase tracking-[0.4em] text-[var(--lm-text-primary)] hover:border-[var(--lm-border-default)] hover:bg-[var(--lm-surface-hover)] transition-all duration-300 ml-auto"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Inspect Atelier
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
        </div>

      </div>
    </div>
  );
}
