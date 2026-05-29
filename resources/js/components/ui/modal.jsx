import { useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * Modal — Reusable dialog/modal overlay.
 *
 * Usage:
 *   <Modal open={isOpen} onClose={() => setIsOpen(false)} title="Judul">
 *     <p>Isi konten modal</p>
 *   </Modal>
 */
export function Modal({ open, onClose, title, children, className, maxWidth = "max-w-lg" }) {
  const handleKeyDown = useCallback((e) => {
    if (e.key === "Escape") onClose?.()
  }, [onClose])

  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "hidden"
      return () => {
        document.removeEventListener("keydown", handleKeyDown)
        document.body.style.overflow = ""
      }
    }
  }, [open, handleKeyDown])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px]"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.15 }}
            className={cn(
              "w-full rounded-xl shadow-xl ring-1 bg-surface-raised ring-line",
              maxWidth,
              className
            )}
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            {title && (
              <div className="flex items-center justify-between border-b px-5 py-4 border-line-subtle">
                <h3 className="text-lg font-semibold text-content-primary">
                  {title}
                </h3>
                <button
                  onClick={onClose}
                  className="rounded-full p-1 transition-colors text-content-muted hover:bg-surface-muted hover:text-content-primary"
                  aria-label="Tutup"
                >
                  <X className="size-5" />
                </button>
              </div>
            )}
            <div className="max-h-[75vh] overflow-y-auto p-5">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/**
 * ConfirmDialog — Reusable confirmation dialog with icon, title, description, and action buttons.
 *
 * Usage:
 *   <ConfirmDialog
 *     open={isOpen}
 *     onClose={() => setIsOpen(false)}
 *     onConfirm={handleDelete}
 *     title="Hapus Kursus"
 *     description="Apakah kamu yakin ingin menghapus kursus ini?"
 *     confirmLabel="Hapus"
 *     variant="danger"
 *     icon={Trash2}
 *   />
 */
export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Konfirmasi",
  cancelLabel = "Batal",
  variant = "danger",
  icon: Icon,
  loading = false,
}) {
  const colorMap = {
    danger: {
      iconBg: "bg-red-100 dark:bg-red-500/20",
      iconText: "text-red-600 dark:text-red-400",
      confirmBtn: "danger",
    },
    warning: {
      iconBg: "bg-amber-100 dark:bg-amber-500/20",
      iconText: "text-amber-600 dark:text-amber-400",
      confirmBtn: "warning",
    },
    info: {
      iconBg: "bg-blue-100 dark:bg-blue-500/20",
      iconText: "text-blue-600 dark:text-blue-400",
      confirmBtn: "default",
    },
    success: {
      iconBg: "bg-emerald-100 dark:bg-emerald-500/20",
      iconText: "text-emerald-600 dark:text-emerald-400",
      confirmBtn: "success",
    },
  }

  const colors = colorMap[variant] ?? colorMap.danger

  return (
    <Modal open={open} onClose={onClose} maxWidth="max-w-md">
      <div className="p-5">
        <div className="flex items-center gap-4 mb-4">
          {Icon && (
            <div className={cn("flex size-12 shrink-0 items-center justify-center rounded-full", colors.iconBg)}>
              <Icon className={cn("size-6", colors.iconText)} />
            </div>
          )}
          <div>
            <h3 className="text-lg font-semibold text-content-primary">{title}</h3>
            {description && (
              <p className="text-sm text-content-secondary">{description}</p>
            )}
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-4 border-t border-line-subtle">
          <button
            onClick={onClose}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-pill border bg-clip-padding px-6 py-3 text-[16px] font-semibold whitespace-nowrap transition-all duration-150 outline-none select-none border-line-strong bg-transparent text-content-primary hover:bg-surface-muted disabled:pointer-events-none disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={cn(
              "inline-flex items-center justify-center gap-2 rounded-pill border border-transparent bg-clip-padding px-6 py-3 text-[16px] font-semibold whitespace-nowrap transition-all duration-150 outline-none select-none disabled:pointer-events-none disabled:opacity-50",
              variant === "danger" && "bg-danger text-danger-foreground hover:opacity-90",
              variant === "warning" && "bg-warning text-warning-foreground hover:opacity-90",
              variant === "info" && "bg-brand text-brand-foreground hover:bg-brand-hover",
              variant === "success" && "bg-success text-success-foreground hover:opacity-90"
            )}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  )
}
