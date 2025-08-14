'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { CalendarDays, DollarSign, Plus, X, CheckCircle2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useRouter } from 'next/navigation'

export default function Page() {
  const today = new Date()
  const humanDate = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  const isoDate = today.toISOString().slice(0, 10)
  const totalSales = 0

  const [expenseAmount, setExpenseAmount] = useState('')
  const [expenseDescription, setExpenseDescription] = useState('')
  const [expenseSaved, setExpenseSaved] = useState(false)
  const router = useRouter()

  return (
    <div className="mx-auto max-w-sm p-4 space-y-4">

      {/* Today’s Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Today</CardTitle>
          <CardDescription className="text-xs">{humanDate} • {isoDate}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center text-sm">
              <CalendarDays className="mr-2 h-4 w-4" />
              Date
            </span>
            <span className="font-medium">{isoDate}</span>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center text-sm">
              <DollarSign className="mr-2 h-4 w-4" />
              Total Sales
            </span>
            <span className="text-xl font-bold">
              ₱{totalSales.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Expenses Card */}
      <Card className={expenseSaved ? 'border-green-500' : 'border-red-500'}>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Expenses</CardTitle>
          <CardDescription className="text-xs">
            {expenseSaved ? 'Expense Recorded' : 'Enter today’s expense'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {!expenseSaved ? (
            <>
              <Textarea
                placeholder="Description"
                value={expenseDescription}
                onChange={(e) => setExpenseDescription(e.target.value)}
              />
              <Input
                placeholder="Amount (₱)"
                type="number"
                value={expenseAmount}
                onChange={(e) => setExpenseAmount(e.target.value)}
              />
              <Button
                className="w-full"
                size="sm"
                onClick={() => {
                  if (expenseDescription && expenseAmount) {
                    setExpenseSaved(true)
                  }
                }}
              >
                <Plus className="mr-2 h-4 w-4" /> Add Expense
              </Button>
            </>
          ) : (
            <div className="space-y-2">
              <div>
                <p className="font-medium whitespace-pre-wrap break-words break-all">
                  {expenseDescription}
                </p>
                <p className="font-bold mt-1">
                  ₱{Number(expenseAmount).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setExpenseSaved(false)}
              >
                <X className="mr-2 h-4 w-4" /> Edit
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Validate Button for Whole Report */}
      <Button
        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        size="lg"
        onClick={() => router.push('/sales/validate')}
      >
        <CheckCircle2 className="mr-2 h-5 w-5" /> Validate Sales Report
      </Button>
    </div>
  )
}
