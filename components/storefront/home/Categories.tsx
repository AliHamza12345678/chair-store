import Link from "next/link";

interface Category {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
}

interface CategoriesProps {
  categories: Category[];
}

export default function Categories({ categories }: CategoriesProps) {
  const aspectRatios = ["aspect-[3/4]", "aspect-[2/3]", "aspect-[3/4]"];
  const verticalOffsets = ["lg:translate-y-0", "lg:translate-y-20", "lg:translate-y-8"];

  return (
    <section className="relative bg-[var(--lm-surface-primary)] py-44 overflow-hidden">

      {/* ── Decorative Vertical Rule ── */}
      <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-[var(--lm-accent-primary)]/15 to-transparent" />

      <div className="mx-auto max-w-7xl px-6 sm:px-12 lg:px-20">

        {/* ── Section Header ── */}
        <div className="mb-28 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 items-end">
          <div>
            <div className="flex items-center gap-4 mb-8">
              <span
                className="inline-block text-[9px] font-medium uppercase tracking-[0.6em] text-[var(--lm-accent-text)]/70"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Chapter II
              </span>
              <div className="h-px flex-1 bg-[var(--lm-accent-primary)]/15" />
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
              Curated
              <br />
              <em
                style={{
                  fontStyle: "italic",
                  color: "var(--lm-text-muted)",
                  fontWeight: 300,
                }}
              >
                Atmospheres.
              </em>
            </h2>
          </div>

          <div className="flex flex-col gap-6 lg:items-end lg:pb-2">
            <p
              className="max-w-xs text-[var(--lm-text-muted)] leading-[1.8]"
              style={{ fontSize: "0.875rem", fontWeight: 300 }}
            >
              Each category represents a distinct design language — a vocabulary
              of form, material, and intention.
            </p>
            <Link
              href="/products"
              className="group inline-flex items-center gap-3 self-start lg:self-auto text-[9.5px] uppercase tracking-[0.4em] text-[var(--lm-text-muted)] transition-all duration-400 hover:text-[var(--lm-text-primary)] pb-1 border-b border-[var(--lm-border-default)] hover:border-[var(--lm-text-primary)]"
            >
              Browse All Collections
            </Link>
          </div>
        </div>

        {/* ── Category Grid ── */}
        <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {categories.slice(0, 3).map((category, index) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className={`group relative flex flex-col overflow-hidden bg-[var(--lm-surface-secondary)] ${aspectRatios[index] ?? "aspect-[3/4]"} ${verticalOffsets[index] ?? ""}`}
            >
              {/* Image */}
              {category.imageUrl && category.imageUrl.startsWith("http") ? (
                <img
                  src={category.imageUrl}
                  alt={category.name}
                  className="absolute inset-0 h-full w-full object-cover transition-all duration-[1400ms] ease-out group-hover:scale-[1.05] opacity-60 group-hover:opacity-80 pointer-events-none"
                  style={{ filter: "saturate(0.75)" }}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-[var(--lm-surface-elevated)]">
                  <span className="text-[9px] font-mono tracking-[0.3em] text-[var(--lm-text-muted)] uppercase">
                    No Image
                  </span>
                </div>
              )}

              {/* Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent transition-opacity duration-700 group-hover:opacity-90 pointer-events-none" />

              {/* Top-left index */}
              <div className="absolute top-6 left-6 z-10">
                <span
                  className="text-[8.5px] font-mono tracking-[0.4em] text-[var(--lm-text-muted)] group-hover:text-[var(--lm-accent-primary)]/60 transition-colors duration-500"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              {/* Bottom label */}
              <div className="absolute bottom-0 left-0 right-0 z-10 flex items-end justify-between p-7 pointer-events-none">
                <div>
                  <div className="mb-2 h-px w-8 bg-[var(--lm-accent-primary)]/0 transition-all duration-500 group-hover:w-12 group-hover:bg-[var(--lm-accent-primary)]/60" />
                  <h3
                    className="text-[var(--lm-text-primary)] transition-all duration-500 group-hover:translate-x-1"
                    style={{
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                      fontWeight: 300,
                      fontSize: "clamp(1.2rem, 2vw, 1.65rem)",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {category.name}
                  </h3>
                </div>

                {/* Hover arrow */}
                <div
                  className="flex h-9 w-9 items-center justify-center border border-transparent bg-transparent transition-all duration-500 group-hover:border-[var(--lm-border-strong)] group-hover:bg-[var(--lm-surface-hover)]"
                  style={{ opacity: 0, transform: "translateY(4px)" }}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    className="text-[var(--lm-text-primary)] opacity-0 transition-all duration-500 group-hover:opacity-100"
                  >
                    <path d="M2 12L12 2M12 2H5M12 2V9" stroke="currentColor" strokeWidth="1.2" />
                  </svg>
                </div>
              </div>

              {/* Border reveal */}
              <div className="absolute inset-0 border border-transparent transition-all duration-700 group-hover:border-[var(--lm-border-default)] pointer-events-none" />
            </Link>
          ))}
        </div>

        {/* ── Bottom note ── */}
        <div className="mt-20 flex items-center gap-5">
          <div className="h-px flex-1 max-w-[60px] bg-[var(--lm-border-default)]" />
          <span className="text-[8.5px] uppercase tracking-[0.45em] text-[var(--lm-text-muted)]">
            {categories.length} categories available
          </span>
        </div>

      </div>
    </section>
  );
}
