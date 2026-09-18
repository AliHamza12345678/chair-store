"use client";

// ─── Luxury Account Settings Client ───────────────────────────────────────────
// Profile credential updates, password security with visual strength meter,
// and privilege notification settings.

import { useState } from "react";
import { updateProfile, changePassword } from "@/features/auth/account-actions";
import { toast } from "sonner";
import { cn } from "@/lib/clsx";

export function SettingsClient({ name: initialName, email }: { name: string; email: string }) {
  const [name, setName] = useState(initialName);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  // Notification toggles
  const [orderAlerts, setOrderAlerts] = useState(true);
  const [salonInvites, setSalonInvites] = useState(true);
  const [bespokeDrops, setBespokeDrops] = useState(false);

  // Calculate password strength score (0 to 4)
  const getPasswordStrength = (pass: string) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    return score;
  };

  const passwordScore = getPasswordStrength(newPassword);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    const res = await updateProfile(name);
    setIsSavingProfile(false);
    if (res.success) toast.success("Profile credentials updated");
    else toast.error(res.error);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingPassword(true);
    const res = await changePassword(currentPassword, newPassword);
    setIsSavingPassword(false);
    if (res.success) {
      toast.success("Security password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
    } else {
      toast.error(res.error);
    }
  };

  const handleToggleNotification = (type: string) => {
    if (type === "orders") setOrderAlerts(!orderAlerts);
    if (type === "invites") setSalonInvites(!salonInvites);
    if (type === "drops") setBespokeDrops(!bespokeDrops);
    toast.success("Notification privilege updated");
  };

  return (
    <div className="space-y-12 animate-in max-w-3xl">
      
      {/* ── Page Header ── */}
      <div className="pb-6 border-b border-[var(--lm-border-default)]">
        <span
          className="text-[8.5px] uppercase tracking-[0.55em] text-[var(--lm-accent-text)]/80 block mb-2 font-mono"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          Security &amp; Preferences
        </span>
        <h1
          className="text-[var(--lm-text-primary)] text-3xl sm:text-4xl font-light tracking-tight"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
        >
          Account Settings
        </h1>
        <p
          className="text-[var(--lm-text-secondary)] text-xs mt-2 font-light leading-relaxed"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          Update your member credentials, maintain password security, and customize private salon alerts.
        </p>
      </div>

      {/* ── Section 1: Profile Credentials ── */}
      <div className="p-8 bg-[var(--lm-surface-secondary)] border border-[var(--lm-border-default)] space-y-6">
        <div className="pb-4 border-b border-[var(--lm-border-subtle)]">
          <span className="text-[8.5px] uppercase tracking-[0.55em] text-[var(--lm-accent-text)] font-mono block mb-1">
            Section 01
          </span>
          <h2
            className="text-[var(--lm-text-primary)] text-2xl font-light"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            Personal Member Details
          </h2>
        </div>

        <form onSubmit={handleProfileSubmit} className="space-y-5">
          <div>
            <label className="text-[8px] uppercase tracking-[0.3em] text-[var(--lm-text-secondary)] block mb-1.5 font-mono">
              Email Address (Primary Account Key)
            </label>
            <div className="flex items-center justify-between bg-black border border-[var(--lm-border-strong)] px-4 py-2.5">
              <span className="text-xs text-[var(--lm-text-secondary)] font-mono">{email}</span>
              <span className="text-[8px] uppercase tracking-[0.3em] text-[var(--lm-accent-text)] font-mono">
                ✓ Verified
              </span>
            </div>
            <p className="text-[9px] text-[var(--lm-text-muted)] mt-1 font-mono">
              Primary email address used for white-glove order updates and session authentication.
            </p>
          </div>

          <div>
            <label className="text-[8px] uppercase tracking-[0.3em] text-[var(--lm-text-secondary)] block mb-1.5 font-mono">
              Display Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isSavingProfile}
              className="w-full bg-black border border-[var(--lm-border-strong)] px-4 py-2.5 text-xs text-[var(--lm-text-primary)] placeholder:text-[var(--lm-text-muted)] focus:outline-none focus:border-[var(--lm-accent-border)]/60 font-mono"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={isSavingProfile}
              className="px-6 py-2.5 bg-[var(--lm-accent-muted)] border border-[var(--lm-accent-border)]/50 text-[var(--lm-accent-text)] text-[8.5px] uppercase tracking-[0.35em] font-mono hover:bg-amber-400/30 disabled:opacity-50"
            >
              {isSavingProfile ? "Saving Profile..." : "Save Profile Details"}
            </button>
          </div>
        </form>
      </div>

      {/* ── Section 2: Security & Password ── */}
      <div className="p-8 bg-[var(--lm-surface-secondary)] border border-[var(--lm-border-default)] space-y-6">
        <div className="pb-4 border-b border-[var(--lm-border-subtle)]">
          <span className="text-[8.5px] uppercase tracking-[0.55em] text-[var(--lm-accent-text)] font-mono block mb-1">
            Section 02
          </span>
          <h2
            className="text-[var(--lm-text-primary)] text-2xl font-light"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            Password &amp; Security Credentials
          </h2>
        </div>

        <form onSubmit={handlePasswordSubmit} className="space-y-5">
          <div>
            <label className="text-[8px] uppercase tracking-[0.3em] text-[var(--lm-text-secondary)] block mb-1.5 font-mono">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              disabled={isSavingPassword}
              placeholder="••••••••••••"
              className="w-full bg-black border border-[var(--lm-border-strong)] px-4 py-2.5 text-xs text-[var(--lm-text-primary)] placeholder:text-[var(--lm-text-muted)] focus:outline-none focus:border-[var(--lm-accent-border)]/60 font-mono"
            />
          </div>

          <div>
            <label className="text-[8px] uppercase tracking-[0.3em] text-[var(--lm-text-secondary)] block mb-1.5 font-mono">
              New Password (Minimum 8 Characters)
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={isSavingPassword}
              minLength={8}
              placeholder="••••••••••••"
              className="w-full bg-black border border-[var(--lm-border-strong)] px-4 py-2.5 text-xs text-[var(--lm-text-primary)] placeholder:text-[var(--lm-text-muted)] focus:outline-none focus:border-[var(--lm-accent-border)]/60 font-mono"
            />

            {/* Password strength meter */}
            {newPassword.length > 0 && (
              <div className="mt-2 space-y-1">
                <div className="flex justify-between items-center text-[8px] font-mono text-[var(--lm-text-secondary)]">
                  <span>Password Security Rating:</span>
                  <span className="text-[var(--lm-accent-text)] font-medium">
                    {passwordScore <= 1 ? "Weak" : passwordScore === 2 ? "Moderate" : passwordScore === 3 ? "Strong" : "Very Strong"}
                  </span>
                </div>
                <div className="w-full bg-[var(--lm-surface-secondary)] h-1 rounded-full overflow-hidden flex gap-1">
                  {[1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className={cn(
                        "h-full flex-1 transition-all",
                        passwordScore >= level
                          ? passwordScore <= 1
                            ? "bg-red-500"
                            : passwordScore === 2
                            ? "bg-amber-500"
                            : "bg-emerald-400"
                          : "bg-[var(--lm-surface-elevated)]"
                      )}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={isSavingPassword || !currentPassword || !newPassword}
              className="px-6 py-2.5 bg-[var(--lm-accent-muted)] border border-[var(--lm-accent-border)]/50 text-[var(--lm-accent-text)] text-[8.5px] uppercase tracking-[0.35em] font-mono hover:bg-amber-400/30 disabled:opacity-50"
            >
              {isSavingPassword ? "Updating..." : "Update Security Password"}
            </button>
          </div>
        </form>
      </div>

      {/* ── Section 3: Salon Privileges & Alerts ── */}
      <div className="p-8 bg-[var(--lm-surface-secondary)] border border-[var(--lm-border-default)] space-y-6">
        <div className="pb-4 border-b border-[var(--lm-border-subtle)]">
          <span className="text-[8.5px] uppercase tracking-[0.55em] text-[var(--lm-accent-text)] font-mono block mb-1">
            Section 03
          </span>
          <h2
            className="text-[var(--lm-text-primary)] text-2xl font-light"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            Salon Privileges &amp; Communication
          </h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-black border border-[var(--lm-border-default)]">
            <div>
              <p className="text-[var(--lm-text-primary)] text-sm font-light" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                Order Status &amp; White-Glove Shipment Alerts
              </p>
              <p className="text-[var(--lm-text-muted)] text-[10px] font-mono">
                Receive instant SMS and email notifications regarding order dispatch.
              </p>
            </div>

            <button
              onClick={() => handleToggleNotification("orders")}
              className={cn(
                "w-12 h-6 rounded-full border transition-all relative p-0.5",
                orderAlerts ? "bg-amber-400/30 border-[var(--lm-accent-border)]" : "bg-[var(--lm-surface-secondary)] border-[var(--lm-border-strong)]"
              )}
            >
              <div
                className={cn(
                  "w-4 h-4 rounded-full bg-amber-300 transition-transform",
                  orderAlerts ? "translate-x-6" : "translate-x-0 bg-neutral-600"
                )}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-black border border-[var(--lm-border-default)]">
            <div>
              <p className="text-[var(--lm-text-primary)] text-sm font-light" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                Private Salon &amp; Exhibition Invitations
              </p>
              <p className="text-[var(--lm-text-muted)] text-[10px] font-mono">
                Exclusive invitations to seasonal furniture unveilings and private viewings.
              </p>
            </div>

            <button
              onClick={() => handleToggleNotification("invites")}
              className={cn(
                "w-12 h-6 rounded-full border transition-all relative p-0.5",
                salonInvites ? "bg-amber-400/30 border-[var(--lm-accent-border)]" : "bg-[var(--lm-surface-secondary)] border-[var(--lm-border-strong)]"
              )}
            >
              <div
                className={cn(
                  "w-4 h-4 rounded-full bg-amber-300 transition-transform",
                  salonInvites ? "translate-x-6" : "translate-x-0 bg-neutral-600"
                )}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-black border border-[var(--lm-border-default)]">
            <div>
              <p className="text-[var(--lm-text-primary)] text-sm font-light" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                Bespoke Limited Edition Drops
              </p>
              <p className="text-[var(--lm-text-muted)] text-[10px] font-mono">
                Early access notifications before limited seating pieces open to the public.
              </p>
            </div>

            <button
              onClick={() => handleToggleNotification("drops")}
              className={cn(
                "w-12 h-6 rounded-full border transition-all relative p-0.5",
                bespokeDrops ? "bg-amber-400/30 border-[var(--lm-accent-border)]" : "bg-[var(--lm-surface-secondary)] border-[var(--lm-border-strong)]"
              )}
            >
              <div
                className={cn(
                  "w-4 h-4 rounded-full bg-amber-300 transition-transform",
                  bespokeDrops ? "translate-x-6" : "translate-x-0 bg-neutral-600"
                )}
              />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}

