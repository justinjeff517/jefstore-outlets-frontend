'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { CalendarDays, DollarSign, X, CheckCircle2, Pencil } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useRouter } from 'next/navigation'

export default function Page() {
  const today = new Date()
  const humanDate = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  const isoDate = today.toISOString().slice(0, 10)
  const totalSales = 0

  const [expenseAmount, setExpenseAmount] = useState('0')
  const [expenseDescription, setExpenseDescription] = useState('none')
  const [editMode, setEditMode] = useState(false)
  const router = useRouter()

  return (
    <div className="mx-auto max-w-sm p-4 space-y-4">

{/* Today’s Card */}
<Card>
  <CardHeader className="pb-2">
    <CardTitle className="text-base">Today</CardTitle>
    <CardDescription className="text-xs">
      <div className="flex flex-col">
        <span className="font-medium">
          {today.toLocaleDateString('en-US', {
            month: 'short',
            day: '2-digit',
            year: 'numeric',
          })}
        </span>
        <span className="text-[11px] opacity-70">{isoDate}</span>
      </div>
    </CardDescription>
  </CardHeader>
  <CardContent className="space-y-3">
    <div className="flex items-center justify-between">
      <span className="inline-flex items-center text-sm">
        <CalendarDays className="mr-2 h-4 w-4" />
        Date
      </span>
      <div className="text-right">
        <div className="font-medium">
          {today.toLocaleDateString('en-US', {
            month: 'short',
            day: '2-digit',
            year: 'numeric',
          })}
        </div>
        <div className="text-[11px] opacity-70">{isoDate}</div>
      </div>
    </div>
    <Separator />
    <div className="flex items-center justify-between">
      <span className="text-sm">Egg Sales</span>
      <span className="font-semibold">₱0.00</span>
    </div>
    <div className="flex items-center justify-between">
      <span className="text-sm">Bread Sales</span>
      <span className="font-semibold">₱0.00</span>
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
      <Card className={editMode ? 'border-red-500' : 'border-green-500'}>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Expenses</CardTitle>
          <CardDescription className="text-xs">
            {editMode ? 'Edit Expense' : 'Expense Recorded'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {editMode ? (
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
                onClick={() => setEditMode(false)}
              >
                Save
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
                onClick={() => setEditMode(true)}
              >
                <Pencil className="mr-2 h-4 w-4" /> Change
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
