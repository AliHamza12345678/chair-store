const steps = [
  {
    index: "01",
    title: "Design",
    body:
      "Every piece begins as a pencil sketch. Proportions are studied against the human body, against space, against light before a single material is chosen.",
  },
  {
    index: "02",
    title: "Selection",
    body:
      "Timber is sourced from certified European mills. Leather is selected by hand — full-grain, naturally tanned, chosen for how it will age over twenty years, not how it looks on day one.",
  },
  {
    index: "03",
    title: "Joinery",
    body:
      "Master craftsmen in our Lahore atelier cut each joint by hand. Mortise and tenon, dovetail, finger — no mechanical fasteners. The furniture holds itself.",
  },
  {
    index: "04",
    title: "Upholstery",
    body:
      "Our upholsterers trained in Florence. Every cushion is hand-stuffed with down and high-resilience foam, then wrapped in fabric tensioned to within 2mm of specification.",
  },
  {
    index: "05",
    title: "Finishing",
    body:
      "Surfaces receive six coats of oil-based finish, hand-sanded between each layer. The final piece is inspected at 45° to detect any surface irregularity.",
  },
];

export default function Craftsmanship() {
  return (
    <section className="relative overflow-hidden bg-[var(--lm-surface-primary)] py-44">

      {/* ── Decorative top line ── */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--lm-border-subtle)] to-transparent" />

      {/* ── Background number watermark ── */}
      <div
        className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 select-none text-right leading-none text-[var(--lm-border-subtle)] hidden lg:block"
        style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: "clamp(14rem, 22vw, 24rem)",
          fontWeight: 300,
          right: "-2rem",
        }}
        aria-hidden="true"
      >
        05
      </div>

      <div className="relative mx-auto max-w-7xl px-6 sm:px-12 lg:px-20">

        {/* Section header */}
        <div className="mb-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-end">
          <div>
            <div className="flex items-center gap-4 mb-10">
              <span
                className="text-[9px] font-medium uppercase tracking-[0.6em] text-[var(--lm-accent-text)]"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Chapter III · Craftsmanship
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
              The five
              <br />
              <em style={{ fontStyle: "italic", color: "var(--lm-text-secondary)", fontWeight: 300 }}>
                disciplines.
              </em>
            </h2>
          </div>

          <p
            className="text-[var(--lm-text-muted)] leading-[1.8] lg:pb-2"
            style={{ fontFamily: "var(--font-inter)", fontSize: "0.875rem", fontWeight: 300 }}
          >
            From first drawing to final delivery, every Lumina piece passes through
            five disciplines — each governed by a standard that cannot be
            negotiated or expedited.
          </p>
        </div>

        {/* ── Step list ── */}
        <div className="divide-y divide-[var(--lm-border-subtle)]" style={{ borderTop: "1px solid var(--lm-border-subtle)" }}>
          {steps.map((step) => (
            <div
              key={step.index}
              className="group grid grid-cols-1 gap-6 py-10 transition-all duration-500 hover:pl-3 sm:grid-cols-[80px_1fr_2fr]"
            >
              {/* Index */}
              <div className="flex items-start">
                <span
                  className="text-[8.5px] font-mono tracking-[0.4em] text-[var(--lm-text-muted)] group-hover:text-[var(--lm-accent-primary)] transition-colors duration-500 pt-1"
                >
                  {step.index}
                </span>
              </div>

              {/* Title */}
              <h3
                className="text-[var(--lm-text-secondary)] transition-colors duration-300 group-hover:text-[var(--lm-text-primary)] self-start"
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontWeight: 400,
                  fontSize: "clamp(1.2rem, 1.6vw, 1.5rem)",
                  letterSpacing: "0.02em",
                }}
              >
                {step.title}
              </h3>

              {/* Body */}
              <p
                className="leading-[1.85] text-[var(--lm-text-muted)] group-hover:text-[var(--lm-text-secondary)] transition-colors duration-300 self-start"
                style={{
                  fontFamily: "var(--font-inter)",
                  fontSize: "0.875rem",
                  fontWeight: 300,
                }}
              >
                {step.body}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
