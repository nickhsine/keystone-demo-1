import { useState, useReducer } from 'react'
import {
    ColumnDef,
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
  } from '@tanstack/react-table'

  interface tableData {
    Name: string,
    Percentage: string,
    Expires: string
  }

  const columnHelper = createColumnHelper<tableData>()

  const columns = [
    columnHelper.accessor('Name', {
        header: () => 'Name', 
        cell: info => info.getValue(),
        footer: info => info.column.id,
    }),
    columnHelper.accessor('Percentage', {
        header: () => 'Percentage',
        cell: info => info.renderValue(),
        footer: info => info.column.id,
    }),
    columnHelper.accessor('Expires', {
      header: () => "Expires",
      footer: info => info.column.id,
    }),
  ]

  export default function ApiTable({tableProps}) {
    // const [data, setData] = useState(() => [...apiData])
    // const rerender = useReducer(() => ({}), {})[1]
  
    const table = useReactTable({
        tableProps,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })
  
    return (
      <div className="p-2">
        <table>
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          <tfoot>
            {table.getFooterGroups().map(footerGroup => (
              <tr key={footerGroup.id}>
                {footerGroup.headers.map(header => (
                  <th key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.footer,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </tfoot>
        </table>
        <div className="h-4" />
        <button onClick={() => rerender()} className="border p-2">
          Rerender
        </button>
      </div>
    )
  }