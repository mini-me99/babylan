"use client"

import { useState, useEffect } from "react"
import { createClientSupabaseClient } from "@/lib/supabase"
import { useParams } from "next/navigation"
import { Navbar } from "@/components/ui/navbar"
import { Footer } from "@/components/ui/footer"
import Image from "next/image"
import { ShoppingCart, ArrowRight, Plus, Minus } from "lucide-react"
import Link from "next/link"
import { addToCart } from "@/lib/cart"
import { toast } from "@/components/ui/use-toast"

export default function ProductDetails() {
  const params = useParams()
  const [product, setProduct] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    async function fetchProduct() {
      try {
        const supabase = createClientSupabaseClient()
        const { data, error } = await supabase.from("products").select("*").eq("id", params.id).single()

        if (error) throw error
        setProduct(data)
      } catch (err: any) {
        setError(err.message || "حدث خطأ أثناء جلب بيانات المنتج")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProduct()
  }, [params.id])

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

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1)
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            {error || "لم يتم العثور على المنتج"}
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/products" className="flex items-center text-blue-500 hover:text-blue-700">
            <ArrowRight className="ml-2 h-4 w-4" />
            <span>العودة إلى المنتجات</span>
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
            <div className="relative h-64 md:h-96 w-full">
              <Image
                src={product.image_url || "/placeholder-product.jpg"}
                alt={product.name}
                fill
                className="object-contain rounded-lg"
              />

              {/* إشارة نفاد المخزون */}
              {product.quantity === 0 && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-md text-sm font-bold">
                  نفذت الكمية
                </div>
              )}
            </div>

            <div>
              <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

              {product.description && (
                <div className="mb-6">
                  <h2 className="text-lg font-semibold mb-2">الوصف</h2>
                  <p className="text-gray-600">{product.description}</p>
                </div>
              )}

              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">المعلومات</h2>
                <div className="space-y-2">
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="text-gray-600">الباركود:</span>
                    <span>{product.barcode}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="text-gray-600">السعر:</span>
                    <span className="font-semibold">{product.price || 0} جنيه</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="text-gray-600">الحالة:</span>
                    <span className={product.quantity > 0 ? "text-green-600" : "text-red-600"}>
                      {product.quantity > 0 ? (product.quantity <= 5 ? "متوفر (كمية محدودة)" : "متوفر") : "غير متوفر"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-3">الكمية</h2>
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
                  className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <ShoppingCart className="ml-2 h-5 w-5" />
                  إضافة إلى السلة
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
