'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, AlertTriangle, ArrowLeft, Send, CalendarDays, DollarSign } from 'lucide-react'

type Row = {
  Product: string
  BeginningStock: number
  Sold: number
  EndingStock: number
  Unit: string
  Price: number
  submitted: boolean
}

type Expense = {
  description: string
  amount: number
  saved: boolean
}

const fallbackRows: Row[] = [
  { Product: 'EXAMPLEA_PCS_499_99', BeginningStock: 100, Sold: 30, EndingStock: 70, Unit: 'pcs', Price: 499.99, submitted: true },
  { Product: 'EXAMPLEB_KG_120_50',  BeginningStock: 50,  Sold: 20, EndingStock: 30, Unit: 'kg',  Price: 120.50, submitted: false },
  { Product: 'SUPERWIDGET_BOX_29_99', BeginningStock: 200, Sold: 75, EndingStock: 125, Unit: 'box', Price: 29.99, submitted: true },
  { Product: 'MEGATOOL_SET_199_00',  BeginningStock: 80,  Sold: 10, EndingStock: 70, Unit: 'set', Price: 199.00, submitted: false },
]

const fallbackExpense: Expense = { description: '', amount: 0, saved: false }

// If you change nav height, update this number (h-14 = 56px)
const NAV_PX = 56
// Approx height of the submit bar; adjust if you change its content sizing
const BAR_PX = 112

export default function Page() {
  const router = useRouter()
  const [rows, setRows] = useState<Row[]>(fallbackRows)
  const [expense, setExpense] = useState<Expense>(fallbackExpense)

  useEffect(() => {
    try {
      const r = localStorage.getItem('rows')
      const e = localStorage.getItem('expense')
      if (r) setRows(JSON.parse(r))
      if (e) setExpense(JSON.parse(e))
    } catch {}
  }, [])

  const today = new Date()
  const humanDate = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  const isoDate = today.toISOString().slice(0, 10)

  const validations = useMemo(() => {
    return rows.map((r) => {
      const computedEnding = r.BeginningStock - r.Sold
      const checks = {
        arithmeticOK: computedEnding === r.EndingStock,
        nonNegative: r.BeginningStock >= 0 && r.Sold >= 0 && r.EndingStock >= 0,
        notOversold: r.Sold <= r.BeginningStock,
        hasMeta: !!r.Unit && Number.isFinite(r.Price),
      }
      const ok = Object.values(checks).every(Boolean)
      const issues: string[] = []
      if (!checks.arithmeticOK) issues.push(`Beginning − Sold should equal Ending (${r.BeginningStock} − ${r.Sold} = ${computedEnding}, not ${r.EndingStock})`)
      if (!checks.notOversold) issues.push('Sold cannot exceed Beginning')
      if (!checks.nonNegative) issues.push('Quantities must be non-negative')
      if (!checks.hasMeta) issues.push('Missing Unit or Price')
      return { product: r.Product, ok, issues, row: r, computedEnding }
    })
  }, [rows])

  const totals = useMemo(() => {
    const grossSales = rows.reduce((sum, r) => sum + r.Sold * r.Price, 0)
    const expenseTotal = expense.saved ? expense.amount : 0
    const netSales = grossSales - expenseTotal
    const okCount = validations.filter(v => v.ok).length
    const issueCount = validations.length - okCount
    return { grossSales, expenseTotal, netSales, okCount, issueCount }
  }, [rows, expense, validations])

  const canSubmit = validations.every(v => v.ok) && (!expense.saved || (expense.saved && expense.amount > 0 && !!expense.description))

  return (
    <div
      className="mx-auto max-w-sm p-4 space-y-4"
      style={{
        // make room for bottom submit bar + mobile nav + safe area
        paddingBottom: `calc(${BAR_PX}px + ${NAV_PX}px + env(safe-area-inset-bottom))`,
      }}
    >
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="gap-2">
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>
        <div className="text-right">
          <div className="text-xs flex items-center justify-end gap-1 opacity-80">
            <CalendarDays className="w-4 h-4" /> {humanDate}
          </div>
          <div className="text-[11px] opacity-60">{isoDate}</div>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Validation Summary</CardTitle>
          <CardDescription className="text-xs">Quick health check before submission</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              OK Items
            </span>
            <Badge variant="secondary">{totals.okCount}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              With Issues
            </span>
            <Badge variant="destructive">{totals.issueCount}</Badge>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Gross Sales
            </span>
            <span className="font-semibold">₱{totals.grossSales.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Expenses</span>
            <span className="font-semibold">₱{totals.expenseTotal.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Net Sales</span>
            <span className="font-bold">₱{totals.netSales.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Items Review</CardTitle>
          <CardDescription className="text-xs">Tap any card to fix issues in the previous page</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {validations.map(({ product, ok, issues, row, computedEnding }) => (
            <div
              key={product}
              className={`rounded-xl border p-3 text-sm ${ok ? 'border-green-500' : 'border-red-500'}`}
              onClick={() => router.back()}
              role="button"
            >
              <div className="flex items-center justify-between">
                <div className="font-medium break-words pr-2">{product}</div>
                <Badge variant={ok ? 'secondary' : 'destructive'} className="whitespace-nowrap">
                  {ok ? 'OK' : 'Issue'}
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-2">
                {[
                  { label: 'Beginning', qty: row.BeginningStock },
                  { label: 'Sold', qty: row.Sold },
                  { label: 'Ending', qty: row.EndingStock },
                ].map(({ label, qty }) => (
                  <div key={label} className="rounded-lg bg-muted p-2 text-center">
                    <div className="font-semibold">{qty.toLocaleString()} {row.Unit}</div>
                    <div className="text-xs opacity-70">₱{(qty * row.Price).toLocaleString('en-PH', { minimumFractionDigits: 2 })}</div>
                    <div className="text-[10px] opacity-60">{label}</div>
                  </div>
                ))}
              </div>

              {!ok && (
                <ul className="mt-2 list-disc pl-5 text-xs text-red-600 space-y-1">
                  {issues.map((msg, i) => <li key={i}>{msg}</li>)}
                  {row.BeginningStock - row.Sold !== row.EndingStock && (
                    <li className="text-xs text-amber-600">
                      Hint: Computed Ending should be {computedEnding}.
                    </li>
                  )}
                </ul>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className={expense.saved ? 'border-green-500' : 'border-muted'}>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Expenses</CardTitle>
          <CardDescription className="text-xs">
            {expense.saved ? 'Recorded' : 'No expense recorded'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {expense.saved ? (
            <>
              <div className="whitespace-pre-wrap break-words">{expense.description}</div>
              <div className="font-bold">
                ₱{expense.amount.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
              </div>
            </>
          ) : (
            <div className="opacity-60">Add an expense in the previous page if needed.</div>
          )}
        </CardContent>
      </Card>

      {/* Fixed submit bar — sits ABOVE the mobile bottom nav */}
      <div
        className="fixed inset-x-0 z-40 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
        style={{
          bottom: `calc(${NAV_PX}px + env(safe-area-inset-bottom))`,
        }}
      >
        <div className="mx-auto max-w-sm p-3 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="opacity-70">Net Sales</span>
            <span className="font-bold">₱{totals.netSales.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="opacity-70">Date</span>
            <span className="font-bold">{humanDate}</span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="w-1/3" onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Edit
            </Button>
            <Button className="w-2/3" disabled={!canSubmit} onClick={() => alert('Submitted!')}>
              <Send className="w-4 h-4 mr-2" /> Submit Report
            </Button>
          </div>
          {!canSubmit && (
            <div className="text-[11px] text-red-600">
              Resolve all item issues and ensure expense (if any) has description and amount.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
