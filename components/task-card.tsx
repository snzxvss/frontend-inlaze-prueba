"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { TaskDialog } from "@/components/task-dialog"
import { CommentDialog } from "@/components/comment-dialog"
import { type Task, taskService } from "@/services/task-service"
import { projectService } from "@/services/project-service"
import { userService } from "@/services/user-service"
import { useToast } from "@/hooks/use-toast"
import { MoreHorizontal, Edit, Trash2, MessageSquare, Calendar, CheckCircle, Clock, AlertCircle } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface TaskCardProps {
  task: Task
  onTaskUpdated: () => void
  showProject?: boolean
}

export function TaskCard({ task, onTaskUpdated, showProject = false }: TaskCardProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isCommentDialogOpen, setIsCommentDialogOpen] = useState(false)
  const { toast } = useToast()

  const project = projectService.getById(task.projectId)
  const assignee = userService.getById(task.assigneeId)

  const handleStatusChange = async (newStatus: "todo" | "in-progress" | "completed") => {
    try {
      await taskService.update(task.id, { ...task, status: newStatus })
      toast({
        title: "Estado actualizado",
        description: `La tarea se marcó como ${getStatusLabel(newStatus)}`,
      })
      onTaskUpdated()
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async () => {
    if (confirm("¿Estás seguro de que quieres eliminar esta tarea?")) {
      try {
        await taskService.delete(task.id)
        toast({
          title: "Tarea eliminada",
          description: "La tarea se ha eliminado exitosamente",
        })
        onTaskUpdated()
      } catch (error) {
        toast({
          title: "Error",
          description: "No se pudo eliminar la tarea",
          variant: "destructive",
        })
      }
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "todo":
        return "por hacer"
      case "in-progress":
        return "en progreso"
      case "completed":
        return "completada"
      default:
        return status
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "todo":
        return <Clock className="h-3 w-3" />
      case "in-progress":
        return <AlertCircle className="h-3 w-3" />
      case "completed":
        return <CheckCircle className="h-3 w-3" />
      default:
        return null
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive"
      case "medium":
        return "default" // Esto usará el color primary (amarillo)
      case "low":
        return "secondary"
      default:
        return "default"
    }
  }

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "completed"

  return (
    <>
      <Card
        className={`hover:shadow-lg transition-all-smooth border-border hover:border-primary/20 ${isOverdue ? "border-destructive" : ""}`}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-sm font-medium line-clamp-2">{task.title}</CardTitle>
              {showProject && project && <CardDescription className="text-xs mt-1">{project.name}</CardDescription>}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsCommentDialogOpen(true)}>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Comentarios
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Eliminar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent className="pt-0 space-y-3">
          <p className="text-xs text-muted-foreground line-clamp-2">{task.description}</p>

          <div className="flex flex-wrap gap-1">
            <Badge variant="outline" className="text-xs flex items-center gap-1">
              {getStatusIcon(task.status)}
              {getStatusLabel(task.status)}
            </Badge>
            <Badge variant={getPriorityColor(task.priority)} className="text-xs">
              {task.priority}
            </Badge>
            {isOverdue && (
              <Badge variant="destructive" className="text-xs">
                Vencida
              </Badge>
            )}
          </div>

          {task.dueDate && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              {new Date(task.dueDate).toLocaleDateString()}
            </div>
          )}

          {assignee && (
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={assignee.avatar || "/placeholder.svg"} />
                <AvatarFallback className="text-xs">
                  {assignee.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-muted-foreground">{assignee.name}</span>
            </div>
          )}

          <div className="flex gap-1">
            {task.status !== "completed" && (
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-xs"
                onClick={() => handleStatusChange("completed")}
              >
                <CheckCircle className="mr-1 h-3 w-3" />
                Completar
              </Button>
            )}
            {task.status === "completed" && (
              <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => handleStatusChange("todo")}>
                <Clock className="mr-1 h-3 w-3" />
                Reabrir
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <TaskDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        task={task}
        onTaskUpdated={onTaskUpdated}
      />

      <CommentDialog open={isCommentDialogOpen} onOpenChange={setIsCommentDialogOpen} taskId={task.id} />
    </>
  )
}
