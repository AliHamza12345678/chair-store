import { prisma } from "@/lib/prisma"
import { ProductsClient } from "./ProductsClient"

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" }
  })
  
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" }
  })

  return (
    <ProductsClient products={products} categories={categories} />
  )
}
