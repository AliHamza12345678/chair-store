"use client";

// ─── Editorial Category Hero ──────────────────────────────────────────────────
// Full-width luxury header for category pages with noise texture, radial spotlight,
// architectural corner marks, and editorial typography.

import { useRef, useEffect } from "react";

interface CategoryHeroProps {
  name: string;
  description?: string | null;
  totalCount: number;
  imageUrl?: string | null;
}

export default function CategoryHero({
  name,
  description,
  totalCount,
  imageUrl,
}: CategoryHeroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Subtle ambient particle canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let w = (canvas.width = canvas.offsetWidth);
    let h = (canvas.height = canvas.offsetHeight);

    const particles: { x: number; y: number; vx: number; vy: number; alpha: number }[] = [];
    for (let i = 0; i < 25; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.08,
        alpha: Math.random() * 0.25 + 0.05,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 175, 80, ${p.alpha})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="relative overflow-hidden bg-[var(--lm-surface-primary)] pt-40 pb-24" style={{ minHeight: "48vh" }}>
      {/* ── Background image with dark overlay if present ── */}
      {imageUrl && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <img
            src={imageUrl}
            alt=""
            className="w-full h-full object-cover opacity-15 scale-105"
            style={{ filter: "saturate(0.5) blur(4px)" }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--lm-surface-primary)]/80 via-[var(--lm-surface-primary)] to-[var(--lm-surface-primary)]" />
        </div>
      )}

      {/* ── Particle canvas ── */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        aria-hidden="true"
      />

      {/* ── Spotlight ── */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "-20%",
          left: "40%",
          width: "70vw",
          height: "70vw",
          background: "radial-gradient(ellipse at center, rgba(180,140,60,0.06) 0%, transparent 60%)",
        }}
        aria-hidden="true"
      />

      {/* ── Architectural corner marks ── */}
      <div className="absolute left-8 top-8 z-10 h-10 w-px bg-gradient-to-b from-[var(--lm-accent-primary)]/50 to-transparent" />
      <div className="absolute left-8 top-8 z-10 h-px w-10 bg-gradient-to-r from-[var(--lm-accent-primary)]/50 to-transparent" />
      <div className="absolute right-8 top-8 z-10 h-10 w-px bg-gradient-to-b from-[var(--lm-accent-primary)]/30 to-transparent" />
      <div className="absolute right-8 top-8 z-10 h-px w-10 bg-gradient-to-l from-[var(--lm-accent-primary)]/30 to-transparent" />

      {/* ── Decorative bottom line ── */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--lm-border-default)] to-transparent" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-12 lg:px-20">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
          
          {/* Headline & description */}
          <div className="max-w-3xl">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px w-12 bg-gradient-to-r from-[var(--lm-accent-primary)]/70 to-[var(--lm-accent-muted)]" />
              <span
                className="text-[9px] font-medium uppercase tracking-[0.65em] text-[var(--lm-accent-text)]/70"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Salon Collection
              </span>
            </div>

            <h1
              className="leading-[0.92] text-[var(--lm-text-primary)]"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontWeight: 300,
                fontSize: "clamp(3.5rem, 7.5vw, 7.5rem)",
                letterSpacing: "-0.02em",
              }}
            >
              {name}
            </h1>

            {description && (
              <p
                className="mt-8 text-[var(--lm-text-secondary)] max-w-2xl leading-relaxed"
                style={{
                  fontFamily: "var(--font-inter)",
                  fontSize: "0.9rem",
                  fontWeight: 300,
                  letterSpacing: "0.03em",
                  lineHeight: 1.85,
                }}
              >
                {description}
              </p>
            )}
          </div>

          {/* Right counter stats */}
          <div className="flex flex-col gap-3 lg:items-end lg:pb-3 flex-shrink-0">
            <div
              className="font-mono text-[3.5rem] leading-none text-transparent lg:text-right select-none"
              style={{
                WebkitTextStroke: "1px rgba(180,140,60,0.2)",
                fontWeight: 300,
                letterSpacing: "-0.05em",
              }}
            >
              {String(totalCount).padStart(2, "0")}
            </div>

            <p
              className="text-[var(--lm-text-muted)] uppercase tracking-[0.4em] text-[8.5px]"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              {totalCount === 1 ? "Curated Piece" : "Curated Pieces"}
            </p>
            <p
              className="text-[var(--lm-text-muted)] italic"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontWeight: 300,
                fontSize: "0.95rem",
              }}
            >
              Handcrafted for distinguished spaces.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
