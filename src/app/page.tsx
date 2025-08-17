"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Egg, Sandwich, ShoppingBag, FileText, Settings } from "lucide-react"

const items = [
  { href: "/eggs", label: "Eggs", Icon: Egg, notif: 3 },
  { href: "/bread", label: "Bread", Icon: Sandwich, notif: 1 },
  { href: "/sales", label: "Sales", Icon: ShoppingBag, notif: 2 },
  { href: "/reports", label: "Reports", Icon: FileText, notif: 4 },
  { href: "/settings", label: "Settings", Icon: Settings, notif: 1 },
]

export default function HomePage() {
  return (
    <main className="mx-auto max-w-md p-4 pb-20">
      <h1 className="mb-4 text-center text-2xl font-bold">Dashboard</h1>

      <div className="space-y-2">
        {items.map(({ href, label, Icon, notif }) => (
          <Link key={href} href={href}>
            <Card className="hover:bg-muted/50 transition">
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <Icon className="h-6 w-6 text-primary" />
                  <span className="text-base font-medium">{label}</span>
                </div>
                <Badge variant="secondary" className="px-2">{notif}</Badge>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  )
}
