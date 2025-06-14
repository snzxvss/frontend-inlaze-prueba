import { apiRequest, apiRequestNoResponse } from "./api"

export interface Task {
  id: string
  title: string
  description: string
  status: "todo" | "in-progress" | "completed"
  priority: "low" | "medium" | "high"
  projectId: string
  assigneeId: string
  dueDate: string
  createdAt: string
  updatedAt: string
}

class TaskService {
  async getAll(): Promise<Task[]> {
    return apiRequest<Task[]>("/tasks")
  }

  async getById(id: string): Promise<Task | undefined> {
    try {
      return await apiRequest<Task>(`/tasks/${id}`)
    } catch (error) {
      if (typeof error === "object" && error !== null && "message" in error && typeof (error as any).message === "string" && (error as any).message.includes("404")) {
        return undefined
      }
      throw error
    }
  }

  async getByProject(projectId: string): Promise<Task[]> {
    return apiRequest<Task[]>(`/tasks?projectId=${projectId}`)
  }

  async getByAssignee(assigneeId: string): Promise<Task[]> {
    return apiRequest<Task[]>(`/tasks?assigneeId=${assigneeId}`)
  }

  async getByStatus(status: "todo" | "in-progress" | "completed"): Promise<Task[]> {
    return apiRequest<Task[]>(`/tasks?status=${status}`)
  }

  async getByPriority(priority: "low" | "medium" | "high"): Promise<Task[]> {
    return apiRequest<Task[]>(`/tasks?priority=${priority}`)
  }

  async create(taskData: Omit<Task, "id" | "createdAt" | "updatedAt">): Promise<Task> {
    return apiRequest<Task>("/tasks", {
      method: "POST",
      body: JSON.stringify(taskData),
    })
  }

  async update(id: string, taskData: Partial<Task>): Promise<Task> {
    return apiRequest<Task>(`/tasks/${id}`, {
      method: "PATCH",
      body: JSON.stringify(taskData),
    })
  }

  async delete(id: string): Promise<void> {
    await apiRequestNoResponse(`/tasks/${id}`, {
      method: "DELETE",
    })
  }

  async search(query: string): Promise<Task[]> {
    return apiRequest<Task[]>(`/tasks?search=${encodeURIComponent(query)}`)
  }

  async filter(filters: {
    status?: "todo" | "in-progress" | "completed"
    priority?: "low" | "medium" | "high"
    projectId?: string
    assigneeId?: string
    overdue?: boolean
  }): Promise<Task[]> {
    const params = new URLSearchParams()

    if (filters.status) params.append("status", filters.status)
    if (filters.priority) params.append("priority", filters.priority)
    if (filters.projectId) params.append("projectId", filters.projectId)
    if (filters.assigneeId) params.append("assigneeId", filters.assigneeId)

    const queryString = params.toString()
    const tasks = await apiRequest<Task[]>(`/tasks${queryString ? `?${queryString}` : ""}`)

    // Filtrar overdue en el cliente ya que el backend no lo maneja
    if (filters.overdue) {
      return tasks.filter((task) => {
        const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "completed"
        return isOverdue
      })
    }

    return tasks
  }
}

export const taskService = new TaskService()
