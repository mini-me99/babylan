"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { addProduct } from "@/lib/actions"
import { AlertCircle } from "lucide-react"

export default function AddProduct() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const router = useRouter()

  // معالجة تغيير الصورة
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // عرض معاينة للصورة
      const reader = new FileReader()
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setImagePreview(null)
    }
  }

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true)
    setError(null)
    setSuccess(null)

    try {
      // استخدام FormData مباشرة
      const name = formData.get("name") as string
      const description = formData.get("description") as string
      const quantity = Number.parseInt(formData.get("quantity") as string)
      const price = Number.parseFloat((formData.get("price") as string) || "0")
      const imageFile = formData.get("image") as File

      // التحقق من صحة البيانات
      if (!name || isNaN(quantity)) {
        setError("يرجى ملء جميع الحقول المطلوبة")
        setIsSubmitting(false)
        return
      }

      const result = await addProduct(formData)

      if (result.error) {
        setError(result.error)
        // إذا كان الخطأ متعلقًا بالصورة فقط، نعرض رسالة نجاح جزئية
        if (result.error.includes("بدون صورة")) {
          setSuccess("تم إضافة المنتج بنجاح ولكن بدون صورة")
          // الانتقال إلى صفحة المنتجات بعد 3 ثوانٍ
          setTimeout(() => {
            router.push("/admin/products")
          }, 3000)
        }
      } else {
        setSuccess("تم إضافة المنتج بنجاح")

        // إذا تم إنشاء الباركود بنجاح، انتقل إلى صفحة الباركود
        if (result.product && result.product.id) {
          setTimeout(() => {
            router.push(`/admin/products/${result.product.id}/barcode`)
          }, 1000)
        } else {
          // الانتقال إلى صفحة المنتجات بعد ثانية واحدة
          setTimeout(() => {
            router.push("/admin/products")
          }, 1000)
        }
      }
    } catch (err: any) {
      setError(err.message || "حدث خطأ أثناء إضافة المنتج")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">إضافة منتج جديد</h1>

      <div className="bg-white rounded-lg shadow-md p-6">
        {success && (
          <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
            {success}
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 mt-0.5" />
            <div>
              <p className="font-bold">خطأ</p>
              <p>{error}</p>
            </div>
          </div>
        )}

        <form action={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              اسم المنتج <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              وصف المنتج
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
          </div>

          <div className="mb-4">
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
              السعر <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="price"
              name="price"
              min="0"
              step="0.01"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
              الكمية المتوفرة <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              min="0"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
              صورة المنتج
            </label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="mt-1 text-sm text-gray-500">الحد الأقصى لحجم الصورة: 5 ميجابايت</p>

            {imagePreview && (
              <div className="mt-2">
                <p className="text-sm text-gray-700 mb-1">معاينة الصورة:</p>
                <div className="relative h-40 w-40 border border-gray-200 rounded-md overflow-hidden">
                  <img src={imagePreview || "/placeholder.svg"} alt="معاينة" className="object-cover w-full h-full" />
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end space-x-4 space-x-reverse">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
            >
              {isSubmitting ? "جاري الإضافة..." : "إضافة المنتج"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
