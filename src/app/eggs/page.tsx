'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Pencil, Tag, PlusCircle, Trash2 } from 'lucide-react'

type Item = {
  product: string
  unit: string
  beginning: number
  addstock: number
  sold: number
  price: number
  ending: number
}
type Inventory = {
  date: string
  items: Item[]
}

const templateItems: Item[] = [
  { product: 'EGG_OS4',   unit: 'pcs', beginning: 360, addstock: 0, sold: 0, price: 5.5, ending: 360 },
  { product: 'EGG_OS3',   unit: 'pcs', beginning: 420, addstock: 0, sold: 0, price: 6.0, ending: 420 },
  { product: 'EGG_OS2',   unit: 'pcs', beginning: 600, addstock: 0, sold: 0, price: 6.5, ending: 600 },
  { product: 'EGG_OS',    unit: 'pcs', beginning: 900, addstock: 0, sold: 0, price: 7.0, ending: 900 },
  { product: 'EGG_SMALL', unit: 'pcs', beginning: 300, addstock: 0, sold: 0, price: 4.5, ending: 300 },
]

export default function Page() {
  const todayISO = new Date().toISOString().slice(0, 10)
  const [date, setDate] = useState<string>(todayISO)
  const [inventory, setInventory] = useState<Inventory | null>(null)
  const [loadingAction, setLoadingAction] = useState<null | 'create' | 'remove'>(null)

  const [editing, setEditing] = useState<string | null>(null)
  const [draftSold, setDraftSold] = useState<number>(0)
  const [draftAdd, setDraftAdd] = useState<number>(0)
  const [draftPrice, setDraftPrice] = useState<number>(0)

  const pesoFmt = new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', minimumFractionDigits: 2 })
  const peso = (v: number) => pesoFmt.format(Number(v || 0))
  const trays = (q: number) => `${(Number(q || 0) / 30).toFixed(2)} trays`
  const human = (iso: string) =>
    new Date(iso + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })

  const clampInt = (n: any) => {
    const v = Math.floor(Number(n))
    return Number.isFinite(v) ? Math.max(0, v) : 0
  }
  const clampMoney = (n: any) => {
    const v = Number(n)
    if (!Number.isFinite(v) || v < 0) return 0
    return Math.round(v * 100) / 100
  }
  const capSold = (begin: number, add: number, sold: number) => Math.min(clampInt(sold), Math.max(0, begin + add))

  const LS_KEY = 'inventory'
  const saveToLS = (inv: Inventory) => localStorage.setItem(LS_KEY, JSON.stringify(inv))
  const loadFromLS = (): Inventory | null => {
    try {
      const raw = localStorage.getItem(LS_KEY)
      if (!raw) return null
      return JSON.parse(raw) as Inventory
    } catch {
      return null
    }
  }
  const removeFromLS = () => localStorage.removeItem(LS_KEY)

  useEffect(() => {
    const saved = loadFromLS()
    if (saved) {
      setInventory(saved)
      setDate(saved.date)
    }
  }, [])

  const creating = loadingAction === 'create'
  const removing = loadingAction === 'remove'
  const loading = !!loadingAction

  const createInventory = () => {
    setLoadingAction('create')
    setEditing(null)
    setTimeout(() => {
      const inv: Inventory = {
        date,
        items: templateItems.map(it => ({
          ...it,
          ending: it.beginning + it.addstock - it.sold,
        })),
      }
      setInventory(inv)
      saveToLS(inv)
      setLoadingAction(null)
    }, 5000)
  }

  const removeInventory = () => {
    if (!inventory) return
    setLoadingAction('remove')
    setEditing(null)
    setTimeout(() => {
      setInventory(null)
      removeFromLS()
      setLoadingAction(null)
    }, 3000)
  }

  const startEdit = (product: string) => {
    if (!inventory || loading) return
    const it = inventory.items.find((x) => x.product === product)
    if (!it) return
    setDraftSold(it.sold)
    setDraftAdd(it.addstock)
    setDraftPrice(it.price)
    setEditing(product)
  }

  const cancelEdit = () => setEditing(null)

  const saveEdit = () => {
    if (!editing || !inventory || loading) return
    const items = inventory.items.map((it) => {
      if (it.product !== editing) return it
      const beginning = it.beginning
      const addstock = clampInt(draftAdd)
      const sold = capSold(beginning, addstock, draftSold)
      const price = clampMoney(draftPrice)
      const ending = Math.max(0, beginning + addstock - sold)
      return { ...it, addstock, sold, price, ending }
    })
    const updated = { ...inventory, items, date }
    setInventory(updated)
    saveToLS(updated)
    setEditing(null)
  }

  return (
    <div className="p-4 space-y-4 max-w-3xl mx-auto">
      <div className="flex flex-wrap gap-2 items-center">
        {!inventory ? (
          <>
            <select
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border rounded-md px-2 py-1 text-sm"
              disabled={loading}
            >
              {[new Date(), new Date(Date.now() - 86400000), new Date(Date.now() + 86400000)].map((d) => {
                const iso = d.toISOString().slice(0, 10)
                return (
                  <option key={iso} value={iso}>
                    {iso}
                  </option>
                )
              })}
            </select>

            <Button onClick={createInventory} className="inline-flex items-center gap-2" disabled={loading}>
              <PlusCircle className="w-4 h-4" />
              {creating ? 'Loading…' : 'Create Inventory'}
            </Button>
          </>
        ) : (
          <>
            <div className="font-medium text-sm px-2 py-1 border rounded-md bg-muted">{inventory.date}</div>
            <Button onClick={removeInventory} variant="destructive" className="inline-flex items-center gap-2" disabled={loading}>
              <Trash2 className="w-4 h-4" />
              {removing ? 'Removing…' : 'Remove Inventory'}
            </Button>
          </>
        )}
      </div>

      {creating && !inventory && (
        <div className="space-y-3">
          <div className="text-base font-semibold">Loading items…</div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="rounded-xl border p-4 shadow-sm">
              <div className="h-4 w-32 bg-muted animate-pulse rounded mb-3" />
              <div className="grid grid-cols-3 gap-2">
                {[...Array(5)].map((__, j) => (
                  <div key={j} className="rounded-lg bg-muted p-3">
                    <div className="h-5 bg-background animate-pulse rounded mb-2" />
                    <div className="h-3 bg-background animate-pulse rounded" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {inventory && (
        <div className={`space-y-3 ${loading ? 'opacity-60 pointer-events-none select-none' : ''}`}>
          <div className="text-base font-semibold">
            Inventory — {human(inventory.date)}
            <div className="text-xs text-muted-foreground">{inventory.date}</div>
            <div className="text-xs mt-1">
              {creating ? 'Fetching…' : removing ? 'Removing…' : 'Draft (auto-saved)'}
            </div>
          </div>

          {inventory.items.map((it) => {
            const isEditing = editing === it.product
            const begin = it.beginning
            const addLive = isEditing ? clampInt(draftAdd) : it.addstock
            const soldLive = isEditing ? capSold(begin, addLive, draftSold) : it.sold
            const priceLive = isEditing ? clampMoney(draftPrice) : it.price
            const endingLive = Math.max(0, begin + addLive - soldLive)

            return (
              <div
                key={it.product}
                className={`rounded-xl border border-border p-4 shadow-sm flex flex-col gap-3 ${isEditing ? 'ring-1 ring-blue-500' : ''}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="font-medium text-base break-words truncate" title={it.product}>
                    {it.product}
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs">
                    <Tag className="w-3 h-3" />
                    {it.unit}
                  </span>
                </div>

                {!isEditing && (
                  <>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div className="rounded-lg bg-muted p-2 text-center">
                        <div className="font-semibold">
                          {it.beginning.toLocaleString()} <span className="text-[11px] opacity-70">{it.unit}</span>
                        </div>
                        <div className="text-[11px] opacity-70">Beginning</div>
                        <div className="text-[11px] opacity-70">{peso(it.beginning * it.price)}</div>
                        <div className="text-[11px] opacity-70">{trays(it.beginning)}</div>
                      </div>
                      <div className="rounded-lg bg-muted p-2 text-center">
                        <div className="font-semibold">
                          {it.addstock.toLocaleString()} <span className="text-[11px] opacity-70">{it.unit}</span>
                        </div>
                        <div className="text-[11px] opacity-70">Add Stock</div>
                        <div className="text-[11px] opacity-70">{peso(it.addstock * it.price)}</div>
                        <div className="text-[11px] opacity-70">{trays(it.addstock)}</div>
                      </div>
                      <div className="rounded-lg bg-muted p-2 text-center">
                        <div className="font-semibold">
                          {it.sold.toLocaleString()} <span className="text-[11px] opacity-70">{it.unit}</span>
                        </div>
                        <div className="text-[11px] opacity-70">Sold</div>
                        <div className="text-[11px] opacity-70">{peso(it.sold * it.price)}</div>
                        <div className="text-[11px] opacity-70">{trays(it.sold)}</div>
                      </div>
                      <div className="rounded-lg bg-muted p-2 text-center">
                        <div className="font-semibold">{peso(it.price)}</div>
                        <div className="text-[11px] opacity-70">Price</div>
                        <div className="text-[11px] opacity-70">per {it.unit}</div>
                      </div>
                      <div className="rounded-lg bg-muted p-2 text-center">
                        <div className="font-semibold">
                          {endingLive.toLocaleString()} <span className="text-[11px] opacity-70">{it.unit}</span>
                        </div>
                        <div className="text-[11px] opacity-70">Ending</div>
                        <div className="text:[11px] opacity-70">{peso(endingLive * it.price)}</div>
                        <div className="text-[11px] opacity-70">{trays(endingLive)}</div>
                      </div>
                    </div>

                    <Button
                      onClick={() => startEdit(it.product)}
                      variant="secondary"
                      className="w-full flex items-center gap-2 mt-4"
                      disabled={loading}
                    >
                      <Pencil className="w-4 h-4" />
                      Edit
                    </Button>
                  </>
                )}

                {isEditing && (
                  <>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="space-y-1">
                        <div className="text-xs opacity-70">Beginning</div>
                        <Input type="number" value={begin} disabled className="text-center bg-muted disabled:opacity-100" />
                        <div className="text-[11px] text-right opacity-70">{peso(begin * priceLive)}</div>
                        <div className="text-[11px] text-right opacity-70">{trays(begin)}</div>
                      </div>

                      <div className="space-y-1">
                        <div className="text-xs opacity-70">Add Stock</div>
                        <Input
                          type="number"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          min={0}
                          value={draftAdd}
                          onChange={(e) => setDraftAdd(e.target.value === '' ? 0 : Number(e.target.value))}
                          className="text-center"
                          disabled={loading}
                        />
                        <div className="text-[11px] text-right opacity-70">{peso(clampInt(draftAdd) * priceLive)}</div>
                        <div className="text-[11px] text-right opacity-70">{trays(clampInt(draftAdd))}</div>
                      </div>

                      <div className="space-y-1">
                        <div className="text-xs opacity-70">Sold</div>
                        <Input
                          type="number"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          min={0}
                          value={draftSold}
                          onChange={(e) => setDraftSold(e.target.value === '' ? 0 : Number(e.target.value))}
                          className="text-center"
                          disabled={loading}
                        />
                        <div className="text-[11px] text-right opacity-70">{peso(capSold(begin, clampInt(draftAdd), draftSold) * priceLive)}</div>
                        <div className="text-[11px] text-right opacity-70">{trays(capSold(begin, clampInt(draftAdd), draftSold))}</div>
                      </div>

                      <div className="space-y-1">
                        <div className="text-xs opacity-70">Price</div>
                        <Input
                          type="number"
                          step="0.01"
                          min={0}
                          value={draftPrice}
                          onChange={(e) => setDraftPrice(e.target.value === '' ? 0 : Number(e.target.value))}
                          className="text-center"
                          disabled={loading}
                        />
                        <div className="text-[11px] text-right opacity-70">{peso(priceLive)}</div>
                      </div>

                      <div className="space-y-1">
                        <div className="text-xs opacity-70">Unit</div>
                        <Input value={it.unit} disabled className="text-center bg-muted disabled:opacity-100" />
                        <div className="text-[11px] text-right opacity-70">—</div>
                      </div>

                      <div className="space-y-1">
                        <div className="text-xs opacity-70">Ending</div>
                        <Input
                          type="number"
                          value={Math.max(0, begin + clampInt(draftAdd) - capSold(begin, clampInt(draftAdd), draftSold))}
                          disabled
                          className="text-center bg-muted disabled:opacity-100"
                        />
                        <div className="text-[11px] text-right opacity-70">
                          {peso(Math.max(0, begin + clampInt(draftAdd) - capSold(begin, clampInt(draftAdd), draftSold)) * priceLive)}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 mt-2">
                      <Button
                        onClick={saveEdit}
                        className="w-full sm:flex-1 min-w-0"
                        disabled={loading || capSold(begin, clampInt(draftAdd), draftSold) > begin + clampInt(draftAdd)}
                      >
                        Save
                      </Button>
                      <Button onClick={cancelEdit} variant="outline" className="w-full sm:flex-1 min-w-0" disabled={loading}>
                        Cancel
                      </Button>
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
