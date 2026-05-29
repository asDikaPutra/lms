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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-[2px]"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.15 }}
            className={cn(
              "w-full rounded-xl shadow-xl ring-1 bg-white ring-black/5 dark:bg-[#111a15] dark:ring-white/10",
              maxWidth,
              className
            )}
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            {title && (
              <div className="flex items-center justify-between border-b px-5 py-4 border-neutral-200 dark:border-white/[0.07]">
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white/90">
                  {title}
                </h3>
                <button
                  onClick={onClose}
                  className="rounded-full p-1 transition-colors text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 dark:text-white/40 dark:hover:bg-white/8 dark:hover:text-white/70"
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
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white/90">{title}</h3>
            {description && (
              <p className="text-sm text-neutral-500 dark:text-white/45">{description}</p>
            )}
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200 dark:border-white/[0.07]">
          <button
            onClick={onClose}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-pill border border-transparent bg-clip-padding px-6 py-3 text-[16px] font-semibold whitespace-nowrap transition-all duration-150 outline-none select-none border-neutral-200 bg-transparent text-neutral-700 hover:bg-neutral-50 dark:border-white/25 dark:text-white/70 dark:hover:bg-white/8 disabled:pointer-events-none disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={cn(
              "inline-flex items-center justify-center gap-2 rounded-pill border border-transparent bg-clip-padding px-6 py-3 text-[16px] font-semibold whitespace-nowrap transition-all duration-150 outline-none select-none text-white disabled:pointer-events-none disabled:opacity-50",
              variant === "danger" && "bg-red-500 hover:bg-red-600",
              variant === "warning" && "bg-amber-500 hover:bg-amber-600",
              variant === "info" && "bg-emerald-600 hover:bg-emerald-700",
              variant === "success" && "bg-emerald-600 hover:bg-emerald-700"
            )}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  )
}
