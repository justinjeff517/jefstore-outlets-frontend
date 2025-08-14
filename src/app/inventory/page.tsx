'use client'

import { Button } from '@/components/ui/button'
import { Plus, Pencil } from 'lucide-react'

type Row = {
  Product: string
  BeginningStock: number
  Sold: number
  EndingStock: number
  Unit: string
  Price: number
  submitted: boolean
}

const rows: Row[] = [
  { Product: 'EXAMPLEA_PCS_499_99', BeginningStock: 100, Sold: 30, EndingStock: 70, Unit: 'pcs', Price: 499.99, submitted: true },
  { Product: 'EXAMPLEB_KG_120_50', BeginningStock: 50, Sold: 20, EndingStock: 30, Unit: 'kg', Price: 120.50, submitted: false },
  { Product: 'SUPERWIDGET_BOX_29_99', BeginningStock: 200, Sold: 75, EndingStock: 125, Unit: 'box', Price: 29.99, submitted: true },
  { Product: 'MEGATOOL_SET_199_00', BeginningStock: 80, Sold: 10, EndingStock: 70, Unit: 'set', Price: 199.00, submitted: false },
]

export default function Page() {
  return (
    <div className="p-4 space-y-3 h-screen overflow-y-auto">
      {rows.map((r) => (
        <div
          key={r.Product}
          className={`rounded-xl border p-4 shadow-sm flex flex-col gap-3 ${
            r.submitted ? 'border-green-500' : 'border-red-500'
          }`}
        >
          {/* Product Name */}
          <div className="font-medium text-base break-words">{r.Product}</div>

          {/* Stock Info */}
          <div className="grid grid-cols-3 gap-2 text-sm">
            {[
              { label: 'Beginning', qty: r.BeginningStock },
              { label: 'Sold', qty: r.Sold },
              { label: 'Ending', qty: r.EndingStock },
            ].map(({ label, qty }) => (
              <div
                key={label}
                className="rounded-lg bg-muted p-2 text-center flex flex-col justify-center"
              >
                <div className="font-semibold">{qty.toLocaleString()} {r.Unit}</div>
                <div className="text-xs opacity-70">
                  {(qty * r.Price).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                </div>
              </div>
            ))}
          </div>

          {/* Action Button */}
          <Button
            variant={r.submitted ? 'secondary' : 'default'}
            className="w-full flex items-center gap-2"
          >
            {r.submitted ? <Pencil className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {r.submitted ? 'Change' : 'Add'}
          </Button>
        </div>
      ))}
    </div>
  )
}
