import * as React from "react"
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
    "bg-white border border-neutral-100 shadow-sm dark:bg-[#111a15] dark:border-white/[0.07]",
  flat:
    "bg-white border border-neutral-200 dark:bg-[#111a15] dark:border-white/[0.07]",
  elevated:
    "bg-white/90 border border-neutral-200/60 shadow-xl backdrop-blur-xl dark:bg-[#111a15] dark:border-white/[0.07] dark:shadow-[0_2px_20px_rgba(0,0,0,0.4)]",
  ghost:
    "bg-white/60 border-2 border-dashed border-neutral-200 backdrop-blur-sm dark:bg-white/5 dark:border-white/10",
  tinted:
    "bg-neutral-50 border border-neutral-200 dark:bg-white/5 dark:border-white/[0.07]",
}

const Card = React.forwardRef(({
  className,
  variant = "default",
  ...props
}, ref) => (
  <div
    ref={ref}
    data-slot="card"
    className={cn(
      "rounded-xl text-card-foreground",
      cardVariants[variant],
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="card-header"
    className={cn("flex flex-col gap-1.5 p-5 pb-0", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    data-slot="card-title"
    className={cn(
      "text-base font-semibold leading-snug tracking-tight text-neutral-900 dark:text-white/90",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    data-slot="card-description"
    className={cn("text-sm text-neutral-500 dark:text-white/40", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="card-content"
    className={cn("p-5 pt-4", className)}
    {...props}
  />
))
CardContent.displayName = "CardContent"

export { Card, CardHeader, CardTitle, CardDescription, CardContent }
