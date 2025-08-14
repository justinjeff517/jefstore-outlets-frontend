"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

type Line = { id: string; name: string; qty: number; price: number }

export default function Page() {
  const [customer, setCustomer] = useState("")
  const [name, setName] = useState("")
  const [qty, setQty] = useState<number | "">("")
  const [price, setPrice] = useState<number | "">("")
  const [lines, setLines] = useState<Line[]>([])

  const total = useMemo(
    () => lines.reduce((s, l) => s + l.qty * l.price, 0),
    [lines]
  )

  function addLine() {
    if (!name || !qty || !price) return
    setLines((prev) => [
      ...prev,
      { id: crypto.randomUUID(), name, qty: Number(qty), price: Number(price) },
    ])
    setName("")
    setQty("")
    setPrice("")
  }

  function removeLine(id: string) {
    setLines((prev) => prev.filter((l) => l.id !== id))
  }

  function submitSale() {
    const payload = {
      customer: customer || "Walk-in",
      date: new Date().toISOString(),
      items: lines,
      total,
    }
    console.log("SUBMIT_SALE", payload)
    setCustomer("")
    setLines([])
  }

  return (
    <main className="flex-1 grid grid-rows-[auto,1fr,auto]">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="px-4 py-3 max-w-sm mx-auto flex items-center justify-between">
          <div className="text-base font-semibold">Sales Recorder</div>
          <div className="text-xs text-muted-foreground">
            {new Date().toLocaleDateString()}
          </div>
        </div>
      </header>

      <section className="p-4 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">New Sale</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="customer">Customer</Label>
              <Input
                id="customer"
                placeholder="Walk-in"
                value={customer}
                onChange={(e) => setCustomer(e.target.value)}
                inputMode="text"
              />
            </div>

            <Separator />

            <div className="grid grid-cols-5 gap-2 items-end">
              <div className="col-span-3 space-y-1.5">
                <Label htmlFor="name">Item</Label>
                <Input
                  id="name"
                  placeholder="Product name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="qty">Qty</Label>
                <Input
                  id="qty"
                  placeholder="0"
                  value={qty}
                  onChange={(e) => setQty(e.target.value === "" ? "" : Number(e.target.value))}
                  inputMode="numeric"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  placeholder="0.00"
                  value={price}
                  onChange={(e) =>
                    setPrice(e.target.value === "" ? "" : Number(e.target.value))
                  }
                  inputMode="decimal"
                />
              </div>
              <div className="col-span-5">
                <Button className="w-full" onClick={addLine} disabled={!name || !qty || !price}>
                  Add Item
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {lines.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <ul className="space-y-2">
                {lines.map((l) => (
                  <li key={l.id} className="flex items-center justify-between rounded-lg border p-2">
                    <div className="min-w-0">
                      <div className="font-medium truncate">{l.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {l.qty} × {l.price.toLocaleString(undefined, { style: "currency", currency: "PHP" })}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-semibold">
                        {(l.qty * l.price).toLocaleString(undefined, { style: "currency", currency: "PHP" })}
                      </div>
                      <Button variant="outline" size="sm" onClick={() => removeLine(l.id)}>
                        Remove
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>

              <Separator className="my-2" />

              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">Total</div>
                <div className="text-lg font-bold">
                  {total.toLocaleString(undefined, { style: "currency", currency: "PHP" })}
                </div>
              </div>

              <Button className="w-full mt-2" onClick={submitSale} disabled={lines.length === 0}>
                Save Sale
              </Button>
            </CardContent>
          </Card>
        )}
      </section>

      <nav className="sticky bottom-0 border-t bg-background">
        <div className="px-4 py-2 grid grid-cols-3 gap-2 max-w-sm mx-auto">
          <Button variant="default">Home</Button>
          <Button variant="outline">Sales</Button>
          <Button variant="outline">Reports</Button>
        </div>
      </nav>
    </main>
  )
}
