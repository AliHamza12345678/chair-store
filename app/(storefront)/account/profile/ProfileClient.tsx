"use client";

// ─── Luxury Atelier Profile Experience Client ─────────────────────────────────
// VIP Member identity card, bespoke material & design preferences,
// personal stylist representative card, and concierge appointment scheduler.

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { cn } from "@/lib/clsx";

interface UserProfileProps {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  createdAt: string;
}

const WOOD_FINISHES = ["Noir Walnut", "Smoked Oak", "Raw Teak", "Ebonized Ash"];
const METAL_ACCENTS = ["Brushed Brass", "Matte Obsidian", "Polished Copper", "Antique Gold"];
const ROOM_FOCUSES = ["Living Salon", "Executive Study", "Dining Room", "Master Suite"];
const DESIGN_THEMES = ["Mid-Century Modern", "Minimalist Luxury", "Brutalist Elegance", "Organic Modern"];

export function ProfileClient({ user }: { user: UserProfileProps }) {
  // Client state for bespoke design preferences
  const [selectedWood, setSelectedWood] = useState<string>("Noir Walnut");
  const [selectedMetal, setSelectedMetal] = useState<string>("Brushed Brass");
  const [selectedRoom, setSelectedRoom] = useState<string>("Living Salon");
  const [selectedTheme, setSelectedTheme] = useState<string>("Minimalist Luxury");
  const [isSavingPrefs, setIsSavingPrefs] = useState<boolean>(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState<boolean>(false);
  const [bookingDate, setBookingDate] = useState<string>("");
  const [bookingTime, setBookingTime] = useState<string>("14:00");

  const handleSavePreferences = () => {
    setIsSavingPrefs(true);
    setTimeout(() => {
      setIsSavingPrefs(false);
      toast.success("Bespoke design preferences saved to your profile");
    }, 600);
  };

  const handleBookAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingDate) {
      toast.error("Please select a date for your appointment");
      return;
    }
    toast.success("Salon appointment requested! Your concierge will confirm shortly.");
    setIsBookingModalOpen(false);
  };

  return (
    <div className="space-y-12 animate-in">
      
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 border-b border-[var(--lm-border-default)] gap-4">
        <div>
          <span
            className="text-[8.5px] uppercase tracking-[0.55em] text-[var(--lm-accent-text)]/80 block mb-2 font-mono"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Identity &amp; Bespoke Privileges
          </span>
          <h1
            className="text-[var(--lm-text-primary)] text-3xl sm:text-4xl font-light tracking-tight"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            Atelier VIP Profile Experience
          </h1>
          <p
            className="text-[var(--lm-text-secondary)] text-xs mt-2 font-light max-w-xl leading-relaxed"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Your private luxury profile, material preferences, personal stylist concierge, and bespoke privilege registry.
          </p>
        </div>

        <span className="text-[8.5px] uppercase tracking-[0.4em] text-[var(--lm-text-muted)] font-mono">
          Member Since {new Date(user.createdAt).getFullYear() || 2024}
        </span>
      </div>

      {/* ── VIP Member Pass Card ── */}
      <div className="relative p-8 bg-gradient-to-br from-[#0e0e11] via-neutral-950 to-[#0c0c0e] border border-[var(--lm-accent-border)]/40 shadow-[0_15px_40px_rgba(0,0,0,0.7)] overflow-hidden">
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-[var(--lm-accent-muted)] rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full border-2 border-[var(--lm-accent-border)]/60 bg-black flex items-center justify-center text-[var(--lm-accent-text)] font-mono text-3xl font-light shadow-[0_0_30px_rgba(212,175,80,0.25)] flex-shrink-0">
              {user.name ? user.name.charAt(0).toUpperCase() : "M"}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-0.5 text-[8px] uppercase tracking-[0.4em] bg-[var(--lm-accent-muted)] border border-[var(--lm-accent-border)]/40 text-[var(--lm-accent-text)] font-mono">
                  Solitaire Tier Member
                </span>
                <span className="text-[8px] uppercase tracking-[0.3em] text-emerald-400 font-mono">
                  ✓ Verified VIP
                </span>
              </div>
              <h2
                className="text-[var(--lm-text-primary)] text-3xl font-light tracking-wide"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
              >
                {user.name}
              </h2>
              <p className="text-[var(--lm-text-secondary)] text-xs font-mono">{user.email}</p>
            </div>
          </div>

          <div className="p-5 bg-black/60 border border-[var(--lm-border-default)] space-y-3 min-w-[240px]">
            <div className="flex justify-between items-center text-[7.5px] uppercase tracking-[0.4em] font-mono text-[var(--lm-text-muted)]">
              <span>Member Pass Reference</span>
              <span className="text-[var(--lm-accent-primary)]">LUMINA</span>
            </div>
            <div className="text-sm font-mono text-[var(--lm-accent-text)] tracking-widest">
              LUM-{user.id.slice(-8).toUpperCase()}
            </div>
            <div className="pt-2 border-t border-[var(--lm-border-default)] flex items-center justify-between text-[8px] font-mono text-[var(--lm-text-secondary)]">
              <span>White-Glove Status:</span>
              <span className="text-[var(--lm-text-primary)]">Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bespoke Design & Material Preferences ── */}
      <div className="p-8 bg-[var(--lm-surface-secondary)] border border-[var(--lm-border-default)] space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--lm-border-default)]">
          <div>
            <span className="text-[8.5px] uppercase tracking-[0.55em] text-[var(--lm-accent-text)] font-mono block mb-1">
              Custom Curation Engine
            </span>
            <h3
              className="text-[var(--lm-text-primary)] text-2xl font-light"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              Bespoke Interior &amp; Material Preferences
            </h3>
            <p className="text-[var(--lm-text-secondary)] text-xs mt-1 font-light">
              Selecting your preferred wood finishes and metals helps our stylists tailor salon recommendations.
            </p>
          </div>

          <button
            onClick={handleSavePreferences}
            disabled={isSavingPrefs}
            className="px-6 py-3 border border-[var(--lm-accent-border)]/50 bg-[var(--lm-accent-muted)] text-[8.5px] uppercase tracking-[0.4em] text-[var(--lm-accent-text)] hover:bg-[var(--lm-accent-muted)] font-mono whitespace-nowrap self-start sm:self-auto disabled:opacity-50"
          >
            {isSavingPrefs ? "Saving..." : "Save Preferences"}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Wood Finish Selector */}
          <div className="space-y-3">
            <span className="text-[8px] uppercase tracking-[0.4em] text-[var(--lm-text-secondary)] font-mono block">
              Preferred Atelier Wood Finish
            </span>
            <div className="grid grid-cols-2 gap-3">
              {WOOD_FINISHES.map((wood) => (
                <button
                  key={wood}
                  onClick={() => setSelectedWood(wood)}
                  className={cn(
                    "p-3.5 text-left border text-xs font-mono transition-all",
                    selectedWood === wood
                      ? "border-[var(--lm-accent-border)] bg-[var(--lm-accent-muted)] text-[var(--lm-accent-text)]"
                      : "border-[var(--lm-border-strong)] bg-black/40 text-[var(--lm-text-secondary)] hover:border-[var(--lm-border-strong)] hover:text-[var(--lm-text-primary)]"
                  )}
                >
                  <span className="text-[8px] uppercase tracking-[0.2em] text-[var(--lm-text-muted)] block mb-0.5">Finish</span>
                  {wood}
                </button>
              ))}
            </div>
          </div>

          {/* Metal Accents Selector */}
          <div className="space-y-3">
            <span className="text-[8px] uppercase tracking-[0.4em] text-[var(--lm-text-secondary)] font-mono block">
              Preferred Metal Hardware &amp; Accents
            </span>
            <div className="grid grid-cols-2 gap-3">
              {METAL_ACCENTS.map((metal) => (
                <button
                  key={metal}
                  onClick={() => setSelectedMetal(metal)}
                  className={cn(
                    "p-3.5 text-left border text-xs font-mono transition-all",
                    selectedMetal === metal
                      ? "border-[var(--lm-accent-border)] bg-[var(--lm-accent-muted)] text-[var(--lm-accent-text)]"
                      : "border-[var(--lm-border-strong)] bg-black/40 text-[var(--lm-text-secondary)] hover:border-[var(--lm-border-strong)] hover:text-[var(--lm-text-primary)]"
                  )}
                >
                  <span className="text-[8px] uppercase tracking-[0.2em] text-[var(--lm-text-muted)] block mb-0.5">Hardware</span>
                  {metal}
                </button>
              ))}
            </div>
          </div>

          {/* Room Focus */}
          <div className="space-y-3">
            <span className="text-[8px] uppercase tracking-[0.4em] text-[var(--lm-text-secondary)] font-mono block">
              Primary Space / Room Focus
            </span>
            <div className="grid grid-cols-2 gap-3">
              {ROOM_FOCUSES.map((room) => (
                <button
                  key={room}
                  onClick={() => setSelectedRoom(room)}
                  className={cn(
                    "p-3.5 text-left border text-xs font-mono transition-all",
                    selectedRoom === room
                      ? "border-[var(--lm-accent-border)] bg-[var(--lm-accent-muted)] text-[var(--lm-accent-text)]"
                      : "border-[var(--lm-border-strong)] bg-black/40 text-[var(--lm-text-secondary)] hover:border-[var(--lm-border-strong)] hover:text-[var(--lm-text-primary)]"
                  )}
                >
                  <span className="text-[8px] uppercase tracking-[0.2em] text-[var(--lm-text-muted)] block mb-0.5">Space</span>
                  {room}
                </button>
              ))}
            </div>
          </div>

          {/* Design Aesthetic Theme */}
          <div className="space-y-3">
            <span className="text-[8px] uppercase tracking-[0.4em] text-[var(--lm-text-secondary)] font-mono block">
              Preferred Architectural Aesthetic
            </span>
            <div className="grid grid-cols-2 gap-3">
              {DESIGN_THEMES.map((theme) => (
                <button
                  key={theme}
                  onClick={() => setSelectedTheme(theme)}
                  className={cn(
                    "p-3.5 text-left border text-xs font-mono transition-all",
                    selectedTheme === theme
                      ? "border-[var(--lm-accent-border)] bg-[var(--lm-accent-muted)] text-[var(--lm-accent-text)]"
                      : "border-[var(--lm-border-strong)] bg-black/40 text-[var(--lm-text-secondary)] hover:border-[var(--lm-border-strong)] hover:text-[var(--lm-text-primary)]"
                  )}
                >
                  <span className="text-[8px] uppercase tracking-[0.2em] text-[var(--lm-text-muted)] block mb-0.5">Aesthetic</span>
                  {theme}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ── Personal Concierge & Private Stylist Card ── */}
      <div className="p-8 bg-gradient-to-r from-neutral-950 via-[#0a0a0d] to-neutral-950 border border-[var(--lm-accent-border)] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-8 space-y-3">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-[8.5px] uppercase tracking-[0.5em] text-[var(--lm-accent-text)] font-mono">
              Assigned Private Design Concierge
            </span>
          </div>

          <h3
            className="text-[var(--lm-text-primary)] text-2xl font-light"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            Consultant: Elena Vance — Senior Atelier Stylist
          </h3>

          <p className="text-[var(--lm-text-secondary)] text-xs leading-relaxed font-light">
            Elena is assigned to your account for custom architectural seating specs, wood tone samples delivery, and private salon appointments.
          </p>
        </div>

        <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3">
          <button
            onClick={() => setIsBookingModalOpen(true)}
            className="px-6 py-3.5 border border-[var(--lm-accent-border)]/60 bg-[var(--lm-accent-muted)] text-[8.5px] uppercase tracking-[0.4em] text-[var(--lm-accent-text)] hover:bg-[var(--lm-accent-muted)] font-mono text-center"
          >
            Book Private Salon Consultation
          </button>
          
          <Link
            href="/contact"
            className="px-6 py-3.5 border border-[var(--lm-border-strong)] text-[8.5px] uppercase tracking-[0.4em] text-[var(--lm-text-secondary)] hover:text-[var(--lm-text-primary)] hover:border-white/30 font-mono text-center"
          >
            Direct Inquiry
          </Link>
        </div>
      </div>

      {/* ── Booking Modal ── */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-[var(--lm-surface-elevated)] border border-[var(--lm-accent-border)] w-full max-w-md p-6 sm:p-8 space-y-6 shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative">
            <button
              onClick={() => setIsBookingModalOpen(false)}
              className="absolute top-6 right-6 w-8 h-8 rounded-full border border-[var(--lm-border-strong)] bg-[var(--lm-surface-secondary)] flex items-center justify-center text-[var(--lm-text-secondary)] hover:text-[var(--lm-text-primary)] transition-colors"
            >
              ✕
            </button>

            <div>
              <span className="text-[8.5px] uppercase tracking-[0.55em] text-[var(--lm-accent-text)] font-mono block mb-1">
                Private Appointment
              </span>
              <h2
                className="text-[var(--lm-text-primary)] text-2xl font-light tracking-tight"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
              >
                Schedule Stylist Consultation
              </h2>
              <p className="text-[var(--lm-text-secondary)] text-xs font-mono mt-1">
                With Senior Stylist Elena Vance
              </p>
            </div>

            <form onSubmit={handleBookAppointment} className="space-y-4">
              <div>
                <label className="text-[8px] uppercase tracking-[0.3em] text-[var(--lm-text-secondary)] block mb-1.5 font-mono">
                  Preferred Consultation Date
                </label>
                <input
                  type="date"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full bg-[var(--lm-surface-secondary)] border border-[var(--lm-border-strong)] px-4 py-2.5 text-xs text-[var(--lm-text-primary)] focus:outline-none focus:border-[var(--lm-accent-border)]/60 font-mono"
                />
              </div>

              <div>
                <label className="text-[8px] uppercase tracking-[0.3em] text-[var(--lm-text-secondary)] block mb-1.5 font-mono">
                  Time Slot
                </label>
                <select
                  value={bookingTime}
                  onChange={(e) => setBookingTime(e.target.value)}
                  className="w-full bg-[var(--lm-surface-secondary)] border border-[var(--lm-border-strong)] px-4 py-2.5 text-xs text-[var(--lm-text-primary)] focus:outline-none focus:border-[var(--lm-accent-border)]/60 font-mono"
                >
                  <option value="10:00">10:00 AM — Morning Salon</option>
                  <option value="14:00">02:00 PM — Afternoon Salon</option>
                  <option value="17:00">05:00 PM — Evening Salon</option>
                </select>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsBookingModalOpen(false)}
                  className="px-4 py-2.5 border border-[var(--lm-border-strong)] text-[8.5px] uppercase tracking-[0.3em] text-[var(--lm-text-secondary)] hover:text-[var(--lm-text-primary)] font-mono"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[var(--lm-accent-muted)] border border-[var(--lm-accent-border)]/50 text-[var(--lm-accent-text)] text-[8.5px] uppercase tracking-[0.3em] font-mono hover:bg-amber-400/30"
                >
                  Request Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
