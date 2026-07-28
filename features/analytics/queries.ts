import { prisma } from "@/lib/prisma"

export async function getDashboardMetrics() {
  const [
    totalRevenueResult,
    ordersCount,
    customersCount,
    lastMonthRevenueResult,
  ] = await Promise.all([
    // Total Revenue (all time, paid orders only ideally, but we'll sum all for now)
    prisma.order.aggregate({
      _sum: { total: true }
    }),
    
    // Total Orders
    prisma.order.count(),
    
    // Total Customers (role = USER)
    prisma.user.count({
      where: { role: "USER" }
    }),

    // Last Month Revenue for trend calculation
    prisma.order.aggregate({
      where: {
        createdAt: {
          gte: new Date(new Date().setMonth(new Date().getMonth() - 1))
        }
      },
      _sum: { total: true }
    })
  ])

  const totalRevenue = totalRevenueResult._sum.total || 0
  const lastMonthRevenue = lastMonthRevenueResult._sum.total || 0
  
  // Calculate a mock trend if there's revenue, otherwise 0
  const revenueTrend = lastMonthRevenue > 0 
    ? ((totalRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 
    : 0

  return {
    totalRevenue,
    ordersCount,
    customersCount,
    revenueTrend: Number(revenueTrend.toFixed(1)),
    conversionRate: 3.2, // Mocked for now
  }
}

export async function getRecentOrders() {
  return await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: { name: true, email: true }
      }
    }
  })
}

/** Revenue grouped by month for the last 6 months, for the dashboard chart. */
export async function getMonthlyRevenue() {
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5)
  sixMonthsAgo.setDate(1)
  sixMonthsAgo.setHours(0, 0, 0, 0)

  const orders = await prisma.order.findMany({
    where: { createdAt: { gte: sixMonthsAgo } },
    select: { total: true, createdAt: true },
  })

  // Build 6 empty buckets first (oldest -> newest) so months with zero
  // orders still show up on the chart instead of being skipped.
  const buckets: { month: string; revenue: number }[] = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date()
    d.setMonth(d.getMonth() - i)
    buckets.push({ month: d.toLocaleDateString("en-US", { month: "short" }), revenue: 0 })
  }

  for (const order of orders) {
    const monthsAgo =
      (new Date().getFullYear() - order.createdAt.getFullYear()) * 12 +
      (new Date().getMonth() - order.createdAt.getMonth())
    const bucketIndex = 5 - monthsAgo
    if (bucketIndex >= 0 && bucketIndex < 6) {
      buckets[bucketIndex].revenue += order.total
    }
  }

  return buckets
}
