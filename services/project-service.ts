import { apiRequest, apiRequestNoResponse } from "./api"

export interface Project {
  id: string
  name: string
  description: string
  status: "active" | "inactive"
  createdAt: string
  updatedAt: string
}

class ProjectService {
  async getAll(): Promise<Project[]> {
    return apiRequest<Project[]>("/projects")
  }

  async getById(id: string): Promise<Project | undefined> {
    try {
      return await apiRequest<Project>(`/projects/${id}`)
    } catch (error) {
      if (typeof error === "object" && error !== null && "message" in error && typeof (error as any).message === "string" && (error as any).message.includes("404")) {
        return undefined
      }
      throw error
    }
  }

  async getByStatus(status: "active" | "inactive"): Promise<Project[]> {
    return apiRequest<Project[]>(`/projects?status=${status}`)
  }

  async create(projectData: Omit<Project, "id" | "createdAt" | "updatedAt">): Promise<Project> {
    return apiRequest<Project>("/projects", {
      method: "POST",
      body: JSON.stringify(projectData),
    })
  }

  async update(id: string, projectData: Partial<Project>): Promise<Project> {
    return apiRequest<Project>(`/projects/${id}`, {
      method: "PATCH",
      body: JSON.stringify(projectData),
    })
  }

  async delete(id: string): Promise<void> {
    await apiRequestNoResponse(`/projects/${id}`, {
      method: "DELETE",
    })
  }

  async search(query: string): Promise<Project[]> {
    return apiRequest<Project[]>(`/projects?search=${encodeURIComponent(query)}`)
  }
}

export const projectService = new ProjectService()
