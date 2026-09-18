import { PrismaClient } from "@prisma/client"
import { Pool } from "pg"
import { PrismaPg } from "@prisma/adapter-pg"
import dotenv from "dotenv"

dotenv.config()

const connectionString = process.env.DATABASE_URL
const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
})
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

// 10 Main Categories Data
const categoriesData = [
  {
    name: "Ergonomic Office Chairs",
    slug: "ergonomic-office-chairs",
    description: "Orthopedic lumina support chairs designed for maximum productivity and all-day workplace comfort.",
    imageUrl: "https://images.unsplash.com/photo-1580481072645-022f9a6d83d0?w=800&auto=format&fit=crop",
    seoTitle: "Ergonomic Office & Task Chairs | Lumina Furniture",
    seoDescription: "Shop ergonomic high-back task chairs with adjustable lumbar support and breathable mesh.",
    sortOrder: 1,
  },
  {
    name: "Executive Leather Chairs",
    slug: "executive-leather-chairs",
    description: "Imposing high-back executive chairs upholstered in full-grain Italian leather.",
    imageUrl: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&auto=format&fit=crop",
    seoTitle: "Executive Leather Chairs & Director Seating",
    seoDescription: "Command your boardroom with executive director chairs crafted from solid hardwood and leather.",
    sortOrder: 2,
  },
  {
    name: "Modern Accent & Lounge Chairs",
    slug: "modern-accent-lounge-chairs",
    description: "Sculptural accent loungers that elevate living room, hotel, and sanctuary aesthetic.",
    imageUrl: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&auto=format&fit=crop",
    seoTitle: "Modern Accent & Lounge Chairs Collection",
    seoDescription: "Explore luxury statement accent chairs in cozy boucle, velvet, and minimalist wooden frames.",
    sortOrder: 3,
  },
  {
    name: "Luxury Velvet Armchairs",
    slug: "luxury-velvet-armchairs",
    description: "Sumptuous plush velvet armchairs featuring deep seating and gold-brushed brass legs.",
    imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&auto=format&fit=crop",
    seoTitle: "Luxury Velvet Armchairs & Club Chairs",
    seoDescription: "Indulge in vibrant velvet armchairs tailored for opulent living rooms and bedrooms.",
    sortOrder: 4,
  },
  {
    name: "Scandinavian Dining Seating",
    slug: "scandinavian-dining-seating",
    description: "Nordic minimalist dining chairs built from natural solid oak, beech, and woven cord.",
    imageUrl: "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800&auto=format&fit=crop",
    seoTitle: "Scandinavian Dining Chairs & Wooden Benches",
    seoDescription: "Clean minimalist Nordic dining chairs for modern, warm, and inviting family dining.",
    sortOrder: 5,
  },
  {
    name: "Pro Gaming Recliners",
    slug: "pro-gaming-recliners",
    description: "High-performance gaming recliners with memory foam lumbar padding and 180° tilt.",
    imageUrl: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&auto=format&fit=crop",
    seoTitle: "Pro Gaming Recliners & Esports Chairs",
    seoDescription: "Dominate long gaming sessions in high-back gaming recliners with cooling gel foam.",
    sortOrder: 6,
  },
  {
    name: "Bar & Counter Stools",
    slug: "bar-counter-stools",
    description: "Architectural swivel bar stools and counter-height seating for kitchen islands and lounges.",
    imageUrl: "https://images.unsplash.com/photo-1503602642458-232111445657?w=800&auto=format&fit=crop",
    seoTitle: "Luxury Bar Stools & Kitchen Counter Seating",
    seoDescription: "Elevate your kitchen counter with upholstered swivel bar stools and leather bar chairs.",
    sortOrder: 7,
  },
  {
    name: "Outdoor Patio Seating",
    slug: "outdoor-patio-seating",
    description: "Weatherproof teak, aluminum, and hand-woven wicker loungers for gardens and poolsides.",
    imageUrl: "https://images.unsplash.com/photo-1519947486511-46149fa0a254?w=800&auto=format&fit=crop",
    seoTitle: "Outdoor Patio Loungers & Garden Seating",
    seoDescription: "Durable luxury outdoor chairs and garden sets crafted for weather resistance.",
    sortOrder: 8,
  },
  {
    name: "Minimalist Rocking Chairs",
    slug: "minimalist-rocking-chairs",
    description: "Contemporary rocking chairs designed for serene nursery relaxation and reading nooks.",
    imageUrl: "https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=800&auto=format&fit=crop",
    seoTitle: "Modern Rocking Chairs & Nursery Gliders",
    seoDescription: "Soothe in style with ergonomic wooden and upholstered modern rocking chairs.",
    sortOrder: 9,
  },
  {
    name: "Ottomans & Footstools",
    slug: "ottomans-footstools",
    description: "Versatile tufted footrests, storage ottomans, and accent poufs in premium fabrics.",
    imageUrl: "https://images.unsplash.com/photo-1541558869434-2840d308329a?w=800&auto=format&fit=crop",
    seoTitle: "Luxury Ottomans, Poufs & Storage Footstools",
    seoDescription: "Complete your seating space with leather footrests and velvet storage ottomans.",
    sortOrder: 10,
  },
]

// Unsplash Chair Images pool
const chairImagesPool = [
  "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1580481072645-022f9a6d83d0?w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1519947486511-46149fa0a254?w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1503602642458-232111445657?w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1541558869434-2840d308329a?w=800&auto=format&fit=crop",
]

const prefixes = [
  "Aura", "Elysian", "Zephyr", "Solace", "Wren", "Aethel", "Norse", "Vanguard",
  "Verona", "Milano", "Kyoto", "Oslo", "Malmo", "Soreno", "Kensington", "Copenhagen",
  "Astor", "Tribeca", "Belgravia", "Sorrento", "Apex", "Monarch", "Zenith", "Horizon",
  "Valiant", "Riviera", "Prism", "Cadence", "Aria", "Lumina", "Oberon", "Talon",
  "Nexus", "Kona", "Bavaria", "Valencia", "Sienna", "Montauk", "Biarritz", "Capri"
]

const materials = [
  "Italian Leather", "Boucle Fabric", "Performance Linen", "Velvet", "Solid Walnut",
  "Nordic Oak", "Brushed Brass", "Breathable Mesh", "Teak Wood", "Cast Aluminum"
]

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
}

async function main() {
  console.log("🚀 Starting Seeding: 10 Categories and 500 Products...")

  // 1. Upsert Categories
  const categoryRecords: any[] = []
  for (const cat of categoriesData) {
    const record = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        description: cat.description,
        imageUrl: cat.imageUrl,
        seoTitle: cat.seoTitle,
        seoDescription: cat.seoDescription,
        sortOrder: cat.sortOrder,
        isVisible: true,
        isFeatured: true,
      },
      create: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        imageUrl: cat.imageUrl,
        seoTitle: cat.seoTitle,
        seoDescription: cat.seoDescription,
        sortOrder: cat.sortOrder,
        isVisible: true,
        isFeatured: true,
      }
    })
    categoryRecords.push(record)
    console.log(`✓ Category ready: ${record.name}`)
  }

  // 2. Generate 500 Products (50 per category) batching inserts using createMany / transactions
  let totalSeeded = 0

  for (let catIdx = 0; catIdx < categoryRecords.length; catIdx++) {
    const category = categoryRecords[catIdx]
    const productsData: any[] = []

    for (let i = 1; i <= 50; i++) {
      totalSeeded++
      const prefix = prefixes[(catIdx * 5 + i) % prefixes.length]
      const material = materials[i % materials.length]
      const name = `${prefix} ${category.name.replace("Chairs", "Chair").replace("Armchairs", "Armchair").replace("Recliners", "Recliner").replace("Stools", "Stool").replace("Seating", "Seat")} - Edition ${i}`
      const slug = slugify(`${name}-${totalSeeded}`)

      const basePrice = Math.floor(Math.random() * 1625 + 125) * 100
      const inventory = Math.floor(Math.random() * 45) + 5
      const isFeatured = Math.random() < 0.15

      const img1 = chairImagesPool[(totalSeeded - 1) % chairImagesPool.length]
      const img2 = chairImagesPool[(totalSeeded + 2) % chairImagesPool.length]
      const images = [img1, img2]

      const description = `Crafted with master artistry, the ${name} features premium ${material} construction engineered for luxury comfort and architectural elegance. Includes a 5-year Lumina manufacturer warranty, dynamic lumbar contours, and scratch-resistant feet.`

      productsData.push({
        name,
        slug,
        description,
        price: basePrice,
        images,
        inventory,
        isFeatured,
        categoryId: category.id,
      })
    }

    // Perform createMany / skipDuplicates for batch speed
    await prisma.product.createMany({
      data: productsData,
      skipDuplicates: true,
    })

    console.log(`✓ Seeded ${productsData.length} products for "${category.name}" (Total: ${totalSeeded} / 500)`)
  }

  console.log(`\n🎉 Successfully Seeded 10 Categories and 500 Products into Database!`)
}

main()
  .catch((e) => {
    console.error("Error Seeding:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    await pool.end()
  })
