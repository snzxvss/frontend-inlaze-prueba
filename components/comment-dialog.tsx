"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { commentService } from "@/services/comment-service"
import { userService } from "@/services/user-service"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"
import { Send } from "lucide-react"

interface CommentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  taskId: string
}

export function CommentDialog({ open, onOpenChange, taskId }: CommentDialogProps) {
  const [comments, setComments] = useState(commentService.getByTask(taskId))
  const [newComment, setNewComment] = useState("")
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || !user) return

    setLoading(true)
    try {
      await commentService.create({
        taskId,
        content: newComment,
        authorId: user.id,
      })

      setComments(commentService.getByTask(taskId))
      setNewComment("")

      toast({
        title: "Comentario agregado",
        description: "Tu comentario se ha agregado exitosamente",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo agregar el comentario",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Comentarios</DialogTitle>
          <DialogDescription>Discute detalles y actualizaciones de la tarea</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="max-h-60 overflow-y-auto space-y-3">
            {comments.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No hay comentarios aún</p>
            ) : (
              comments.map((comment) => {
                const author = userService.getById(comment.authorId)
                return (
                  <div key={comment.id} className="flex gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={author?.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="text-xs">
                        {author?.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{author?.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(comment.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm">{comment.content}</p>
                    </div>
                  </div>
                )
              })
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Escribe un comentario..."
              className="min-h-[80px]"
            />
            <div className="flex justify-end">
              <Button type="submit" disabled={loading || !newComment.trim()}>
                <Send className="mr-2 h-4 w-4" />
                {loading ? "Enviando..." : "Enviar"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
