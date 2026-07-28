/**
 * Optional: seeds a handful of demo products so the storefront isn't
 * empty while you're building. Safe to skip in production — just don't
 * run this script there. Run with: npx tsx scripts/seed-products.ts
 * (requires categories to already exist — run `npx prisma db seed` first).
 */
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const demoProducts = [
  {
    name: "Wren Lounge Chair",
    slug: "wren-lounge-chair",
    description: "A sculptural lounge chair with a solid oak frame and boucle upholstery.",
    price: 45000,
    images: [],
    inventory: 12,
    isFeatured: true,
    categorySlug: "chairs",
  },
  {
    name: "Milo 3-Seater Sofa",
    slug: "milo-3-seater-sofa",
    description: "Deep-seated three-seater sofa in performance linen fabric.",
    price: 145000,
    images: [],
    inventory: 5,
    isFeatured: true,
    categorySlug: "sofas",
  },
  {
    name: "Ashford Dining Table",
    slug: "ashford-dining-table",
    description: "Solid walnut dining table, seats six comfortably.",
    price: 89000,
    images: [],
    inventory: 8,
    isFeatured: false,
    categorySlug: "tables",
  },
]

async function main() {
  for (const p of demoProducts) {
    const category = await prisma.category.findUnique({ where: { slug: p.categorySlug } })
    if (!category) {
      console.warn(`Skipping "${p.name}" — category "${p.categorySlug}" not found. Run "npx prisma db seed" first.`)
      continue
    }

    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        name: p.name,
        slug: p.slug,
        description: p.description,
        price: p.price,
        images: p.images,
        inventory: p.inventory,
        isFeatured: p.isFeatured,
        categoryId: category.id,
      },
    })
  }
  console.log(`✓ ${demoProducts.length} demo products ready`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
