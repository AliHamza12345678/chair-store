import { getCurrentUser } from "@/features/auth/queries"
import { getUserAddresses } from "@/features/addresses/queries"
import { redirect } from "next/navigation"
import { AddressesClient } from "./AddressesClient"

export default async function AddressesPage() {
  const user = await getCurrentUser()
  if (!user) redirect("/auth/login?callbackUrl=/account/addresses")

  const addresses = await getUserAddresses(user.id)
  return <AddressesClient addresses={addresses} />
}
