/**
 * Prisma's standard seed entrypoint. Run via `npx prisma db seed`
 * (configured in prisma.config.ts). Creates the first admin account and
 * a couple of categories so the storefront/admin aren't completely empty
 * on first run. Safe to re-run — every write uses upsert.
 */
import { PrismaClient } from "@prisma/client"
import { hash } from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL || "admin@lumina.com"
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || "ChangeMe123!"

  const hashedPassword = await hash(adminPassword, 10)

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: "Admin",
      password: hashedPassword,
      role: "ADMIN",
    },
  })
  console.log(`✓ Admin user ready: ${admin.email}`)
  if (!process.env.SEED_ADMIN_PASSWORD) {
    console.log(`  (default password "ChangeMe123!" — set SEED_ADMIN_PASSWORD env var to override, and change it after first login)`)
  }

  const categories = [
    { name: "Chairs", slug: "chairs", description: "Ergonomic and accent chairs for every room." },
    { name: "Sofas", slug: "sofas", description: "Comfortable sofas and sectionals." },
    { name: "Tables", slug: "tables", description: "Dining and side tables." },
  ]

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    })
  }
  console.log(`✓ ${categories.length} categories ready`)

  await prisma.storeSettings.upsert({
    where: { id: "global" },
    update: {},
    create: { id: "global", storeName: "LUMINA", currency: "PKR", shippingRate: 50.0 },
  })
  console.log("✓ Store settings ready")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
