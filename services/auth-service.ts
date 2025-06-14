import { apiRequest } from "./api"

export interface User {
  id: string
  name: string
  email: string
  role: "admin" | "member"
  avatar?: string
  createdAt: string
}

interface AuthResponse {
  user: User
  access_token: string
  expires_in: number
}

class AuthService {
  async login(email: string, password: string): Promise<User> {
    const response = await apiRequest<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })

    // Guardar token en localStorage
    localStorage.setItem("authToken", response.access_token)
    localStorage.setItem("currentUser", JSON.stringify(response.user))

    return response.user
  }

  logout(): void {
    localStorage.removeItem("authToken")
    localStorage.removeItem("currentUser")
  }

  getCurrentUser(): User | null {
    if (typeof window === "undefined") return null

    const userStr = localStorage.getItem("currentUser")
    if (!userStr) return null

    try {
      return JSON.parse(userStr)
    } catch {
      return null
    }
  }

  async getAllUsers(): Promise<User[]> {
    return apiRequest<User[]>("/auth/users", {
      method: "POST",
    })
  }

  async getProfile(): Promise<User> {
    const response = await apiRequest<{ user: User }>("/auth/profile", {
      method: "POST",
    })
    return response.user
  }
}

export const authService = new AuthService()
