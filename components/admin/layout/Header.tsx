"use client"

import { signOut, useSession } from "next-auth/react"
import { Menu, LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/Button"

export function Header() {
  const { data: session } = useSession()

  return (
    <header className="h-16 border-b bg-background/50 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="w-5 h-5" />
        </Button>
        <div className="hidden sm:flex text-sm font-medium text-muted-foreground">
          {/* Simple breadcrumb placeholder */}
          Admin / Overview
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-2 text-sm">
          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
            <User className="w-4 h-4 text-muted-foreground" />
          </div>
          <span className="font-medium">{session?.user?.name || "Admin"}</span>
        </div>
        <Button variant="ghost" size="sm" onClick={() => signOut({ callbackUrl: "/auth/login" })} className="text-muted-foreground">
          <LogOut className="w-4 h-4 mr-2" />
          Sign out
        </Button>
      </div>
    </header>
  )
}
