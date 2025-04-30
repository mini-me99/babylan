"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Navbar } from "@/components/ui/navbar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // التحقق من وجود ملف تعريف الارتباط
    const checkAuth = () => {
      const isAuth = document.cookie.includes("admin_authenticated=true")
      setIsAuthenticated(isAuth)
      setIsLoading(false)

      // إذا لم يكن المستخدم مصرح له وليس في صفحة تسجيل الدخول
      if (!isAuth && pathname !== "/admin") {
        router.push("/")
      }
    }

    checkAuth()
  }, [pathname, router])

  // عرض شاشة التحميل أثناء التحقق من المصادقة
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  // إذا كان المستخدم في صفحة تسجيل الدخول ولم يكن مصرح له
  if (pathname === "/admin" && !isAuthenticated) {
    return children
  }

  // إذا كان المستخدم مصرح له، عرض التخطيط الكامل
  if (isAuthenticated) {
    return (
      <>
        <Navbar />
        {children}
      </>
    )
  }

  // في حالة عدم المصادقة، سيتم إعادة التوجيه في useEffect
  return null
}
