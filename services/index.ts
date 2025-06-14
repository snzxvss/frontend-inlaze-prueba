// Exportar todos los services para fácil importación
export { authService } from "./auth-service"
export { projectService } from "./project-service"
export { taskService } from "./task-service"
export { userService } from "./user-service"
export { commentService } from "./comment-service"
export { notificationService } from "./notification-service"

// Exportar tipos
export type { User } from "./auth-service"
export type { Project } from "./project-service"
export type { Task } from "./task-service"
export type { Comment } from "./comment-service"
export type { Notification } from "./notification-service"
