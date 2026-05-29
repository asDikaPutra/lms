import { cn } from "@/lib/utils"

/**
 * Form primitives — token-based, dark-mode aware, accessible.
 *
 *   <Input placeholder="Cari…" />
 *   <Textarea rows={4} />
 *   <Select><option/></Select>
 *   <Checkbox checked={...} onChange={...} /> <label/>
 *   <Switch checked={...} onChange={...} />
 *
 * All accept className and forward refs + native props.
 */

const fieldBase =
  "w-full rounded-lg border bg-surface px-3 py-2 text-sm text-content-primary " +
  "placeholder:text-content-muted outline-none transition-colors " +
  "border-line focus:border-brand focus:ring-2 focus:ring-brand/20 " +
  "disabled:cursor-not-allowed disabled:opacity-50 " +
  "aria-[invalid=true]:border-danger aria-[invalid=true]:focus:ring-danger/20"

export function Input({ className, type = "text", ref, ...props }) {
  return <input ref={ref} type={type} className={cn(fieldBase, "h-10", className)} {...props} />
}

export function Textarea({ className, ref, ...props }) {
  return <textarea ref={ref} className={cn(fieldBase, "resize-y min-h-[80px]", className)} {...props} />
}

export function Select({ className, children, ref, ...props }) {
  return (
    <select ref={ref} className={cn(fieldBase, "h-10 pr-8", className)} {...props}>
      {children}
    </select>
  )
}

export function Checkbox({ className, ref, ...props }) {
  return (
    <input
      ref={ref}
      type="checkbox"
      className={cn(
        "size-4 rounded border-line text-brand accent-brand",
        "focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:ring-offset-1",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export function Radio({ className, ref, ...props }) {
  return (
    <input
      ref={ref}
      type="radio"
      className={cn(
        "size-4 border-line text-brand accent-brand",
        "focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:ring-offset-1",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

/**
 * Switch — controlled toggle. Pass `checked` and `onCheckedChange` (or onChange).
 */
export function Switch({ checked = false, onCheckedChange, onChange, disabled, className, ...props }) {
  const handle = () => {
    if (disabled) return
    onCheckedChange?.(!checked)
    onChange?.({ target: { checked: !checked } })
  }
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={handle}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors outline-none",
        "focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        checked ? "bg-brand" : "bg-line-strong",
        className
      )}
      {...props}
    >
      <span
        className={cn(
          "inline-block size-4 transform rounded-full bg-white shadow transition-transform",
          checked ? "translate-x-6" : "translate-x-1"
        )}
      />
    </button>
  )
}
