import { cn } from "@/lib/utils"

/**
 * PageHeader — top-of-page title block with optional description and actions.
 *
 *   <PageHeader
 *     title="Kursus"
 *     description="Kelola semua kursus kamu"
 *     actions={<Button>Buat Kursus</Button>}
 *   />
 */
export function PageHeader({ title, description, icon: Icon, actions, className, children }) {
  return (
    <div className={cn("mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between", className)}>
      <div className="min-w-0">
        <h1 className="flex items-center gap-2.5 text-2xl font-bold tracking-tight text-content-primary">
          {Icon && <Icon className="size-6 text-brand" aria-hidden="true" />}
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-sm text-content-secondary">{description}</p>
        )}
        {children}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  )
}
