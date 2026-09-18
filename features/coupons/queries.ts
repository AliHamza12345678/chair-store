import { prisma } from "@/lib/prisma"

/** Admin: list all coupons, newest first. */
export async function getCoupons() {
  return prisma.coupon.findMany({
    include: {
      orders: {
        select: {
          discount: true,
          total: true
        }
      }
    },
    orderBy: { createdAt: "desc" },
  })
}

export async function getCouponById(id: string) {
  return prisma.coupon.findUnique({ where: { id } })
}

/** Case-insensitive lookup used by the checkout "apply coupon" flow. */
export async function getCouponByCode(code: string) {
  return prisma.coupon.findFirst({
    where: { code: { equals: code.trim(), mode: "insensitive" } },
  })
}
