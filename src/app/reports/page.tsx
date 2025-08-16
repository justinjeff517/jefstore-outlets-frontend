'use client'

import { useRouter } from 'next/navigation'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export default function Page() {
  const router = useRouter()

  const reports = [
    { date: '2025-08-15', employees: ['John Doe', 'Maria Lee'], sales: { egg: 120, bread: 80 } },
    { date: '2025-08-14', employees: ['Jane Smith', 'Carlos Cruz'], sales: { egg: 90, bread: 110 } },
    { date: '2025-08-13', employees: ['Alex Tan', 'Sophia Reyes'], sales: { egg: 150, bread: 95 } },
  ]

  const formatHumanDate = (dateString: string) => {
    const date = new Date(dateString)
    const month = date.toLocaleString('en-US', { month: 'short' }) + '.'
    const day = date.getDate()
    const year = date.getFullYear()
    return `${month} ${day}, ${year}`
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Employees</TableHead>
            <TableHead>Sales</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reports.map((r, i) => (
            <TableRow
              key={i}
              role="link"
              tabIndex={0}
              onClick={() => router.push(`/reports/${r.date}`)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  router.push(`/reports/${r.date}`)
                }
              }}
              className="cursor-pointer hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
            >
              <TableCell>
                <div className="font-medium">{r.date}</div>
                <div className="text-xs text-muted-foreground">
                  {formatHumanDate(r.date)}
                </div>
              </TableCell>
              <TableCell>
                {r.employees.map((emp, idx) => (
                  <div key={idx}>{emp}</div>
                ))}
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  Egg: {r.sales.egg.toLocaleString()} <br />
                  Bread: {r.sales.bread.toLocaleString()}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
