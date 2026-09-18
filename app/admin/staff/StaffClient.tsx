"use client"

import { useState } from "react"
import { DataTable } from "@/components/ui/DataTable"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/Button"
import { setUserRole } from "@/features/staff/actions"
import { toast } from "sonner"

interface UserRow {
  id: string
  name: string | null
  email: string | null
  role: "ADMIN" | "USER"
  createdAt: Date
}

export function StaffClient({ users }: { users: UserRow[] }) {
  const [busyId, setBusyId] = useState<string | null>(null)

  const handleToggleRole = async (user: UserRow) => {
    const newRole = user.role === "ADMIN" ? "USER" : "ADMIN"
    if (!confirm(`${newRole === "ADMIN" ? "Grant" : "Revoke"} admin access for ${user.email}?`)) return

    setBusyId(user.id)
    const res = await setUserRole(user.id, newRole)
    setBusyId(null)
    if (res.success) toast.success("Role updated")
    else toast.error(res.error)
  }

  const columns = [
    { header: "Name", cell: (u: UserRow) => u.name || "—" },
    { header: "Email", cell: (u: UserRow) => u.email },
    { header: "Role", cell: (u: UserRow) => <Badge variant={u.role === "ADMIN" ? "default" : "secondary"}>{u.role}</Badge> },
    { header: "Joined", cell: (u: UserRow) => new Date(u.createdAt).toLocaleDateString() },
    {
      header: "Actions",
      cell: (u: UserRow) => (
        <Button variant="outline" size="sm" disabled={busyId === u.id} onClick={() => handleToggleRole(u)}>
          {u.role === "ADMIN" ? "Revoke Admin" : "Make Admin"}
        </Button>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Staff & Users</h1>
        <p className="text-muted-foreground mt-2">Grant or revoke admin dashboard access.</p>
      </div>
      <DataTable columns={columns} data={users} />
    </div>
  )
}
