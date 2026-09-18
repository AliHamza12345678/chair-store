const stats = [
  { value: "15+", label: "Years of craft" },
  { value: "8,000+", label: "Satisfied clients" },
  { value: "120+", label: "Exclusive designs" },
  { value: "25", label: "Countries served" },
];

export default function Stats() {
  return (
    <section className="relative overflow-hidden bg-[var(--lm-surface-primary)] py-40">

      {/* ── Decorative lines ── */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--lm-border-subtle)] to-transparent" />

      {/* ── Large decorative numeral ── */}
      <div
        className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 select-none leading-none text-[var(--lm-border-subtle)] hidden xl:block"
        style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: "clamp(14rem, 20vw, 22rem)",
          fontWeight: 300,
          right: "-2rem",
        }}
        aria-hidden="true"
      >
        ∞
      </div>

      <div className="relative mx-auto max-w-7xl px-6 sm:px-12 lg:px-20">

        {/* Eyebrow + headline */}
        <div className="mb-24 text-center">
          <div className="mb-8 flex items-center justify-center gap-5">
            <div className="h-px w-12 bg-[var(--lm-accent-muted)]" />
            <span
              className="text-[9px] font-medium uppercase tracking-[0.6em] text-[var(--lm-accent-text)]"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Chapter VII · By the Numbers
            </span>
            <div className="h-px w-12 bg-[var(--lm-accent-muted)]" />
          </div>
          <h2
            className="leading-none text-[var(--lm-text-primary)]"
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontWeight: 300,
              fontSize: "clamp(2.5rem, 5vw, 5rem)",
              letterSpacing: "-0.01em",
            }}
          >
            Measured in
            <em
              style={{
                fontStyle: "italic",
                color: "var(--lm-accent-text)",
                fontWeight: 300,
                marginLeft: "0.5rem",
              }}
            >
              decades, not seasons.
            </em>
          </h2>
        </div>

        {/* ── Stats row ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-[var(--lm-border-subtle)]"
          style={{
            borderTop: "1px solid var(--lm-border-subtle)",
            borderBottom: "1px solid var(--lm-border-subtle)",
          }}
        >
          {stats.map((stat, i) => (
            <div
              key={i}
              className="group flex flex-col items-center gap-4 px-6 py-14 text-center transition-all duration-500 hover:bg-[var(--lm-surface-hover)]"
            >
              <span
                className="text-[var(--lm-text-primary)] transition-colors duration-300"
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontWeight: 300,
                  fontSize: "clamp(2.75rem, 5vw, 4.5rem)",
                  letterSpacing: "0.02em",
                  lineHeight: 1,
                }}
              >
                {stat.value}
              </span>
              {/* Divider */}
              <div className="h-px w-8 bg-[var(--lm-accent-muted)] transition-all duration-500 group-hover:w-14 group-hover:bg-[var(--lm-accent-primary)]" />
              <p
                className="text-[var(--lm-text-muted)] group-hover:text-[var(--lm-text-secondary)] transition-colors duration-300"
                style={{
                  fontFamily: "var(--font-inter)",
                  fontSize: "0.7rem",
                  fontWeight: 400,
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                }}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}