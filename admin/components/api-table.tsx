  
import { useState } from 'react'
import { ApiArray, ApiArrayItem, TableProps } from '../interfaces/reconcilliation'

const TableHeaders = (tableHeaders: TableProps) => {
  const topKeys = tableHeaders.tableProps.keys()

  const tHeads =
    <thead>
      <tr>
        <th>Id</th>
        <th>Name</th>
        <th>Discount</th>
        <th>Expires</th>
        <th>Source</th>
        <th>Match?</th>
      </tr>
    </thead>
  
  return (
      tHeads
    )
}

const TableBody = (tableHeaders: TableProps) => {

    const tBody = (
        <tbody>
            {
                tableHeaders.tableProps.map(row => 
                    <TRow {...row}></TRow>
                )
            }
        </tbody>
    )
    return (
        tBody
    )
}

const TRow = (tableRow: ApiArray) => {
    // const [discounts, setDiscounts] = useState<Array<string | null>>([])
    // discounts.length = 0
    const tableRowOutput = 
        <>
        {
        tableRow.items.map((item, i) =>
                // setDiscounts(discounts => [...discounts, item.Discount]),
            <tr key={i}>
                {i == 0?<td rowSpan={2}>{tableRow.Id}</td> : null}
                <td>{item.Name}</td>
                <td>{item.Discount}</td>
                <td>{item.Expires}</td>
                <td>{item.Source}</td>
                {/* <td>{discounts.every(item.Discount === (item[0].Discount))}</td> */}
            </tr>
        )
}
    </>
    return (
        // console.log(discounts),
        tableRowOutput
    )
}

export default function ApiTable(tableProps: TableProps) {
  return (
    // console.log(tableProps.tableProps),
    <table>
      <TableHeaders tableProps={tableProps.tableProps}></TableHeaders>
      <TableBody tableProps={tableProps.tableProps}></TableBody>
    </table>
  )
}
