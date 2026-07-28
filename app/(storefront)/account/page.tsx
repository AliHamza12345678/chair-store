// ─── Account Dashboard Page ──────────────────────────────────────────────────
// Overview dashboard featuring membership status, quick stat widgets,
// recent orders preview, quick shortcuts, and concierge support box.

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { formatCurrency } from "@/lib/format-currency";

export default async function AccountDashboardPage() {
  const session = await getServerSession(authOptions);

  const [user, recentOrders, wishlistCount] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session?.user?.id },
      include: {
        _count: { select: { orders: true, wishlist: true, addresses: true } },
      },
    }),
    prisma.order.findMany({
      where: { userId: session?.user?.id },
      take: 3,
      orderBy: { createdAt: "desc" },
      include: {
        orderItems: {
          include: { product: true },
        },
      },
    }),
    prisma.wishlistItem.count({
      where: { userId: session?.user?.id },
    }),
  ]);

  const totalSpent = recentOrders.reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="space-y-12 animate-in">
      
      {/* ── Welcome & Atelier Overview ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 border-b border-[var(--lm-border-default)] gap-4">
        <div>
          <span
            className="text-[8.5px] uppercase tracking-[0.55em] text-[var(--lm-accent-text)]/80 block mb-2 font-mono"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Overview &amp; Salons
          </span>
          <h2
            className="text-[var(--lm-text-primary)] text-3xl sm:text-4xl font-light tracking-tight"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            Welcome to your Atelier Dashboard
          </h2>
          <p
            className="text-[var(--lm-text-secondary)] text-xs mt-2 max-w-xl leading-relaxed"
            style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}
          >
            Manage your order history, saved residences, bespoke wishlist, profile preferences, and private security credentials.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/account/profile"
            className="px-4 py-2 border border-[var(--lm-accent-border)]/40 bg-[var(--lm-accent-muted)] text-[8px] uppercase tracking-[0.35em] text-[var(--lm-accent-text)] hover:bg-amber-400/15 transition-all font-mono"
          >
            Edit Profile →
          </Link>
        </div>
      </div>

      {/* ── VIP Atelier Tier Membership Card ── */}
      <div className="relative p-8 bg-[var(--lm-surface-secondary)] border border-[var(--lm-accent-border)] overflow-hidden shadow-[0_10px_35px_rgba(0,0,0,0.6)]">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-400/[0.04] rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_10px_#f59e0b]" />
              <span className="text-[8.5px] uppercase tracking-[0.5em] text-[var(--lm-accent-text)] font-mono">
                Solitaire Member Privilege Status
              </span>
            </div>

            <h3
              className="text-2xl sm:text-3xl text-[var(--lm-text-primary)] font-light tracking-wide"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              VIP Solitaire Membership Tier
            </h3>

            <p className="text-[var(--lm-text-secondary)] text-xs leading-relaxed max-w-2xl font-light">
              As a Lumina Solitaire Member, you enjoy complimentary White-Glove interior delivery, 
              priority access to limited atelier drops, and a dedicated personal design concierge.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-6 text-[8px] uppercase tracking-[0.3em] font-mono text-[var(--lm-text-secondary)]">
              <span className="flex items-center gap-2">
                <span className="text-[var(--lm-accent-primary)]">✦</span> Complimentary Shipping
              </span>
              <span className="flex items-center gap-2">
                <span className="text-[var(--lm-accent-primary)]">✦</span> 24/7 Private Concierge
              </span>
              <span className="flex items-center gap-2">
                <span className="text-[var(--lm-accent-primary)]">✦</span> Private Salon Previews
              </span>
            </div>
          </div>

          <div className="lg:col-span-4 p-6 bg-black/50 border border-[var(--lm-border-default)] flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[7.5px] uppercase tracking-[0.4em] text-[var(--lm-text-muted)] font-mono">
                Loyalty Reward Points
              </span>
              <span className="text-[8px] uppercase tracking-[0.3em] text-[var(--lm-accent-text)] font-mono">
                Active Tier
              </span>
            </div>

            <div>
              <span className="font-mono text-3xl text-[var(--lm-accent-text)] font-light block">
                3,850 <span className="text-xs text-[var(--lm-text-muted)] font-normal">PTS</span>
              </span>
              <span className="text-[8px] uppercase tracking-[0.3em] text-[var(--lm-text-muted)] mt-1 block">
                Next Tier: Lumina Sovereign (5,000 PTS)
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-[var(--lm-surface-elevated)] h-1.5 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-amber-500 to-amber-200 h-full w-[77%]" />
            </div>
          </div>
        </div>
      </div>

      {/* ── Quick Stat Widgets ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Orders Stat */}
        <div className="p-6 bg-[var(--lm-surface-secondary)] border border-[var(--lm-border-default)] hover:border-[var(--lm-accent-border)]/40 transition-all duration-300 flex flex-col justify-between group">
          <div className="flex items-center justify-between mb-4">
            <span
              className="text-[8px] uppercase tracking-[0.4em] text-[var(--lm-text-muted)] block font-mono"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Total Orders
            </span>
            <span className="text-amber-400/40 group-hover:text-[var(--lm-accent-text)] transition-colors font-mono">
              ◈
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-3xl text-[var(--lm-text-primary)] font-light">
              {String(user?._count.orders || 0).padStart(2, "0")}
            </span>
            <Link
              href="/account/orders"
              className="text-[8px] uppercase tracking-[0.3em] text-[var(--lm-accent-text)] hover:text-[var(--lm-text-primary)] transition-colors"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              History →
            </Link>
          </div>
        </div>

        {/* Wishlist Stat */}
        <div className="p-6 bg-[var(--lm-surface-secondary)] border border-[var(--lm-border-default)] hover:border-[var(--lm-accent-border)]/40 transition-all duration-300 flex flex-col justify-between group">
          <div className="flex items-center justify-between mb-4">
            <span
              className="text-[8px] uppercase tracking-[0.4em] text-[var(--lm-text-muted)] block font-mono"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Saved Pieces
            </span>
            <span className="text-amber-400/40 group-hover:text-[var(--lm-accent-text)] transition-colors font-mono">
              ◇
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-3xl text-[var(--lm-text-primary)] font-light">
              {String(wishlistCount || 0).padStart(2, "0")}
            </span>
            <Link
              href="/account/wishlist"
              className="text-[8px] uppercase tracking-[0.3em] text-[var(--lm-accent-text)] hover:text-[var(--lm-text-primary)] transition-colors"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Wishlist →
            </Link>
          </div>
        </div>

        {/* Saved Addresses Stat */}
        <div className="p-6 bg-[var(--lm-surface-secondary)] border border-[var(--lm-border-default)] hover:border-[var(--lm-accent-border)]/40 transition-all duration-300 flex flex-col justify-between group">
          <div className="flex items-center justify-between mb-4">
            <span
              className="text-[8px] uppercase tracking-[0.4em] text-[var(--lm-text-muted)] block font-mono"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Delivery Residences
            </span>
            <span className="text-amber-400/40 group-hover:text-[var(--lm-accent-text)] transition-colors font-mono">
              ⟡
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-3xl text-[var(--lm-text-primary)] font-light">
              {String(user?._count.addresses || 0).padStart(2, "0")}
            </span>
            <Link
              href="/account/addresses"
              className="text-[8px] uppercase tracking-[0.3em] text-[var(--lm-accent-text)] hover:text-[var(--lm-text-primary)] transition-colors"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Manage →
            </Link>
          </div>
        </div>

        {/* Total Spent Stat */}
        <div className="p-6 bg-[var(--lm-surface-secondary)] border border-[var(--lm-border-default)] hover:border-[var(--lm-accent-border)]/40 transition-all duration-300 flex flex-col justify-between group">
          <div className="flex items-center justify-between mb-4">
            <span
              className="text-[8px] uppercase tracking-[0.4em] text-[var(--lm-text-muted)] block font-mono"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Acquisitions Value
            </span>
            <span className="text-amber-400/40 group-hover:text-[var(--lm-accent-text)] transition-colors font-mono">
              ★
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-xl text-[var(--lm-text-primary)] font-light tabular-nums truncate">
              {formatCurrency(totalSpent)}
            </span>
            <span className="text-[7.5px] uppercase tracking-[0.2em] text-[var(--lm-accent-text)]/80 font-mono">
              VIP Tier
            </span>
          </div>
        </div>

      </div>

      {/* ── Recent Orders Preview ── */}
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-[var(--lm-border-subtle)]">
          <div className="flex items-center gap-3">
            <div className="h-px w-6 bg-[var(--lm-accent-muted)]0" />
            <h3
              className="text-[var(--lm-text-primary)] text-2xl font-light tracking-wide"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              Recent Atelier Orders
            </h3>
          </div>
          <Link
            href="/account/orders"
            className="text-[8px] uppercase tracking-[0.4em] text-[var(--lm-text-secondary)] hover:text-[var(--lm-accent-text)] transition-colors font-mono"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            All Orders ({user?._count.orders || 0}) →
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="p-12 bg-[var(--lm-surface-secondary)] border border-[var(--lm-border-default)] text-center space-y-4">
            <p className="text-[var(--lm-text-secondary)] text-xs" style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}>
              You haven't placed any atelier collection orders yet.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 border border-[var(--lm-accent-border)]/50 bg-[var(--lm-accent-muted)] px-6 py-3 text-[8px] uppercase tracking-[0.4em] text-[var(--lm-accent-text)] hover:bg-[var(--lm-accent-muted)] transition-all font-mono"
            >
              Explore Atelier Collection
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="p-6 bg-[var(--lm-surface-secondary)] border border-[var(--lm-border-default)] hover:border-[var(--lm-border-strong)] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-6"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-[8px] uppercase tracking-[0.4em] text-[var(--lm-accent-text)] font-mono">
                      #{order.id.slice(-8).toUpperCase()}
                    </span>
                    <span className="text-[8px] text-[var(--lm-text-muted)] font-mono">•</span>
                    <span className="text-[8px] uppercase tracking-[0.3em] text-[var(--lm-text-muted)] font-mono">
                      {new Date(order.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                    </span>
                  </div>
                  <h4
                    className="text-[var(--lm-text-primary)] text-lg truncate font-light"
                    style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                  >
                    {order.orderItems.length} {order.orderItems.length === 1 ? "Item" : "Items"}:{" "}
                    <span className="text-[var(--lm-text-secondary)]">
                      {order.orderItems.map((i) => i.product.name).join(", ")}
                    </span>
                  </h4>
                </div>

                <div className="flex items-center gap-6 flex-shrink-0">
                  <span className="font-mono text-base text-[var(--lm-text-primary)] tabular-nums">
                    {formatCurrency(order.total)}
                  </span>
                  <span
                    className="px-3 py-1 text-[7.5px] uppercase tracking-[0.3em] border border-[var(--lm-accent-border)] text-[var(--lm-accent-text)] font-mono bg-[var(--lm-accent-muted)]"
                  >
                    {order.status}
                  </span>
                  <Link
                    href="/account/orders"
                    className="text-[8px] uppercase tracking-[0.3em] text-[var(--lm-text-secondary)] hover:text-[var(--lm-text-primary)] font-mono"
                  >
                    Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Concierge Support Box ── */}
      <div className="relative p-8 bg-gradient-to-r from-amber-400/10 via-neutral-950 to-neutral-950 border border-[var(--lm-accent-border)]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-6 overflow-hidden">
        <div className="space-y-2">
          <span
            className="text-[8.5px] uppercase tracking-[0.55em] text-[var(--lm-accent-text)] block font-mono"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Lumina Concierge Service
          </span>
          <h4
            className="text-[var(--lm-text-primary)] text-2xl font-light"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            Require custom interior styling or private salon consultation?
          </h4>
          <p
            className="text-[var(--lm-text-secondary)] text-xs max-w-xl leading-relaxed"
            style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}
          >
            Our dedicated design consultants are standing by for bespoke wood finish matching, space planning, and order inquiries.
          </p>
        </div>

        <Link
          href="/contact"
          className="flex-shrink-0 px-6 py-3.5 border border-[var(--lm-accent-border)]/60 bg-[var(--lm-accent-muted)] text-[8.5px] uppercase tracking-[0.4em] text-[var(--lm-accent-text)] hover:bg-[var(--lm-accent-muted)] transition-all text-center font-mono"
        >
          Contact Stylist
        </Link>
      </div>

    </div>
  );
}

