import { getCategoriesWithCounts, getCategoryAnalytics } from "@/features/categories/queries"
import { CategoriesClient } from "./CategoriesClient"

export default async function CategoriesPage() {
  const [categories, analyticsRaw] = await Promise.all([
    getCategoriesWithCounts(),
    getCategoryAnalytics(),
  ])

  // Compute visible and featured counts on the server
  const visibleCount = categories.filter(c => c.isVisible).length
  const featuredCount = categories.filter(c => c.isFeatured).length

  const analytics = {
    totalCategories: analyticsRaw.totalCategories,
    totalProducts: analyticsRaw.totalProducts,
    totalVisitors: analyticsRaw.totalMonthlyVisitors,
    avgConversion: analyticsRaw.avgConversionRate,
    totalSales: analyticsRaw.totalMonthlySales,
    visibleCount,
    featuredCount,
  }

  // Serialize dates for the client component
  const serializedCategories = categories.map(cat => ({
    ...cat,
    createdAt: cat.createdAt,
    updatedAt: cat.updatedAt,
    children: undefined, // flatten - client builds its own tree
  }))

  return (
    <CategoriesClient
      categories={serializedCategories as any}
      analytics={analytics}
    />
  )
}
