"use client";

// ─────────────────────────────────────────────────────────────────────────────
// LUMINA ATELIER — LUXURY ARCHITECTURAL & EDITORIAL FOOTER
// Design System: High-End Minimalist Editorial, Architectural Grid & Colossal Typography
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";

export function Footer() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please provide a valid email address");
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubscribed(true);
      toast.success("Welcome to Lumina Atelier Dispatches. Your invitation key has been sent.");
      setEmail("");
    }, 600);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-[var(--lm-surface-primary)] text-[var(--lm-text-primary)] border-t border-[var(--lm-border-default)] overflow-hidden font-sans selection:bg-[var(--lm-accent-primary)] selection:text-black">
      
      {/* ── Architectural Blueprint Grid Overlay ── */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{ 
          backgroundImage: `linear-gradient(to right, var(--lm-text-primary) 1px, transparent 1px), linear-gradient(to bottom, var(--lm-text-primary) 1px, transparent 1px)`,
          backgroundSize: '5rem 5rem'
        }}
      />

      {/* ── Ambient Radial Warm Accent ── */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[var(--lm-accent-primary)]/[0.015] blur-[160px] pointer-events-none rounded-full" />

      <div className="relative z-10 mx-auto max-w-[1440px] px-6 sm:px-12 lg:px-20 pt-20 pb-12">
        
        {/* ── 00. ARCHITECTURAL TOP STATUS BAR ── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-12 border-b border-[var(--lm-border-default)] text-[9px] font-mono uppercase tracking-[0.45em] text-[var(--lm-text-secondary)]">
          <div className="flex items-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--lm-accent-primary)] animate-pulse shadow-[0_0_8px_var(--lm-accent-glow)]" />
            <span className="text-[var(--lm-accent-text)]/90 font-medium">LUMINA ARCHITECTURAL INDEX // VOL. XXIV</span>
          </div>

          <div className="flex items-center gap-6 flex-wrap">
            <span className="text-[var(--lm-text-secondary)]">GPS: 31.5204° N, 74.3587° E</span>
            <span className="hidden sm:inline text-[var(--lm-border-strong)]">•</span>
            <span className="text-[var(--lm-text-secondary)]">CET / GMT+1</span>
            <span className="hidden sm:inline text-[var(--lm-border-strong)]">•</span>
            <span className="text-[var(--lm-accent-primary)]/80">MILANO / PARIS / NEW YORK / LAHORE</span>
          </div>
        </div>

        {/* ── 01. EDITORIAL NEWSLETTER SECTION ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 py-20 border-b border-[var(--lm-border-default)] items-center">
          
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-[9px] uppercase tracking-[0.6em] text-[var(--lm-accent-primary)]/80 font-mono">
                00 // ATELIER DISPATCHES
              </span>
              <div className="h-px w-12 bg-[var(--lm-accent-muted)]" />
            </div>
            
            <h2
              className="text-[var(--lm-text-primary)] text-3xl sm:text-4xl md:text-5xl font-light tracking-tight leading-[1.15]"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              Subscribe for private salon invitations, material releases &amp; limited seating drops.
            </h2>
            
            <p className="text-[var(--lm-text-secondary)] text-xs sm:text-sm font-light max-w-lg leading-relaxed">
              Join our collector circle to receive architectural design monographs, timber finish updates, and advance keys for bespoke allocations.
            </p>
          </div>

          <div className="lg:col-span-6 lg:pl-8">
            {subscribed ? (
              <div className="p-8 border border-[var(--lm-accent-border)] bg-[var(--lm-accent-primary)]/[0.03] space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-[var(--lm-accent-primary)] block">
                  ✓ Dispatch Registration Confirmed
                </span>
                <p className="text-sm font-light text-[var(--lm-text-secondary)]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                  Thank you. You have been added to the Lumina Private Atelier Registry.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-4">
                <div className="relative flex items-center border-b border-[var(--lm-border-strong)] focus-within:border-[var(--lm-accent-primary)] transition-colors duration-500 pb-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address..."
                    disabled={isSubmitting}
                    className="w-full bg-transparent text-sm sm:text-base text-[var(--lm-text-primary)] placeholder:text-[var(--lm-text-muted)] focus:outline-none font-mono py-1 pr-32 tracking-wider"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="absolute right-0 text-[9px] uppercase tracking-[0.4em] text-[var(--lm-accent-text)] hover:text-black transition-all duration-300 font-mono py-2 px-4 border border-[var(--lm-accent-border)] bg-[var(--lm-accent-muted)] hover:bg-[var(--lm-accent-primary)] disabled:opacity-50"
                  >
                    {isSubmitting ? "Registering..." : "Subscribe →"}
                  </button>
                </div>

                <div className="flex items-center justify-between text-[9px] font-mono text-[var(--lm-text-secondary)] tracking-wider">
                  <span>Strictly private correspondence</span>
                  <span>Unsubscribe at any time</span>
                </div>
              </form>
            )}
          </div>

        </div>

        {/* ── 02. EDITORIAL NAVIGATION DIRECTORY ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 py-20 border-b border-[var(--lm-border-default)] items-start">
          
          {/* Column 01 */}
          <div className="space-y-6">
            <span className="text-[9.5px] uppercase tracking-[0.5em] text-[var(--lm-accent-primary)] opacity-80 font-mono block border-b border-[var(--lm-border-default)] pb-3">
              01 // COLLECTIONS
            </span>
            <ul className="space-y-3.5 text-xs font-mono text-[var(--lm-text-secondary)]">
              <li>
                <Link href="/products" className="hover:text-[var(--lm-text-primary)] transition-all duration-300 flex items-center gap-2 group">
                  <span className="opacity-0 group-hover:opacity-100 text-[var(--lm-accent-primary)] text-[10px] transition-opacity -ml-3 group-hover:ml-0 duration-300">›</span>
                  All Seating Pieces
                </Link>
              </li>
              <li>
                <Link href="/category/chairs" className="hover:text-[var(--lm-text-primary)] transition-all duration-300 flex items-center gap-2 group">
                  <span className="opacity-0 group-hover:opacity-100 text-[var(--lm-accent-primary)] text-[10px] transition-opacity -ml-3 group-hover:ml-0 duration-300">›</span>
                  Sculptural Lounge Chairs
                </Link>
              </li>
              <li>
                <Link href="/category/sofas" className="hover:text-[var(--lm-text-primary)] transition-all duration-300 flex items-center gap-2 group">
                  <span className="opacity-0 group-hover:opacity-100 text-[var(--lm-accent-primary)] text-[10px] transition-opacity -ml-3 group-hover:ml-0 duration-300">›</span>
                  Atelier Sofas &amp; Daybeds
                </Link>
              </li>
              <li>
                <Link href="/category/tables" className="hover:text-[var(--lm-text-primary)] transition-all duration-300 flex items-center gap-2 group">
                  <span className="opacity-0 group-hover:opacity-100 text-[var(--lm-accent-primary)] text-[10px] transition-opacity -ml-3 group-hover:ml-0 duration-300">›</span>
                  Bespoke Dining Tables
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-[var(--lm-text-primary)] transition-all duration-300 flex items-center gap-2 group">
                  <span className="opacity-0 group-hover:opacity-100 text-[var(--lm-accent-primary)] text-[10px] transition-opacity -ml-3 group-hover:ml-0 duration-300">›</span>
                  Architectural Benches
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 02 */}
          <div className="space-y-6">
            <span className="text-[9.5px] uppercase tracking-[0.5em] text-[var(--lm-accent-primary)] font-mono block border-b border-[var(--lm-border-default)] pb-3">
              02 // THE ATELIER
            </span>
            <ul className="space-y-3.5 text-xs font-mono text-[var(--lm-text-secondary)]">
              <li>
                <Link href="/about" className="hover:text-[var(--lm-text-primary)] transition-all duration-300 flex items-center gap-2 group">
                  <span className="opacity-0 group-hover:opacity-100 text-[var(--lm-accent-primary)] text-[10px] transition-opacity -ml-3 group-hover:ml-0 duration-300">›</span>
                  Design Philosophy
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-[var(--lm-text-primary)] transition-all duration-300 flex items-center gap-2 group">
                  <span className="opacity-0 group-hover:opacity-100 text-[var(--lm-accent-primary)] text-[10px] transition-opacity -ml-3 group-hover:ml-0 duration-300">›</span>
                  Journal &amp; Monographs
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[var(--lm-text-primary)] transition-all duration-300 flex items-center gap-2 group">
                  <span className="opacity-0 group-hover:opacity-100 text-[var(--lm-accent-primary)] text-[10px] transition-opacity -ml-3 group-hover:ml-0 duration-300">›</span>
                  Timber &amp; Finish Archive
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[var(--lm-text-primary)] transition-all duration-300 flex items-center gap-2 group">
                  <span className="opacity-0 group-hover:opacity-100 text-[var(--lm-accent-primary)] text-[10px] transition-opacity -ml-3 group-hover:ml-0 duration-300">›</span>
                  Craftsmanship Manifesto
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[var(--lm-text-primary)] transition-all duration-300 flex items-center gap-2 group">
                  <span className="opacity-0 group-hover:opacity-100 text-[var(--lm-accent-primary)] text-[10px] transition-opacity -ml-3 group-hover:ml-0 duration-300">›</span>
                  Sustainable Sourcing
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 03 */}
          <div className="space-y-6">
            <span className="text-[9.5px] uppercase tracking-[0.5em] text-[var(--lm-accent-primary)] font-mono block border-b border-[var(--lm-border-default)] pb-3">
              03 // CONCIERGE
            </span>
            <ul className="space-y-3.5 text-xs font-mono text-[var(--lm-text-secondary)]">
              <li>
                <Link href="/contact" className="hover:text-[var(--lm-text-primary)] transition-all duration-300 flex items-center gap-2 group">
                  <span className="opacity-0 group-hover:opacity-100 text-[var(--lm-accent-primary)] text-[10px] transition-opacity -ml-3 group-hover:ml-0 duration-300">›</span>
                  Private Stylist Consult
                </Link>
              </li>
              <li>
                <Link href="/account/orders" className="hover:text-[var(--lm-text-primary)] transition-all duration-300 flex items-center gap-2 group">
                  <span className="opacity-0 group-hover:opacity-100 text-[var(--lm-accent-primary)] text-[10px] transition-opacity -ml-3 group-hover:ml-0 duration-300">›</span>
                  Acquisition Tracking
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[var(--lm-text-primary)] transition-all duration-300 flex items-center gap-2 group">
                  <span className="opacity-0 group-hover:opacity-100 text-[var(--lm-accent-primary)] text-[10px] transition-opacity -ml-3 group-hover:ml-0 duration-300">›</span>
                  White-Glove Delivery
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[var(--lm-text-primary)] transition-all duration-300 flex items-center gap-2 group">
                  <span className="opacity-0 group-hover:opacity-100 text-[var(--lm-accent-primary)] text-[10px] transition-opacity -ml-3 group-hover:ml-0 duration-300">›</span>
                  Lifetime Guarantee
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[var(--lm-text-primary)] transition-all duration-300 flex items-center gap-2 group">
                  <span className="opacity-0 group-hover:opacity-100 text-[var(--lm-accent-primary)] text-[10px] transition-opacity -ml-3 group-hover:ml-0 duration-300">›</span>
                  Bespoke Architectural Quotes
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 04 */}
          <div className="space-y-6">
            <span className="text-[9.5px] uppercase tracking-[0.5em] text-[var(--lm-accent-primary)] font-mono block border-b border-[var(--lm-border-default)] pb-3">
              04 // GLOBAL SALONS
            </span>
            <ul className="space-y-3.5 text-xs font-mono text-[var(--lm-text-secondary)]">
              <li className="flex items-center justify-between pb-1 border-b border-[var(--lm-border-subtle)]">
                <span className="text-[var(--lm-text-secondary)]">Milano Atelier</span>
                <span className="text-[9px] text-[var(--lm-text-secondary)]">Via Montenapoleone</span>
              </li>
              <li className="flex items-center justify-between pb-1 border-b border-[var(--lm-border-subtle)]">
                <span className="text-[var(--lm-text-secondary)]">Paris Salon</span>
                <span className="text-[9px] text-[var(--lm-text-secondary)]">Rue Saint-Honoré</span>
              </li>
              <li className="flex items-center justify-between pb-1 border-b border-[var(--lm-border-subtle)]">
                <span className="text-[var(--lm-text-secondary)]">New York Studio</span>
                <span className="text-[9px] text-[var(--lm-text-secondary)]">SoHo District</span>
              </li>
              <li className="flex items-center justify-between pb-1 border-b border-[var(--lm-border-subtle)]">
                <span className="text-[var(--lm-accent-text)] font-medium">Lahore Flagship</span>
                <span className="text-[9px] text-[var(--lm-accent-primary)]">Gulberg III</span>
              </li>
            </ul>
          </div>

        </div>

        {/* ── 03. COLOSSAL ARCHITECTURAL BRAND TYPOGRAPHY ── */}
        <div className="py-16 overflow-hidden select-none border-b border-[var(--lm-border-default)] text-center">
          <h1
            className="text-[var(--lm-text-primary)] text-[12vw] sm:text-[13.5vw] lg:text-[14.5vw] font-extralight tracking-[0.12em] leading-none transition-colors duration-700 hover:text-[var(--lm-accent-hover)]/90 cursor-default"
            style={{ 
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              textShadow: "0 0 80px rgba(245, 158, 11, 0.04)"
            }}
          >
            LUMINA
          </h1>
          <div className="flex items-center justify-center gap-4 sm:gap-8 mt-6 text-[8.5px] sm:text-[9.5px] uppercase tracking-[0.5em] font-mono text-[var(--lm-text-secondary)] flex-wrap">
            <span>ARCHITECTURAL FURNITURE</span>
            <span className="text-[var(--lm-accent-primary)]">•</span>
            <span>BESPOKE WOODCRAFT</span>
            <span className="text-[var(--lm-accent-primary)]">•</span>
            <span>PRIVATE ATELIER SALONS</span>
          </div>
        </div>

        {/* ── 04. SOCIAL & BOTTOM BAR ── */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 pt-10 text-[9.5px] font-mono text-[var(--lm-text-secondary)] tracking-widest">
          
          {/* Social Links */}
          <div className="flex items-center gap-6 uppercase flex-wrap justify-center">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--lm-accent-text)] transition-colors duration-300"
            >
              [ INSTAGRAM ]
            </a>
            <a
              href="https://pinterest.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--lm-accent-text)] transition-colors duration-300"
            >
              [ PINTEREST ]
            </a>
            <a
              href="https://archdaily.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--lm-accent-text)] transition-colors duration-300"
            >
              [ ARCHDAILY ]
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--lm-accent-text)] transition-colors duration-300"
            >
              [ LINKEDIN ]
            </a>
          </div>

          {/* Copyright & Back to Top */}
          <div className="flex items-center gap-8 uppercase flex-wrap justify-center">
            <span>&copy; {new Date().getFullYear()} LUMINA ATELIER. ALL RIGHTS RESERVED.</span>
            
            <button
              onClick={scrollToTop}
              className="text-[var(--lm-accent-text)] hover:text-[var(--lm-text-primary)] transition-colors duration-300 flex items-center gap-2 font-mono py-1 px-3 border border-[var(--lm-accent-border)] hover:border-[var(--lm-accent-border)] bg-[var(--lm-accent-muted)] hover:bg-[var(--lm-accent-muted)]"
            >
              <span>TOP</span>
              <span>↑</span>
            </button>
          </div>

        </div>

      </div>
    </footer>
  );
}
