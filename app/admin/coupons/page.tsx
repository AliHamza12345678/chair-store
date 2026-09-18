import { getCoupons } from "@/features/coupons/queries"
import { CouponsClient } from "./CouponsClient"

export default async function CouponsPage() {
  const coupons = await getCoupons()

  const serializedCoupons = coupons.map(c => ({
    ...c,
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
    startsAt: c.startsAt?.toISOString() || null,
    expiresAt: c.expiresAt?.toISOString() || null,
    orders: (c.orders || []).map(o => ({
      ...o,
    }))
  }))

  return <CouponsClient coupons={serializedCoupons as any} />
}
