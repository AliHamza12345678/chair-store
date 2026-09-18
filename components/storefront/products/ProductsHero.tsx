// ─── Luxury Products Hero ─────────────────────────────────────────────────────
// Editorial masthead with kinetic typography, animated particle constellation,
// and multi-layered depth — far beyond a generic page header.

"use client";

import { useEffect, useRef } from "react";

interface ProductsHeroProps {
  totalCount: number;
  activeCategory?: string;
}

export default function ProductsHero({ totalCount, activeCategory }: ProductsHeroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Particle constellation on the canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let w = 0;
    let h = 0;

    interface Particle {
      x: number; y: number; vx: number; vy: number;
      size: number; opacity: number; pulse: number; phase: number;
    }

    const particles: Particle[] = [];
    const NUM = 40;

    const resize = () => {
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = w;
      canvas.height = h;
    };

    const init = () => {
      particles.length = 0;
      for (let i = 0; i < NUM; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.18,
          vy: (Math.random() - 0.5) * 0.10,
          size: Math.random() * 1.5 + 0.5,
          opacity: Math.random() * 0.3 + 0.05,
          pulse: Math.random() * 0.005 + 0.002,
          phase: Math.random() * Math.PI * 2,
        });
      }
    };

    let t = 0;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      t += 1;

      // Draw constellation lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(180, 140, 60, ${0.06 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        const pulse = Math.sin(t * p.pulse + p.phase) * 0.5 + 0.5;
        const alpha = p.opacity * (0.6 + 0.4 * pulse);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 175, 80, ${alpha})`;
        ctx.fill();
      });

      animId = requestAnimationFrame(draw);
    };

    resize();
    init();
    draw();

    const ro = new ResizeObserver(() => { resize(); init(); });
    ro.observe(canvas.parentElement!);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
  }, []);

  const headline = activeCategory
    ? activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1).replace(/-/g, " ")
    : "The Collection";

  return (
    <div className="relative overflow-hidden bg-[var(--lm-surface-primary)]" style={{ minHeight: "52vh" }}>

      {/* ── Canvas constellation layer ── */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        aria-hidden="true"
      />

      {/* ── Noise texture overlay ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
          backgroundSize: "150px 150px",
          mixBlendMode: "screen",
          opacity: 0.35,
        }}
        aria-hidden="true"
      />

      {/* ── Radial spotlight ── */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "-20%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "80vw",
          height: "80vw",
          background: "radial-gradient(ellipse at center, rgba(180,140,60,0.07) 0%, transparent 65%)",
        }}
        aria-hidden="true"
      />

      {/* ── Architectural corner marks ── */}
      <div className="absolute left-8 top-8 z-10 h-10 w-px bg-gradient-to-b from-amber-400/50 to-transparent" />
      <div className="absolute left-8 top-8 z-10 h-px w-10 bg-gradient-to-r from-amber-400/50 to-transparent" />
      <div className="absolute right-8 top-8 z-10 h-10 w-px bg-gradient-to-b from-amber-400/30 to-transparent" />
      <div className="absolute right-8 top-8 z-10 h-px w-10 bg-gradient-to-l from-amber-400/30 to-transparent" />

      {/* ── Vertical guide rails ── */}
      <div
        className="pointer-events-none absolute top-0 h-full w-px hidden lg:block"
        style={{ left: "5rem", background: "rgba(255,255,255,0.02)" }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-0 h-full w-px hidden lg:block"
        style={{ right: "5rem", background: "rgba(255,255,255,0.02)" }}
        aria-hidden="true"
      />

      {/* ── Bottom gradient fade ── */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background: "linear-gradient(to top, var(--lm-surface-primary), transparent)" }}
        aria-hidden="true"
      />

      {/* ── Decorative bottom line ── */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--lm-border-default)] to-transparent" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-12 lg:px-20 pt-40 pb-24">

        {/* ── Top eyebrow row ── */}
        <div className="flex items-center gap-4 mb-12">
          <div className="h-px w-14 bg-gradient-to-r from-amber-400/70 to-amber-400/10" />
          <span
            className="text-[9px] font-medium uppercase tracking-[0.65em] text-[var(--lm-accent-text)]/70"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Lumina — Atelier
          </span>
          <div className="h-px flex-1 bg-[var(--lm-border-subtle)]" />
          <span
            className="text-[9px] uppercase tracking-[0.35em] text-[var(--lm-text-muted)] tabular-nums"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            {String(totalCount).padStart(3, "0")} pieces
          </span>
        </div>

        {/* ── Main headline block ── */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
          <div className="max-w-3xl">

            {/* Number index — editorial detail */}
            <div className="mb-4 flex items-center gap-3">
              <span
                className="font-mono text-[0.65rem] text-amber-400/20 tracking-[0.2em]"
              >
                §01
              </span>
            </div>

            <h1
              className="leading-[0.92] text-[var(--lm-text-primary)]"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontWeight: 300,
                fontSize: "clamp(3.5rem, 8vw, 8.5rem)",
                letterSpacing: "-0.02em",
              }}
            >
              {activeCategory ? (
                <>
                  {headline.split(" ").map((word, i) => (
                    <span key={i} className="block">
                      {i > 0 ? (
                        <em style={{ fontStyle: "italic", color: "rgba(163,163,163,0.55)", fontWeight: 300 }}>
                          {word}
                        </em>
                      ) : word}
                    </span>
                  ))}
                </>
              ) : (
                <>
                  All{" "}
                  <em style={{ fontStyle: "italic", color: "rgba(163,163,163,0.55)", fontWeight: 300 }}>
                    Pieces.
                  </em>
                </>
              )}
            </h1>

            {/* ── Accent rule below headline ── */}
            <div className="mt-8 flex items-center gap-4">
              <div className="h-px w-20 bg-gradient-to-r from-amber-400/60 to-transparent" />
              <span
                className="text-[var(--lm-text-muted)] italic"
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontWeight: 300,
                  fontSize: "1.05rem",
                }}
              >
                Designed for sophisticated interiors.
              </span>
            </div>
          </div>

          {/* ── Right stat block ── */}
          <div className="flex flex-col items-start lg:items-end gap-6 lg:pb-4 flex-shrink-0">

            {/* Animated counter display */}
            <div
              className="font-mono text-[4rem] leading-none text-transparent lg:text-right select-none"
              style={{
                WebkitTextStroke: "1px rgba(180,140,60,0.15)",
                fontWeight: 300,
                letterSpacing: "-0.05em",
              }}
            >
              {String(totalCount).padStart(3, "0")}
            </div>

            <div className="flex flex-col gap-2 lg:items-end">
              <div className="flex items-center gap-2">
                <div className="h-1 w-1 rounded-full bg-amber-400/60" />
                <span
                  className="text-[8.5px] uppercase tracking-[0.45em] text-[var(--lm-text-muted)]"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  Pieces available
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-1 w-1 rounded-full bg-[var(--lm-surface-active)]" />
                <span
                  className="text-[8.5px] uppercase tracking-[0.45em] text-[var(--lm-text-muted)]"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  Free delivery Rs 50k+
                </span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
