"use server"

import { prisma } from "@/lib/prisma"
import crypto from "crypto"
import { hash } from "bcryptjs"
import { sendPasswordResetEmail } from "@/lib/email"
import * as z from "zod"

const requestSchema = z.object({ email: z.string().email() })
const resetSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8, "Password must be at least 8 characters."),
})

/**
 * Always returns success (even if the email isn't registered) to avoid
 * leaking which emails have accounts.
 */
export async function requestPasswordReset(email: string) {
  const parsed = requestSchema.safeParse({ email })
  if (!parsed.success) {
    return { success: false as const, error: "Enter a valid email address." }
  }

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } })

  if (user) {
    const token = crypto.randomBytes(32).toString("hex")
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    await prisma.passwordResetToken.create({
      data: { email: user.email!, token, expiresAt },
    })

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset?token=${token}`
    await sendPasswordResetEmail(user.email!, resetUrl)
  }

  return { success: true as const }
}

export async function resetPassword(token: string, password: string) {
  const parsed = resetSchema.safeParse({ token, password })
  if (!parsed.success) {
    return { success: false as const, error: parsed.error.issues[0]?.message ?? "Invalid input." }
  }

  const resetToken = await prisma.passwordResetToken.findUnique({ where: { token: parsed.data.token } })

  if (!resetToken || resetToken.usedAt || resetToken.expiresAt < new Date()) {
    return { success: false as const, error: "This reset link is invalid or has expired." }
  }

  const hashedPassword = await hash(parsed.data.password, 10)

  await prisma.$transaction([
    prisma.user.update({ where: { email: resetToken.email }, data: { password: hashedPassword } }),
    prisma.passwordResetToken.update({ where: { id: resetToken.id }, data: { usedAt: new Date() } }),
  ])

  return { success: true as const }
}
