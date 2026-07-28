import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

function generateSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
}

function randomStats() {
  return {
    monthlyVisitors: Math.floor(Math.random() * (50000 - 1000 + 1)) + 1000,
    monthlySales: Math.floor(Math.random() * (500000 - 5000 + 1)) + 5000,
    conversionRate: Number((Math.random() * (8.5 - 1.5) + 1.5).toFixed(2)),
  }
}

const categoriesData = [
  {
    name: "Executive Seating",
    description: "Premium seating solutions for executives and professionals.",
    seoTitle: "Executive Seating & Office Chairs | Luxury Office",
    seoDescription: "Discover our premium collection of executive seating and office chairs. Ergonomic design meets luxury materials.",
    type: "PARENT",
    children: [
      { name: "Ergonomic Task Chairs", description: "Advanced ergonomic chairs for all-day comfort.", seoTitle: "Ergonomic Task Chairs", seoDescription: "Stay comfortable and productive with our ergonomic task chairs." },
      { name: "High-Back Directors", description: "Imposing high-back chairs for the executive office.", seoTitle: "High-Back Director Chairs", seoDescription: "Make a statement with our premium high-back director chairs." },
      { name: "Conference Room", description: "Professional seating for meeting spaces.", seoTitle: "Conference Room Chairs", seoDescription: "Professional and comfortable seating for your conference room." }
    ]
  },
  {
    name: "Living Room",
    description: "Elegant furniture for your main living spaces.",
    seoTitle: "Luxury Living Room Furniture",
    seoDescription: "Transform your living space with our premium living room furniture collection.",
    type: "PARENT",
    children: [
      { name: "Sofas & Sectionals", description: "Comfortable and stylish sofas.", seoTitle: "Luxury Sofas & Sectionals", seoDescription: "Find the perfect sofa or sectional for your living room." },
      { name: "Accent Chairs", description: "Beautiful chairs to complete your room.", seoTitle: "Designer Accent Chairs", seoDescription: "Add a touch of style with our designer accent chairs." },
      { name: "Recliners", description: "Ultimate comfort recliners.", seoTitle: "Premium Recliners", seoDescription: "Relax in style with our premium recliners." }
    ]
  },
  {
    name: "Dining",
    description: "Beautiful dining furniture for memorable meals.",
    seoTitle: "Dining Room Furniture & Sets",
    seoDescription: "Create the perfect dining experience with our luxury dining room furniture.",
    type: "PARENT",
    children: [
      { name: "Dining Tables", description: "Stunning tables for any dining space.", seoTitle: "Luxury Dining Tables", seoDescription: "Gather around our beautiful dining tables." },
      { name: "Dining Chairs", description: "Comfortable and stylish dining chairs.", seoTitle: "Designer Dining Chairs", seoDescription: "Complete your dining set with our designer chairs." },
      { name: "Bar Stools", description: "Modern bar stools for your kitchen.", seoTitle: "Modern Bar Stools", seoDescription: "Elevate your kitchen counter with our modern bar stools." }
    ]
  },
  {
    name: "Office",
    description: "Professional furniture for your home or corporate office.",
    seoTitle: "Home Office & Corporate Furniture",
    seoDescription: "Work in style with our premium office furniture collection.",
    type: "PARENT",
    children: [
      { name: "Standing Desks", description: "Ergonomic height-adjustable desks.", seoTitle: "Premium Standing Desks", seoDescription: "Improve your posture with our premium standing desks." },
      { name: "Executive Desks", description: "Impressive desks for the modern executive.", seoTitle: "Luxury Executive Desks", seoDescription: "Command your workspace with our luxury executive desks." },
      { name: "Bookshelves", description: "Elegant storage for your office.", seoTitle: "Designer Bookshelves & Storage", seoDescription: "Organize your office with our designer bookshelves." }
    ]
  },
  {
    name: "Outdoor",
    description: "Durable and stylish furniture for your outdoor spaces.",
    seoTitle: "Luxury Outdoor Furniture",
    seoDescription: "Enjoy the outdoors in comfort with our luxury outdoor furniture.",
    type: "PARENT",
    children: [
      { name: "Patio Loungers", description: "Comfortable loungers for sunbathing.", seoTitle: "Premium Patio Loungers", seoDescription: "Relax in the sun with our premium patio loungers." },
      { name: "Garden Sets", description: "Complete dining and seating sets for the garden.", seoTitle: "Outdoor Garden Furniture Sets", seoDescription: "Entertain outdoors with our garden furniture sets." },
      { name: "Hammocks", description: "Relaxing hammocks for your backyard.", seoTitle: "Luxury Hammocks", seoDescription: "Swing into relaxation with our luxury hammocks." }
    ]
  }
]

const collectionsData = [
  {
    name: "Best Sellers",
    description: "Our most popular furniture pieces.",
    seoTitle: "Best Selling Furniture",
    seoDescription: "Shop our most popular and highly rated furniture pieces.",
    type: "COLLECTION"
  },
  {
    name: "New Arrivals",
    description: "The latest additions to our collection.",
    seoTitle: "New Furniture Arrivals",
    seoDescription: "Discover the latest trends with our new furniture arrivals.",
    type: "COLLECTION"
  }
]

async function main() {
  let sortOrder = 0

  for (const parent of categoriesData) {
    const pSlug = generateSlug(parent.name)
    const pStats = randomStats()
    
    const parentCategory = await prisma.category.upsert({
      where: { slug: pSlug },
      update: {},
      create: {
        name: parent.name,
        slug: pSlug,
        description: parent.description,
        type: parent.type,
        seoTitle: parent.seoTitle,
        seoDescription: parent.seoDescription,
        isVisible: true,
        isFeatured: Math.random() > 0.5,
        sortOrder: sortOrder++,
        ...pStats
      }
    })

    let childSortOrder = 0
    for (const child of parent.children) {
      const cSlug = generateSlug(child.name)
      const cStats = randomStats()
      
      await prisma.category.upsert({
        where: { slug: cSlug },
        update: {},
        create: {
          name: child.name,
          slug: cSlug,
          description: child.description,
          type: "SUBCATEGORY",
          parentId: parentCategory.id,
          seoTitle: child.seoTitle,
          seoDescription: child.seoDescription,
          isVisible: true,
          isFeatured: Math.random() > 0.7,
          sortOrder: childSortOrder++,
          ...cStats
        }
      })
    }
  }

  for (const coll of collectionsData) {
    const cSlug = generateSlug(coll.name)
    const cStats = randomStats()
    
    await prisma.category.upsert({
      where: { slug: cSlug },
      update: {},
      create: {
        name: coll.name,
        slug: cSlug,
        description: coll.description,
        type: coll.type,
        seoTitle: coll.seoTitle,
        seoDescription: coll.seoDescription,
        isVisible: true,
        isFeatured: true,
        sortOrder: sortOrder++,
        ...cStats
      }
    })
  }
  
  console.log(`✓ Seeded categories hierarchy and collections.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
