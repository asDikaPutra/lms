import { Link } from "@inertiajs/react"
import { cn } from "@/lib/utils"

/**
 * SectionHeader — Reusable section header with title, description, and optional link.
 *
 * Usage:
 *   <SectionHeader
 *     title="Kursus Saya"
 *     description="Daftar kursus yang kamu ikuti"
 *     link={{ href: '/student/courses', label: 'Lihat semua' }}
 *   />
 */
export function SectionHeader({
  title,
  description,
  icon: Icon,
  link,
  className,
}) {
  return (
    <div className={cn("flex items-center justify-between mb-6", className)}>
      <div>
        <h2 className="text-xl font-bold flex items-center gap-2.5 text-neutral-900 dark:text-white/90">
          {Icon && <Icon className="size-5" />}
          {title}
        </h2>
        {description && (
          <p className="mt-1 text-xs text-neutral-500 dark:text-white/40">{description}</p>
        )}
      </div>
      {link && (
        <Link
          href={link.href}
          className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors"
        >
          {link.label ?? "Lihat semua"}
        </Link>
      )}
    </div>
  )
}
