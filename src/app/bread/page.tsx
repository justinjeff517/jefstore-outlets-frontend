'use client'

import { useEffect, useMemo, useState } from 'react'
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

type BreadInventory = {
  id: string
  date: string
  items: Item[]
}

const templateItems: Item[] = [
  { product: 'PANDESAL',      unit: 'pcs', beginning: 200, addstock: 0, sold: 0, price: 3.00,  ending: 200 },
  { product: 'SPANISH_BREAD', unit: 'pcs', beginning: 150, addstock: 0, sold: 0, price: 8.00,  ending: 150 },
  { product: 'ENSAYMADA',     unit: 'pcs', beginning: 100, addstock: 0, sold: 0, price: 20.00, ending: 100 },
  { product: 'MONAY',         unit: 'pcs', beginning: 120, addstock: 0, sold: 0, price: 7.00,  ending: 120 },
  { product: 'HOPIA',         unit: 'pcs', beginning: 80,  addstock: 0, sold: 0, price: 15.00, ending: 80 },
]

const todayISO = () => new Date().toISOString().slice(0, 10)

export default function Page() {
  const [inv, setInv] = useState<BreadInventory | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editing, setEditing] = useState<string | null>(null)
  const [draftSold, setDraftSold] = useState<number>(0)
  const [draftAdd, setDraftAdd] = useState<number>(0)
  const [draftPrice, setDraftPrice] = useState<number>(0)

  // Money formatter
  const peso = (v: number) =>
    `₱ ${Number(v || 0).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

  // --- First: query if today's inventory exists ---
  useEffect(() => {
    const run = async () => {
      setLoading(true)
      setError(null)
      try {
        const date = todayISO()
        const res = await fetch(`/api/bread_inventory?date=${date}`, { method: 'GET' })
        if (res.status === 404) {
          // Not created yet
          setInv(null)
        } else if (!res.ok) {
          throw new Error(`HTTP ${res.status}`)
        } else {
          const data = await res.json() as { bread_inventory: BreadInventory }
          setInv(data.bread_inventory)
        }
      } catch (e: any) {
        setError(e?.message || 'Request failed')
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [])

  const startEdit = (product: string) => {
    if (!inv) return
    const it = inv.items.find((x) => x.product === product)
    if (!it) return
    setDraftSold(it.sold)
    setDraftAdd(it.addstock)
    setDraftPrice(it.price)
    setEditing(product)
  }

  const cancelEdit = () => setEditing(null)

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
    if (!editing || !inv) return
    setInv((prev) => {
      if (!prev) return prev
      const items = prev.items.map((it) => {
        if (it.product !== editing) return it
        const beginning = it.beginning
        const addstock = clampInt(draftAdd)
        const sold = clampInt(draftSold)
        const price = clampMoney(draftPrice)
        const ending = beginning + addstock - sold
        return { ...it, addstock, sold, price, ending }
      })
      return { ...prev, items }
    })
    setEditing(null)
  }

  const initTodayFromTemplate = () => {
    const date = todayISO()
    const id = crypto?.randomUUID?.() || `${date}-${Math.random().toString(36).slice(2,8)}`
    setInv({ id, date, items: templateItems })
  }

  // Optional totals (fast to compute, helpful)
  const totals = useMemo(() => {
    if (!inv) return null
    return inv.items.reduce(
      (acc, it) => {
        acc.beginning += it.beginning
        acc.addstock += it.addstock
        acc.sold += it.sold
        acc.ending += it.ending
        acc.value += it.ending * it.price
        return acc
      },
      { beginning: 0, addstock: 0, sold: 0, ending: 0, value: 0 }
    )
  }, [inv])

  return (
    <div className="p-4 space-y-3">
      {/* Status strip */}
      {loading && <div className="text-sm opacity-70">Checking today’s inventory…</div>}
      {error && <div className="text-sm text-red-600">Error: {error}</div>}

      {!loading && !inv && !error && (
        <div className="rounded-lg border p-4 space-y-3">
          <div className="text-sm">
            No <span className="font-medium">bread_inventory</span> found for <span className="font-mono">{todayISO()}</span>.
          </div>
          <Button onClick={initTodayFromTemplate}>Initialize from template</Button>
          <div className="text-xs opacity-70">
            Expected API (200) response shape:
            <pre className="mt-2 whitespace-pre-wrap">
{`{
  "bread_inventory": {
    "id": "string",
    "date": "YYYY-MM-DD",
    "items": [
      { "product": "string", "unit": "string", "beginning": 0, "addstock": 0, "sold": 0, "price": 0, "ending": 0 }
    ]
  }
}`}
            </pre>
          </div>
        </div>
      )}

      {!loading && inv && (
        <>
          <div className="text-sm opacity-70">
            Inventory ID: <span className="font-mono">{inv.id}</span> • Date: <span className="font-mono">{inv.date}</span>
          </div>

          {inv.items.map((it) => {
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

                {/* View mode */}
                {!isEditing && (
                  <>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div className="rounded-lg bg-muted p-2 text-center">
                        <div className="font-semibold">
                          {it.beginning.toLocaleString()} <span className="text-[11px] opacity-70">{it.unit}</span>
                        </div>
                        <div className="text-[11px] opacity-70">Beginning</div>
                        <div className="text-[11px] opacity-70">{peso(it.beginning * it.price)}</div>
                      </div>
                      <div className="rounded-lg bg-muted p-2 text-center">
                        <div className="font-semibold">
                          {it.addstock.toLocaleString()} <span className="text-[11px] opacity-70">{it.unit}</span>
                        </div>
                        <div className="text-[11px] opacity-70">Add Stock</div>
                        <div className="text-[11px] opacity-70">{peso(it.addstock * it.price)}</div>
                      </div>
                      <div className="rounded-lg bg-muted p-2 text-center">
                        <div className="font-semibold">
                          {it.sold.toLocaleString()} <span className="text-[11px] opacity-70">{it.unit}</span>
                        </div>
                        <div className="text-[11px] opacity-70">Sold</div>
                        <div className="text-[11px] opacity-70">{peso(it.sold * it.price)}</div>
                      </div>
                      <div className="rounded-lg bg-muted p-2 text-center">
                        <div className="font-semibold">{peso(it.price)}</div>
                        <div className="text-[11px] opacity-70">Price</div>
                        <div className="text-[11px] opacity-70">per {it.unit}</div>
                      </div>
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

                {/* Edit mode */}
                {isEditing && (
                  <>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="space-y-1">
                        <div className="text-xs opacity-70">Beginning</div>
                        <Input type="number" value={begin} disabled className="text-center border-gray-300 bg-gray-100 text-gray-800 disabled:opacity-100" />
                        <div className="text-[11px] text-right opacity-70">{peso(begin * priceLive)}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs opacity-70">Add Stock</div>
                        <Input type="number" value={draftAdd}
                          onChange={(e) => setDraftAdd(e.target.value === '' ? 0 : Number(e.target.value))}
                          className="text-center" />
                        <div className="text-[11px] text-right opacity-70">{peso(addLive * priceLive)}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs opacity-70">Sold</div>
                        <Input type="number" value={draftSold}
                          onChange={(e) => setDraftSold(e.target.value === '' ? 0 : Number(e.target.value))}
                          className="text-center" />
                        <div className="text-[11px] text-right opacity-70">{peso(soldLive * priceLive)}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs opacity-70">Price</div>
                        <Input type="number" step="0.01" value={draftPrice}
                          onChange={(e) => setDraftPrice(e.target.value === '' ? 0 : Number(e.target.value))}
                          className="text-center" />
                        <div className="text-[11px] text-right opacity-70">{peso(priceLive)}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs opacity-70">Unit</div>
                        <Input value={it.unit} disabled className="text-center border-gray-300 bg-gray-100 text-gray-800 disabled:opacity-100" />
                        <div className="text-[11px] text-right opacity-70">—</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs opacity-70">Ending</div>
                        <Input type="number" value={endingLive} disabled className="text-center border-gray-300 bg-gray-100 text-gray-800 disabled:opacity-100" />
                        <div className="text-[11px] text-right opacity-70">{peso(endingLive * priceLive)}</div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button onClick={saveEdit} className="w-full sm:flex-1 min-w-0">Save</Button>
                      <Button onClick={cancelEdit} variant="secondary" className="w-full sm:flex-1 min-w-0">Cancel</Button>
                    </div>
                  </>
                )}
              </div>
            )
          })}

          {totals && (
            <div className="rounded-xl border p-4">
              <div className="font-medium mb-2">Totals</div>
              <div className="grid grid-cols-5 gap-2 text-sm">
                <div className="rounded-lg bg-muted p-2 text-center">
                  <div className="font-semibold">{totals.beginning.toLocaleString()}</div>
                  <div className="text-[11px] opacity-70">Beginning</div>
                </div>
                <div className="rounded-lg bg-muted p-2 text-center">
                  <div className="font-semibold">{totals.addstock.toLocaleString()}</div>
                  <div className="text-[11px] opacity-70">Add Stock</div>
                </div>
                <div className="rounded-lg bg-muted p-2 text-center">
                  <div className="font-semibold">{totals.sold.toLocaleString()}</div>
                  <div className="text-[11px] opacity-70">Sold</div>
                </div>
                <div className="rounded-lg bg-muted p-2 text-center">
                  <div className="font-semibold">{totals.ending.toLocaleString()}</div>
                  <div className="text-[11px] opacity-70">Ending</div>
                </div>
                <div className="rounded-lg bg-muted p-2 text-center">
                  <div className="font-semibold">{peso(totals.value)}</div>
                  <div className="text-[11px] opacity-70">Ending Value</div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
