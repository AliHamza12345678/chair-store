"use client";

// ─── Account Navigation Sidebar ───────────────────────────────────────────────
// Client component providing active link highlights for account sections.

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/clsx";

const NAV_ITEMS = [
  { href: "/account", label: "Dashboard", desc: "Overview & Salons", icon: "❖" },
  { href: "/account/orders", label: "Order History", desc: "Purchases & Tracking", icon: "◈" },
  { href: "/account/wishlist", label: "Wishlist", desc: "Saved Atelier Pieces", icon: "◇" },
  { href: "/account/addresses", label: "Saved Addresses", desc: "Delivery Residences", icon: "⟡" },
  { href: "/account/profile", label: "Atelier Profile", desc: "Bespoke & Privileges", icon: "★" },
  { href: "/account/settings", label: "Account Settings", desc: "Security & Preferences", icon: "⚙" },
];

export default function AccountNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col space-y-1.5">
      <div className="pb-3 mb-2 border-b border-[var(--lm-border-default)] flex items-center justify-between">
        <span
          className="text-[8px] uppercase tracking-[0.5em] text-[var(--lm-accent-text)]/70 font-mono"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          Atelier Navigation
        </span>
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400/60 shadow-[0_0_8px_rgba(212,175,80,0.5)]" />
      </div>

      {NAV_ITEMS.map((item) => {
        const isActive =
          item.href === "/account"
            ? pathname === "/account"
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "group relative flex flex-col px-4 py-3.5 border transition-all duration-300 rounded-sm",
              isActive
                ? "border-[var(--lm-accent-border)]/40 bg-gradient-to-r from-amber-400/10 via-amber-400/[0.03] to-transparent text-[var(--lm-text-primary)] shadow-[0_0_20px_rgba(212,175,80,0.06)]"
                : "border-transparent text-[var(--lm-text-secondary)] hover:text-[var(--lm-text-primary)] hover:border-[var(--lm-border-strong)] hover:bg-[var(--lm-surface-hover)]"
            )}
          >
            {isActive && (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-3/4 bg-amber-400 shadow-[0_0_10px_#f59e0b]" />
            )}
            
            <div className="flex items-center justify-between">
              <span
                className={cn(
                  "text-[9.5px] uppercase tracking-[0.4em] transition-colors duration-300 flex items-center gap-2 font-medium",
                  isActive ? "text-[var(--lm-accent-text)]" : "group-hover:text-[var(--lm-text-primary)]"
                )}
                style={{ fontFamily: "var(--font-inter)" }}
              >
                <span className="text-[10px] opacity-75">{item.icon}</span>
                {item.label}
              </span>
              {isActive && (
                <span className="text-[9px] text-[var(--lm-accent-primary)] font-mono">→</span>
              )}
            </div>

            <span
              className="text-[7.5px] uppercase tracking-[0.2em] text-[var(--lm-text-muted)] mt-1 pl-4"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              {item.desc}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

