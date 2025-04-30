"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function LogoutPage() {
  const router = useRouter()

  useEffect(() => {
    // حذف ملف تعريف الارتباط
    document.cookie = "admin_authenticated=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"

    // إعادة توجيه المستخدم إلى الصفحة الرئيسية
    setTimeout(() => {
      router.push("/")
    }, 1000)
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <h1 className="text-2xl font-bold">جاري تسجيل الخروج...</h1>
        <p>يرجى الانتظار...</p>
      </div>
    </div>
  )
}
