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
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { taskService, type Task } from "@/services/task-service"
import { projectService } from "@/services/project-service"
import { userService } from "@/services/user-service"
import { useToast } from "@/hooks/use-toast"

interface TaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onTaskCreated?: () => void
  onTaskUpdated?: () => void
  projectId?: string
  task?: Task
}

export function TaskDialog({ open, onOpenChange, onTaskCreated, onTaskUpdated, projectId, task }: TaskDialogProps) {
  const [title, setTitle] = useState(task?.title || "")
  const [description, setDescription] = useState(task?.description || "")
  const [status, setStatus] = useState<"todo" | "in-progress" | "completed">(task?.status || "todo")
  const [priority, setPriority] = useState<"low" | "medium" | "high">(task?.priority || "medium")
  const [selectedProjectId, setSelectedProjectId] = useState(task?.projectId || projectId || "")
  const [assigneeId, setAssigneeId] = useState(task?.assigneeId || "")
  const [dueDate, setDueDate] = useState(task?.dueDate || "")
  const [loading, setLoading] = useState(false)

  const { toast } = useToast()
  const projects = projectService.getAll()
  const users = userService.getAll()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (task) {
        await taskService.update(task.id, {
          title,
          description,
          status,
          priority,
          projectId: selectedProjectId,
          assigneeId,
          dueDate,
        })
        toast({
          title: "Tarea actualizada",
          description: "La tarea se ha actualizado exitosamente",
        })
        onTaskUpdated?.()
      } else {
        await taskService.create({
          title,
          description,
          status,
          priority,
          projectId: selectedProjectId,
          assigneeId,
          dueDate,
        })
        toast({
          title: "Tarea creada",
          description: "La tarea se ha creado exitosamente",
        })
        onTaskCreated?.()
      }

      resetForm()
    } catch (error) {
      toast({
        title: "Error",
        description: `No se pudo ${task ? "actualizar" : "crear"} la tarea`,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    if (!task) {
      setTitle("")
      setDescription("")
      setStatus("todo")
      setPriority("medium")
      setAssigneeId("")
      setDueDate("")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{task ? "Editar Tarea" : "Crear Nueva Tarea"}</DialogTitle>
          <DialogDescription>
            {task ? "Modifica la información de la tarea." : "Completa la información para crear una nueva tarea."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-3 py-3">
            <div className="grid gap-1">
              <Label htmlFor="title" className="text-sm">
                Título
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Título de la tarea"
                className="h-9"
                required
              />
            </div>

            <div className="grid gap-1">
              <Label htmlFor="description" className="text-sm">
                Descripción
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe la tarea"
                className="min-h-[60px] resize-none"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1">
                <Label htmlFor="status" className="text-sm">
                  Estado
                </Label>
                <Select
                  value={status}
                  onValueChange={(value: "todo" | "in-progress" | "completed") => setStatus(value)}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">Por hacer</SelectItem>
                    <SelectItem value="in-progress">En progreso</SelectItem>
                    <SelectItem value="completed">Completada</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-1">
                <Label htmlFor="priority" className="text-sm">
                  Prioridad
                </Label>
                <Select value={priority} onValueChange={(value: "low" | "medium" | "high") => setPriority(value)}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Prioridad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Baja</SelectItem>
                    <SelectItem value="medium">Media</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-1">
              <Label htmlFor="project" className="text-sm">
                Proyecto
              </Label>
              <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Selecciona un proyecto" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-1">
              <Label htmlFor="assignee" className="text-sm">
                Asignado a
              </Label>
              <Select value={assigneeId} onValueChange={setAssigneeId}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Selecciona un usuario" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-1">
              <Label htmlFor="dueDate" className="text-sm">
                Fecha límite
              </Label>
              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="h-9"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (task ? "Actualizando..." : "Creando...") : task ? "Actualizar" : "Crear Tarea"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
