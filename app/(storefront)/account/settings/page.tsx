import { getCurrentUser } from "@/features/auth/queries"
import { redirect } from "next/navigation"
import { SettingsClient } from "./SettingsClient"

export default async function AccountSettingsPage() {
  const user = await getCurrentUser()
  if (!user) redirect("/auth/login?callbackUrl=/account/settings")

  return <SettingsClient name={user.name || ""} email={user.email || ""} />
}
