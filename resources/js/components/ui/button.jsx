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
    "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-mint",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        // ── Primary / Default ──────────────────────────────────────────
        default:
          "bg-mint text-white hover:bg-forest shadow-none",
        primary:
          "bg-mint text-white hover:bg-forest shadow-none",

        // ── Secondary ─────────────────────────────────────────────────
        secondary:
          "bg-mint-light text-forest hover:bg-[#d9ede2] dark:bg-emerald-500/15 dark:text-emerald-400 dark:hover:bg-emerald-500/25",

        // ── Outline ───────────────────────────────────────────────────
        outline:
          "border-fg-secondary bg-transparent text-fg-primary hover:border-forest hover:text-forest dark:border-white/25 dark:text-white/70 dark:hover:border-emerald-400 dark:hover:text-emerald-400",

        // ── Ghost ─────────────────────────────────────────────────────
        ghost:
          "hover:bg-slate-100 hover:text-forest text-fg-primary dark:text-white/60 dark:hover:bg-white/8 dark:hover:text-emerald-400",

        // ── Danger / Destructive ──────────────────────────────────────
        danger:
          "bg-red-500 text-white hover:bg-red-600 focus-visible:ring-red-500",
        destructive:
          "bg-red-500 text-white hover:bg-red-600 focus-visible:ring-red-500",

        // ── Success ───────────────────────────────────────────────────
        success:
          "bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700 focus-visible:ring-emerald-500",

        // ── Warning ───────────────────────────────────────────────────
        warning:
          "bg-amber-500 text-white hover:bg-amber-600 focus-visible:ring-amber-500",

        // ── Link ──────────────────────────────────────────────────────
        link:
          "text-mint underline-offset-4 hover:underline border-transparent",
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
