"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/ui/navbar"
import { Footer } from "@/components/ui/footer"
import { BarcodeScanner } from "@/components/ui/barcode-scanner"
import { createClientSupabaseClient } from "@/lib/supabase"
import Image from "next/image"
import { ShoppingCart, Plus, Minus } from "lucide-react"
import Link from "next/link"
import { addToCart } from "@/lib/cart"
import { toast } from "@/components/ui/use-toast"

export default function ScannerPage() {
  const [scannedBarcode, setScannedBarcode] = useState<string | null>(null)
  const [product, setProduct] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)

  // البحث عن المنتج بالباركود
  useEffect(() => {
    async function searchProduct() {
      if (!scannedBarcode) return

      setIsLoading(true)
      setError(null)

      try {
        const supabase = createClientSupabaseClient()

        const { data, error } = await supabase.from("products").select("*").eq("barcode", scannedBarcode).single()

        if (error) {
          setError("لم يتم العثور على منتج بهذا الباركود")
          setProduct(null)
        } else {
          setProduct(data)
          setError(null)
          // إعادة تعيين الكمية إلى 1 عند العثور على منتج جديد
          setQuantity(1)
        }
      } catch (err: any) {
        setError(err.message || "حدث خطأ أثناء البحث عن المنتج")
        setProduct(null)
      } finally {
        setIsLoading(false)
      }
    }

    searchProduct()
  }, [scannedBarcode])

  const handleScan = (barcode: string) => {
    setScannedBarcode(barcode)
  }

  const handleError = (error: string) => {
    setError(error)
  }

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1)
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1)
    }
  }

  const handleAddToCart = () => {
    if (!product) return

    try {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price || 0,
        quantity: quantity,
        imageUrl: product.image_url,
      })

      toast({
        title: "تمت الإضافة إلى السلة",
        description: `تمت إضافة ${quantity} ${quantity > 1 ? "قطع" : "قطعة"} من ${product.name} إلى سلة التسوق`,
      })

      // إعادة تعيين الكمية إلى 1 بعد الإضافة
      setQuantity(1)
    } catch (error) {
      console.error("Error adding item to cart:", error)
      toast({
        title: "حدث خطأ",
        description: "لم نتمكن من إضافة المنتج إلى السلة",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">مسح الباركود</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">مسح باركود المنتج</h2>
            <BarcodeScanner onScan={handleScan} onError={handleError} />

            {scannedBarcode && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-blue-700">تم مسح الباركود: {scannedBarcode}</p>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">معلومات المنتج</h2>

            {isLoading && (
              <div className="flex justify-center items-center h-64">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
              </div>
            )}

            {error && !isLoading && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md">{error}</div>
            )}

            {product && !isLoading && (
              <div>
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/3 mb-4 md:mb-0">
                    <div className="relative h-40 w-full">
                      <Image
                        src={product.image_url || "/placeholder-product.jpg"}
                        alt={product.name}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                  </div>

                  <div className="md:w-2/3 md:pr-6">
                    <h3 className="text-lg font-semibold mb-2">{product.name}</h3>

                    <div className="space-y-2 mb-4">
                      <div>
                        <span className="text-gray-600">الباركود:</span>
                        <span className="font-medium mr-2">{product.barcode}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">السعر:</span>
                        <span className="font-medium mr-2">{product.price || 0} جنيه</span>
                      </div>
                      <div>
                        <span className="text-gray-600">الحالة:</span>
                        <span
                          className={`font-medium mr-2 ${product.quantity > 0 ? "text-green-600" : "text-red-600"}`}
                        >
                          {product.quantity > 0
                            ? product.quantity <= 5
                              ? "متوفر (كمية محدودة)"
                              : "متوفر"
                            : "غير متوفر"}
                        </span>
                      </div>
                    </div>

                    {product.description && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-1">الوصف:</h4>
                        <p className="text-gray-600 text-sm">{product.description}</p>
                      </div>
                    )}

                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">الكمية:</h4>
                      <div className="flex items-center">
                        <button
                          onClick={decrementQuantity}
                          className="p-2 bg-gray-100 rounded-md text-gray-700 hover:bg-gray-200"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="mx-4 w-10 text-center font-bold">{quantity}</span>
                        <button
                          onClick={incrementQuantity}
                          className="p-2 bg-gray-100 rounded-md text-gray-700 hover:bg-gray-200"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="flex space-x-4 space-x-reverse">
                      <button
                        onClick={handleAddToCart}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        <ShoppingCart className="ml-2 h-5 w-5" />
                        إضافة إلى السلة
                      </button>
                      <Link
                        href={`/products/${product.id}`}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                      >
                        عرض التفاصيل
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!product && !error && !isLoading && !scannedBarcode && (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
                <p>قم بمسح باركود المنتج للحصول على معلوماته</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
