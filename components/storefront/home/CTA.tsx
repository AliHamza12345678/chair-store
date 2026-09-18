import Link from "next/link";

export default function CTA() {
  return (
    <section className="relative overflow-hidden bg-[var(--lm-surface-primary)]">

      {/* ── Top border ── */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--lm-border-default)] to-transparent" />

      {/* ── Background architectural grid ── */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
        aria-hidden="true"
      />

      {/* ── Radial glow ── */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(251,191,36,0.04) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      {/* ── Corner marks ── */}
      <div className="absolute left-8 bottom-8 z-10 h-12 w-px bg-gradient-to-t from-[var(--lm-accent-primary)]/40 to-transparent" />
      <div className="absolute left-8 bottom-8 z-10 h-px w-12 bg-gradient-to-r from-[var(--lm-accent-primary)]/40 to-transparent" />
      <div className="absolute right-8 top-8 z-10 h-12 w-px bg-gradient-to-b from-[var(--lm-border-strong)] to-transparent" />
      <div className="absolute right-8 top-8 z-10 h-px w-12 bg-gradient-to-l from-[var(--lm-border-strong)] to-transparent" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-12 lg:px-20 py-48">

        {/* ── Center content ── */}
        <div className="flex flex-col items-center text-center">

          {/* Eyebrow */}
          <div className="mb-10 flex items-center gap-5">
            <div className="h-px w-12 bg-[var(--lm-accent-primary)]/40" />
            <span
              className="text-[9px] font-medium uppercase tracking-[0.6em] text-[var(--lm-accent-text)]/70"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Begin Your Story
            </span>
            <div className="h-px w-12 bg-[var(--lm-accent-primary)]/40" />
          </div>

          {/* Main headline */}
          <h2
            className="max-w-4xl leading-none text-[var(--lm-text-primary)]"
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontWeight: 300,
              fontSize: "clamp(3rem, 6vw, 6.5rem)",
              letterSpacing: "-0.01em",
            }}
          >
            Objects worthy of
            <br />
            <em
              style={{
                fontStyle: "italic",
                color: "var(--lm-accent-text)",
                fontWeight: 300,
              }}
            >
              a lifetime.
            </em>
          </h2>

          {/* Subtext */}
          <p
            className="mt-10 max-w-xl text-[var(--lm-text-muted)] leading-[1.8]"
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "clamp(0.875rem, 1.1vw, 1rem)",
              fontWeight: 300,
            }}
          >
            Every piece in our atelier is designed to endure — not just
            structurally, but aesthetically. Furniture that grows more meaningful
            with each passing year.
          </p>

          {/* CTAs */}
          <div className="mt-14 flex flex-wrap justify-center gap-5">
            <Link
              href="/products"
              className="group relative inline-flex items-center gap-4 overflow-hidden border border-[var(--lm-text-primary)] bg-[var(--lm-text-primary)] px-10 py-4 text-[10px] font-semibold uppercase tracking-[0.35em] text-[var(--lm-surface-primary)] transition-all duration-500 hover:bg-transparent hover:text-[var(--lm-text-primary)]"
            >
              Explore the Collection
              <svg
                width="13"
                height="13"
                viewBox="0 0 13 13"
                fill="none"
                className="transition-transform duration-400 group-hover:translate-x-1.5"
              >
                <path d="M0 6.5H12M12 6.5L6.5 1M12 6.5L6.5 12" stroke="currentColor" strokeWidth="1.2" />
              </svg>
            </Link>

            <Link
              href="/about"
              className="group inline-flex items-center gap-3 border border-[var(--lm-border-strong)] px-10 py-4 text-[10px] font-medium uppercase tracking-[0.35em] text-[var(--lm-text-secondary)] transition-all duration-400 hover:border-[var(--lm-text-primary)] hover:text-[var(--lm-text-primary)]"
            >
              Our Philosophy
            </Link>
          </div>

          {/* ── Divider ── */}
          <div className="mt-24 flex w-full items-center gap-8">
            <div className="h-px flex-1 bg-[var(--lm-border-subtle)]" />
            <span
              className="text-[8px] uppercase tracking-[0.5em] text-[var(--lm-text-muted)]"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Lumina Atelier
            </span>
            <div className="h-px flex-1 bg-[var(--lm-border-subtle)]" />
          </div>

          {/* ── Bottom promise bar ── */}
          <div className="mt-12 flex flex-wrap justify-center gap-x-16 gap-y-6">
            {[
              "Handcrafted in Pakistan",
              "Full-Grain Leather",
              "10-Year Guarantee",
              "White-Glove Delivery",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <div className="h-1 w-1 rounded-full bg-[var(--lm-accent-primary)]/50" />
                <span
                  className="text-[8.5px] uppercase tracking-[0.4em] text-[var(--lm-text-muted)]"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  {item}
                </span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
