import { cn } from "@/lib/utils"

/**
 * Skeleton — loading placeholder block.
 *
 *   <Skeleton className="h-4 w-32" />
 *   <Skeleton className="size-10 rounded-full" />
 */
export function Skeleton({ className, ...props }) {
  return (
    <div
      aria-hidden="true"
      className={cn("animate-pulse rounded-md bg-surface-muted", className)}
      {...props}
    />
  )
}
