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
      <tr className={cn("border-b border-line-subtle bg-surface-muted", className)}>
        {children}
      </tr>
    </thead>
  )
}

function DataTableHeaderCell({ className, children, ...props }) {
  return (
    <th
      className={cn(
        "text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider text-content-muted",
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
    <tbody className={cn("divide-y divide-line-subtle", className)} {...props}>
      {children}
    </tbody>
  )
}

function DataTableRow({ className, children, ...props }) {
  return (
    <tr
      className={cn(
        "transition-colors hover:bg-surface-muted",
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
