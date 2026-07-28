export default function Story() {
  return (
    <section className="relative overflow-hidden bg-[var(--lm-surface-primary)] py-44">

      {/* ── Decorative vertical rule ── */}
      <div
        className="pointer-events-none absolute left-0 top-0 h-full w-px"
        style={{ left: "5rem", background: "linear-gradient(to bottom, transparent, var(--lm-accent-muted), transparent)" }}
        aria-hidden="true"
      />

      <div className="mx-auto max-w-7xl px-6 sm:px-12 lg:px-20">

        {/* ── Two-column editorial layout ── */}
        <div className="grid grid-cols-1 gap-20 lg:grid-cols-2 lg:gap-32 items-start">

          {/* Left: Headline + eyebrow */}
          <div className="lg:sticky lg:top-32">

            <div className="flex items-center gap-4 mb-10">
              <span
                className="text-[9px] font-medium uppercase tracking-[0.6em] text-[var(--lm-accent-text)]"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Chapter I · Our Story
              </span>
              <div className="h-px w-16 bg-[var(--lm-accent-muted)]" />
            </div>

            <h2
              className="leading-none text-[var(--lm-text-primary)]"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontWeight: 300,
                fontSize: "clamp(2.75rem, 5vw, 5rem)",
                letterSpacing: "-0.01em",
              }}
            >
              Furniture designed
              <br />
              <em
                style={{
                  fontStyle: "italic",
                  fontWeight: 300,
                  color: "var(--lm-text-secondary)",
                }}
              >
                to outlive trends.
              </em>
            </h2>

            {/* Pull quote */}
            <div className="mt-14 border-l-2 border-[var(--lm-accent-muted)] pl-7">
              <p
                className="leading-[1.9] text-[var(--lm-text-secondary)]"
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontStyle: "italic",
                  fontWeight: 300,
                  fontSize: "clamp(1.1rem, 1.4vw, 1.35rem)",
                }}
              >
                &ldquo;Luxury should feel quiet, timeless, and deeply personal — never
                ornamental for its own sake.&rdquo;
              </p>
              <p
                className="mt-4 text-[8.5px] uppercase tracking-[0.45em] text-[var(--lm-accent-text)]"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                — The Lumina Founding Principle
              </p>
            </div>

            {/* Amber accent rule */}
            <div className="mt-14 h-px w-16 bg-gradient-to-r from-[var(--lm-accent-muted)] to-transparent" />
          </div>

          {/* Right: Body copy */}
          <div className="space-y-10 pt-2 lg:pt-16">

            <p
              className="leading-[1.9] text-[var(--lm-text-secondary)]"
              style={{
                fontFamily: "var(--font-inter)",
                fontWeight: 300,
                fontSize: "clamp(0.9375rem, 1.1vw, 1.0625rem)",
              }}
            >
              Lumina was founded with one belief — that luxury should feel quiet,
              timeless, and deeply personal. Every chair and every sofa is created
              to become part of the architecture instead of competing with it.
            </p>

            <p
              className="leading-[1.9] text-[var(--lm-text-muted)]"
              style={{
                fontFamily: "var(--font-inter)",
                fontWeight: 300,
                fontSize: "clamp(0.9375rem, 1.1vw, 1.0625rem)",
              }}
            >
              We work with premium materials, refined craftsmanship and modern
              silhouettes to create furniture that feels effortless today and
              relevant decades from now. Each piece begins with a drawing, passes
              through the hands of master craftsmen, and arrives at your door
              bearing the weight of intention.
            </p>

            <p
              className="leading-[1.9] text-[var(--lm-text-muted)]"
              style={{
                fontFamily: "var(--font-inter)",
                fontWeight: 300,
                fontSize: "clamp(0.9375rem, 1.1vw, 1.0625rem)",
              }}
            >
              Our studio sits at the intersection of architecture and object-making —
              a place where scale, proportion, and material are considered not as
              decorative choices but as ethical ones.
            </p>

            {/* Visual separator + founder note */}
            <div className="pt-6 flex items-start gap-6">
              <div className="flex-shrink-0 mt-1">
                <div className="h-10 w-10 border border-[var(--lm-border-subtle)] flex items-center justify-center">
                  <span
                    className="text-[9px] font-medium uppercase tracking-[0.3em] text-[var(--lm-text-muted)]"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    L
                  </span>
                </div>
              </div>
              <div>
                <p
                  className="text-[var(--lm-text-primary)]"
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontSize: "0.8rem",
                    fontWeight: 500,
                    letterSpacing: "0.06em",
                  }}
                >
                  Ahmad Lumina
                </p>
                <p
                  className="mt-0.5 text-[var(--lm-text-muted)]"
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontSize: "0.72rem",
                    letterSpacing: "0.08em",
                  }}
                >
                  Founder & Chief Design Officer
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}