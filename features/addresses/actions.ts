"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { requireUser } from "@/lib/permissions"
import { addressSchema, AddressFormValues } from "./validations"

export async function createAddress(data: AddressFormValues) {
  const user = await requireUser()
  const parsed = addressSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false as const, error: parsed.error.issues[0]?.message ?? "Invalid address." }
  }

  if (parsed.data.isDefault) {
    await prisma.address.updateMany({ where: { userId: user.id }, data: { isDefault: false } })
  }

  await prisma.address.create({ data: { ...parsed.data, userId: user.id } })
  revalidatePath("/account/addresses")
  return { success: true as const }
}

export async function updateAddress(id: string, data: AddressFormValues) {
  const user = await requireUser()
  const parsed = addressSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false as const, error: parsed.error.issues[0]?.message ?? "Invalid address." }
  }

  const existing = await prisma.address.findUnique({ where: { id } })
  if (!existing || existing.userId !== user.id) {
    return { success: false as const, error: "Address not found." }
  }

  if (parsed.data.isDefault) {
    await prisma.address.updateMany({ where: { userId: user.id }, data: { isDefault: false } })
  }

  await prisma.address.update({ where: { id }, data: parsed.data })
  revalidatePath("/account/addresses")
  return { success: true as const }
}

export async function deleteAddress(id: string) {
  const user = await requireUser()
  const existing = await prisma.address.findUnique({ where: { id } })
  if (!existing || existing.userId !== user.id) {
    return { success: false as const, error: "Address not found." }
  }
  await prisma.address.delete({ where: { id } })
  revalidatePath("/account/addresses")
  return { success: true as const }
}
