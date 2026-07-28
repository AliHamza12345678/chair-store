"use server"

import { prisma } from "@/lib/prisma"
import { hash } from "bcryptjs"
import { sendWelcomeEmail } from "@/lib/email"
import { registerSchema, RegisterFormData } from "./validations"

export async function registerUser(data: RegisterFormData) {
  try {
    const validatedFields = registerSchema.safeParse(data)
    if (!validatedFields.success) {
      return { error: "Invalid fields" }
    }

    const { name, email, password } = validatedFields.data

    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return { error: "User already exists" }
    }

    const hashedPassword = await hash(password, 10)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })

    if (user.email) {
      sendWelcomeEmail(user.email, user.name || "Customer")
    }

    return { success: true }
  } catch (error) {
    console.error("Registration error:", error)
    return { error: "Internal server error" }
  }
}
