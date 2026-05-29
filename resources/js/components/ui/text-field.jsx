import { cn } from "@/lib/utils"

/**
 * TextField — Reusable text input with label, description, and error.
 *
 * Usage:
 *   <TextField label="Nama" placeholder="Masukkan nama" />
 *   <TextField label="Email" type="email" error="Email wajib diisi" />
 *   <TextField label="Deskripsi" description="Tulis deskripsi singkat" />
 */
export function TextField({
  label,
  description,
  error,
  className,
  containerClassName,
  ...props
}) {
  return (
    <div className={cn("space-y-1.5", containerClassName)}>
      {label && (
        <label className="block text-sm font-medium text-neutral-700 dark:text-white/70">
          {label}
        </label>
      )}
      {description && !error && (
        <p className="text-xs text-neutral-500 dark:text-white/35">{description}</p>
      )}
      <input
        className={cn(
          "w-full rounded-lg border px-3 py-2 text-sm outline-none",
          "border-neutral-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20",
          "dark:border-white/15 dark:bg-white/8 dark:text-white/90 dark:placeholder:text-white/25",
          "dark:focus:border-emerald-500/60",
          error && "border-red-400 focus:border-red-500 focus:ring-red-500/20 dark:border-red-500/50",
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  )
}

/**
 * TextArea — Reusable textarea with label, description, and error.
 */
export function TextArea({
  label,
  description,
  error,
  className,
  containerClassName,
  ...props
}) {
  return (
    <div className={cn("space-y-1.5", containerClassName)}>
      {label && (
        <label className="block text-sm font-medium text-neutral-700 dark:text-white/70">
          {label}
        </label>
      )}
      {description && !error && (
        <p className="text-xs text-neutral-500 dark:text-white/35">{description}</p>
      )}
      <textarea
        className={cn(
          "w-full rounded-lg border px-3 py-2 text-sm outline-none resize-y",
          "border-neutral-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20",
          "dark:border-white/15 dark:bg-white/8 dark:text-white/90 dark:placeholder:text-white/25",
          "dark:focus:border-emerald-500/60",
          error && "border-red-400 focus:border-red-500 focus:ring-red-500/20 dark:border-red-500/50",
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  )
}

/**
 * SelectField — Reusable select with label, description, and error.
 */
export function SelectField({
  label,
  description,
  error,
  children,
  className,
  containerClassName,
  ...props
}) {
  return (
    <div className={cn("space-y-1.5", containerClassName)}>
      {label && (
        <label className="block text-sm font-medium text-neutral-700 dark:text-white/70">
          {label}
        </label>
      )}
      {description && !error && (
        <p className="text-xs text-neutral-500 dark:text-white/35">{description}</p>
      )}
      <select
        className={cn(
          "w-full rounded-lg border px-3 py-2 text-sm outline-none",
          "border-neutral-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20",
          "dark:border-white/15 dark:bg-white/8 dark:text-white/90",
          "dark:focus:border-emerald-500/60",
          error && "border-red-400 focus:border-red-500 focus:ring-red-500/20 dark:border-red-500/50",
          className
        )}
        {...props}
      >
        {children}
      </select>
      {error && (
        <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  )
}

/**
 * CheckboxField — Reusable checkbox with label.
 */
export function CheckboxField({ label, className, ...props }) {
  return (
    <label className={cn("flex items-center gap-2 text-sm cursor-pointer text-neutral-700 dark:text-white/60", className)}>
      <input
        type="checkbox"
        className="size-4 rounded border-neutral-300 text-emerald-600 focus:ring-emerald-500"
        {...props}
      />
      {label}
    </label>
  )
}
