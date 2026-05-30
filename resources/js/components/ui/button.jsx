import { Slot } from "radix-ui"
import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button-variants"

/**
 * Button — Design System Component
 *
 * Variants:
 *   default   — primary green CTA (mint)
 *   primary   — alias for default
 *   secondary — light green tint
 *   outline   — transparent with border
 *   ghost     — no border, hover bg
 *   danger    — destructive red
 *   success   — emerald/teal
 *   warning   — amber
 *   link      — underline text
 *
 * Sizes:
 *   default   — h-12 px-6 text-base
 *   sm        — h-9 px-4 text-sm
 *   lg        — h-14 px-8 text-lg
 *   icon      — size-12 square
 *   icon-sm   — size-9 square
 *   icon-lg   — size-14 square
 *
 * Extra props:
 *   loading   — shows spinner, disables button
 *   asChild   — renders as child element (e.g. <Link>)
 */

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  loading = false,
  children,
  disabled,
  ...props
}) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      disabled={disabled || loading}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {loading && (
        <Loader2
          className="animate-spin"
          aria-hidden="true"
        />
      )}
      {children}
    </Comp>
  )
}

export { Button }
