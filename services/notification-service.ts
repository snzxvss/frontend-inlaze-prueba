import { apiRequest, apiRequestNoResponse } from "./api"

export interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  read: boolean
  createdAt: string
  userId?: string
  actionUrl?: string
}

class NotificationService {
  async getAll(): Promise<Notification[]> {
    return apiRequest<Notification[]>("/notifications")
  }

  async getUnreadCount(): Promise<number> {
    return apiRequest<number>("/notifications/unread-count")
  }

  async getByUser(userId: string): Promise<Notification[]> {
    return apiRequest<Notification[]>(`/notifications?userId=${userId}`)
  }

  async markAsRead(id: string): Promise<void> {
    await apiRequestNoResponse(`/notifications/${id}/read`, {
      method: "PATCH",
    })
  }

  async markAllAsRead(): Promise<void> {
    await apiRequestNoResponse("/notifications/mark-all-read", {
      method: "PATCH",
    })
  }

  async delete(id: string): Promise<void> {
    await apiRequestNoResponse(`/notifications/${id}`, {
      method: "DELETE",
    })
  }

  async create(notification: Omit<Notification, "id" | "createdAt">): Promise<Notification> {
    return apiRequest<Notification>("/notifications", {
      method: "POST",
      body: JSON.stringify(notification),
    })
  }
}

export const notificationService = new NotificationService()
