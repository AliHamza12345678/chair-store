"use client";

import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[var(--lm-surface-primary)]">

      {/* ── Background Image ── */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://res.cloudinary.com/rixvfk3s/image/upload/v1785175686/about-hero_lumina.jpg"
          alt="Lumina Atelier — the studio"
          className="h-full w-full object-cover"
          style={{ opacity: 0.38, filter: "saturate(0.6) contrast(1.08)" }}
          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
        />
      </div>

      {/* ── Gradient overlays ── */}
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-[var(--lm-surface-primary)]/98 via-[var(--lm-surface-primary)]/70 to-[var(--lm-surface-primary)]/20" />
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-[var(--lm-surface-primary)] via-transparent to-[var(--lm-surface-primary)]/50" />

      {/* ── Architectural corner marks ── */}
      <div className="absolute left-8 top-8 z-20 h-14 w-px bg-gradient-to-b from-[var(--lm-accent-muted)] to-transparent" />
      <div className="absolute left-8 top-8 z-20 h-px w-14 bg-gradient-to-r from-[var(--lm-accent-muted)] to-transparent" />
      <div className="absolute right-8 bottom-32 z-20 h-14 w-px bg-gradient-to-t from-[var(--lm-border-default)] to-transparent hidden lg:block" />
      <div className="absolute right-8 bottom-32 z-20 h-px w-14 bg-gradient-to-l from-[var(--lm-border-default)] to-transparent hidden lg:block" />

      {/* ── Vertical guide ── */}
      <div className="absolute left-0 top-0 z-10 h-full w-px" style={{ left: "5rem", background: "var(--lm-border-subtle)" }} />

      {/* ── Content ── */}
      <div className="relative z-20 flex h-screen min-h-[700px] flex-col justify-between pt-32 pb-0">

        {/* Main text block */}
        <div className="mx-auto w-full max-w-7xl px-6 sm:px-12 lg:px-20 flex flex-col justify-center flex-1">

          {/* Eyebrow */}
          <div className="mb-10 flex items-center gap-5">
            <div className="h-px w-10 bg-[var(--lm-accent-muted)]" />
            <span
              className="text-[9px] font-medium uppercase tracking-[0.6em] text-[var(--lm-accent-text)]"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Atelier Vol. II · Our Story
            </span>
          </div>

          {/* Headline */}
          <h1
            className="max-w-4xl leading-none text-[var(--lm-text-primary)]"
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontWeight: 300,
              fontSize: "clamp(3.2rem, 7.5vw, 7.5rem)",
              letterSpacing: "-0.015em",
            }}
          >
            We design furniture
            <br />
            <em
              style={{
                fontStyle: "italic",
                fontWeight: 300,
                color: "var(--lm-accent-text)",
              }}
            >
              that becomes architecture.
            </em>
          </h1>

          {/* Sub-copy */}
          <div className="mt-10 flex flex-col sm:flex-row sm:items-start gap-6 sm:gap-16">
            <div className="h-px w-16 bg-gradient-to-r from-[var(--lm-accent-muted)] to-transparent mt-3 flex-shrink-0 hidden sm:block" />
            <p
              className="max-w-md leading-[1.8] text-[var(--lm-text-secondary)]"
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: "clamp(0.875rem, 1.1vw, 1rem)",
                fontWeight: 300,
              }}
            >
              Every collection reflects timeless craftsmanship, noble materials,
              and a minimalist philosophy engineered for sophisticated modern interiors.
            </p>
          </div>

          {/* CTAs */}
          <div className="mt-14 flex flex-wrap items-center gap-5">
            <Link
              href="/products"
              className="group inline-flex items-center gap-4 border border-[var(--lm-text-primary)] bg-[var(--lm-text-primary)] px-9 py-4 text-[10px] font-semibold uppercase tracking-[0.35em] text-[var(--lm-surface-primary)] transition-all duration-500 hover:bg-transparent hover:text-[var(--lm-text-primary)]"
            >
              Explore Collection
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" className="transition-transform duration-400 group-hover:translate-x-1.5">
                <path d="M0 6.5H12M12 6.5L6.5 1M12 6.5L6.5 12" stroke="currentColor" strokeWidth="1.2" />
              </svg>
            </Link>
            <Link
              href="/products"
              className="group inline-flex items-center gap-3 pb-1 text-[10px] font-medium uppercase tracking-[0.35em] text-[var(--lm-text-secondary)] transition-all duration-400 border-b border-[var(--lm-border-strong)] hover:text-[var(--lm-text-primary)] hover:border-[var(--lm-text-primary)]"
            >
              View Series
            </Link>
          </div>
        </div>

        {/* ── Bottom metrics strip ── */}
        <div
          className="w-full border-t border-[var(--lm-border-subtle)]"
          style={{ backdropFilter: "blur(20px)", background: "var(--lm-nav-bg)" }}
        >
          <div className="mx-auto grid max-w-7xl grid-cols-3 px-6 sm:px-12 lg:px-20">
            {[
              { value: "15+", label: "Years of craft" },
              { value: "8,000+", label: "Satisfied clients" },
              { value: "120+", label: "Exclusive designs" },
            ].map((s, i) => (
              <div
                key={i}
                className="group border-l border-[var(--lm-border-subtle)] px-8 py-7 transition-all duration-500 hover:border-[var(--lm-accent-muted)] first:border-l-0"
              >
                <p
                  className="text-[var(--lm-text-primary)]"
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: "1.75rem",
                    fontWeight: 300,
                    letterSpacing: "0.02em",
                  }}
                >
                  {s.value}
                </p>
                <p className="mt-1 text-[8.5px] uppercase tracking-[0.35em] text-[var(--lm-text-muted)] group-hover:text-[var(--lm-text-secondary)] transition-colors duration-300">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
