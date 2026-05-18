import * as React from "react"
import { cva } from "class-variance-authority";
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-pill border border-transparent bg-clip-padding font-semibold whitespace-nowrap transition-all outline-none select-none active:scale-95 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-sb-accent text-white hover:bg-sb-green shadow-none",
        outline:
          "border-sb-text-soft bg-transparent text-sb-text-black hover:border-sb-green hover:text-sb-green",
        secondary:
          "bg-sb-light text-sb-green hover:bg-[#d9ede2]",
        ghost:
          "hover:bg-slate-100 hover:text-sb-green text-sb-text-black",
        destructive:
          "bg-red-500 text-white hover:bg-red-600",
        link: "text-sb-accent underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-[48px] px-6 text-[16px] gap-2 [&_svg:not([class*='size-'])]:size-5",
        sm: "h-[36px] px-4 text-[14px] gap-1.5 [&_svg:not([class*='size-'])]:size-4",
        lg: "h-[56px] px-8 text-[18px] gap-2 [&_svg:not([class*='size-'])]:size-6",
        icon: "size-[48px] [&_svg:not([class*='size-'])]:size-5",
        "icon-sm":
          "size-[36px] [&_svg:not([class*='size-'])]:size-4",
        "icon-lg": "size-[56px] [&_svg:not([class*='size-'])]:size-6",
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
  ...props
}) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props} />
  );
}

export { Button, buttonVariants }
