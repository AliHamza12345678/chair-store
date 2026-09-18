"use client";

// ─── Collection Story & Philosophy ─────────────────────────────────────────────
// Editorial story block detailing the design philosophy and craftsmanship of the category.

interface CollectionStoryProps {
  categoryName: string;
}

export default function CollectionStory({ categoryName }: CollectionStoryProps) {
  return (
    <div className="my-24 py-20 border-t border-b border-[var(--lm-border-subtle)]">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        
        {/* Left: Manifesto quote */}
        <div className="lg:col-span-5 relative pl-6 border-l border-[var(--lm-accent-primary)]/40">
          <span
            className="text-[8.5px] uppercase tracking-[0.6em] text-[var(--lm-accent-text)]/60 block mb-4"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Design Philosophy
          </span>

          <blockquote
            className="text-[var(--lm-text-primary)] italic leading-snug mb-6"
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontWeight: 300,
              fontSize: "clamp(1.6rem, 2.5vw, 2.4rem)",
              letterSpacing: "-0.01em",
            }}
          >
            "In {categoryName.toLowerCase()}, form is not merely a vessel — it is an architectural dialogue between timber, light, and shadow."
          </blockquote>

          <span
            className="text-[8px] uppercase tracking-[0.4em] text-[var(--lm-text-muted)] block"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            — Lumina Atelier Manifesto
          </span>
        </div>

        {/* Right: Three pillars of craftsmanship */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-8">
          {[
            {
              number: "01",
              title: "Materiality",
              text: "Hand-selected solid oak, Italian full-grain leather, and honed natural marble.",
            },
            {
              number: "02",
              title: "Proportion",
              text: "Rigorously engineered ergonomics balanced with timeless mid-century silhouettes.",
            },
            {
              number: "03",
              title: "Longevity",
              text: "Mortise-and-tenon joinery designed to endure across generations.",
            },
          ].map((pillar) => (
            <div key={pillar.number} className="flex flex-col gap-3">
              <span
                className="font-mono text-[9px] text-[var(--lm-accent-primary)]/40 tracking-[0.3em]"
              >
                §{pillar.number}
              </span>
              <h4
                className="text-[var(--lm-text-primary)] text-base"
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontWeight: 400,
                  letterSpacing: "0.03em",
                }}
              >
                {pillar.title}
              </h4>
              <p
                className="text-[var(--lm-text-muted)] text-xs leading-relaxed"
                style={{
                  fontFamily: "var(--font-inter)",
                  fontWeight: 300,
                  letterSpacing: "0.03em",
                  lineHeight: 1.7,
                }}
              >
                {pillar.text}
              </p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
