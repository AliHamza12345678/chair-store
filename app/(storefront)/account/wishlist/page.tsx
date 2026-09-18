import { getCurrentUser } from "@/features/auth/queries";
import { getUserWishlist } from "@/features/wishlist/queries";
import { redirect } from "next/navigation";
import { WishlistClient } from "@/app/(storefront)/wishlist/WishlistClient";

export default async function AccountWishlistPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login?callbackUrl=/account/wishlist");

  const items = await getUserWishlist(user.id);
  return <WishlistClient items={items} embedded={true} />;
}
