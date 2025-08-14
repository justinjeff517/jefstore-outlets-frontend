"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Boxes, ShoppingBag, FileText, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

const items = [
  { href: "/inventory", label: "Inventory", Icon: Boxes },
  { href: "/sales", label: "Sales", Icon: ShoppingBag },
  { href: "/reports", label: "Reports", Icon: FileText },
  { href: "/settings", label: "Settings", Icon: Settings },
]

export default function MobileBottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-sm">
        <ul className="grid grid-cols-4">
          {items.map(({ href, label, Icon }) => {
            const active = pathname === href || (href !== "/" && pathname?.startsWith(href))
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    "flex h-14 flex-col items-center justify-center gap-1 text-xs",
                    "hover:text-foreground/80",
                    active ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  <Icon className={cn("h-5 w-5", active && "scale-110")} />
                  <span>{label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
        <div className="h-[env(safe-area-inset-bottom)]" />
      </div>
    </nav>
  )
}
