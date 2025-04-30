"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/ui/navbar"
import { Footer } from "@/components/ui/footer"
import { createOrder } from "@/lib/actions"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState<any[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [paymentMethod, setPaymentMethod] = useState("كاش")
  const router = useRouter()

  // استرجاع عناصر السلة من التخزين المحلي
  useEffect(() => {
    const storedCart = localStorage.getItem("cart")
    if (storedCart) {
      setCartItems(JSON.parse(storedCart))
    } else {
      // إذا كانت السلة فارغة، ارجع إلى صفحة السلة
      router.push("/cart")
    }
  }, [router])

  // حساب إجمالي السلة
  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true)
    setError(null)

    try {
      // إضافة عناصر السلة إلى النموذج
      formData.append("cartItems", JSON.stringify(cartItems))

      const result = await createOrder(formData)

      if (result.error) {
        setError(result.error)
      } else {
        // توجيه المستخدم إلى صفحة تأكيد الطلب
        router.push(`/checkout/success?orderId=${result.orderId}&orderNumber=${result.orderNumber}`)
      }
    } catch (err: any) {
      setError("حدث خطأ أثناء إنشاء الطلب")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar cartItemsCount={cartItems.length} />

      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center md:text-right">إتمام الطلب</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
              <h2 className="text-xl font-semibold mb-6">معلومات الطلب</h2>

              <form action={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
                  <div>
                    <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-1">
                      الاسم <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="customerName"
                      name="customerName"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="storeName" className="block text-sm font-medium text-gray-700 mb-1">
                      اسم المحل
                    </label>
                    <input
                      type="text"
                      id="storeName"
                      name="storeName"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      رقم الهاتف <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                      العنوان <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="deposit" className="block text-sm font-medium text-gray-700 mb-1">
                      العربون
                    </label>
                    <input
                      type="number"
                      id="deposit"
                      name="deposit"
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="shippingCompany" className="block text-sm font-medium text-gray-700 mb-1">
                      شركة الشحن
                    </label>
                    <input
                      type="text"
                      id="shippingCompany"
                      name="shippingCompany"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="deliveryDate" className="block text-sm font-medium text-gray-700 mb-1">
                      تاريخ التسليم
                    </label>
                    <input
                      type="date"
                      id="deliveryDate"
                      name="deliveryDate"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-3">طريقة الدفع</h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="cash"
                        name="paymentMethod"
                        value="كاش"
                        checked={paymentMethod === "كاش"}
                        onChange={() => setPaymentMethod("كاش")}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor="cash" className="mr-2 block text-sm font-medium text-gray-700">
                        الدفع عند الاستلام (كاش)
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="instapay"
                        name="paymentMethod"
                        value="إنستا باي"
                        checked={paymentMethod === "إنستا باي"}
                        onChange={() => setPaymentMethod("إنستا باي")}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor="instapay" className="mr-2 block text-sm font-medium text-gray-700">
                        إنستا باي
                      </label>
                    </div>

                    {paymentMethod === "إنستا باي" && (
                      <div className="mt-4 pr-6">
                        <label htmlFor="paymentScreenshot" className="block text-sm font-medium text-gray-700 mb-1">
                          صورة إيصال الدفع <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="file"
                          id="paymentScreenshot"
                          name="paymentScreenshot"
                          accept="image/*"
                          required={paymentMethod === "إنستا باي"}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {error && (
                  <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                    {error}
                  </div>
                )}

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting || cartItems.length === 0}
                    className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
                  >
                    {isSubmitting ? "جاري إرسال الطلب..." : "تأكيد الطلب"}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
              <h2 className="text-lg font-semibold mb-4">ملخص الطلب</h2>

              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center border-b border-gray-200 pb-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 relative flex-shrink-0">
                        <Image
                          src={item.imageUrl || "/placeholder-product.jpg"}
                          alt={item.name}
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>
                      <div className="mr-3">
                        <p className="text-sm font-medium line-clamp-1">{item.name}</p>
                        <p className="text-xs text-gray-500">الكمية: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="text-sm font-medium">{(item.price * item.quantity).toFixed(2)} جنيه</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between font-semibold">
                  <span>الإجمالي</span>
                  <span>{cartTotal.toFixed(2)} جنيه</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
