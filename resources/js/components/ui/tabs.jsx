import { cn } from "@/lib/utils"

/**
 * Tabs — Reusable tab navigation.
 *
 * Usage:
 *   <Tabs value={activeTab} onChange={setActiveTab}>
 *     <Tabs.List>
 *       <Tabs.Tab value="overview">Ringkasan</Tabs.Tab>
 *       <Tabs.Tab value="grades">Nilai</Tabs.Tab>
 *     </Tabs.List>
 *     <Tabs.Panel value="overview">...</Tabs.Panel>
 *     <Tabs.Panel value="grades">...</Tabs.Panel>
 *   </Tabs>
 */
function TabsList({ className, children, ...props }) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-xl border p-1",
        "border-neutral-200 bg-neutral-50/50 dark:border-white/[0.07] dark:bg-white/5",
        className
      )}
      role="tablist"
      {...props}
    >
      {children}
    </div>
  )
}

function TabsTab({ value, active, onClick, className, children, ...props }) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={() => onClick?.(value)}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold transition-all",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2",
        active
          ? "bg-white text-emerald-700 shadow-sm dark:bg-white/10 dark:text-emerald-400"
          : "text-neutral-500 hover:text-neutral-700 dark:text-white/40 dark:hover:text-white/60",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

function TabsPanel({ value, activeTab, className, children, ...props }) {
  if (value !== activeTab) return null
  return (
    <div role="tabpanel" className={cn("mt-4", className)} {...props}>
      {children}
    </div>
  )
}

export const Tabs = {
  List: TabsList,
  Tab: TabsTab,
  Panel: TabsPanel,
}
