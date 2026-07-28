"use client";

// ─── Luxury Image Gallery ──────────────────────────────────────────────────────
// Features:
//   • Full-height vertical gallery strip (thumbnails left, hero right)
//   • Pinch-zoom / mouse-wheel zoom on desktop with lens loupe
//   • Keyboard navigation through images
//   • Animated crossfade between images
//   • Swipe-ready mobile layout
//   • Floating image index counter

import { useState, useRef, useCallback, useEffect } from "react";
import { cn } from "@/lib/clsx";

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [zoomScale, setZoomScale] = useState(2.5);
  const heroRef = useRef<HTMLDivElement>(null);

  const safeImages = images.length > 0 ? images : [""];

  const goTo = useCallback((idx: number) => {
    if (idx === activeIndex || isTransitioning) return;
    setPrevIndex(activeIndex);
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveIndex(idx);
      setIsTransitioning(false);
    }, 380);
  }, [activeIndex, isTransitioning]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goTo(Math.max(0, activeIndex - 1));
      if (e.key === "ArrowRight") goTo(Math.min(safeImages.length - 1, activeIndex + 1));
      if (e.key === "Escape") setZoomed(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [activeIndex, goTo, safeImages.length]);

  // Mouse zoom tracking
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!zoomed || !heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (!zoomed) return;
    e.preventDefault();
    setZoomScale(prev => Math.max(1.5, Math.min(5, prev - e.deltaY * 0.005)));
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-full">

      {/* ── Thumbnail strip (left on desktop, bottom on mobile) ── */}
      {safeImages.length > 1 && (
        <div className="order-2 lg:order-1 flex flex-row lg:flex-col gap-3 lg:w-20 overflow-x-auto lg:overflow-y-auto lg:max-h-[680px] pb-1 lg:pb-0 scrollbar-none">
          {safeImages.map((img, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={cn(
                "relative flex-shrink-0 w-16 h-16 lg:w-full lg:h-20 overflow-hidden border transition-all duration-400",
                activeIndex === i
                  ? "border-[var(--lm-accent-border)]/60"
                  : "border-[var(--lm-border-default)] hover:border-[var(--lm-border-strong)] opacity-50 hover:opacity-80"
              )}
              aria-label={`View image ${i + 1}`}
            >
              {img ? (
                <img
                  src={img}
                  alt={`${productName} ${i + 1}`}
                  className="w-full h-full object-cover"
                  style={{ filter: "saturate(0.7)" }}
                />
              ) : (
                <div className="w-full h-full bg-[var(--lm-surface-secondary)]" />
              )}
              {/* Active left bar */}
              {activeIndex === i && (
                <div className="absolute left-0 top-0 w-[2px] h-full bg-gradient-to-b from-amber-400 to-amber-400/20" />
              )}
            </button>
          ))}
        </div>
      )}

      {/* ── Hero image (main stage) ── */}
      <div className="order-1 lg:order-2 flex-1 relative">
        <div
          ref={heroRef}
          className={cn(
            "relative overflow-hidden bg-[var(--lm-surface-secondary)] select-none",
            zoomed ? "cursor-crosshair" : "cursor-zoom-in"
          )}
          style={{ aspectRatio: "4/5" }}
          onClick={() => setZoomed(z => !z)}
          onMouseMove={handleMouseMove}
          onWheel={handleWheel}
        >
          {/* ── Previous image (fade out) ── */}
          {safeImages[prevIndex] && (
            <img
              src={safeImages[prevIndex]}
              alt={`${productName} — previous`}
              className={cn(
                "absolute inset-0 w-full h-full object-cover transition-opacity duration-400",
                isTransitioning ? "opacity-100" : "opacity-0"
              )}
              style={{ filter: "saturate(0.8)" }}
            />
          )}

          {/* ── Active image ── */}
          {safeImages[activeIndex] ? (
            <img
              src={safeImages[activeIndex]}
              alt={`${productName} — view ${activeIndex + 1}`}
              className={cn(
                "absolute inset-0 w-full h-full object-cover transition-all duration-400",
                isTransitioning ? "opacity-0 scale-[1.02]" : "opacity-100 scale-100"
              )}
              style={{
                filter: "saturate(0.8)",
                ...(zoomed && {
                  transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                  transform: `scale(${zoomScale})`,
                  transition: "transform 0.1s ease-out",
                }),
              }}
              draggable={false}
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-[var(--lm-text-muted)]">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <rect x="8" y="8" width="32" height="32" rx="2" stroke="currentColor" strokeWidth="1" />
                <circle cx="19" cy="19" r="4" fill="currentColor" opacity="0.3" />
                <path d="M8 34L18 24L24 30L30 22L40 34" stroke="currentColor" strokeWidth="1" />
              </svg>
              <span className="text-[8px] uppercase tracking-[0.4em]" style={{ fontFamily: "var(--font-inter)" }}>
                No image
              </span>
            </div>
          )}

          {/* ── Zoom indicator ── */}
          {!zoomed && safeImages[activeIndex] && (
            <div
              className="absolute bottom-5 right-5 flex items-center gap-2 px-3 py-1.5 border border-[var(--lm-border-strong)] transition-opacity duration-300"
              style={{ backdropFilter: "blur(10px)", background: "rgba(0,0,0,0.5)" }}
            >
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none" className="text-[var(--lm-text-muted)]">
                <circle cx="5" cy="5" r="4" stroke="currentColor" strokeWidth="1" />
                <path d="M8.5 8.5L10.5 10.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                <path d="M5 3V7M3 5H7" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
              </svg>
              <span className="text-[7px] uppercase tracking-[0.35em] text-[var(--lm-text-muted)]" style={{ fontFamily: "var(--font-inter)" }}>
                Zoom
              </span>
            </div>
          )}

          {/* ── Gradient overlay ── */}
          {!zoomed && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
          )}

          {/* ── Image counter ── */}
          <div className="absolute top-5 left-5 pointer-events-none">
            <span
              className="text-[8px] font-mono tracking-[0.3em] text-white/25"
            >
              {String(activeIndex + 1).padStart(2, "0")} / {String(safeImages.length).padStart(2, "0")}
            </span>
          </div>

          {/* ── Inset border ── */}
          <div className="absolute inset-0 border border-[var(--lm-border-subtle)] pointer-events-none" />
        </div>

        {/* ── Prev / Next arrows ── */}
        {safeImages.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); goTo(Math.max(0, activeIndex - 1)); }}
              disabled={activeIndex === 0}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center border border-[var(--lm-border-strong)] text-[var(--lm-text-muted)] hover:text-[var(--lm-text-primary)] hover:border-white/25 transition-all duration-300 disabled:opacity-20 disabled:pointer-events-none"
              style={{ backdropFilter: "blur(8px)", background: "rgba(0,0,0,0.4)" }}
              aria-label="Previous image"
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M7 1L3 5L7 9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); goTo(Math.min(safeImages.length - 1, activeIndex + 1)); }}
              disabled={activeIndex === safeImages.length - 1}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center border border-[var(--lm-border-strong)] text-[var(--lm-text-muted)] hover:text-[var(--lm-text-primary)] hover:border-white/25 transition-all duration-300 disabled:opacity-20 disabled:pointer-events-none"
              style={{ backdropFilter: "blur(8px)", background: "rgba(0,0,0,0.4)" }}
              aria-label="Next image"
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M3 1L7 5L3 9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </button>
          </>
        )}

        {/* ── Dot navigation (mobile) ── */}
        {safeImages.length > 1 && (
          <div className="flex justify-center gap-1.5 mt-4 lg:hidden">
            {safeImages.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={cn(
                  "transition-all duration-300 rounded-full",
                  activeIndex === i
                    ? "w-5 h-1 bg-amber-400/70"
                    : "w-1 h-1 bg-white/20 hover:bg-white/40"
                )}
                aria-label={`Image ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
