"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"

export async function getCurrentUser() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return null
    return session.user
  } catch (error) {
    return null
  }
}

export async function checkAdminStatus() {
  const user = await getCurrentUser()
  return user?.role === "ADMIN"
}
