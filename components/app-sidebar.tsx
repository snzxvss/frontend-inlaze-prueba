"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useAuth } from "@/components/auth-provider"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, FolderOpen, CheckSquare, Users, Settings, LogOut } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"

const menuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Proyectos",
    url: "/dashboard/projects",
    icon: FolderOpen,
  },
  {
    title: "Tareas",
    url: "/dashboard/tasks",
    icon: CheckSquare,
  },
  {
    title: "Usuarios",
    url: "/dashboard/users",
    icon: Users,
  },
  {
    title: "Configuración",
    url: "/dashboard/settings",
    icon: Settings,
  },
]

export function AppSidebar() {
  const { user, logout } = useAuth()
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border bg-sidebar-background">
        <div className="flex items-center gap-2 px-4 py-3">
          <Image src="/inlaze-logo.png" alt="Inlaze Logo" width={120} height={32} className="h-8 w-auto" priority />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegación</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border">
        <div className="flex items-center gap-3 p-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.avatar || "/placeholder.svg"} />
            <AvatarFallback>
              {user?.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.role}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={logout} className="h-8 w-8">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
