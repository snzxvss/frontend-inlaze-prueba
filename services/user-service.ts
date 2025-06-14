import { apiRequest, apiRequestNoResponse } from "./api"
import type { User } from "./auth-service"

class UserService {
  async getAll(): Promise<User[]> {
    return apiRequest<User[]>("/users")
  }

  async getById(id: string): Promise<User | undefined> {
    try {
      return await apiRequest<User>(`/users/${id}`)
    } catch (error) {
      if (typeof error === "object" && error !== null && "message" in error && typeof (error as any).message === "string" && (error as any).message.includes("404")) {
        return undefined
      }
      throw error
    }
  }

  async getByRole(role: "admin" | "member"): Promise<User[]> {
    return apiRequest<User[]>(`/users?role=${role}`)
  }

  async create(userData: Omit<User, "id" | "createdAt">): Promise<User> {
    return apiRequest<User>("/users", {
      method: "POST",
      body: JSON.stringify(userData),
    })
  }

  async update(id: string, userData: Partial<User>): Promise<User> {
    return apiRequest<User>(`/users/${id}`, {
      method: "PATCH",
      body: JSON.stringify(userData),
    })
  }

  async delete(id: string): Promise<void> {
    await apiRequestNoResponse(`/users/${id}`, {
      method: "DELETE",
    })
  }

  // Método para mantener compatibilidad con el código existente
  getUpdatedUsers(): Promise<User[]> {
    return this.getAll()
  }
}

export const userService = new UserService()
