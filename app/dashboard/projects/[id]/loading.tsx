import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div className="flex-1 space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Filters skeleton */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Skeleton className="h-9 flex-1" />
        <Skeleton className="h-9 w-full sm:w-[160px]" />
      </div>

      {/* Kanban columns skeleton */}
      <div className="grid gap-6 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Skeleton className="w-3 h-3 rounded-full" />
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-8" />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {Array.from({ length: 2 }).map((_, j) => (
                <div key={j} className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-3/4" />
                  <div className="flex gap-1">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-12" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
