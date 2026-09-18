const milestones = [
  {
    year: "2009",
    title: "The First Workshop",
    body: "A small workshop in Lahore. Three craftsmen, one design principle: every joint should be invisible, every edge intentional.",
  },
  {
    year: "2013",
    title: "The Material Manifesto",
    body: "We published our first material standard — full-grain leather sourced from European tanneries, solid walnut harvested from certified forests.",
  },
  {
    year: "2016",
    title: "Atelier Expansion",
    body: "The studio doubled in size. We brought in master upholsterers trained in Italy, and our first bespoke commission for a private residence in Karachi.",
  },
  {
    year: "2019",
    title: "The Lumina Collection",
    body: "Our flagship collection launched — twelve pieces defined by silence, weight, and the irreducible logic of good proportion.",
  },
  {
    year: "2022",
    title: "Digital Atelier",
    body: "Lumina opens its digital storefront, making bespoke luxury accessible across Pakistan for the first time — with white-glove delivery nationwide.",
  },
  {
    year: "2026",
    title: "New Season",
    body: "The Atelier Vol. II collection — exploring the space between restraint and warmth, between stone and textile, between East and West.",
  },
];

export default function Timeline() {
  return (
    <section
      className="relative overflow-hidden py-44"
      style={{ background: "var(--lm-surface-secondary)" }}
    >
      {/* ── Decorative top line ── */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--lm-accent-muted)] to-transparent" />

      <div className="mx-auto max-w-7xl px-6 sm:px-12 lg:px-20">

        {/* Section header */}
        <div className="mb-24 flex items-center gap-4">
          <span
            className="text-[9px] font-medium uppercase tracking-[0.6em] text-[var(--lm-accent-text)]"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Chapter II · Timeline
          </span>
          <div className="h-px w-16 bg-[var(--lm-accent-muted)]" />
        </div>

        <div className="grid grid-cols-1 gap-0 lg:grid-cols-[1fr_1px_1fr]">

          {/* Left label column */}
          <div className="hidden lg:flex lg:flex-col lg:justify-center lg:pr-20 lg:pb-0">
            <h2
              className="leading-none text-[var(--lm-text-primary)]"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontWeight: 300,
                fontSize: "clamp(2.5rem, 4.5vw, 4.5rem)",
                letterSpacing: "-0.01em",
              }}
            >
              Two decades
              <br />
              <em style={{ fontStyle: "italic", color: "var(--lm-text-secondary)", fontWeight: 300 }}>
                of craft.
              </em>
            </h2>
            <p
              className="mt-8 text-[var(--lm-text-muted)] leading-[1.8]"
              style={{ fontFamily: "var(--font-inter)", fontSize: "0.875rem", fontWeight: 300 }}
            >
              A sequential record of the decisions, materials, and moments that
              shaped Lumina into what it is today.
            </p>
          </div>

          {/* Centre vertical line (desktop only) */}
          <div className="hidden lg:block bg-[var(--lm-border-subtle)]" />

          {/* Timeline entries */}
          <div className="lg:pl-20">
            {milestones.map((m, index) => (
              <div
                key={m.year}
                className="group relative flex gap-8 pb-14 last:pb-0"
              >
                {/* Dot + connector */}
                <div className="relative flex flex-col items-center">
                  <div className="relative z-10 flex h-8 w-8 flex-shrink-0 items-center justify-center border border-[var(--lm-border-subtle)] bg-[var(--lm-surface-secondary)] transition-all duration-500 group-hover:border-[var(--lm-accent-muted)]">
                    <div className="h-1.5 w-1.5 rounded-full bg-[var(--lm-border-strong)] transition-all duration-500 group-hover:bg-[var(--lm-accent-primary)]" />
                  </div>
                  {index < milestones.length - 1 && (
                    <div className="mt-2 flex-1 w-px bg-[var(--lm-border-subtle)]" />
                  )}
                </div>

                {/* Content */}
                <div className="pb-2 min-w-0">
                  <span
                    className="text-[8.5px] font-mono tracking-[0.4em] text-[var(--lm-accent-muted)] group-hover:text-[var(--lm-accent-primary)] transition-colors duration-400"
                  >
                    {m.year}
                  </span>
                  <h3
                    className="mt-2 text-[var(--lm-text-secondary)] transition-colors duration-300 group-hover:text-[var(--lm-text-primary)]"
                    style={{
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                      fontWeight: 400,
                      fontSize: "clamp(1.1rem, 1.5vw, 1.4rem)",
                      letterSpacing: "0.02em",
                    }}
                  >
                    {m.title}
                  </h3>
                  <p
                    className="mt-3 leading-[1.8] text-[var(--lm-text-muted)] group-hover:text-[var(--lm-text-secondary)] transition-colors duration-300"
                    style={{
                      fontFamily: "var(--font-inter)",
                      fontSize: "0.875rem",
                      fontWeight: 300,
                    }}
                  >
                    {m.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
