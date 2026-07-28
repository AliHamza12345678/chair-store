"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import { categorySchema, CategoryFormValues } from "./validations"

async function checkAdmin() {
  const session = await getServerSession(authOptions)
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized")
  }
}

function generateSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
}

export async function createCategory(data: CategoryFormValues) {
  await checkAdmin()
  
  const validatedFields = categorySchema.safeParse(data)
  if (!validatedFields.success) {
    return { error: "Invalid fields" }
  }

  const { name, ...rest } = validatedFields.data
  const slug = generateSlug(name) + "-" + Date.now().toString().slice(-4)

  const parentId = rest.parentId === "" ? null : rest.parentId

  try {
    await prisma.category.create({
      data: {
        name,
        slug,
        description: rest.description || null,
        imageUrl: rest.imageUrl || null,
        bannerUrl: rest.bannerUrl || null,
        thumbnailUrl: rest.thumbnailUrl || null,
        parentId,
        type: rest.type,
        sortOrder: rest.sortOrder,
        isVisible: rest.isVisible,
        isFeatured: rest.isFeatured,
        seoTitle: rest.seoTitle || null,
        seoDescription: rest.seoDescription || null,
        seoKeywords: rest.seoKeywords || null,
      }
    })
    
    revalidatePath("/")
    revalidatePath("/admin/categories")
    return { success: true }
  } catch (error: any) {
    return { error: error.message || "Failed to create category" }
  }
}

export async function updateCategory(id: string, data: CategoryFormValues) {
  await checkAdmin()
  
  const validatedFields = categorySchema.safeParse(data)
  if (!validatedFields.success) {
    return { error: "Invalid fields" }
  }

  const { name, ...rest } = validatedFields.data
  const parentId = rest.parentId === "" ? null : rest.parentId

  try {
    await prisma.category.update({
      where: { id },
      data: {
        name,
        description: rest.description || null,
        imageUrl: rest.imageUrl || null,
        bannerUrl: rest.bannerUrl || null,
        thumbnailUrl: rest.thumbnailUrl || null,
        parentId,
        type: rest.type,
        sortOrder: rest.sortOrder,
        isVisible: rest.isVisible,
        isFeatured: rest.isFeatured,
        seoTitle: rest.seoTitle || null,
        seoDescription: rest.seoDescription || null,
        seoKeywords: rest.seoKeywords || null,
      }
    })
    
    revalidatePath("/")
    revalidatePath("/admin/categories")
    return { success: true }
  } catch (error: any) {
    return { error: error.message || "Failed to update category" }
  }
}

export async function deleteCategory(id: string) {
  await checkAdmin()
  
  try {
    await prisma.category.delete({
      where: { id }
    })
    revalidatePath("/")
    revalidatePath("/admin/categories")
    return { success: true }
  } catch (error: any) {
    return { error: error.message || "Failed to delete category" }
  }
}

export async function bulkDeleteCategories(ids: string[]) {
  await checkAdmin()
  
  try {
    await prisma.category.deleteMany({
      where: { id: { in: ids } }
    })
    revalidatePath("/")
    revalidatePath("/admin/categories")
    return { success: true }
  } catch (error: any) {
    return { error: error.message || "Failed to delete categories" }
  }
}

export async function toggleCategoryFeatured(id: string, isFeatured: boolean) {
  await checkAdmin()
  
  try {
    await prisma.category.update({
      where: { id },
      data: { isFeatured }
    })
    revalidatePath("/")
    revalidatePath("/admin/categories")
    return { success: true }
  } catch (error: any) {
    return { error: error.message || "Failed to update category" }
  }
}

export async function toggleCategoryVisibility(id: string, isVisible: boolean) {
  await checkAdmin()
  
  try {
    await prisma.category.update({
      where: { id },
      data: { isVisible }
    })
    revalidatePath("/")
    revalidatePath("/admin/categories")
    return { success: true }
  } catch (error: any) {
    return { error: error.message || "Failed to update category" }
  }
}

export async function updateSortOrder(items: { id: string; sortOrder: number }[]) {
  await checkAdmin()
  
  try {
    await Promise.all(
      items.map((item) =>
        prisma.category.update({
          where: { id: item.id },
          data: { sortOrder: item.sortOrder },
        })
      )
    )
    revalidatePath("/")
    revalidatePath("/admin/categories")
    return { success: true }
  } catch (error: any) {
    return { error: error.message || "Failed to update sort order" }
  }
}
