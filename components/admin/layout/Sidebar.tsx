"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Package, Tags, ShoppingCart, Users, Settings, Ticket, Star, CreditCard, Newspaper } from "lucide-react"
import { cn } from "@/lib/clsx"

const routes = [
  { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Products", path: "/admin/products", icon: Package },
  { name: "Categories", path: "/admin/categories", icon: Tags },
  { name: "Orders", path: "/admin/orders", icon: ShoppingCart },
  { name: "Customers", path: "/admin/customers", icon: Users },
  { name: "Coupons", path: "/admin/coupons", icon: Ticket },
  { name: "Reviews", path: "/admin/reviews", icon: Star },
  { name: "Installments", path: "/admin/installments", icon: CreditCard },
  { name: "Blog", path: "/admin/blog", icon: Newspaper },
  { name: "Settings", path: "/admin/settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 border-r bg-background/50 backdrop-blur-xl hidden md:flex flex-col h-full">
      <div className="h-16 flex items-center px-6 border-b">
        <Link href="/admin/dashboard" className="text-xl font-bold tracking-tighter">
          LUMINA <span className="font-light text-muted-foreground">Admin</span>
        </Link>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {routes.map((route) => {
          const isActive = pathname.startsWith(route.path)
          return (
            <Link
              key={route.path}
              href={route.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
              )}
            >
              <route.icon className="w-4 h-4" />
              {route.name}
            </Link>
          )
        })}
        <a href="https://financevault-rosy.vercel.app/">Finance Vault ☞</a>
      </nav>
    </aside>
  )
}
