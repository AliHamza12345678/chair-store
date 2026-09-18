import Link from "next/link";
import { formatCurrency } from "@/lib/format-currency";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  images: string[];
}

interface CollectionsProps {
  products: Product[];
}

const collectionLabels = ["New Season", "Essential", "Signature", "Reserve"];
const collectionSubtext = [
  "Just arrived",
  "Everyday luxury",
  "Our most distinct",
  "Limited edition",
];

export default function Collections({ products }: CollectionsProps) {
  return (
    <section className="relative overflow-hidden bg-[var(--lm-surface-secondary)]">

      {/* ── Decorative top line ── */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--lm-accent-primary)]/15 to-transparent" />

      {/* ── Left editorial column ── */}
      <div className="mx-auto max-w-7xl px-6 sm:px-12 lg:px-20 py-44">

        {/* Header row */}
        <div className="mb-20 flex flex-col lg:flex-row lg:items-end justify-between gap-10">
          <div>
            <div className="flex items-center gap-4 mb-8">
              <span
                className="text-[9px] font-medium uppercase tracking-[0.6em] text-[var(--lm-accent-text)]/70"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Chapter IV
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
              New
              <br />
              <em style={{ fontStyle: "italic", color: "var(--lm-text-muted)", fontWeight: 300 }}>
                Arrivals.
              </em>
            </h2>
          </div>

          <p
            className="max-w-xs text-[var(--lm-text-muted)] leading-[1.8] lg:text-right"
            style={{ fontSize: "0.85rem", fontWeight: 300 }}
          >
            The latest additions to the Lumina atelier — objects that carry both
            weight and lightness.
          </p>
        </div>

        {/* ── Editorial List View ── */}
        <div className="divide-y divide-[var(--lm-border-subtle)]">
          {products.map((product, index) => (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              className="group flex items-center gap-6 sm:gap-10 py-8 transition-all duration-500 hover:pl-3"
              style={{ borderTop: index === 0 ? "1px solid var(--lm-border-subtle)" : undefined }}
            >
              {/* Index */}
              <span
                className="w-8 flex-shrink-0 text-[8.5px] font-mono tracking-[0.4em] text-[var(--lm-text-muted)] group-hover:text-[var(--lm-accent-primary)]/60 transition-colors duration-500"
              >
                {String(index + 1).padStart(2, "0")}
              </span>

              {/* Thumbnail */}
              <div className="relative h-20 w-16 flex-shrink-0 overflow-hidden bg-[var(--lm-surface-elevated)] sm:h-24 sm:w-20">
                {product.images?.[0] ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    style={{ filter: "saturate(0.7) brightness(0.85)" }}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-[9px] uppercase tracking-[0.2em] text-[var(--lm-text-muted)]">
                    —
                  </div>
                )}
                <div className="absolute inset-0 border border-transparent transition-all duration-500 group-hover:border-[var(--lm-border-strong)]" />
              </div>

              {/* Name & tag */}
              <div className="flex-1 min-w-0">
                <div className="mb-1.5">
                  <span
                    className="text-[8px] uppercase tracking-[0.4em] text-[var(--lm-accent-primary)]/50 group-hover:text-[var(--lm-accent-primary)]/80 transition-colors duration-400"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    {collectionLabels[index % collectionLabels.length]}
                  </span>
                </div>
                <h3
                  className="truncate text-[var(--lm-text-secondary)] transition-colors duration-300 group-hover:text-[var(--lm-text-primary)]"
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: "clamp(1.1rem, 1.6vw, 1.5rem)",
                    fontWeight: 400,
                    letterSpacing: "0.025em",
                  }}
                >
                  {product.name}
                </h3>
                <p
                  className="mt-1 text-[var(--lm-text-muted)] group-hover:text-[var(--lm-text-secondary)] transition-colors duration-300"
                  style={{ fontSize: "0.75rem", fontFamily: "var(--font-inter)", letterSpacing: "0.08em" }}
                >
                  {collectionSubtext[index % collectionSubtext.length]}
                </p>
              </div>

              {/* Price */}
              <div className="hidden sm:block text-right flex-shrink-0">
                <span
                  className="text-[var(--lm-text-secondary)] group-hover:text-[var(--lm-text-primary)] transition-colors duration-300"
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontSize: "0.825rem",
                    letterSpacing: "0.12em",
                    fontWeight: 400,
                  }}
                >
                  {formatCurrency(product.price)}
                </span>
              </div>

              {/* Arrow */}
              <div className="flex-shrink-0 opacity-0 translate-x-[-6px] transition-all duration-400 group-hover:opacity-100 group-hover:translate-x-0">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="text-[var(--lm-text-secondary)]">
                  <path d="M3 15L15 3M15 3H7M15 3V11" stroke="currentColor" strokeWidth="1.2" />
                </svg>
              </div>

            </Link>
          ))}
        </div>

        {/* View all */}
        <div className="mt-14 flex items-center gap-8">
          <div className="h-px flex-1 max-w-[60px] bg-[var(--lm-border-default)]" />
          <Link
            href="/products"
            className="group inline-flex items-center gap-3 text-[9.5px] uppercase tracking-[0.45em] text-[var(--lm-text-muted)] hover:text-[var(--lm-text-primary)] transition-all duration-400 pb-1 border-b border-[var(--lm-border-default)] hover:border-[var(--lm-text-primary)]"
          >
            Explore All
          </Link>
        </div>

      </div>
    </section>
  );
}
