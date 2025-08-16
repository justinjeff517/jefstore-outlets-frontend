"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Boxes, ShoppingBag, FileText, Settings } from "lucide-react"
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
              <li key={href} className="py-1">
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative flex h-12 flex-col items-center justify-center gap-0.5 text-xs transition-colors",
                    active ? "text-primary" : "text-muted-foreground hover:text-foreground/80"
                  )}
                >
                  {/* Top indicator */}
                  <span
                    className={cn(
                      "absolute -top-1 h-1 w-8 rounded-full transition-all duration-300",
                      active ? "bg-primary opacity-100" : "opacity-0"
                    )}
                  />
                  <Icon className={cn("h-5 w-5 transition-transform duration-200", active && "scale-125")} />
                  <span className={cn("transition-all", active && "font-semibold text-sm")}>{label}</span>
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
