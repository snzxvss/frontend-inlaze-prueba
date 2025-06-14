"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { notificationService, type Notification } from "@/services/notification-service"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"
import { Bell, Check, CheckCheck, Trash2, Info, CheckCircle, AlertTriangle, XCircle, ExternalLink } from "lucide-react"
import { useRouter } from "next/navigation"

export function NotificationsDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    loadNotifications()
  }, [user])

  const loadNotifications = async () => {
    if (user) {
      const userNotifications = await notificationService.getByUser(user.id)
      setNotifications(userNotifications)
      const unread = await notificationService.getUnreadCount()
      setUnreadCount(unread)
    }
  }

  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id)
      loadNotifications()
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo marcar como leída",
        variant: "destructive",
      })
    }
  }

  const handleMarkAllAsRead = async () => {
    setLoading(true)
    try {
      await notificationService.markAllAsRead()
      loadNotifications()
      toast({
        title: "Notificaciones marcadas",
        description: "Todas las notificaciones han sido marcadas como leídas",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron marcar las notificaciones",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await notificationService.delete(id)
      loadNotifications()
      toast({
        title: "Notificación eliminada",
        description: "La notificación ha sido eliminada",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar la notificación",
        variant: "destructive",
      })
    }
  }

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.read) {
      await handleMarkAsRead(notification.id)
    }

    if (notification.actionUrl) {
      router.push(notification.actionUrl)
    }
  }

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Info className="h-4 w-4 text-blue-500" />
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) {
      return "Hace unos minutos"
    } else if (diffInHours < 24) {
      return `Hace ${diffInHours}h`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return `Hace ${diffInDays}d`
    }
  }

  if (!Array.isArray(notifications)) {
    console.error("Error: notifications is not an array", notifications)
    return (
      <div className="p-4 text-center text-sm text-muted-foreground">
        Missing required error components, refreshing...
      </div>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative hover:bg-accent">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge
              variant="default"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-primary text-primary-foreground"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notificaciones</span>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllAsRead}
              disabled={loading}
              className="h-6 px-2 text-xs"
            >
              <CheckCheck className="h-3 w-3 mr-1" />
              Marcar todas
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {notifications.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">No tienes notificaciones</div>
        ) : (
          <ScrollArea className="h-[400px]">
            {notifications.map((notification, index) => (
              <div key={notification.id}>
                <DropdownMenuItem
                  className={`p-0 cursor-pointer ${!notification.read ? "bg-accent/50" : ""}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start gap-3 p-3 w-full">
                    <div className="flex-shrink-0 mt-0.5">{getNotificationIcon(notification.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p
                            className={`text-sm font-medium ${!notification.read ? "text-foreground" : "text-muted-foreground"}`}
                          >
                            {notification.title}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{notification.message}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs text-muted-foreground">{formatTime(notification.createdAt)}</span>
                            {notification.actionUrl && <ExternalLink className="h-3 w-3 text-muted-foreground" />}
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleMarkAsRead(notification.id)
                              }}
                            >
                              <Check className="h-3 w-3" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-muted-foreground hover:text-destructive"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDelete(notification.id)
                            }}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </DropdownMenuItem>
                {index < notifications.length - 1 && <Separator />}
              </div>
            ))}
          </ScrollArea>
        )}

        {notifications.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-center text-sm text-muted-foreground">
              Ver todas las notificaciones
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
