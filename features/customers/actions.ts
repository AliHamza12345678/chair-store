"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { checkAdminStatus } from "@/features/auth/queries"

export async function updateCustomerNotesAndTags(
  customerId: string,
  notes: string,
  tags: string[]
) {
  const isAdmin = await checkAdminStatus()
  if (!isAdmin) return { error: "Unauthorized access" }

  try {
    await prisma.user.update({
      where: { id: customerId },
      data: {
        notes,
        tags,
      }
    })

    revalidatePath("/admin/customers")
    return { success: true }
  } catch (error: any) {
    return { error: error.message || "Failed to update customer CRM records" }
  }
}
