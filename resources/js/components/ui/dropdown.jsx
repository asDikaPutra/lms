import { cn } from "@/lib/utils"

/**
 * DropdownItem — Reusable dropdown menu item.
 *
 * Usage:
 *   <DropdownItem icon={Pencil} onClick={handleEdit}>Edit</DropdownItem>
 *   <DropdownItem icon={Trash2} onClick={handleDelete} variant="danger">Hapus</DropdownItem>
 */
export function DropdownItem({
  icon: Icon,
  variant = "default",
  className,
  children,
  ...props
}) {
  const variantClasses = {
    default: "text-neutral-700 dark:text-white/70 hover:bg-neutral-50 dark:hover:bg-white/8",
    danger: "text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10",
  }

  return (
    <button
      className={cn(
        "flex w-full items-center gap-2 px-3 py-2 text-sm transition-colors rounded-lg",
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {Icon && <Icon className="size-4 shrink-0" />}
      {children}
    </button>
  )
}

/**
 * CloseButton — Reusable close/dismiss button.
 *
 * Usage:
 *   <CloseButton onClick={onClose} />
 */
export function CloseButton({ className, ...props }) {
  return (
    <button
      className={cn(
        "rounded-full p-1 transition-colors text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 dark:text-white/40 dark:hover:bg-white/8 dark:hover:text-white/70",
        className
      )}
      aria-label="Tutup"
      {...props}
    >
      <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
      </svg>
    </button>
  )
}
