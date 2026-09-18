"use client";

const studioFacts = [
  { label: "Location", value: "Old Town, Lahore" },
  { label: "Founded", value: "2009" },
  { label: "Floor area", value: "4,200 sq·ft" },
  { label: "Craftsmen", value: "23 artisans" },
  { label: "Disciplines", value: "Joinery · Upholstery · Finishing" },
  { label: "Open by appointment", value: "Mon – Sat, 10:00 – 18:00" },
];

export default function Studio() {
  return (
    <section className="relative overflow-hidden bg-[var(--lm-surface-primary)] py-44">

      {/* ── Top line ── */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--lm-border-subtle)] to-transparent" />

      <div className="mx-auto max-w-7xl px-6 sm:px-12 lg:px-20">

        {/* ── Asymmetric two-column ── */}
        <div className="grid grid-cols-1 gap-20 lg:grid-cols-2 lg:gap-28 items-start">

          {/* Left: Image + overlay caption */}
          <div className="relative">
            {/* Main image */}
            <div className="relative aspect-[4/5] overflow-hidden bg-[var(--lm-surface-secondary)]">
              <img
                src="https://res.cloudinary.com/rixvfk3s/image/upload/v1785175686/lumina-studio.jpg"
                alt="Lumina Studio, Lahore"
                className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out hover:scale-[1.03]"
                style={{ opacity: 0.55, filter: "saturate(0.5)" }}
                onError={(e) => {
                  const el = e.target as HTMLImageElement;
                  el.style.display = "none";
                }}
              />
              {/* Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              {/* Bottom caption */}
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <p
                  className="text-[8.5px] font-mono uppercase tracking-[0.4em] text-[var(--lm-accent-text)]"
                >
                  Lumina Atelier · Lahore
                </p>
                <p
                  className="mt-1 text-[var(--lm-text-primary)]"
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontWeight: 300,
                    fontSize: "1.1rem",
                    fontStyle: "italic",
                  }}
                >
                  Where objects become furniture.
                </p>
              </div>
            </div>

            {/* Floated secondary block */}
            <div
              className="absolute right-0 bottom-[-3rem] hidden lg:block w-[55%] border border-[var(--lm-border-subtle)] bg-[var(--lm-surface-secondary)] p-8"
              style={{ transform: "translateX(2rem)" }}
            >
              <p
                className="text-[var(--lm-text-muted)] leading-[1.8]"
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontStyle: "italic",
                  fontWeight: 300,
                  fontSize: "1rem",
                }}
              >
                &ldquo;A studio should be as considered as the objects it produces.
                Ours is a working space — not a showroom.&rdquo;
              </p>
              <p
                className="mt-4 text-[8px] uppercase tracking-[0.4em] text-[var(--lm-accent-text)]"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                — Ahmad Lumina, 2022
              </p>
            </div>
          </div>

          {/* Right: Facts + description */}
          <div className="lg:pt-12">

            {/* Eyebrow */}
            <div className="flex items-center gap-4 mb-10">
              <span
                className="text-[9px] font-medium uppercase tracking-[0.6em] text-[var(--lm-accent-text)]"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Chapter V · The Studio
              </span>
              <div className="h-px w-16 bg-[var(--lm-accent-muted)]" />
            </div>

            {/* Headline */}
            <h2
              className="leading-none text-[var(--lm-text-primary)]"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontWeight: 300,
                fontSize: "clamp(2.5rem, 4.5vw, 4.75rem)",
                letterSpacing: "-0.01em",
              }}
            >
              Where objects
              <br />
              <em style={{ fontStyle: "italic", color: "var(--lm-text-secondary)", fontWeight: 300 }}>
                become furniture.
              </em>
            </h2>

            {/* Paragraph */}
            <p
              className="mt-10 leading-[1.85] text-[var(--lm-text-muted)]"
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: "0.9rem",
                fontWeight: 300,
              }}
            >
              Our atelier in the old city of Lahore is where all design, joinery,
              upholstery, and finishing takes place under one roof. We believe in
              verticality — owning every stage of production so that quality is not
              delegated, it is witnessed.
            </p>

            {/* Facts table */}
            <div className="mt-14 divide-y divide-[var(--lm-border-subtle)]" style={{ borderTop: "1px solid var(--lm-border-subtle)" }}>
              {studioFacts.map((fact) => (
                <div
                  key={fact.label}
                  className="group flex items-start justify-between gap-6 py-5 transition-colors duration-300 hover:bg-[var(--lm-surface-hover)] px-1"
                >
                  <span
                    className="text-[8.5px] uppercase tracking-[0.35em] text-[var(--lm-text-muted)] group-hover:text-[var(--lm-text-secondary)] flex-shrink-0 transition-colors duration-300 pt-0.5"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    {fact.label}
                  </span>
                  <span
                    className="text-[var(--lm-text-secondary)] group-hover:text-[var(--lm-text-primary)] transition-colors duration-300 text-right"
                    style={{
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                      fontWeight: 400,
                      fontSize: "1rem",
                      letterSpacing: "0.02em",
                    }}
                  >
                    {fact.value}
                  </span>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
