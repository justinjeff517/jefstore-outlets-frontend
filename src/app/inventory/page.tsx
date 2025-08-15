'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Pencil } from 'lucide-react'

type Row = {
  Product: string
  BeginningStock: number
  Sold: number
  EndingStock: number
  Unit: string
  Price: number
  submitted: boolean
}

const initialRows: Row[] = [
  { Product: 'EXAMPLEA_PCS_499_99', BeginningStock: 100, Sold: 0, EndingStock: 100, Unit: 'pcs', Price: 499.99, submitted: true },
  { Product: 'EXAMPLEB_KG_120_50', BeginningStock: 50,  Sold: 0, EndingStock: 50,  Unit: 'kg',  Price: 120.5,  submitted: false },
  { Product: 'SUPERWIDGET_BOX_29_99', BeginningStock: 200, Sold: 0, EndingStock: 200, Unit: 'box', Price: 29.99,  submitted: true },
  { Product: 'MEGATOOL_SET_199_00',  BeginningStock: 80,  Sold: 0, EndingStock: 80,  Unit: 'set', Price: 199.0,  submitted: false },
]

export default function Page() {
  const [rows, setRows] = useState<Row[]>(initialRows)
  const [editing, setEditing] = useState<string | null>(null)
  const [draftSold, setDraftSold] = useState<number>(0)

  const currency = (v: number) =>
    `₱ ${v.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

  const startEdit = (product: string) => {
    const r = rows.find((x) => x.Product === product)
    if (!r) return
    setDraftSold(r.Sold)
    setEditing(product)
  }

  const cancelEdit = () => setEditing(null)

  const saveEdit = () => {
    if (!editing) return
    setRows((prev) =>
      prev.map((r) => {
        if (r.Product !== editing) return r
        const begin = r.BeginningStock
        const sold = Math.min(begin, Math.max(0, Math.floor(Number(draftSold))))
        const ending = Math.max(0, begin - sold)
        return { ...r, Sold: sold, EndingStock: ending, submitted: true }
      })
    )
    setEditing(null)
  }

  return (
    <div className="p-4 space-y-3 h-screen overflow-y-auto">
      {rows.map((r) => {
        const isEditing = editing === r.Product
        const begin = r.BeginningStock
        const soldLive = isEditing ? Math.min(begin, Math.max(0, Math.floor(Number(draftSold) || 0))) : r.Sold
        const endingLive = Math.max(0, begin - soldLive)
        const borderColor = isEditing ? 'border-red-500' : r.submitted ? 'border-green-500' : 'border-red-500'

        return (
          <div key={r.Product} className={`rounded-xl border p-4 shadow-sm flex flex-col gap-3 ${borderColor}`}>
            <div className="font-medium text-base break-words truncate" title={r.Product}>{r.Product}</div>

            {!isEditing && (
              <>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  {[{ label: 'Beginning', qty: r.BeginningStock },
                    { label: 'Sold', qty: r.Sold },
                    { label: 'Ending', qty: r.EndingStock }].map(({ label, qty }) => (
                    <div key={label} className="rounded-lg bg-muted p-2 text-center flex flex-col justify-center">
                      <div className="font-semibold">{qty.toLocaleString()} {r.Unit}</div>
                      <div className="text-xs opacity-70">{currency(qty * r.Price)}</div>
                    </div>
                  ))}
                </div>

                <Button onClick={() => startEdit(r.Product)} variant="secondary" className="w-full flex items-center gap-2">
                  <Pencil className="w-4 h-4" />
                  Change
                </Button>
              </>
            )}

            {isEditing && (
              <>
                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1">
                    <div className="text-xs opacity-70">Beginning ({r.Unit})</div>
                    <Input
                      type="number"
                      id="begin"
                      value={begin}
                      disabled
                      className="text-center border-gray-300 bg-gray-100 text-gray-800 disabled:opacity-100 focus:ring-2 focus:ring-blue-500"
                      aria-label="Start value (disabled)"
                      aria-describedby="begin-description"
                    />
                    <div className="text-[11px] text-right opacity-70">{currency(begin * r.Price)}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs opacity-70">Sold ({r.Unit})</div>
                    <Input
                      type="number"
                      value={draftSold}
                      onChange={(e) => setDraftSold(Number(e.target.value))}
                      className="text-center"
                    />
                    <div className="text-[11px] text-right opacity-70">{currency(soldLive * r.Price)}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs opacity-70">Ending ({r.Unit})</div>
                    <Input type="number" value={endingLive} disabled className="text-center disabled:opacity-100" />
                    <div className="text-[11px] text-right opacity-70">{currency(endingLive * r.Price)}</div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={saveEdit} className="w-full">Save</Button>
                  <Button onClick={cancelEdit} variant="secondary" className="w-full">Cancel</Button>
                </div>
              </>
            )}
          </div>
        )
      })}
    </div>
  )
}
