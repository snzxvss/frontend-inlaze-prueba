import { apiRequest, apiRequestNoResponse } from "./api"

export interface Comment {
  id: string
  taskId: string
  authorId: string
  content: string
  createdAt: string
  updatedAt: string
}

class CommentService {
  async getAll(): Promise<Comment[]> {
    return apiRequest<Comment[]>("/comments")
  }

  async getById(id: string): Promise<Comment | undefined> {
    try {
      return await apiRequest<Comment>(`/comments/${id}`)
    } catch (error) {
      if (typeof error === "object" && error !== null && "message" in error && typeof (error as any).message === "string" && (error as any).message.includes("404")) {
        return undefined
      }
      throw error
    }
  }

  async getByTask(taskId: string): Promise<Comment[]> {
    return apiRequest<Comment[]>(`/comments?taskId=${taskId}`)
  }

  async getByAuthor(authorId: string): Promise<Comment[]> {
    return apiRequest<Comment[]>(`/comments?authorId=${authorId}`)
  }

  async create(commentData: Omit<Comment, "id" | "createdAt" | "updatedAt">): Promise<Comment> {
    return apiRequest<Comment>("/comments", {
      method: "POST",
      body: JSON.stringify(commentData),
    })
  }

  async update(id: string, commentData: Partial<Comment>): Promise<Comment> {
    return apiRequest<Comment>(`/comments/${id}`, {
      method: "PATCH",
      body: JSON.stringify(commentData),
    })
  }

  async delete(id: string): Promise<void> {
    await apiRequestNoResponse(`/comments/${id}`, {
      method: "DELETE",
    })
  }

  async getRecentComments(limit = 10): Promise<Comment[]> {
    return apiRequest<Comment[]>(`/comments?recent=${limit}`)
  }
}

export const commentService = new CommentService()
