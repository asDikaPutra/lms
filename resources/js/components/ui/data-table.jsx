import { cn } from "@/lib/utils"

/**
 * DataTable — Reusable table wrapper with consistent styling.
 *
 * Usage:
 *   <DataTable minWidth="1000px">
 *     <DataTable.Header>
 *       <DataTable.HeaderCell>Nama</DataTable.HeaderCell>
 *       <DataTable.HeaderCell>Email</DataTable.HeaderCell>
 *     </DataTable.Header>
 *     <DataTable.Body>
 *       <DataTable.Row>
 *         <DataTable.Cell>John</DataTable.Cell>
 *         <DataTable.Cell>john@example.com</DataTable.Cell>
 *       </DataTable.Row>
 *     </DataTable.Body>
 *   </DataTable>
 */
function DataTableHeader({ className, children, ...props }) {
  return (
    <thead {...props}>
      <tr className={cn("border-b border-neutral-100 bg-neutral-50/50 dark:border-white/[0.07] dark:bg-white/5", className)}>
        {children}
      </tr>
    </thead>
  )
}

function DataTableHeaderCell({ className, children, ...props }) {
  return (
    <th
      className={cn(
        "text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-white/40",
        className
      )}
      {...props}
    >
      {children}
    </th>
  )
}

function DataTableBody({ className, children, ...props }) {
  return (
    <tbody className={cn("divide-y divide-neutral-100 dark:divide-white/[0.06]", className)} {...props}>
      {children}
    </tbody>
  )
}

function DataTableRow({ className, children, ...props }) {
  return (
    <tr
      className={cn(
        "transition-colors hover:bg-neutral-50/50 dark:hover:bg-white/5",
        className
      )}
      {...props}
    >
      {children}
    </tr>
  )
}

function DataTableCell({ className, children, ...props }) {
  return (
    <td className={cn("py-3 px-4", className)} {...props}>
      {children}
    </td>
  )
}

export const DataTable = {
  Header: DataTableHeader,
  HeaderCell: DataTableHeaderCell,
  Body: DataTableBody,
  Row: DataTableRow,
  Cell: DataTableCell,
}
