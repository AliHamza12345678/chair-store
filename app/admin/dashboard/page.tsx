import { DollarSign, Users, ShoppingBag, ArrowUpRight } from "lucide-react"
import { MetricCard } from "@/components/admin/MetricCard"
import { RevenueChart } from "@/components/admin/RevenueChart"
import { formatCurrency } from "@/lib/format-currency"
import { getDashboardMetrics, getRecentOrders, getMonthlyRevenue } from "@/features/analytics/queries"

export default async function AdminDashboardPage() {
  const metrics = await getDashboardMetrics()
  const recentOrders = await getRecentOrders()
  const monthlyRevenue = await getMonthlyRevenue()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
        <p className="text-muted-foreground mt-2">
          Monitor your store's performance and recent activities.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Revenue"
          value={formatCurrency(metrics.totalRevenue)}
          icon={DollarSign}
          trend={{ value: metrics.revenueTrend, isPositive: metrics.revenueTrend >= 0 }}
          description="vs last month"
        />
        <MetricCard
          title="Orders"
          value={`+${metrics.ordersCount}`}
          icon={ShoppingBag}
        />
        <MetricCard
          title="Active Customers"
          value={`+${metrics.customersCount}`}
          icon={Users}
        />
        <MetricCard
          title="Conversion Rate (Mock)"
          value={`${metrics.conversionRate}%`}
          icon={ArrowUpRight}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm col-span-4 flex flex-col">
          <div className="p-6">
            <h3 className="font-semibold leading-none tracking-tight">Revenue Overview</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Revenue over the last 6 months.
            </p>
          </div>
          <div className="p-6 pt-0 flex-1 min-h-[300px]">
             <RevenueChart data={monthlyRevenue} />
          </div>
        </div>
        
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm col-span-3">
          <div className="p-6">
            <h3 className="font-semibold leading-none tracking-tight">Recent Orders</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Latest transactions across your store.
            </p>
          </div>
          <div className="p-6 pt-0 space-y-6">
            {recentOrders.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No recent orders found.</p>
            ) : (
              recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-sm font-bold uppercase">
                      {order.user.name ? order.user.name.slice(0, 2) : "UN"}
                    </div>
                    <div>
                      <p className="text-sm font-medium leading-none">{order.user.name || "Unknown"}</p>
                      <p className="text-sm text-muted-foreground">{order.user.email}</p>
                    </div>
                  </div>
                  <div className="font-medium flex flex-col items-end">
                    <span>+{formatCurrency(order.total)}</span>
                    <span className="text-xs text-muted-foreground">{order.status}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
