"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import { productSchema, ProductFormValues } from "./validations"

async function checkAdmin() {
  const session = await getServerSession(authOptions)
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized")
  }
}

function generateSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
}

export async function createProduct(data: ProductFormValues) {
  await checkAdmin()
  
  const validatedFields = productSchema.safeParse(data)
  if (!validatedFields.success) {
    return { error: "Invalid fields" }
  }

  const { name, description, price, categoryId, imageUrl, inventory, isFeatured, isArchived } = validatedFields.data
  const slug = generateSlug(name) + "-" + Date.now().toString().slice(-4)

  try {
    await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price,
        categoryId,
        inventory: inventory ?? 10,
        isFeatured: isFeatured ?? false,
        isArchived: isArchived ?? false,
        images: imageUrl ? [imageUrl] : [],
      }
    })
    
    revalidatePath("/admin/products")
    return { success: true }
  } catch (error: any) {
    return { error: error.message || "Failed to create product" }
  }
}

export async function updateProduct(id: string, data: ProductFormValues) {
  await checkAdmin()
  
  const validatedFields = productSchema.safeParse(data)
  if (!validatedFields.success) {
    return { error: "Invalid fields" }
  }

  const { name, description, price, categoryId, imageUrl, inventory, isFeatured, isArchived } = validatedFields.data

  try {
    await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        price,
        categoryId,
        inventory: inventory ?? 0,
        isFeatured: isFeatured ?? false,
        isArchived: isArchived ?? false,
        images: imageUrl ? [imageUrl] : [],
      }
    })
    
    revalidatePath("/admin/products")
    return { success: true }
  } catch (error: any) {
    return { error: error.message || "Failed to update product" }
  }
}

export async function deleteProduct(id: string) {
  await checkAdmin()
  
  try {
    await prisma.product.delete({
      where: { id }
    })
    revalidatePath("/admin/products")
    return { success: true }
  } catch (error: any) {
    return { error: error.message || "Failed to delete product" }
  }
}

export async function toggleProductFeatured(id: string, isFeatured: boolean) {
  await checkAdmin()
  try {
    await prisma.product.update({
      where: { id },
      data: { isFeatured }
    })
    revalidatePath("/admin/products")
    return { success: true }
  } catch (error: any) {
    return { error: error.message || "Failed to update status" }
  }
}

export async function toggleProductArchived(id: string, isArchived: boolean) {
  await checkAdmin()
  try {
    await prisma.product.update({
      where: { id },
      data: { isArchived }
    })
    revalidatePath("/admin/products")
    return { success: true }
  } catch (error: any) {
    return { error: error.message || "Failed to update status" }
  }
}

export async function duplicateProduct(id: string) {
  await checkAdmin()
  try {
    const existing = await prisma.product.findUnique({ where: { id } })
    if (!existing) return { error: "Product not found" }

    const newSlug = generateSlug(existing.name) + "-copy-" + Date.now().toString().slice(-4)

    await prisma.product.create({
      data: {
        name: `${existing.name} (Copy)`,
        slug: newSlug,
        description: existing.description,
        price: existing.price,
        categoryId: existing.categoryId,
        inventory: existing.inventory,
        isFeatured: existing.isFeatured,
        isArchived: false,
        images: existing.images,
      }
    })

    revalidatePath("/admin/products")
    return { success: true }
  } catch (error: any) {
    return { error: error.message || "Failed to duplicate product" }
  }
}

export async function bulkDeleteProducts(ids: string[]) {
  await checkAdmin()
  try {
    await prisma.product.deleteMany({
      where: { id: { in: ids } }
    })
    revalidatePath("/admin/products")
    return { success: true }
  } catch (error: any) {
    return { error: error.message || "Failed to bulk delete products" }
  }
}

export async function bulkArchiveProducts(ids: string[], isArchived: boolean = true) {
  await checkAdmin()
  try {
    await prisma.product.updateMany({
      where: { id: { in: ids } },
      data: { isArchived }
    })
    revalidatePath("/admin/products")
    return { success: true }
  } catch (error: any) {
    return { error: error.message || "Failed to bulk archive products" }
  }
}
