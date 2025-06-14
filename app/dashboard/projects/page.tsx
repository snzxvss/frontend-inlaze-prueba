"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ProjectDialog } from "@/components/project-dialog"
import { projectService } from "@/services/project-service"
import { taskService } from "@/services/task-service"
import { Plus, Search } from "lucide-react"
import Link from "next/link"

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    const fetchProjects = async () => {
      const resolvedProjects = await projectService.getAll()
      setProjects(resolvedProjects)
    }
    fetchProjects()
  }, [])

  const filteredProjects = Array.isArray(projects)
    ? projects.filter(
        (project) =>
          project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : []

  const handleProjectCreated = async () => {
    const resolvedProjects = await projectService.getAll()
    setProjects(resolvedProjects)
    setIsDialogOpen(false)
  }

  const getProjectTasksCount = async (projectId: string) => {
    const tasks = await taskService.getByProject(projectId)
    return tasks.length
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Proyectos</h1>
          <p className="text-muted-foreground">Gestiona todos tus proyectos y sus tareas asociadas</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Proyecto
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar proyectos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.map((project) => (
          <Link key={project.id} href={`/dashboard/projects/${project.id}`}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{project.name}</CardTitle>
                  <Badge variant={project.status === "active" ? "default" : "secondary"}>{project.status}</Badge>
                </div>
                <CardDescription>{project.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{getProjectTasksCount(project.id)} tareas</span>
                  <span>Creado: {new Date(project.createdAt).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No se encontraron proyectos</p>
        </div>
      )}

      <ProjectDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} onProjectCreated={handleProjectCreated} />
    </div>
  )
}
