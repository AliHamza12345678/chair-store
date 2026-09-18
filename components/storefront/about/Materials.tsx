const materials = [
  {
    index: "01",
    name: "Full-Grain Leather",
    origin: "Saddlery tanneries, Northern Italy",
    qualities: ["Natural grain pattern", "Develops patina over decades", "Breathes with temperature"],
    note: "We reject corrected-grain leather. The surface you touch is the surface the animal wore.",
  },
  {
    index: "02",
    name: "European Walnut",
    origin: "Certified forests, Austria & Slovenia",
    qualities: ["FSC-certified harvest", "Kiln-dried 12% moisture", "Hand-selected grain"],
    note: "No two pieces share the same grain. This is not a flaw — it is the signature.",
  },
  {
    index: "03",
    name: "Down & Fibre Fill",
    origin: "Responsible down standard, Hungary",
    qualities: ["80/20 down-to-feather ratio", "Hand-stuffed at controlled density", "Re-stuffable by design"],
    note: "Cushions that hold their shape for fifteen years, then can be renewed rather than replaced.",
  },
  {
    index: "04",
    name: "Solid Brass Hardware",
    origin: "Precision casting, Germany",
    qualities: ["Unlacquered living finish", "Hand-polished to 400 grit", "Salt-fog tested 500hr"],
    note: "Hardware should be felt, not seen. Weight signals integrity.",
  },
];

export default function Materials() {
  return (
    <section
      className="relative overflow-hidden py-44"
      style={{ background: "linear-gradient(180deg, var(--lm-surface-secondary) 0%, var(--lm-surface-primary) 100%)" }}
    >
      {/* ── Decorative top ── */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--lm-accent-muted)] to-transparent" />

      <div className="mx-auto max-w-7xl px-6 sm:px-12 lg:px-20">

        {/* Section header */}
        <div className="mb-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-end">
          <div>
            <div className="flex items-center gap-4 mb-10">
              <span
                className="text-[9px] font-medium uppercase tracking-[0.6em] text-[var(--lm-accent-text)]"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Chapter IV · Materials
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
              Noble
              <br />
              <em style={{ fontStyle: "italic", color: "var(--lm-text-secondary)", fontWeight: 300 }}>
                materials.
              </em>
            </h2>
          </div>

          <p
            className="text-[var(--lm-text-muted)] leading-[1.8] lg:pb-2"
            style={{ fontFamily: "var(--font-inter)", fontSize: "0.875rem", fontWeight: 300 }}
          >
            We source four core materials. Each is chosen once — with absolute
            conviction — and then mastered over years of working with it. No
            annual replacements, no trend-driven substitutions.
          </p>
        </div>

        {/* ── Material cards ── */}
        <div className="grid grid-cols-1 gap-0 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[var(--lm-border-subtle)]"
          style={{ borderTop: "1px solid var(--lm-border-subtle)", borderBottom: "1px solid var(--lm-border-subtle)" }}
        >
          {materials.map((mat) => (
            <div
              key={mat.index}
              className="group flex flex-col gap-8 p-8 transition-all duration-500 hover:bg-[var(--lm-surface-hover)]"
            >
              {/* Index + origin */}
              <div className="flex items-start justify-between">
                <span
                  className="text-[8.5px] font-mono tracking-[0.4em] text-[var(--lm-text-muted)] group-hover:text-[var(--lm-accent-primary)] transition-colors duration-500"
                >
                  {mat.index}
                </span>
              </div>

              {/* Name */}
              <div>
                <h3
                  className="text-[var(--lm-text-secondary)] transition-colors duration-300 group-hover:text-[var(--lm-text-primary)]"
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontWeight: 400,
                    fontSize: "clamp(1.15rem, 1.4vw, 1.4rem)",
                    letterSpacing: "0.02em",
                  }}
                >
                  {mat.name}
                </h3>
                <p
                  className="mt-1.5 text-[var(--lm-text-muted)] group-hover:text-[var(--lm-text-secondary)] transition-colors duration-300"
                  style={{ fontFamily: "var(--font-inter)", fontSize: "0.7rem", letterSpacing: "0.06em" }}
                >
                  {mat.origin}
                </p>
              </div>

              {/* Qualities */}
              <ul className="space-y-2 flex-1">
                {mat.qualities.map((q) => (
                  <li key={q} className="flex items-start gap-3">
                    <div className="mt-2 h-0.5 w-3 flex-shrink-0 bg-[var(--lm-accent-muted)] group-hover:bg-[var(--lm-accent-primary)] transition-colors duration-400" />
                    <span
                      className="text-[var(--lm-text-muted)] group-hover:text-[var(--lm-text-secondary)] transition-colors duration-300"
                      style={{ fontFamily: "var(--font-inter)", fontSize: "0.775rem", fontWeight: 300, lineHeight: 1.6 }}
                    >
                      {q}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Footer note */}
              <div className="pt-4 border-t border-[var(--lm-border-subtle)]">
                <p
                  className="text-[var(--lm-text-muted)] group-hover:text-[var(--lm-text-secondary)] transition-colors duration-300 leading-[1.75] italic"
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontWeight: 300,
                    fontSize: "0.9rem",
                  }}
                >
                  {mat.note}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
