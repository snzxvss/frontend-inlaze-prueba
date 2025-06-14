"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/auth-provider"
import { Settings, Shield, Bell, Palette, Database, Users } from "lucide-react"

export default function SettingsPage() {
  const { user } = useAuth()

  const settingsCategories = [
    {
      title: "Perfil de Usuario",
      description: "Gestiona tu información personal y preferencias",
      icon: Users,
      items: ["Información personal", "Cambiar contraseña", "Preferencias de idioma", "Zona horaria"],
    },
    {
      title: "Notificaciones",
      description: "Configura cómo y cuándo recibir notificaciones",
      icon: Bell,
      items: [
        "Notificaciones por email",
        "Notificaciones push",
        "Comentarios en tareas",
        "Actualizaciones de proyecto",
      ],
    },
    {
      title: "Seguridad",
      description: "Configuración de seguridad y privacidad",
      icon: Shield,
      items: ["Autenticación de dos factores", "Sesiones activas", "Registro de actividad", "Permisos de aplicación"],
    },
    {
      title: "Apariencia",
      description: "Personaliza la interfaz de usuario",
      icon: Palette,
      items: ["Tema oscuro/claro", "Tamaño de fuente", "Densidad de información", "Colores de estado"],
    },
    {
      title: "Sistema",
      description: "Configuración del sistema y base de datos",
      icon: Database,
      items: ["Respaldo de datos", "Configuración de API", "Logs del sistema", "Mantenimiento"],
      adminOnly: true,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Settings className="h-8 w-8" />
        <div>
          <h1 className="text-3xl font-bold">Configuración</h1>
          <p className="text-muted-foreground">Personaliza tu experiencia y gestiona las configuraciones del sistema</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {settingsCategories.map((category) => {
          // Ocultar configuraciones de admin si el usuario no es admin
          if (category.adminOnly && user?.role !== "admin") {
            return null
          }

          return (
            <Card key={category.title} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <category.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {category.title}
                      {category.adminOnly && (
                        <Badge variant="secondary" className="text-xs">
                          Admin
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription>{category.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {category.items.map((item) => (
                    <li key={item} className="text-sm text-muted-foreground flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información del Sistema</CardTitle>
          <CardDescription>Detalles técnicos y estado del sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-1">
              <p className="text-sm font-medium">Versión</p>
              <p className="text-sm text-muted-foreground">v1.0.0</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Última actualización</p>
              <p className="text-sm text-muted-foreground">{new Date().toLocaleDateString()}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Estado del sistema</p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <p className="text-sm text-muted-foreground">Operativo</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
