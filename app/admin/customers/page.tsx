import { prisma } from "@/lib/prisma"
import { CustomersClient } from "./CustomersClient"

export default async function CustomersPage() {
  const customers = await prisma.user.findMany({
    where: { role: "USER" },
    include: {
      orders: {
        include: {
          orderItems: {
            include: {
              product: true
            }
          },
          coupon: true
        },
        orderBy: { createdAt: "desc" }
      },
      reviews: {
        include: {
          product: true
        },
        orderBy: { createdAt: "desc" }
      },
      addresses: {
        orderBy: { createdAt: "desc" }
      },
      wishlist: {
        include: {
          product: true
        }
      },
      _count: {
        select: {
          orders: true,
          reviews: true,
          wishlist: true
        }
      }
    },
    orderBy: { createdAt: "desc" }
  })

  // Safe serialization of dates for client component
  const serializedCustomers = customers.map(c => {
    const totalSpent = c.orders.reduce((sum, order) => sum + (order.total || 0), 0)

    return {
      ...c,
      totalSpent,
      createdAt: c.createdAt.toISOString(),
      updatedAt: c.updatedAt.toISOString(),
      emailVerified: c.emailVerified?.toISOString() || null,
      orders: c.orders.map(o => ({
        ...o,
        createdAt: o.createdAt.toISOString(),
        updatedAt: o.updatedAt.toISOString(),
        coupon: o.coupon ? {
          ...o.coupon,
          createdAt: o.coupon.createdAt.toISOString(),
          updatedAt: o.updatedAt.toISOString(),
          startsAt: o.coupon.startsAt?.toISOString() || null,
          expiresAt: o.coupon.expiresAt?.toISOString() || null,
        } : null,
        orderItems: o.orderItems.map(item => ({
          ...item,
          product: item.product ? {
            ...item.product,
            createdAt: item.product.createdAt.toISOString(),
            updatedAt: item.product.updatedAt.toISOString(),
          } : null
        }))
      })),
      reviews: c.reviews.map(r => ({
        ...r,
        createdAt: r.createdAt.toISOString(),
        updatedAt: r.updatedAt.toISOString(),
        product: r.product ? {
          ...r.product,
          createdAt: r.product.createdAt.toISOString(),
          updatedAt: r.product.updatedAt.toISOString(),
        } : null
      })),
      addresses: c.addresses.map(a => ({
        ...a,
        createdAt: a.createdAt.toISOString(),
        updatedAt: a.updatedAt.toISOString(),
      })),
      wishlist: c.wishlist.map(w => ({
        ...w,
        createdAt: w.createdAt.toISOString(),
        product: w.product ? {
          ...w.product,
          createdAt: w.product.createdAt.toISOString(),
          updatedAt: w.product.updatedAt.toISOString(),
        } : null
      }))
    }
  })

  return <CustomersClient customers={serializedCustomers as any} />
}
