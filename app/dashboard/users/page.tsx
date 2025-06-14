"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { userService } from "@/services/user-service"
import { taskService } from "@/services/task-service"
import { Search, Users, UserCheck, Crown, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { UserDialog } from "@/components/user-dialog"
import { UserOptionsDropdown } from "@/components/user-options-dropdown"

export default function UsersPage() {
  const [users, setUsers] = useState(userService.getAll())
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getUserTasksCount = (userId: string) => {
    return taskService.getByAssignee(userId).length
  }

  const getUserCompletedTasks = (userId: string) => {
    return taskService.getByAssignee(userId).filter((task) => task.status === "completed").length
  }

  const handleUserCreated = () => {
    setUsers(userService.getAll())
    setIsDialogOpen(false)
  }

  const handleUserUpdated = () => {
    setUsers(userService.getAll())
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Usuarios</h1>
          <p className="text-muted-foreground">Gestiona los usuarios del sistema y sus roles</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            {users.length} usuarios
          </Badge>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Usuario
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar usuarios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredUsers.map((user) => {
          const totalTasks = getUserTasksCount(user.id)
          const completedTasks = getUserCompletedTasks(user.id)
          const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

          return (
            <Card key={user.id} className="hover:shadow-lg transition-shadow group">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {user.name}
                      {user.role === "admin" && <Crown className="h-4 w-4 text-primary" />}
                    </CardTitle>
                    <CardDescription>{user.email}</CardDescription>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <UserOptionsDropdown user={user} onUserUpdated={handleUserUpdated} />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <Badge
                    variant={user.role === "admin" ? "default" : "secondary"}
                    className={user.role === "admin" ? "bg-primary text-primary-foreground" : ""}
                  >
                    {user.role === "admin" ? "Administrador" : "Miembro"}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Desde {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tareas asignadas</span>
                    <span className="font-medium">{totalTasks}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Completadas</span>
                    <span className="font-medium flex items-center gap-1">
                      <UserCheck className="h-3 w-3" />
                      {completedTasks}
                    </span>
                  </div>
                  {totalTasks > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tasa de completado</span>
                      <span className="font-medium text-primary">{completionRate.toFixed(0)}%</span>
                    </div>
                  )}
                </div>

                {totalTasks > 0 && (
                  <div className="pt-2">
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${completionRate}%` }}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No se encontraron usuarios</p>
        </div>
      )}
      <UserDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} onUserCreated={handleUserCreated} />
    </div>
  )
}
