import { ReactNode } from "react";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { redirect } from "next/navigation";
import AccountNav from "@/components/storefront/account/AccountNav";

export default async function AccountLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/login?callbackUrl=/account");
  }

  const user = session.user;
  const initial = user.name ? user.name.charAt(0).toUpperCase() : "M";

  return (
    <div className="bg-[var(--lm-surface-primary)] text-[var(--lm-text-primary)] min-h-screen pt-32 pb-28">
      <div className="mx-auto max-w-7xl px-6 sm:px-12 lg:px-20">
        
        {/* ── Top Luxury Header Banner ── */}
        <div className="relative p-6 sm:p-8 mb-12 bg-[var(--lm-surface-secondary)] border border-[var(--lm-border-default)] shadow-[0_10px_30px_rgba(0,0,0,0.05)] overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--lm-accent-glow)] blur-[100px] pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-center gap-5 sm:gap-6">
              {/* Glowing Avatar */}
              <div className="relative group">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-[var(--lm-accent-border)] bg-[var(--lm-surface-elevated)] flex items-center justify-center text-[var(--lm-accent-text)] font-mono text-2xl font-light flex-shrink-0 shadow-[0_0_25px_var(--lm-accent-glow)]">
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name || "Member"}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    initial
                  )}
                </div>
                <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[var(--lm-surface-primary)] shadow-[0_0_8px_#10b981]" title="Member Active" />
              </div>

              <div>
                <div className="flex items-center gap-3 mb-1.5 flex-wrap">
                  <span
                    className="px-2.5 py-0.5 text-[8px] uppercase tracking-[0.45em] bg-[var(--lm-accent-muted)] border border-[var(--lm-accent-border)] text-[var(--lm-accent-text)] font-mono"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    Solitaire Tier §01
                  </span>
                  <span className="h-1 w-1 rounded-full bg-[var(--lm-text-muted)]" />
                  <span className="text-[8px] uppercase tracking-[0.3em] text-[var(--lm-text-muted)] font-mono flex items-center gap-1">
                    <span className="text-[var(--lm-accent-primary)]">✓</span> Authenticated
                  </span>
                </div>

                <h1
                  className="text-[var(--lm-text-primary)] text-3xl sm:text-4xl font-light tracking-tight"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                >
                  {user.name || "Valued Customer"}
                </h1>
                
                <p className="text-[var(--lm-text-muted)] text-xs font-mono mt-0.5 tracking-wider">
                  {user.email}
                </p>
              </div>
            </div>

            {/* Quick Status / Actions */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 border-t lg:border-t-0 border-[var(--lm-border-subtle)] pt-4 lg:pt-0">
              <div className="text-left lg:text-right">
                <span className="text-[7.5px] uppercase tracking-[0.4em] text-[var(--lm-text-muted)] font-mono block">
                  Concierge Status
                </span>
                <span className="text-xs text-[var(--lm-accent-text)] font-mono tracking-wider flex items-center gap-1.5 justify-start lg:justify-end mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--lm-accent-primary)] animate-pulse" /> Dedicated Rep On Call
                </span>
              </div>

              <div className="h-8 w-px bg-[var(--lm-border-default)] hidden sm:block" />

              <div className="text-left lg:text-right">
                <span className="text-[7.5px] uppercase tracking-[0.4em] text-[var(--lm-text-muted)] font-mono block">
                  Member ID
                </span>
                <span className="text-xs text-[var(--lm-text-secondary)] font-mono tracking-widest mt-0.5 block">
                  #{user.id ? user.id.slice(-8).toUpperCase() : "LUMINA"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Main Layout: Sidebar Left + Content Right ── */}
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-14">
          {/* Navigation Sidebar */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <AccountNav />
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 min-w-0">
            {children}
          </main>
        </div>

      </div>
    </div>
  );
}
