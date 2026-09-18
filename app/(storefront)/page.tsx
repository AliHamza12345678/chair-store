import { prisma } from "@/lib/prisma";
import Hero from "@/components/storefront/home/Hero";
import Categories from "@/components/storefront/home/Categories";
import FeaturedProducts from "@/components/storefront/home/FeaturedProducts";
import Collections from "@/components/storefront/home/Collections";
import Testimonials from "@/components/storefront/home/Testimonials";
import CTA from "@/components/storefront/home/CTA";

// NEXT.JS KO DATA HAR REFRESH PAR DIRECT DATA BASE SE LANE PAR MAJBOOR KARNE KE LIYE:
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function StorefrontHomePage() {
  const [featuredProducts, newArrivals, categories] = await Promise.all([
    prisma.product.findMany({
      where: { isFeatured: true, isArchived: false },
      take: 4,
    }),
    prisma.product.findMany({
      where: { isArchived: false },
      orderBy: { createdAt: "desc" },
      take: 4,
    }),
    prisma.category.findMany({
      orderBy: { createdAt: "desc" }, // Naye entries sabse pehle dikhane ke liye
      take: 3,
    }),
  ]);

  return (
    <div className="flex flex-col min-h-screen bg-[var(--lm-surface-primary)]">
      {/* Hero Section */}
      <Hero />

      {/* Featured Categories */}
      <Categories categories={categories} />

      {/* Featured Products */}
      <FeaturedProducts products={featuredProducts} />

      {/* New Arrivals / Collections */}
      <Collections products={newArrivals} />

      {/* Testimonials */}
      <Testimonials />

      {/* CTA */}
      <CTA />
    </div>
  );
}
