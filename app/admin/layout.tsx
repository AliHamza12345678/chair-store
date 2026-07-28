import { ReactNode } from "react"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth-options"
import { Sidebar } from "@/components/admin/layout/Sidebar"
import { Header } from "@/components/admin/layout/Header"
import { AuthProvider } from "@/components/providers/AuthProvider"

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions)

  // Double check protection (middleware also does this)
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/auth/login")
  }

  return (
    <AuthProvider>
      <div className="flex h-screen overflow-hidden bg-secondary/10">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Header />
          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </AuthProvider>
  )
}
