"use client"

import { useState, use } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TaskDialog } from "@/components/task-dialog"
import { TaskCard } from "@/components/task-card"
import { projectService } from "@/services/project-service"
import { taskService } from "@/services/task-service"
import { Plus, Search, Filter } from "lucide-react"
import { notFound } from "next/navigation"

interface ProjectPageProps {
  params: Promise<{ id: string }>
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const { id } = use(params)
  const project = projectService.getById(id)

  if (!project) {
    notFound()
  }

  const [tasks, setTasks] = useState(taskService.getByProject(id))
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || task.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleTaskCreated = () => {
    setTasks(taskService.getByProject(id))
    setIsDialogOpen(false)
  }

  const handleTaskUpdated = () => {
    setTasks(taskService.getByProject(id))
  }

  const tasksByStatus = {
    todo: filteredTasks.filter((t) => t.status === "todo"),
    "in-progress": filteredTasks.filter((t) => t.status === "in-progress"),
    completed: filteredTasks.filter((t) => t.status === "completed"),
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold">{project.name}</h1>
          <p className="text-muted-foreground text-sm sm:text-base">{project.description}</p>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant={project.status === "active" ? "default" : "secondary"}>{project.status}</Badge>
            <span className="text-sm text-muted-foreground">{tasks.length} tareas totales</span>
          </div>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Nueva Tarea
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar tareas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 h-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[160px] h-9">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filtrar por estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="todo">Por hacer</SelectItem>
            <SelectItem value="in-progress">En progreso</SelectItem>
            <SelectItem value="completed">Completada</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-500"></div>
              Por hacer
              <Badge variant="secondary">{tasksByStatus.todo.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {tasksByStatus.todo.map((task) => (
              <TaskCard key={task.id} task={task} onTaskUpdated={handleTaskUpdated} />
            ))}
            {tasksByStatus.todo.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">No hay tareas por hacer</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              En progreso
              <Badge variant="secondary">{tasksByStatus["in-progress"].length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {tasksByStatus["in-progress"].map((task) => (
              <TaskCard key={task.id} task={task} onTaskUpdated={handleTaskUpdated} />
            ))}
            {tasksByStatus["in-progress"].length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">No hay tareas en progreso</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              Completadas
              <Badge variant="secondary">{tasksByStatus.completed.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {tasksByStatus.completed.map((task) => (
              <TaskCard key={task.id} task={task} onTaskUpdated={handleTaskUpdated} />
            ))}
            {tasksByStatus.completed.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">No hay tareas completadas</p>
            )}
          </CardContent>
        </Card>
      </div>

      <TaskDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} projectId={id} onTaskCreated={handleTaskCreated} />
    </div>
  )
}
