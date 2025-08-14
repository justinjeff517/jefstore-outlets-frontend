import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import MobileBottomNav from "@/components/mobile-bottom-nav"

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] })
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] })

export const metadata: Metadata = { title: "Sales Recorder", description: "Mobile sales recording" }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}>
        <div className="mx-auto max-w-sm min-h-dvh pb-14">{children}</div>
        <MobileBottomNav />
      </body>
    </html>
  )
}
