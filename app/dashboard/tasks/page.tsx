"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TaskCard } from "@/components/task-card"
import { TaskDialog } from "@/components/task-dialog"
import { taskService } from "@/services/task-service"
import { projectService } from "@/services/project-service"
import { userService } from "@/services/user-service"
import { Plus, Search } from "lucide-react"

export default function TasksPage() {
  const [tasks, setTasks] = useState(taskService.getAll())
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [assigneeFilter, setAssigneeFilter] = useState<string>("all")
  const [projectFilter, setProjectFilter] = useState<string>("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const projects = projectService.getAll()
  const users = userService.getAll()

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || task.status === statusFilter
    const matchesAssignee = assigneeFilter === "all" || task.assigneeId === assigneeFilter
    const matchesProject = projectFilter === "all" || task.projectId === projectFilter

    return matchesSearch && matchesStatus && matchesAssignee && matchesProject
  })

  const handleTaskCreated = () => {
    setTasks(taskService.getAll())
    setIsDialogOpen(false)
  }

  const handleTaskUpdated = () => {
    setTasks(taskService.getAll())
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Todas las Tareas</h1>
          <p className="text-muted-foreground">Gestiona todas las tareas de todos los proyectos</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Tarea
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar tareas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="todo">Por hacer</SelectItem>
              <SelectItem value="in-progress">En progreso</SelectItem>
              <SelectItem value="completed">Completada</SelectItem>
            </SelectContent>
          </Select>

          <Select value="projectFilter" onValueChange={setProjectFilter}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="Proyecto" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="Asignado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {users.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredTasks.map((task) => (
          <TaskCard key={task.id} task={task} onTaskUpdated={handleTaskUpdated} showProject />
        ))}
      </div>

      {filteredTasks.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No se encontraron tareas</p>
        </div>
      )}

      <TaskDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} onTaskCreated={handleTaskCreated} />
    </div>
  )
}
