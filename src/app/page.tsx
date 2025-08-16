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

export default function HomePage() {
  const pathname = usePathname()

  return (
    <main className="flex min-h-[100dvh] flex-col bg-background text-foreground">
      {/* Header */}
      <header className="border-b px-4 py-3 text-center text-xl font-bold">My App</header>

      {/* Main content */}
      <section className="flex-1 p-6">
        <h1 className="text-2xl font-semibold">Welcome</h1>
        <p className="mt-2 text-muted-foreground">Choose a section below to get started.</p>
      </section>

      {/* Bottom navigation */}
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
                    {/* Top indicator (no box) */}
                    <span
                      className={cn(
                        "absolute -top-1 h-1 w-8 rounded-full transition-opacity",
                        active ? "bg-primary opacity-100" : "opacity-0"
                      )}
                    />
                    <Icon className={cn("h-5 w-5 transition-transform", active && "scale-110")} />
                    <span className={cn(active && "font-semibold")}>{label}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
          <div className="h-[env(safe-area-inset-bottom)]" />
        </div>
      </nav>
    </main>
  )
}
