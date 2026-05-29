import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

/**
 * EmptyState — Reusable empty state for tables, lists, and grids.
 *
 * Usage:
 *   <EmptyState
 *     icon={HelpCircle}
 *     title="Belum Ada Kuis"
 *     description="Buat kuis pertama untuk menguji pemahaman mahasiswa."
 *     action={<Button onClick={onCreate}>Buat Kuis</Button>}
 *   />
 */
export function EmptyState({
  icon: Icon,
  iconColor = "emerald",
  title,
  description,
  action,
  className,
}) {
  const iconBg = {
    emerald: "from-emerald-100 to-teal-100 border-emerald-200 dark:from-emerald-500/20 dark:to-teal-500/20 dark:border-emerald-500/30",
    blue:    "from-blue-100 to-indigo-100 border-blue-200 dark:from-emerald-500/20 dark:to-indigo-500/20 dark:border-emerald-500/30",
    amber:   "from-amber-100 to-orange-100 border-amber-200 dark:from-amber-500/20 dark:to-orange-500/20 dark:border-amber-500/30",
    neutral: "from-neutral-100 to-neutral-200 border-neutral-200 dark:from-white/10 dark:to-white/5 dark:border-white/10",
  }
  const iconText = {
    emerald: "text-emerald-600 dark:text-emerald-400",
    blue:    "text-blue-600 dark:text-emerald-400",
    amber:   "text-amber-600 dark:text-amber-400",
    neutral: "text-neutral-400 dark:text-white/20",
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "rounded-xl border p-12 text-center shadow-sm",
        "bg-white border-neutral-100",
        "dark:bg-[#111a15] dark:border-white/[0.07]",
        className
      )}
    >
      {Icon && (
        <div className="flex justify-center mb-6">
          <div className={cn(
            "flex size-20 items-center justify-center rounded-2xl border bg-gradient-to-br",
            iconBg[iconColor] ?? iconBg.emerald
          )}>
            <Icon className={cn("size-10", iconText[iconColor] ?? iconText.emerald)} />
          </div>
        </div>
      )}
      {title && (
        <h3 className="text-xl font-bold mb-2 text-neutral-900 dark:text-white/90">
          {title}
        </h3>
      )}
      {description && (
        <p className="mb-6 max-w-md mx-auto text-sm text-neutral-600 dark:text-white/45">
          {description}
        </p>
      )}
      {action && <div className="flex justify-center">{action}</div>}
    </motion.div>
  )
}


