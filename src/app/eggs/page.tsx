'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Pencil, Tag } from 'lucide-react'

type Item = {
  product: string
  unit: string
  beginning: number
  addstock: number
  sold: number
  price: number
  ending: number
}
type Inventory = { items: Item[] }

const initialInventory: Inventory = {
  items: [
    { product: 'EXAMPLEA_PCS_499_99',  unit: 'pcs', beginning: 100, addstock: 0, sold: 0, price: 499.99, ending: 100 },
    { product: 'EXAMPLEB_KG_120_50',   unit: 'kg',  beginning: 50,  addstock: 0, sold: 0, price: 120.5,  ending: 50  },
    { product: 'SUPERWIDGET_BOX_29_99',unit: 'box', beginning: 200, addstock: 0, sold: 0, price: 29.99,  ending: 200 },
    { product: 'MEGATOOL_SET_199_00',  unit: 'set', beginning: 80,  addstock: 0, sold: 0, price: 199.0,  ending: 80  },
  ],
}

export default function Page() {
  const [inventory, setInventory] = useState<Inventory>(initialInventory)
  const [editing, setEditing] = useState<string | null>(null)
  const [draftSold, setDraftSold] = useState<number>(0)
  const [draftAdd, setDraftAdd] = useState<number>(0)
  const [draftPrice, setDraftPrice] = useState<number>(0)

  const peso = (v: number) =>
    `₱ ${Number(v || 0).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

  const startEdit = (product: string) => {
    const it = inventory.items.find((x) => x.product === product)
    if (!it) return
    setDraftSold(it.sold)
    setDraftAdd(it.addstock)
    setDraftPrice(it.price)
    setEditing(product)
  }

  const cancelEdit = () => {
    setEditing(null)
  }

  const clampInt = (n: any) => {
    const v = Math.floor(Number(n))
    return Number.isFinite(v) ? Math.max(0, v) : 0
  }
  const clampMoney = (n: any) => {
    const v = Number(n)
    if (!Number.isFinite(v) || v < 0) return 0
    return Math.round(v * 100) / 100
  }

  const saveEdit = () => {
    if (!editing) return
    setInventory((prev) => {
      const items = prev.items.map((it) => {
        if (it.product !== editing) return it
        const beginning = it.beginning
        const addstock = clampInt(draftAdd)
        const sold = clampInt(draftSold)
        const price = clampMoney(draftPrice)
        const ending = beginning + addstock - sold // required formula
        return { ...it, addstock, sold, price, ending }
      })
      return { items }
    })
    setEditing(null)
  }

  return (
    <div className="p-4 space-y-3">
      {inventory.items.map((it) => {
        const isEditing = editing === it.product
        const begin = it.beginning
        const addLive = isEditing ? clampInt(draftAdd) : it.addstock
        const soldLive = isEditing ? clampInt(draftSold) : it.sold
        const priceLive = isEditing ? clampMoney(draftPrice) : it.price
        const endingLive = begin + addLive - soldLive
        const borderColor = isEditing ? 'border-blue-500' : 'border-muted'

        return (
          <div key={it.product} className={`rounded-xl border p-4 shadow-sm flex flex-col gap-3 ${borderColor}`}>
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="font-medium text-base break-words truncate" title={it.product}>
                {it.product}
              </div>
              <span className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs">
                <Tag className="w-3 h-3" />
                {it.unit}
              </span>
            </div>

            {/* View mode: show Beginning, Add Stock, Sold, Price, Ending — min 3 per row */}
{!isEditing && (
  <>
    <div className="grid grid-cols-3 gap-2 text-sm">
      {/* Beginning */}
      <div className="rounded-lg bg-muted p-2 text-center">
        <div className="font-semibold">
          {it.beginning.toLocaleString()} <span className="text-[11px] opacity-70">{it.unit}</span>
        </div>
        <div className="text-[11px] opacity-70">Beginning</div>
        <div className="text-[11px] opacity-70">{peso(it.beginning * it.price)}</div>
      </div>
      {/* Add Stock */}
      <div className="rounded-lg bg-muted p-2 text-center">
        <div className="font-semibold">
          {it.addstock.toLocaleString()} <span className="text-[11px] opacity-70">{it.unit}</span>
        </div>
        <div className="text-[11px] opacity-70">Add Stock</div>
        <div className="text-[11px] opacity-70">{peso(it.addstock * it.price)}</div>
      </div>
      {/* Sold */}
      <div className="rounded-lg bg-muted p-2 text-center">
        <div className="font-semibold">
          {it.sold.toLocaleString()} <span className="text-[11px] opacity-70">{it.unit}</span>
        </div>
        <div className="text-[11px] opacity-70">Sold</div>
        <div className="text-[11px] opacity-70">{peso(it.sold * it.price)}</div>
      </div>
      {/* Price (unit price only) */}
      <div className="rounded-lg bg-muted p-2 text-center">
        <div className="font-semibold">{peso(it.price)}</div>
        <div className="text-[11px] opacity-70">Price</div>
        <div className="text-[11px] opacity-70">per {it.unit}</div>
      </div>
      {/* Ending */}
      <div className="rounded-lg bg-muted p-2 text-center">
        <div className="font-semibold">
          {it.ending.toLocaleString()} <span className="text-[11px] opacity-70">{it.unit}</span>
        </div>
        <div className="text-[11px] opacity-70">Ending</div>
        <div className="text-[11px] opacity-70">{peso(it.ending * it.price)}</div>
      </div>
    </div>

    <Button
      onClick={() => startEdit(it.product)}
      variant="secondary"
      className="w-full flex items-center gap-2 mt-4"
    >
      <Pencil className="w-4 h-4" />
      Change
    </Button>
  </>
)}


            {/* Edit mode — min 3 fields per row; order: Beginning, Add, Sold, Price, Unit, Ending */}
            {isEditing && (
              <>
                <div className="grid grid-cols-3 gap-2">
                  {/* Beginning (readonly) */}
                  <div className="space-y-1">
                    <div className="text-xs opacity-70">Beginning</div>
                    <Input
                      type="number"
                      value={begin}
                      disabled
                      className="text-center border-gray-300 bg-gray-100 text-gray-800 disabled:opacity-100"
                    />
                    <div className="text-[11px] text-right opacity-70">{peso(begin * priceLive)}</div>
                  </div>

                  {/* Add Stock */}
                  <div className="space-y-1">
                    <div className="text-xs opacity-70">Add Stock</div>
                    <Input
                      type="number"
                      value={draftAdd}
                      onChange={(e) => setDraftAdd(e.target.value === '' ? 0 : Number(e.target.value))}
                      className="text-center"
                    />
                    <div className="text-[11px] text-right opacity-70">{peso(addLive * priceLive)}</div>
                  </div>

                  {/* Sold */}
                  <div className="space-y-1">
                    <div className="text-xs opacity-70">Sold</div>
                    <Input
                      type="number"
                      value={draftSold}
                      onChange={(e) => setDraftSold(e.target.value === '' ? 0 : Number(e.target.value))}
                      className="text-center"
                    />
                    <div className="text-[11px] text-right opacity-70">{peso(soldLive * priceLive)}</div>
                  </div>

                  {/* Price (editable) */}
                  <div className="space-y-1">
                    <div className="text-xs opacity-70">Price</div>
                    <Input
                      type="number"
                      step="0.01"
                      value={draftPrice}
                      onChange={(e) => setDraftPrice(e.target.value === '' ? 0 : Number(e.target.value))}
                      className="text-center"
                    />
                    <div className="text-[11px] text-right opacity-70">{peso(priceLive)}</div>
                  </div>

                  {/* Unit (readonly) */}
                  <div className="space-y-1">
                    <div className="text-xs opacity-70">Unit</div>
                    <Input
                      value={it.unit}
                      disabled
                      className="text-center border-gray-300 bg-gray-100 text-gray-800 disabled:opacity-100"
                    />
                    <div className="text-[11px] text-right opacity-70">—</div>
                  </div>

                  {/* Ending (readonly live calc) */}
                  <div className="space-y-1">
                    <div className="text-xs opacity-70">Ending</div>
                    <Input
                      type="number"
                      value={endingLive}
                      disabled
                      className="text-center border-gray-300 bg-gray-100 text-gray-800 disabled:opacity-100"
                    />
                    <div className="text-[11px] text-right opacity-70">{peso(endingLive * priceLive)}</div>
                  </div>
                </div>

                {/* Actions: full-width on mobile, side-by-side on larger; no overlap */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button onClick={saveEdit} className="w-full sm:flex-1 min-w-0">Save</Button>
                  <Button onClick={cancelEdit} variant="secondary" className="w-full sm:flex-1 min-w-0">Cancel</Button>
                </div>
              </>
            )}
          </div>
        )
      })}
    </div>
  )
}
