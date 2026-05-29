import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * Tooltip — lightweight CSS hover/focus tooltip (no portal, no deps).
 *
 *   <Tooltip label="Hapus"><button>…</button></Tooltip>
 *
 * Sides: top | bottom | left | right
 */
const sideMap = {
  top:    "bottom-full left-1/2 -translate-x-1/2 mb-2",
  bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
  left:   "right-full top-1/2 -translate-y-1/2 mr-2",
  right:  "left-full top-1/2 -translate-y-1/2 ml-2",
}

export function Tooltip({ label, side = "top", className, children }) {
  return (
    <span className="group/tooltip relative inline-flex">
      {children}
      <span
        role="tooltip"
        className={cn(
          "pointer-events-none absolute z-50 whitespace-nowrap rounded-md px-2 py-1 text-xs font-medium",
          "bg-surface-overlay text-content-primary border border-line shadow-md",
          "opacity-0 transition-opacity duration-150 group-hover/tooltip:opacity-100 group-focus-within/tooltip:opacity-100",
          sideMap[side] ?? sideMap.top,
          className
        )}
      >
        {label}
      </span>
    </span>
  )
}
