import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ReviewsSection } from "@/components/storefront/ReviewsSection";
import { getCurrentUser } from "@/features/auth/queries";
import { isProductWishlisted } from "@/features/wishlist/queries";
import ProductGallery from "@/components/storefront/products/ProductGallery";
import PurchasePanel from "@/components/storefront/products/PurchasePanel";
import ProductDetailsAccordion from "@/components/storefront/products/ProductDetailsAccordion";
import RelatedProducts from "@/components/storefront/products/RelatedProducts";
import Link from "next/link";
import { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!product) return { title: "Not Found" };

  return {
    title: `${product.name} | LUMINA Atelier`,
    description: product.description,
    openGraph: {
      title: `${product.name} | LUMINA Atelier`,
      description: product.description,
      images: product.images[0] ? [product.images[0]] : [],
      type: "website",
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/products/${product.slug}`,
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      options: true,
      variants: true,
    },
  });

  if (!product || product.isArchived) {
    notFound();
  }

  const currentUser = await getCurrentUser();
  const isWishlisted = currentUser ? await isProductWishlisted(currentUser.id, product.id) : false;

  // Fetch related products from the same category or general catalog
  const relatedRaw = await prisma.product.findMany({
    where: {
      isArchived: false,
      id: { not: product.id },
      categoryId: product.categoryId,
    },
    take: 4,
    include: { category: true },
  });

  // Fallback if not enough category matches
  let finalRelated = relatedRaw;
  if (relatedRaw.length < 4) {
    const extra = await prisma.product.findMany({
      where: {
        isArchived: false,
        id: { notIn: [product.id, ...relatedRaw.map(r => r.id)] },
      },
      take: 4 - relatedRaw.length,
      include: { category: true },
    });
    finalRelated = [...relatedRaw, ...extra];
  }

  // Schema.org Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images,
    description: product.description,
    sku: product.id,
    brand: {
      "@type": "Brand",
      name: "LUMINA",
    },
    offers: {
      "@type": "Offer",
      url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/products/${product.slug}`,
      priceCurrency: "PKR",
      price: product.price,
      itemCondition: "https://schema.org/NewCondition",
      availability: product.inventory > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };

  return (
    <div className="bg-[var(--lm-surface-primary)] text-[var(--lm-text-primary)] min-h-screen pt-32 pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-7xl px-6 sm:px-12 lg:px-20">

        {/* ── Breadcrumb & Back Link ── */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            <Link
              href="/products"
              className="group inline-flex items-center gap-2 text-[8.5px] uppercase tracking-[0.4em] text-[var(--lm-text-muted)] hover:text-[var(--lm-text-primary)] transition-colors duration-300"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="transition-transform duration-300 group-hover:-translate-x-1">
                <path d="M6 1L2 5L6 9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
              Catalog
            </Link>
            <span className="text-[var(--lm-text-muted)] text-[9px]">•</span>
            <Link
              href={`/products?category=${product.category.slug}`}
              className="text-[8.5px] uppercase tracking-[0.4em] text-[var(--lm-text-muted)] hover:text-[var(--lm-text-secondary)] transition-colors duration-300"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              {product.category.name}
            </Link>
          </div>

          <span
            className="text-[8.5px] font-mono tracking-[0.3em] text-[var(--lm-text-muted)] hidden sm:inline"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            LUMINA-REF: {product.id.slice(-6).toUpperCase()}
          </span>
        </div>

        {/* ── Main Detail Grid: Gallery Left + Sticky Purchase Right ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

          {/* Left: Luxury Image Gallery */}
          <div className="lg:col-span-7">
            <ProductGallery images={product.images} productName={product.name} />
          </div>

          {/* Right: Sticky Purchase Panel & Accordion */}
          <div className="lg:col-span-5 lg:sticky lg:top-32 space-y-12">
            <PurchasePanel product={product} isWishlisted={isWishlisted} />

            <ProductDetailsAccordion product={product} />
          </div>
        </div>

        {/* ── Reviews Section ── */}
        <div className="mt-24 pt-16 border-t border-[var(--lm-border-default)]">
          <ReviewsSection productId={product.id} />
        </div>

        {/* ── Related Products ── */}
        <RelatedProducts
          products={finalRelated.map((p) => ({
            id: p.id,
            name: p.name,
            slug: p.slug,
            price: p.price,
            images: p.images,
            category: { name: p.category.name, slug: p.category.slug },
            isFeatured: p.isFeatured,
          }))}
        />

      </div>
    </div>
  );
}
