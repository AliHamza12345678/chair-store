"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import { hash } from "bcryptjs"
import { Prisma } from "@prisma/client"

async function checkAdmin() {
  const session = await getServerSession(authOptions)
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized")
  }
  return session
}

export async function updateStoreSettings(formData: FormData) {
  await checkAdmin()
  
  const storeName = formData.get("storeName") as string
  const storeEmail = formData.get("storeEmail") as string
  const currency = formData.get("currency") as string
  const taxRate = parseFloat(formData.get("taxRate") as string) || 0
  const shippingRate = parseFloat(formData.get("shippingRate") as string) || 0
  const maintenanceMode = formData.get("maintenanceMode") === "on"

  try {
    await prisma.storeSettings.upsert({
      where: { id: "global" },
      update: {
        storeName,
        storeEmail,
        currency,
        taxRate,
        shippingRate,
        maintenanceMode,
      },
      create: {
        id: "global",
        storeName,
        storeEmail,
        currency,
        taxRate,
        shippingRate,
        maintenanceMode,
      }
    })
    
    revalidatePath("/admin/settings")
    return { success: true }
  } catch (error: any) {
    return { error: error.message || "Failed to update settings" }
  }
}

export async function updateProfile(formData: FormData) {
  const session = await checkAdmin()
  
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const imageUrl = formData.get("imageUrl") as string

  try {
    const dataToUpdate: Prisma.UserUpdateInput = { name, email }
    if (imageUrl) dataToUpdate.image = imageUrl
    if (password) dataToUpdate.password = await hash(password, 10)

    await prisma.user.update({
      where: { id: session.user.id },
      data: dataToUpdate
    })
    
    revalidatePath("/admin/settings")
    return { success: true }
  } catch (error: any) {
    return { error: error.message || "Failed to update profile" }
  }
}
