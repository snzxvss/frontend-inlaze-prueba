"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { userService } from "@/services/user-service"
import { useToast } from "@/hooks/use-toast"
import { Upload, User } from "lucide-react"

interface UserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onUserCreated: () => void
}

export function UserDialog({ open, onOpenChange, onUserCreated }: UserDialogProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [role, setRole] = useState<"admin" | "member">("member")
  const [avatar, setAvatar] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validaciones básicas
      if (!name.trim()) {
        throw new Error("El nombre es requerido")
      }
      if (!email.trim()) {
        throw new Error("El email es requerido")
      }
      if (!email.includes("@")) {
        throw new Error("El email debe tener un formato válido")
      }

      await userService.create({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        role,
        avatar: avatar || "/placeholder.svg?height=40&width=40",
      })

      toast({
        title: "Usuario creado",
        description: `${name} se ha agregado exitosamente al sistema`,
      })

      resetForm()
      onUserCreated()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo crear el usuario",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setName("")
    setEmail("")
    setRole("member")
    setAvatar("")
  }

  const handleClose = () => {
    resetForm()
    onOpenChange(false)
  }

  const generateAvatar = () => {
    if (name.trim()) {
      const initials = name
        .trim()
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
      setAvatar(`/placeholder.svg?height=40&width=40&text=${initials}`)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[450px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Usuario</DialogTitle>
          <DialogDescription>Agrega un nuevo usuario al sistema y asígnale un rol específico.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-3">
            {/* Avatar Preview */}
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={avatar || "/placeholder.svg"} />
                <AvatarFallback>
                  <User className="h-8 w-8" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Label htmlFor="avatar">Avatar URL (opcional)</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="avatar"
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    placeholder="https://ejemplo.com/avatar.jpg"
                  />
                  <Button type="button" variant="outline" size="icon" onClick={generateAvatar}>
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Deja vacío para usar avatar por defecto</p>
              </div>
            </div>

            {/* Información básica */}
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1">
                <Label htmlFor="name" className="text-sm">
                  Nombre completo *
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Juan Pérez"
                  className="h-9"
                  required
                />
              </div>
              <div className="grid gap-1">
                <Label htmlFor="role" className="text-sm">
                  Rol *
                </Label>
                <Select value={role} onValueChange={(value: "admin" | "member") => setRole(value)}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Selecciona un rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="member">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <div>
                          <div className="font-medium">Miembro</div>
                          <div className="text-xs text-muted-foreground">Acceso estándar</div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="admin">
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded bg-primary flex items-center justify-center">
                          <User className="h-3 w-3 text-primary-foreground" />
                        </div>
                        <div>
                          <div className="font-medium">Administrador</div>
                          <div className="text-xs text-muted-foreground">Acceso completo</div>
                        </div>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="juan.perez@inlaze.com"
                required
              />
              <p className="text-xs text-muted-foreground">Se enviará una invitación a esta dirección de correo</p>
            </div>

            {/* Información del rol */}
            <div className="rounded-lg border p-4 bg-muted/50">
              <h4 className="font-medium mb-2">Permisos del rol seleccionado:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                {role === "admin" ? (
                  <>
                    <li>• Gestionar todos los proyectos y tareas</li>
                    <li>• Crear y eliminar usuarios</li>
                    <li>• Acceso a configuración del sistema</li>
                    <li>• Ver reportes y analytics completos</li>
                  </>
                ) : (
                  <>
                    <li>• Ver y gestionar tareas asignadas</li>
                    <li>• Participar en proyectos asignados</li>
                    <li>• Comentar en tareas</li>
                    <li>• Actualizar perfil personal</li>
                  </>
                )}
              </ul>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creando..." : "Crear Usuario"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
