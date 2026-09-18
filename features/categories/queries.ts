import { prisma } from "@/lib/prisma"

export async function getCategoriesWithCounts() {
  return prisma.category.findMany({
    include: {
      parent: true,
      children: true,
      _count: {
        select: { products: true }
      }
    },
    orderBy: { sortOrder: 'asc' }
  })
}

export async function getCategoryTree() {
  return prisma.category.findMany({
    where: { parentId: null },
    include: {
      children: {
        include: {
          children: true,
          _count: { select: { products: true } }
        },
        orderBy: { sortOrder: 'asc' }
      },
      _count: {
        select: { products: true }
      }
    },
    orderBy: { sortOrder: 'asc' }
  })
}

export async function getCategoryAnalytics() {
  const [categoryCount, productCount, aggregations] = await Promise.all([
    prisma.category.count(),
    prisma.product.count(),
    prisma.category.aggregate({
      _sum: {
        monthlyVisitors: true,
        monthlySales: true,
      },
      _avg: {
        conversionRate: true,
      }
    })
  ])

  return {
    totalCategories: categoryCount,
    totalProducts: productCount,
    totalMonthlyVisitors: aggregations._sum.monthlyVisitors || 0,
    totalMonthlySales: aggregations._sum.monthlySales || 0,
    avgConversionRate: aggregations._avg.conversionRate || 0,
  }
}
