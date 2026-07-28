"use client"

import { useState } from "react"
import { BlogPost } from "@prisma/client"
import { DataTable } from "@/components/ui/DataTable"
import { Modal } from "@/components/ui/Modal"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Textarea } from "@/components/ui/textarea"
import { Select } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2 } from "lucide-react"
import { createPost, deletePost, updatePost } from "@/features/blog/actions"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { blogPostSchema, BlogPostFormValues } from "@/features/blog/validations"
import { toast } from "sonner"

export function BlogClient({ posts }: { posts: BlogPost[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<BlogPostFormValues>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: { title: "", excerpt: "", content: "", coverImage: "", status: "DRAFT", authorName: "" },
  })

  const handleOpenNew = () => {
    setEditingId(null)
    reset({ title: "", excerpt: "", content: "", coverImage: "", status: "DRAFT", authorName: "" })
    setIsModalOpen(true)
  }

  const handleOpenEdit = (post: BlogPost) => {
    setEditingId(post.id)
    reset({
      title: post.title,
      excerpt: post.excerpt ?? "",
      content: post.content,
      coverImage: post.coverImage ?? "",
      status: post.status,
      authorName: post.authorName ?? "",
    })
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this post?")) return
    const loadingToast = toast.loading("Deleting post...")
    const res = await deletePost(id)
    if (res.success) toast.success("Post deleted", { id: loadingToast })
    else toast.error(res.error, { id: loadingToast })
  }

  const onSubmit = async (data: BlogPostFormValues) => {
    const loadingToast = toast.loading(editingId ? "Updating post..." : "Creating post...")
    const res = editingId ? await updatePost(editingId, data) : await createPost(data)
    if (res.success) {
      toast.success(editingId ? "Post updated" : "Post created", { id: loadingToast })
      setIsModalOpen(false)
    } else {
      toast.error(res.error, { id: loadingToast })
    }
  }

  const columns = [
    { header: "Title", cell: (item: BlogPost) => <span className="font-medium">{item.title}</span> },
    { header: "Author", cell: (item: BlogPost) => item.authorName || "—" },
    {
      header: "Status",
      cell: (item: BlogPost) => (
        <Badge variant={item.status === "PUBLISHED" ? "success" : "secondary"}>{item.status}</Badge>
      ),
    },
    { header: "Updated", cell: (item: BlogPost) => new Date(item.updatedAt).toLocaleDateString() },
    {
      header: "Actions",
      cell: (item: BlogPost) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleOpenEdit(item)}>
            <Edit className="w-4 h-4 text-blue-500" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDelete(item.id)}>
            <Trash2 className="w-4 h-4 text-red-500" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Blog</h1>
          <p className="text-muted-foreground mt-2">Write and publish store news, guides, and updates.</p>
        </div>
        <Button onClick={handleOpenNew}>
          <Plus className="w-4 h-4 mr-2" /> New Post
        </Button>
      </div>

      <DataTable columns={columns} data={posts} />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? "Edit Post" : "New Post"}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <Input {...register("title")} disabled={isSubmitting} placeholder="5 Tips for Choosing the Right Chair" />
            {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Excerpt (optional)</label>
            <Input {...register("excerpt")} disabled={isSubmitting} placeholder="Short summary shown on the blog listing" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Cover Image URL (optional)</label>
            <Input {...register("coverImage")} disabled={isSubmitting} placeholder="https://..." />
            {errors.coverImage && <p className="text-xs text-red-500">{errors.coverImage.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Author (optional)</label>
              <Input {...register("authorName")} disabled={isSubmitting} placeholder="LUMINA Team" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select {...register("status")} disabled={isSubmitting}>
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Content</label>
            <Textarea {...register("content")} disabled={isSubmitting} rows={10} placeholder="Write your post..." />
            {errors.content && <p className="text-xs text-red-500">{errors.content.message}</p>}
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : (editingId ? "Save Changes" : "Create Post")}
          </Button>
        </form>
      </Modal>
    </div>
  )
}
