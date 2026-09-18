import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative h-screen min-h-[700px] overflow-hidden bg-[var(--lm-surface-primary)]">

      {/* ── Background Video ── */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="h-full w-full object-cover"
          style={{ transform: "scale(1.04)" }}
        >
          <source
            src="https://res.cloudinary.com/rixvfk3s/video/upload/v1785172732/Luxury_living_room_motion_video_202607272218_frzzos.mp4"
            type="video/mp4"
          />
        </video>
      </div>

      {/* ── Cinematic Overlays ── */}
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-[var(--lm-surface-primary)]/95 via-[var(--lm-surface-primary)]/55 to-transparent" />
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-[var(--lm-surface-primary)] via-transparent to-[var(--lm-surface-primary)]/30" />

      {/* ── Architectural Guide Lines ── */}
      <div className="absolute left-0 top-0 z-10 h-full w-px bg-[var(--lm-border-subtle)]" style={{ left: "5rem" }} />
      <div className="absolute top-0 z-10 h-full w-px bg-[var(--lm-border-subtle)]" style={{ left: "25%" }} />

      {/* ── Corner Marks ── */}
      <div className="absolute left-8 top-8 z-20 h-12 w-px bg-gradient-to-b from-[var(--lm-accent-primary)]/60 to-transparent" />
      <div className="absolute left-8 top-8 z-20 h-px w-12 bg-gradient-to-r from-[var(--lm-accent-primary)]/60 to-transparent" />
      <div className="absolute right-8 top-8 z-20 h-12 w-px bg-gradient-to-b from-[var(--lm-border-strong)] to-transparent hidden lg:block" />
      <div className="absolute right-8 top-8 z-20 h-px w-12 bg-gradient-to-l from-[var(--lm-border-strong)] to-transparent hidden lg:block" />

      {/* ── Main Content ── */}
      <div className="relative z-20 flex h-full flex-col justify-between">

        {/* Center Block */}
        <div className="flex flex-1 items-center">
          <div className="mx-auto w-full max-w-7xl px-6 sm:px-12 lg:px-20">

            {/* Eyebrow */}
            <div className="mb-8 flex items-center gap-4">
              <div className="h-px w-10 bg-[var(--lm-accent-primary)]/70" />
              <span
                className="text-[9px] font-medium uppercase tracking-[0.55em] text-[var(--lm-accent-text)]/80"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Lumina Atelier · Est. 2020
              </span>
            </div>

            {/* Headline */}
            <h1
              className="max-w-4xl leading-none text-[var(--lm-text-primary)]"
              style={{
                fontFamily: "'Cormorant Garamond', 'Georgia', serif",
                fontWeight: 300,
                fontSize: "clamp(3.5rem, 8vw, 7.5rem)",
                letterSpacing: "-0.01em",
              }}
            >
              Crafted for
              <br />
              <em
                className="block"
                style={{
                  fontStyle: "italic",
                  color: "var(--lm-accent-text)",
                  fontWeight: 300,
                }}
              >
                Timeless Living
              </em>
            </h1>

            {/* Sub-copy */}
            <div className="mt-10 flex flex-col sm:flex-row sm:items-start gap-6 sm:gap-16">
              <div className="h-px w-20 bg-gradient-to-r from-[var(--lm-accent-primary)]/50 to-transparent mt-3 flex-shrink-0" />
              <p
                className="max-w-md text-[var(--lm-text-secondary)] leading-[1.75]"
                style={{ fontSize: "clamp(0.875rem, 1.2vw, 1.0625rem)", fontWeight: 300 }}
              >
                Premium seating and luxury furniture designed for sophisticated
                interiors — where uncompromising craftsmanship meets quiet,
                enduring elegance.
              </p>
            </div>

            {/* CTAs */}
            <div className="mt-14 flex flex-wrap items-center gap-5">
              <Link
                href="/products"
                className="group relative inline-flex items-center gap-4 overflow-hidden border border-[var(--lm-text-primary)] bg-[var(--lm-text-primary)] px-9 py-4 text-[10px] font-semibold uppercase tracking-[0.35em] text-[var(--lm-surface-primary)] transition-all duration-500 hover:bg-transparent hover:text-[var(--lm-text-primary)]"
              >
                Explore Collection
                <ArrowRight
                  size={13}
                  className="transition-transform duration-500 group-hover:translate-x-1.5"
                />
              </Link>

              <Link
                href="/products"
                className="group inline-flex items-center gap-3 pb-1 text-[10px] font-medium uppercase tracking-[0.35em] text-[var(--lm-text-secondary)] transition-all duration-400 border-b border-[var(--lm-border-strong)] hover:text-[var(--lm-text-primary)] hover:border-[var(--lm-text-primary)]"
              >
                View Lookbook
              </Link>
            </div>

          </div>
        </div>

        {/* ── Bottom Stats Bar ── */}
        <div className="border-t border-[var(--lm-border-default)]">
          <div
            className="mx-auto grid max-w-7xl grid-cols-2 px-6 sm:grid-cols-4 sm:px-12 lg:px-20"
            style={{ backdropFilter: "blur(20px)", background: "var(--lm-nav-bg)" }}
          >
            {[
              { label: "Years of craft", value: "15+" },
              { label: "Bespoke pieces", value: "2,400+" },
              { label: "Materials sourced", value: "European" },
              { label: "Satisfied clients", value: "98%" },
            ].map((stat, i) => (
              <div
                key={i}
                className="group relative border-l border-[var(--lm-border-default)] px-8 py-7 transition-all duration-500 hover:border-[var(--lm-accent-border)] first:border-l-0 sm:first:border-l sm:first:border-[var(--lm-border-default)]"
              >
                <p className="text-[8.5px] uppercase tracking-[0.35em] text-[var(--lm-text-muted)] transition-colors duration-300 group-hover:text-[var(--lm-text-secondary)]">
                  {stat.label}
                </p>
                <p
                  className="mt-2 text-[var(--lm-text-primary)]"
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: "1.6rem",
                    fontWeight: 300,
                    letterSpacing: "0.02em",
                  }}
                >
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
