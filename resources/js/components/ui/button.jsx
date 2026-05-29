import * as React from "react"
import { cva } from "class-variance-authority";
import { Slot } from "radix-ui"
import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

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
 *   default   — h-[48px] px-6 text-[16px]
 *   sm        — h-[36px] px-4 text-[14px]
 *   lg        — h-[56px] px-8 text-[18px]
 *   icon      — size-[48px] square
 *   icon-sm   — size-[36px] square
 *   icon-lg   — size-[56px] square
 *
 * Extra props:
 *   loading   — shows spinner, disables button
 *   asChild   — renders as child element (e.g. <Link>)
 */

const buttonVariants = cva(
  [
    "group/button inline-flex shrink-0 items-center justify-center gap-2",
    "rounded-pill border border-transparent bg-clip-padding",
    "font-semibold whitespace-nowrap",
    "transition-all duration-150 outline-none select-none",
    "active:scale-95",
    "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        // ── Primary / Default ──────────────────────────────────────────
        default:
          "bg-brand text-brand-foreground hover:bg-brand-hover shadow-none",
        primary:
          "bg-brand text-brand-foreground hover:bg-brand-hover shadow-none",

        // ── Secondary ─────────────────────────────────────────────────
        secondary:
          "bg-brand-subtle text-brand hover:bg-brand-subtle/70",

        // ── Outline ───────────────────────────────────────────────────
        outline:
          "border-line-strong bg-transparent text-content-primary hover:border-brand hover:text-brand",

        // ── Ghost ─────────────────────────────────────────────────────
        ghost:
          "text-content-primary hover:bg-surface-muted hover:text-brand",

        // ── Danger / Destructive ──────────────────────────────────────
        danger:
          "bg-danger text-danger-foreground hover:opacity-90 focus-visible:ring-danger",
        destructive:
          "bg-danger text-danger-foreground hover:opacity-90 focus-visible:ring-danger",

        // ── Success ───────────────────────────────────────────────────
        success:
          "bg-success text-success-foreground hover:opacity-90 focus-visible:ring-success",

        // ── Warning ───────────────────────────────────────────────────
        warning:
          "bg-warning text-warning-foreground hover:opacity-90 focus-visible:ring-warning",

        // ── Link ──────────────────────────────────────────────────────
        link:
          "text-brand underline-offset-4 hover:underline border-transparent",
      },

      size: {
        default:
          "h-[48px] px-6 text-[16px] [&_svg:not([class*='size-'])]:size-5",
        sm:
          "h-[36px] px-4 text-[14px] [&_svg:not([class*='size-'])]:size-4",
        lg:
          "h-[56px] px-8 text-[18px] [&_svg:not([class*='size-'])]:size-6",
        icon:
          "size-[48px] [&_svg:not([class*='size-'])]:size-5",
        "icon-sm":
          "size-[36px] [&_svg:not([class*='size-'])]:size-4",
        "icon-lg":
          "size-[56px] [&_svg:not([class*='size-'])]:size-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

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

export { Button, buttonVariants }
