const values = [
  {
    index: "I",
    title: "Restraint",
    body:
      "We believe subtraction is harder than addition. Every element that remains in a finished piece survived a deliberate argument for its inclusion.",
  },
  {
    index: "II",
    title: "Permanence",
    body:
      "We design for the long arc. A Lumina piece should function, feel, and look right in twenty-five years. This informs every material choice and every structural decision.",
  },
  {
    index: "III",
    title: "Honesty",
    body:
      "Materials are not disguised. Joints are not hidden behind filler. The object tells you exactly how it was made — and is confident enough to do so.",
  },
  {
    index: "IV",
    title: "Proportion",
    body:
      "We believe furniture is spatial architecture. Scale, shadow, and negative space are considered as carefully as upholstery and finish.",
  },
  {
    index: "V",
    title: "Responsibility",
    body:
      "Every material we use is traceable. Every craftsman is employed directly. We do not sub-contract what we cannot supervise.",
  },
  {
    index: "VI",
    title: "Silence",
    body:
      "The best luxury furniture disappears into the room. It does not announce itself — it anchors the space and makes everything around it more legible.",
  },
];

export default function Values() {
  return (
    <section
      className="relative overflow-hidden py-44"
      style={{ background: "#0e0d0b" }}
    >
      {/* ── Decorative lines ── */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/10 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />

      {/* ── Background Roman numeral watermark ── */}
      <div
        className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 select-none leading-none text-white/[0.018] hidden lg:block"
        style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: "clamp(16rem, 25vw, 28rem)",
          fontWeight: 300,
          left: "-3rem",
        }}
        aria-hidden="true"
      >
        VI
      </div>

      <div className="relative mx-auto max-w-7xl px-6 sm:px-12 lg:px-20">

        {/* Section header */}
        <div className="mb-24 flex flex-col lg:flex-row lg:items-end justify-between gap-12">
          <div>
            <div className="flex items-center gap-4 mb-10">
              <span
                className="text-[9px] font-medium uppercase tracking-[0.6em] text-[var(--lm-accent-text)]/70"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Chapter VI · Values
              </span>
              <div className="h-px w-16 bg-amber-400/15" />
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
              Six
              <br />
              <em style={{ fontStyle: "italic", color: "rgba(163,163,163,0.6)", fontWeight: 300 }}>
                principles.
              </em>
            </h2>
          </div>

          <p
            className="max-w-xs text-[var(--lm-text-muted)] leading-[1.8] lg:text-right lg:pb-2"
            style={{ fontFamily: "var(--font-inter)", fontSize: "0.875rem", fontWeight: 300 }}
          >
            These are not aspirations. They are the criteria against which every
            design decision is judged before a piece goes into production.
          </p>
        </div>

        {/* ── Values grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 divide-y divide-[var(--lm-border-subtle)] sm:divide-y-0"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
        >
          {values.map((val, i) => (
            <div
              key={val.index}
              className="group relative flex flex-col gap-6 p-10 transition-all duration-500 hover:bg-white/[0.016]"
              style={{
                borderRight: (i + 1) % 3 !== 0 ? "1px solid rgba(255,255,255,0.05)" : "none",
                borderBottom: i < 3 ? "1px solid rgba(255,255,255,0.05)" : "none",
              }}
            >
              {/* Top amber accent on hover */}
              <div className="absolute top-0 left-0 right-0 h-px bg-amber-400/0 transition-all duration-500 group-hover:bg-[var(--lm-accent-muted)]" />

              {/* Roman index */}
              <span
                className="self-start text-[8.5px] font-mono tracking-[0.4em] text-white/15 group-hover:text-[var(--lm-accent-hover)]/55 transition-colors duration-500"
              >
                {val.index}
              </span>

              {/* Title */}
              <h3
                className="text-[var(--lm-text-primary)] transition-colors duration-300 group-hover:text-[var(--lm-text-primary)]"
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontWeight: 400,
                  fontSize: "clamp(1.3rem, 1.8vw, 1.65rem)",
                  letterSpacing: "0.02em",
                }}
              >
                {val.title}
              </h3>

              {/* Accent rule */}
              <div className="h-px w-8 bg-amber-400/25 transition-all duration-500 group-hover:w-14 group-hover:bg-[var(--lm-accent-muted)]5" />

              {/* Body */}
              <p
                className="leading-[1.85] text-[var(--lm-text-muted)] group-hover:text-[var(--lm-text-muted)] transition-colors duration-300"
                style={{
                  fontFamily: "var(--font-inter)",
                  fontSize: "0.875rem",
                  fontWeight: 300,
                }}
              >
                {val.body}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
