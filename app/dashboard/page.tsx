"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { projectService } from "@/services/project-service"
import { taskService } from "@/services/task-service"
import { useAuth } from "@/components/auth-provider"
import { BarChart3, CheckCircle, Clock, Users } from "lucide-react"

import { useEffect, useState } from "react"

export default function DashboardPage() {
  const { user } = useAuth()
  const [projects, setProjects] = useState<any[]>([])
  const [tasks, setTasks] = useState<any[]>([])

  useEffect(() => {
    projectService.getAll().then((data) => setProjects(Array.isArray(data) ? data : []))
    taskService.getAll().then((data) => setTasks(Array.isArray(data) ? data : []))
  }, [])

  const stats = {
    totalProjects: Array.isArray(projects) ? projects.length : 0,
    totalTasks: Array.isArray(tasks) ? tasks.length : 0,
    completedTasks: Array.isArray(tasks) ? tasks.filter((t) => t.status === "completed").length : 0,
    inProgressTasks: Array.isArray(tasks) ? tasks.filter((t) => t.status === "in-progress").length : 0,
    pendingTasks: Array.isArray(tasks) ? tasks.filter((t) => t.status === "todo").length : 0,
  }

  const completionRate = stats.totalTasks > 0 ? (stats.completedTasks / stats.totalTasks) * 100 : 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold inlaze-text-gradient">Dashboard</h1>
        <p className="text-muted-foreground">
          Bienvenido, {user?.name}. Aquí tienes un resumen de tus proyectos y tareas.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Proyectos</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProjects}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tareas</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTasks}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completadas</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedTasks}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Progreso</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inProgressTasks}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Progreso General</CardTitle>
            <CardDescription>Porcentaje de tareas completadas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Progress value={completionRate} className="w-full" />
              <p className="text-sm text-muted-foreground">{completionRate.toFixed(1)}% completado</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Proyectos Recientes</CardTitle>
            <CardDescription>Últimos proyectos creados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Array.isArray(projects) && projects.slice(0, 3).map((project) => (
                <div key={project.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{project.name}</p>
                    <p className="text-sm text-muted-foreground">{project.description}</p>
                  </div>
                  <Badge variant={project.status === "active" ? "default" : "secondary"}>{project.status}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
