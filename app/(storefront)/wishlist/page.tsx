import { getCurrentUser } from "@/features/auth/queries"
import { getUserWishlist } from "@/features/wishlist/queries"
import { redirect } from "next/navigation"
import { WishlistClient } from "./WishlistClient"

export default async function WishlistPage() {
  const user = await getCurrentUser()
  if (!user) redirect("/auth/login?callbackUrl=/wishlist")

  const items = await getUserWishlist(user.id)
  return <WishlistClient items={items} />
}
