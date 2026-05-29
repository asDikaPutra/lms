import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

/**
 * FilterButton — Tab-style toggle button for filter bars.
 *
 * Usage:
 *   <FilterButton active={filter === 'all'} onClick={() => setFilter('all')}>
 *     Semua
 *   </FilterButton>
 */
export function FilterButton({ active = false, className, children, ...props }) {
  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold transition-all",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        active
          ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/30"
          : [
              "border border-neutral-200 bg-white text-neutral-600",
              "hover:border-emerald-300 hover:text-emerald-700",
              "dark:border-white/10 dark:bg-white/8 dark:text-white/60",
              "dark:hover:border-emerald-500/40 dark:hover:bg-white/12 dark:hover:text-emerald-400",
            ],
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  )
}
