"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { NotificationsDropdown } from "@/components/notifications-dropdown"

export function Header() {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border px-4 bg-card/50 backdrop-blur-sm">
      <SidebarTrigger className="-ml-1 hover:bg-accent" />
      <Separator orientation="vertical" className="mr-2 h-4" />

      <div className="flex-1 flex items-center gap-4">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar..."
            className="pl-10 h-9 bg-background/50 border-border focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <NotificationsDropdown />
      </div>
    </header>
  )
}
