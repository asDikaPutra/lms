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
        <label className="block text-sm font-medium text-content-primary">
          {label}
        </label>
      )}
      {description && !error && (
        <p className="text-xs text-content-muted">{description}</p>
      )}
      <input
        className={cn(
          "w-full rounded-lg border px-3 py-2 text-sm outline-none bg-surface text-content-primary",
          "border-line placeholder:text-content-muted focus:border-brand focus:ring-2 focus:ring-brand/20",
          error && "border-danger focus:border-danger focus:ring-danger/20",
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-xs text-danger">{error}</p>
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
        <label className="block text-sm font-medium text-content-primary">
          {label}
        </label>
      )}
      {description && !error && (
        <p className="text-xs text-content-muted">{description}</p>
      )}
      <textarea
        className={cn(
          "w-full rounded-lg border px-3 py-2 text-sm outline-none resize-y bg-surface text-content-primary",
          "border-line placeholder:text-content-muted focus:border-brand focus:ring-2 focus:ring-brand/20",
          error && "border-danger focus:border-danger focus:ring-danger/20",
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-xs text-danger">{error}</p>
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
        <label className="block text-sm font-medium text-content-primary">
          {label}
        </label>
      )}
      {description && !error && (
        <p className="text-xs text-content-muted">{description}</p>
      )}
      <select
        className={cn(
          "w-full rounded-lg border px-3 py-2 text-sm outline-none bg-surface text-content-primary",
          "border-line focus:border-brand focus:ring-2 focus:ring-brand/20",
          error && "border-danger focus:border-danger focus:ring-danger/20",
          className
        )}
        {...props}
      >
        {children}
      </select>
      {error && (
        <p className="text-xs text-danger">{error}</p>
      )}
    </div>
  )
}

/**
 * CheckboxField — Reusable checkbox with label.
 */
export function CheckboxField({ label, className, ...props }) {
  return (
    <label className={cn("flex items-center gap-2 text-sm cursor-pointer text-content-primary", className)}>
      <input
        type="checkbox"
        className="size-4 rounded border-line text-brand accent-brand focus:ring-brand/30"
        {...props}
      />
      {label}
    </label>
  )
}
