import type React from "react"
import "./globals.css"
import { Cairo } from "next/font/google"
import type { Metadata } from "next"
import { Toaster } from "@/components/ui/toaster"

// استيراد الخط العربي
const cairo = Cairo({
  subsets: ["arabic"],
  display: "swap",
  variable: "--font-cairo",
})

export const metadata: Metadata = {
  title: "بيبي لاند - متجر منتجات الأطفال",
  description: "متجر بيبي لاند لمنتجات الأطفال - كل ما يحتاجه طفلك في مكان واحد",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${cairo.variable} font-cairo min-h-screen bg-gray-50`}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
