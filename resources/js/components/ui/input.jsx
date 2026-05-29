import * as React from "react"
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

export const Input = React.forwardRef(({ className, type = "text", ...props }, ref) => (
  <input ref={ref} type={type} className={cn(fieldBase, "h-10", className)} {...props} />
))
Input.displayName = "Input"

export const Textarea = React.forwardRef(({ className, ...props }, ref) => (
  <textarea ref={ref} className={cn(fieldBase, "resize-y min-h-[80px]", className)} {...props} />
))
Textarea.displayName = "Textarea"

export const Select = React.forwardRef(({ className, children, ...props }, ref) => (
  <select ref={ref} className={cn(fieldBase, "h-10 pr-8", className)} {...props}>
    {children}
  </select>
))
Select.displayName = "Select"

export const Checkbox = React.forwardRef(({ className, ...props }, ref) => (
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
))
Checkbox.displayName = "Checkbox"

export const Radio = React.forwardRef(({ className, ...props }, ref) => (
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
))
Radio.displayName = "Radio"

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
