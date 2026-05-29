import { cn } from "@/lib/utils"

/**
 * Card — Design System Component
 *
 * Variants:
 *   default   — standard white card with border + shadow
 *   flat      — no shadow, border only
 *   elevated  — stronger shadow, backdrop-blur (dashboard panels)
 *   ghost     — transparent bg, dashed border (empty states)
 *   tinted    — colored tint bg (alerts, callouts)
 *
 * Usage:
 *   <Card>
 *     <CardHeader>
 *       <CardTitle>Title</CardTitle>
 *       <CardDescription>Subtitle</CardDescription>
 *     </CardHeader>
 *     <CardContent>...</CardContent>
 *     <CardFooter>...</CardFooter>
 *   </Card>
 */

const cardVariants = {
  default:
    "bg-surface border border-line-subtle shadow-sm",
  flat:
    "bg-surface border border-line",
  outlined:
    "bg-surface border border-line",
  elevated:
    "bg-surface-raised border border-line-subtle shadow-lg backdrop-blur-xl",
  interactive:
    "bg-surface border border-line-subtle shadow-sm transition-all hover:shadow-md hover:border-line cursor-pointer",
  compact:
    "bg-surface border border-line-subtle",
  gradient:
    "bg-gradient-to-br from-surface to-surface-muted border border-line-subtle shadow-sm",
  ghost:
    "bg-surface/60 border-2 border-dashed border-line backdrop-blur-sm",
  tinted:
    "bg-surface-muted border border-line-subtle",
}

function Card({ className, variant = "default", ref, ...props }) {
  return (
    <div
      ref={ref}
      data-slot="card"
      className={cn(
        "rounded-xl text-content-primary",
        cardVariants[variant],
        className
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ref, ...props }) {
  return (
    <div
      ref={ref}
      data-slot="card-header"
      className={cn("flex flex-col gap-1.5 p-5 pb-0", className)}
      {...props}
    />
  )
}

function CardTitle({ className, ref, ...props }) {
  return (
    <h3
      ref={ref}
      data-slot="card-title"
      className={cn(
        "text-base font-semibold leading-snug tracking-tight text-content-primary",
        className
      )}
      {...props}
    />
  )
}

function CardDescription({ className, ref, ...props }) {
  return (
    <p
      ref={ref}
      data-slot="card-description"
      className={cn("text-sm text-content-secondary", className)}
      {...props}
    />
  )
}

function CardContent({ className, ref, ...props }) {
  return (
    <div
      ref={ref}
      data-slot="card-content"
      className={cn("p-5 pt-4", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ref, ...props }) {
  return (
    <div
      ref={ref}
      data-slot="card-footer"
      className={cn("flex items-center gap-3 p-5 pt-0", className)}
      {...props}
    />
  )
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }
