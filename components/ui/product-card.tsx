"use client"

import type React from "react"

import Image from "next/image"
import { ShoppingCart, Eye, Plus, Minus } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import { addToCart } from "@/lib/cart"
import { toast } from "@/components/ui/use-toast"

interface ProductCardProps {
  id: string
  name: string
  description?: string
  imageUrl?: string
  price?: number
  quantity?: number
  onAddToCart?: () => void
}

export function ProductCard({
  id,
  name,
  description,
  imageUrl,
  price = 0,
  quantity = 0,
  onAddToCart,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [selectedQuantity, setSelectedQuantity] = useState(1)

  const handleAddToCart = () => {
    try {
      addToCart({
        id,
        name,
        price,
        quantity: selectedQuantity,
        imageUrl,
      })

      // Show success toast
      toast({
        title: "تمت الإضافة إلى السلة",
        description: `تمت إضافة ${selectedQuantity} ${selectedQuantity > 1 ? "قطع" : "قطعة"} من ${name} إلى سلة التسوق`,
      })

      // Call the onAddToCart callback if provided
      if (onAddToCart) onAddToCart()

      // إعادة تعيين الكمية إلى 1 بعد الإضافة
      setSelectedQuantity(1)
    } catch (error) {
      console.error("Error adding item to cart:", error)
      toast({
        title: "حدث خطأ",
        description: "لم نتمكن من إضافة المنتج إلى السلة",
        variant: "destructive",
      })
    }
  }

  const incrementQuantity = (e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedQuantity((prev) => prev + 1)
  }

  const decrementQuantity = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (selectedQuantity > 1) {
      setSelectedQuantity((prev) => prev - 1)
    }
  }

  return (
    <div className="card hover-float" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <div className="relative overflow-hidden h-48">
        <Image
          src={imageUrl || "/placeholder-product.jpg"}
          alt={name}
          fill
          className="object-cover transition-transform duration-500"
          style={{ transform: isHovered ? "scale(1.05)" : "scale(1)" }}
        />

        {/* أزرار العمل */}
        <div
          className={`absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="flex items-center justify-center space-x-4 space-x-reverse mb-4">
            <button
              onClick={decrementQuantity}
              className="p-2 bg-white rounded-full text-blue-500 hover:bg-blue-500 hover:text-white transition-colors"
              aria-label="تقليل الكمية"
            >
              <Minus className="h-4 w-4" />
            </button>

            <span className="bg-white px-4 py-1 rounded-full text-gray-800 font-bold">{selectedQuantity}</span>

            <button
              onClick={incrementQuantity}
              className="p-2 bg-white rounded-full text-blue-500 hover:bg-blue-500 hover:text-white transition-colors"
              aria-label="زيادة الكمية"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center space-x-4 space-x-reverse">
            <button
              onClick={handleAddToCart}
              className="p-2 bg-white rounded-full text-blue-500 hover:bg-blue-500 hover:text-white transition-colors"
              aria-label="إضافة إلى السلة"
            >
              <ShoppingCart className="h-5 w-5" />
            </button>

            <Link
              href={`/products/${id}`}
              className="p-2 bg-white rounded-full text-blue-500 hover:bg-blue-500 hover:text-white transition-colors"
              aria-label="عرض التفاصيل"
            >
              <Eye className="h-5 w-5" />
            </Link>
          </div>
        </div>

        {/* إشارة نفاد المخزون */}
        {quantity === 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold">
            نفذت الكمية
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-1">{name}</h3>
        <div className="flex justify-between items-center">
          <p className="text-blue-600 font-bold">{price} جنيه</p>
          {quantity <= 5 && quantity > 0 && <p className="text-yellow-600 text-sm">كمية محدودة</p>}
        </div>
        {description && <p className="text-gray-600 text-sm line-clamp-2 mt-1">{description}</p>}
      </div>
    </div>
  )
}
