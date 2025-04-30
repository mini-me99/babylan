"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Navbar } from "@/components/ui/navbar"
import { Footer } from "@/components/ui/footer"
import { CheckCircle, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("orderId")
  const orderNumber = searchParams.get("orderNumber")
  const [countdown, setCountdown] = useState(10)

  // عد تنازلي للتوجيه التلقائي
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      window.location.href = "/"
    }
  }, [countdown])

  // مسح السلة بعد إتمام الطلب
  useEffect(() => {
    localStorage.removeItem("cart")
  }, [])

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8 text-center">
          <div className="flex justify-center mb-6">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>

          <h1 className="text-3xl font-bold mb-4">تم استلام طلبك بنجاح!</h1>

          <p className="text-lg text-gray-600 mb-6">
            شكراً لك على طلبك. لقد تم استلام طلبك وسيتم معالجته في أقرب وقت ممكن.
          </p>

          <div className="bg-gray-50 p-4 rounded-md mb-6">
            <p className="text-gray-700 mb-2">
              رقم الطلب: <span className="font-semibold">#{orderNumber || "غير محدد"}</span>
            </p>
            <p className="text-gray-500 text-sm">يرجى الاحتفاظ برقم الطلب للمتابعة</p>
          </div>

          <div className="flex justify-center">
            <Link
              href="/"
              className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <ArrowRight className="ml-2 h-5 w-5" />
              العودة إلى الصفحة الرئيسية ({countdown})
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
