"use server"

import { prisma } from "@/lib/prisma"
import { hash, compare } from "bcryptjs"
import { requireUser } from "@/lib/permissions"
import * as z from "zod"

const profileSchema = z.object({ name: z.string().min(1, "Name is required.") })
const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8, "New password must be at least 8 characters."),
})

/** Logged-in user updating their own display name (settings page). */
export async function updateProfile(name: string) {
  const user = await requireUser()

  const parsed = profileSchema.safeParse({ name })
  if (!parsed.success) {
    return { success: false as const, error: parsed.error.issues[0]?.message ?? "Invalid name." }
  }

  await prisma.user.update({ where: { id: user.id }, data: { name: parsed.data.name } })
  return { success: true as const }
}

/** Logged-in user changing their password (requires the current password — different flow from the forgot-password email link). */
export async function changePassword(currentPassword: string, newPassword: string) {
  const user = await requireUser()

  const parsed = changePasswordSchema.safeParse({ currentPassword, newPassword })
  if (!parsed.success) {
    return { success: false as const, error: parsed.error.issues[0]?.message ?? "Invalid password." }
  }

  const dbUser = await prisma.user.findUnique({ where: { id: user.id } })
  if (!dbUser?.password) {
    return { success: false as const, error: "This account has no password set (social login?)." }
  }

  const isCorrect = await compare(parsed.data.currentPassword, dbUser.password)
  if (!isCorrect) {
    return { success: false as const, error: "Current password is incorrect." }
  }

  const hashedPassword = await hash(parsed.data.newPassword, 10)
  await prisma.user.update({ where: { id: user.id }, data: { password: hashedPassword } })
  return { success: true as const }
}
