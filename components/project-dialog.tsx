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
import { projectService } from "@/services/project-service"
import { useToast } from "@/hooks/use-toast"

interface ProjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onProjectCreated: () => void
}

export function ProjectDialog({ open, onOpenChange, onProjectCreated }: ProjectDialogProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [status, setStatus] = useState<"active" | "inactive">("active")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await projectService.create({
        name,
        description,
        status,
      })

      toast({
        title: "Proyecto creado",
        description: "El proyecto se ha creado exitosamente",
      })

      setName("")
      setDescription("")
      setStatus("active")
      onProjectCreated()
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo crear el proyecto",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[380px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Proyecto</DialogTitle>
          <DialogDescription>Completa la información para crear un nuevo proyecto.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-3 py-3">
            <div className="grid gap-1">
              <Label htmlFor="name" className="text-sm">
                Nombre del proyecto
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ingresa el nombre del proyecto"
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
                placeholder="Describe el proyecto"
                className="min-h-[60px] resize-none"
                required
              />
            </div>
            <div className="grid gap-1">
              <Label htmlFor="status" className="text-sm">
                Estado
              </Label>
              <Select value={status} onValueChange={(value: "active" | "inactive") => setStatus(value)}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Selecciona el estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Activo</SelectItem>
                  <SelectItem value="inactive">Inactivo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creando..." : "Crear Proyecto"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
