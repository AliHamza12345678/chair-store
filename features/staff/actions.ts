"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { requireAdmin } from "@/lib/permissions"

export async function setUserRole(userId: string, role: "ADMIN" | "USER") {
  const currentAdmin = await requireAdmin()

  if (currentAdmin.id === userId && role === "USER") {
    return { success: false as const, error: "You can't remove your own admin access." }
  }

  await prisma.user.update({ where: { id: userId }, data: { role } })
  revalidatePath("/admin/staff")
  return { success: true as const }
}
