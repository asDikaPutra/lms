import { cn } from "@/lib/utils"

/**
 * Badge — Reusable status/pill badge.
 *
 * Usage:
 *   <Badge color="emerald">Aktif</Badge>
 *   <Badge color="amber" dot>Draft</Badge>
 *   <Badge color="red" dot={false}>Ditolak</Badge>
 *
 * Colors: emerald | teal | blue | amber | red | purple | neutral | sky
 */
const colorMap = {
  emerald: {
    base: "bg-emerald-100/60 border-emerald-200/60 text-emerald-700 dark:bg-emerald-500/15 dark:border-emerald-500/30 dark:text-emerald-400",
    dot: "bg-emerald-500 dark:bg-emerald-400",
  },
  teal: {
    base: "bg-teal-100/60 border-teal-200/60 text-teal-700 dark:bg-teal-500/15 dark:border-teal-500/30 dark:text-teal-400",
    dot: "bg-teal-500 dark:bg-teal-400",
  },
  blue: {
    base: "bg-blue-100/60 border-blue-200/60 text-blue-700 dark:bg-blue-500/15 dark:border-blue-500/30 dark:text-blue-400",
    dot: "bg-blue-500 dark:bg-blue-400",
  },
  amber: {
    base: "bg-amber-100/60 border-amber-200/60 text-amber-700 dark:bg-amber-500/15 dark:border-amber-500/30 dark:text-amber-400",
    dot: "bg-amber-500 dark:bg-amber-400",
  },
  red: {
    base: "bg-red-100/60 border-red-200/60 text-red-700 dark:bg-red-500/15 dark:border-red-500/30 dark:text-red-400",
    dot: "bg-red-500 dark:bg-red-400",
  },
  purple: {
    base: "bg-purple-100/60 border-purple-200/60 text-purple-700 dark:bg-purple-500/15 dark:border-purple-500/30 dark:text-purple-400",
    dot: "bg-purple-500 dark:bg-purple-400",
  },
  neutral: {
    base: "bg-neutral-100/60 border-neutral-200/60 text-neutral-700 dark:bg-white/10 dark:border-white/10 dark:text-white/60",
    dot: "bg-neutral-500 dark:bg-white/40",
  },
  sky: {
    base: "bg-sky-100/60 border-sky-200/60 text-sky-700 dark:bg-sky-500/15 dark:border-sky-500/30 dark:text-sky-400",
    dot: "bg-sky-500 dark:bg-sky-400",
  },
}

export function Badge({
  color = "emerald",
  dot = false,
  pulsing = false,
  size = "sm",
  className,
  children,
}) {
  const colors = colorMap[color] ?? colorMap.emerald

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-semibold backdrop-blur-sm",
        size === "xs" && "px-2 py-0.5 text-[10px] uppercase tracking-wider",
        size === "sm" && "px-2.5 py-1 text-[10px] uppercase tracking-wider",
        size === "md" && "px-3 py-1 text-xs",
        colors.base,
        className
      )}
    >
      {dot && (
        <span
          className={cn(
            "size-1.5 rounded-full",
            pulsing && "animate-pulse",
            colors.dot
          )}
        />
      )}
      {children}
    </span>
  )
}
