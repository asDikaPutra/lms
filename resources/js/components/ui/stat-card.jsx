import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

/**
 * StatCard — Reusable statistics card for dashboards.
 *
 * Usage:
 *   <StatCard label="Total Kuis" value={42} icon={HelpCircle} color="emerald" />
 *   <StatCard label="Progress" value={75} icon={TrendingUp} color="blue" suffix="%" />
 *
 * Colors: emerald | teal | blue | amber | red | purple | neutral | slate
 */

const colorMap = {
  emerald: "from-emerald-500 to-teal-500 shadow-emerald-500/25",
  teal:    "from-teal-500 to-cyan-500 shadow-teal-500/25",
  blue:    "from-blue-500 to-indigo-500 shadow-blue-500/25",
  amber:   "from-amber-500 to-orange-500 shadow-amber-500/25",
  red:     "from-red-500 to-rose-500 shadow-red-500/25",
  purple:  "from-purple-500 to-pink-500 shadow-purple-500/25",
  neutral: "from-neutral-400 to-neutral-500 shadow-neutral-400/25",
  slate:   "from-slate-400 via-slate-500 to-slate-600 shadow-slate-400/25",
  orange:  "from-orange-400 via-orange-500 to-amber-600 shadow-orange-500/25",
  sky:     "from-sky-400 via-sky-500 to-blue-500 shadow-sky-500/25",
  violet:  "from-violet-400 via-violet-500 to-purple-600 shadow-violet-500/25",
}

export function StatCard({
  label,
  value,
  icon: Icon,
  color = "emerald",
  suffix = "",
  className,
}) {
  const gradient = colorMap[color] ?? colorMap.emerald

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "rounded-xl border p-4 shadow-sm",
        "bg-white border-neutral-100",
        "dark:bg-[#111a15] dark:border-white/[0.07]",
        className
      )}
    >
      <div className="flex items-center gap-3">
        {Icon && (
          <div
            className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-xl",
              "bg-gradient-to-br shadow-lg text-white",
              gradient
            )}
          >
            <Icon className="size-5" aria-hidden="true" />
          </div>
        )}
        <div>
          <p className="text-2xl font-bold tabular-nums text-neutral-900 dark:text-white/90">
            {value}{suffix}
          </p>
          <p className="text-xs text-neutral-500 dark:text-white/40">{label}</p>
        </div>
      </div>
    </motion.div>
  )
}
