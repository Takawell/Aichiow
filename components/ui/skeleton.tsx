import * as React from "react"
import { cn } from "@/utils/cn"

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl bg-gradient-to-r from-muted/40 via-muted/20 to-muted/40",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
