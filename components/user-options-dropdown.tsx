"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { userService } from "@/services/user-service"
import { notificationService } from "@/services/notification-service"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"
import { MoreHorizontal, Edit, Trash2, UserCheck, Mail, Shield, ShieldOff, MessageSquare } from "lucide-react"
import type { User } from "@/services/auth-service"

interface UserOptionsDropdownProps {
  user: User
  onUserUpdated: () => void
}

export function UserOptionsDropdown({ user, onUserUpdated }: UserOptionsDropdownProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [loading, setLoading] = useState(false)
  const { user: currentUser } = useAuth()
  const { toast } = useToast()

  const handleToggleRole = async () => {
    setLoading(true)
    try {
      const newRole = user.role === "admin" ? "member" : "admin"
      await userService.update(user.id, { role: newRole })

      // Crear notificación
      await notificationService.create({
        title: "Rol actualizado",
        message: `El rol de ${user.name} ha sido cambiado a ${newRole === "admin" ? "Administrador" : "Miembro"}`,
        type: "info",
        read: false,
        userId: currentUser?.id,
      })

      toast({
        title: "Rol actualizado",
        description: `${user.name} ahora es ${newRole === "admin" ? "Administrador" : "Miembro"}`,
      })

      onUserUpdated()
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el rol del usuario",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleToggleStatus = async () => {
    setLoading(true)
    try {
      // Simular cambio de estado activo/inactivo
      const newStatus = "inactive" // En una implementación real, esto vendría del estado del usuario

      await notificationService.create({
        title: "Estado de usuario actualizado",
        message: `${user.name} ha sido ${newStatus === "active" ? "activado" : "desactivado"}`,
        type: "warning",
        read: false,
        userId: currentUser?.id,
      })

      toast({
        title: "Estado actualizado",
        description: `${user.name} ha sido ${newStatus === "active" ? "activado" : "desactivado"}`,
      })

      onUserUpdated()
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado del usuario",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSendMessage = async () => {
    try {
      await notificationService.create({
        title: "Mensaje enviado",
        message: `Has enviado un mensaje a ${user.name}`,
        type: "success",
        read: false,
        userId: currentUser?.id,
      })

      toast({
        title: "Mensaje enviado",
        description: `Se ha enviado un mensaje a ${user.name}`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo enviar el mensaje",
        variant: "destructive",
      })
    }
  }

  const handleSendEmail = async () => {
    try {
      // Simular envío de email
      await new Promise((resolve) => setTimeout(resolve, 1000))

      await notificationService.create({
        title: "Email enviado",
        message: `Se ha enviado un email de invitación a ${user.email}`,
        type: "success",
        read: false,
        userId: currentUser?.id,
      })

      toast({
        title: "Email enviado",
        description: `Se ha enviado un email de invitación a ${user.email}`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo enviar el email",
        variant: "destructive",
      })
    }
  }

  const handleDeleteUser = async () => {
    setLoading(true)
    try {
      await userService.delete(user.id)

      await notificationService.create({
        title: "Usuario eliminado",
        message: `${user.name} ha sido eliminado del sistema`,
        type: "error",
        read: false,
        userId: currentUser?.id,
      })

      toast({
        title: "Usuario eliminado",
        description: `${user.name} ha sido eliminado del sistema`,
      })

      onUserUpdated()
      setShowDeleteDialog(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el usuario",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // No mostrar opciones para el usuario actual
  if (currentUser?.id === user.id) {
    return null
  }

  // Solo admins pueden ver todas las opciones
  const isCurrentUserAdmin = currentUser?.role === "admin"

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>Acciones de usuario</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={handleSendMessage}>
            <MessageSquare className="mr-2 h-4 w-4" />
            Enviar mensaje
          </DropdownMenuItem>

          <DropdownMenuItem onClick={handleSendEmail}>
            <Mail className="mr-2 h-4 w-4" />
            Enviar email
          </DropdownMenuItem>

          {isCurrentUserAdmin && (
            <>
              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={handleToggleRole} disabled={loading}>
                {user.role === "admin" ? (
                  <>
                    <ShieldOff className="mr-2 h-4 w-4" />
                    Quitar admin
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-4 w-4" />
                    Hacer admin
                  </>
                )}
              </DropdownMenuItem>

              <DropdownMenuItem onClick={handleToggleStatus} disabled={loading}>
                <UserCheck className="mr-2 h-4 w-4" />
                Cambiar estado
              </DropdownMenuItem>

              <DropdownMenuItem>
                <Edit className="mr-2 h-4 w-4" />
                Editar usuario
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => setShowDeleteDialog(true)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Eliminar usuario
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente a <strong>{user.name}</strong> del sistema
              y se perderán todos sus datos asociados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUser}
              disabled={loading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {loading ? "Eliminando..." : "Eliminar usuario"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
