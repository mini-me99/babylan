"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/ui/navbar"
import { Footer } from "@/components/ui/footer"
import { Trash2, ShoppingBag } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function CartPage() {
  const [cartItems, setCartItems] = useState<any[]>([])

  // استرجاع عناصر السلة من التخزين المحلي
  useEffect(() => {
    const storedCart = localStorage.getItem("cart")
    if (storedCart) {
      setCartItems(JSON.parse(storedCart))
    }
  }, [])

  // حساب إجمالي السلة
  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)

  // تحديث كمية المنتج
  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return

    const updatedCart = cartItems.map((item) => (item.id === id ? { ...item, quantity } : item))

    setCartItems(updatedCart)
    localStorage.setItem("cart", JSON.stringify(updatedCart))
  }

  // حذف منتج من السلة
  const removeItem = (id: string) => {
    const updatedCart = cartItems.filter((item) => item.id !== id)
    setCartItems(updatedCart)
    localStorage.setItem("cart", JSON.stringify(updatedCart))
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar cartItemsCount={cartItems.length} />

      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center md:text-right">سلة التسوق</h1>

        {cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-4 md:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          المنتج
                        </th>
                        <th
                          scope="col"
                          className="px-4 md:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          السعر
                        </th>
                        <th
                          scope="col"
                          className="px-4 md:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          الكمية
                        </th>
                        <th
                          scope="col"
                          className="px-4 md:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          الإجمالي
                        </th>
                        <th
                          scope="col"
                          className="px-4 md:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          <span className="sr-only">حذف</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {cartItems.map((item) => (
                        <tr key={item.id}>
                          <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 relative flex-shrink-0">
                                <Image
                                  src={item.imageUrl || "/placeholder-product.jpg"}
                                  alt={item.name}
                                  fill
                                  className="object-cover rounded-md"
                                />
                              </div>
                              <div className="mr-2 md:mr-4">
                                <div className="text-sm font-medium text-gray-900 line-clamp-1">{item.name}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.price} جنيه
                          </td>
                          <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="p-1 rounded-md bg-gray-100 hover:bg-gray-200"
                              >
                                -
                              </button>
                              <span className="mx-2 w-6 text-center">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="p-1 rounded-md bg-gray-100 hover:bg-gray-200"
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                            {(item.price * item.quantity).toFixed(2)} جنيه
                          </td>
                          <td className="px-4 md:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button onClick={() => removeItem(item.id)} className="text-red-600 hover:text-red-900">
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold mb-4">ملخص الطلب</h2>

                <div className="space-y-4">
                  <div className="flex justify-between border-b border-gray-200 pb-4">
                    <span>إجمالي المنتجات</span>
                    <span>{cartTotal.toFixed(2)} جنيه</span>
                  </div>

                  <div className="flex justify-between font-semibold">
                    <span>الإجمالي</span>
                    <span>{cartTotal.toFixed(2)} جنيه</span>
                  </div>

                  <Link
                    href="/checkout"
                    className="w-full flex justify-center items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <ShoppingBag className="ml-2 h-5 w-5" />
                    إتمام الطلب
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="flex flex-col items-center">
              <ShoppingBag className="h-16 w-16 text-gray-400 mb-4" />
              <h2 className="text-2xl font-semibold mb-2">سلة التسوق فارغة</h2>
              <p className="text-gray-600 mb-6">لم تقم بإضافة أي منتجات إلى سلة التسوق بعد</p>
              <Link
                href="/products"
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                تصفح المنتجات
              </Link>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
