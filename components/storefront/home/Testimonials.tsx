"use client";

const testimonials = [
  {
    id: 1,
    quote:
      "The Lumina lounge chair is unlike anything I have owned — the craftsmanship is precise, the leather ages beautifully, and its presence transforms a room entirely.",
    author: "Ayesha Raza",
    title: "Interior Architect, Lahore",
    initial: "A",
  },
  {
    id: 2,
    quote:
      "I commissioned two Lumina pieces for my study. The weight of the materials, the grain of the wood — you feel immediately that these objects are made to outlast trends.",
    author: "Omar Faruq",
    title: "Creative Director, Karachi",
    initial: "O",
  },
  {
    id: 3,
    quote:
      "Ordering from Lumina was effortless. The team communicated with precision, and the delivery was handled with a care that matched the quality of the furniture itself.",
    author: "Sara Imtiaz",
    title: "Architect, Islamabad",
    initial: "S",
  },
];

export default function Testimonials() {
  return (
    <section
      className="relative overflow-hidden py-44 bg-[var(--lm-surface-secondary)]"
    >
      {/* ── Decorative lines ── */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--lm-border-default)] to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--lm-border-default)] to-transparent" />

      {/* ── Background large quotation ── */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none text-center leading-none text-[var(--lm-text-primary)] opacity-[0.018]"
        style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: "clamp(16rem, 30vw, 32rem)",
          fontWeight: 300,
        }}
        aria-hidden="true"
      >
        "
      </div>

      <div className="relative mx-auto max-w-7xl px-6 sm:px-12 lg:px-20">

        {/* Header */}
        <div className="mb-24 flex items-center gap-4">
          <span
            className="text-[9px] font-medium uppercase tracking-[0.6em] text-[var(--lm-accent-text)]/70"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Chapter V · Testimonials
          </span>
          <div className="h-px flex-1 max-w-[80px] bg-[var(--lm-accent-primary)]/15" />
        </div>

        {/* ── Grid ── */}
        <div className="grid grid-cols-1 gap-0 lg:grid-cols-3">
          {testimonials.map((t, index) => (
            <div
              key={t.id}
              className="group relative flex flex-col justify-between border-l border-[var(--lm-border-default)] px-10 py-12 transition-all duration-500 hover:border-[var(--lm-accent-border)] first:border-l-0 lg:first:border-l lg:first:border-[var(--lm-border-default)]"
              style={{
                borderTop: "1px solid var(--lm-border-subtle)",
              }}
            >
              {/* Top accent line on hover */}
              <div className="absolute top-0 left-0 right-0 h-px bg-[var(--lm-accent-primary)]/0 transition-all duration-500 group-hover:bg-[var(--lm-accent-primary)]/25" />

              {/* Stars */}
              <div className="mb-8 flex gap-1.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} width="11" height="10" viewBox="0 0 11 10" fill="none">
                    <path
                      d="M5.5 0.5L6.8 3.7L10.3 4L7.8 6.3L8.5 9.8L5.5 8L2.5 9.8L3.2 6.3L0.7 4L4.2 3.7L5.5 0.5Z"
                      fill="var(--lm-accent-primary)" fillOpacity="0.7"
                    />
                  </svg>
                ))}
              </div>

              {/* Quote */}
              <blockquote
                className="flex-1 text-[var(--lm-text-secondary)] leading-[1.9] group-hover:text-[var(--lm-text-primary)] transition-colors duration-500"
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontWeight: 300,
                  fontSize: "clamp(1.05rem, 1.2vw, 1.2rem)",
                  fontStyle: "italic",
                }}
              >
                &ldquo;{t.quote}&rdquo;
              </blockquote>

              {/* Attribution */}
              <div className="mt-10 flex items-center gap-4">
                {/* Initial avatar */}
                <div
                  className="flex h-10 w-10 flex-shrink-0 items-center justify-center border border-[var(--lm-border-default)] bg-[var(--lm-surface-hover)] text-[11px] font-semibold text-[var(--lm-text-secondary)] group-hover:border-[var(--lm-accent-border)] transition-colors duration-500"
                  style={{ fontFamily: "var(--font-inter)", letterSpacing: "0.06em" }}
                >
                  {t.initial}
                </div>
                <div>
                  <p
                    className="text-[var(--lm-text-secondary)] group-hover:text-[var(--lm-text-primary)] transition-colors duration-300"
                    style={{
                      fontFamily: "var(--font-inter)",
                      fontSize: "0.8rem",
                      fontWeight: 500,
                      letterSpacing: "0.06em",
                    }}
                  >
                    {t.author}
                  </p>
                  <p
                    className="text-[var(--lm-text-muted)] group-hover:text-[var(--lm-text-secondary)] transition-colors duration-300 mt-0.5"
                    style={{
                      fontFamily: "var(--font-inter)",
                      fontSize: "0.7rem",
                      letterSpacing: "0.08em",
                    }}
                  >
                    {t.title}
                  </p>
                </div>
              </div>

              {/* Index */}
              <div className="absolute bottom-12 right-10">
                <span
                  className="text-[8px] font-mono tracking-[0.3em] text-[var(--lm-text-muted)] group-hover:text-[var(--lm-accent-primary)]/30 transition-colors duration-500"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
