import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import { prisma } from "@/lib/prisma"
import { ProfileClient } from "./ProfileClient"
import { redirect } from "next/navigation"

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)
  
  // if (!session) redirect("/auth/login")

  let user = null
  if (session?.user?.id) {
    user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { name: true, email: true, image: true }
    })
  }

  return <ProfileClient user={user || { name: "Admin", email: "admin@lumina.com", image: null }} />
}
