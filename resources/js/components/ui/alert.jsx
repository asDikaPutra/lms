import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * Alert — inline status callout. Tones map to semantic status tokens.
 *
 *   <Alert tone="success" title="Tersimpan">Perubahan disimpan.</Alert>
 *   <Alert tone="danger">Terjadi kesalahan.</Alert>
 *
 * Tones: info | success | warning | danger | neutral
 */
const toneMap = {
  info:    "bg-info-subtle border-info/30 text-info",
  success: "bg-success-subtle border-success/30 text-success",
  warning: "bg-warning-subtle border-warning/30 text-warning",
  danger:  "bg-danger-subtle border-danger/30 text-danger",
  neutral: "bg-surface-muted border-line text-content-secondary",
}

export const Alert = React.forwardRef(({ tone = "info", title, icon: Icon, className, children, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn("flex gap-3 rounded-lg border px-4 py-3 text-sm", toneMap[tone] ?? toneMap.info, className)}
    {...props}
  >
    {Icon && <Icon className="size-4 mt-0.5 shrink-0" aria-hidden="true" />}
    <div className="min-w-0">
      {title && <p className="font-semibold">{title}</p>}
      {children && <div className={cn(title && "mt-0.5", "text-current/90")}>{children}</div>}
    </div>
  </div>
))
Alert.displayName = "Alert"
