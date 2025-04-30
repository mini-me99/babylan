"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { updateProduct, deleteProduct } from "@/lib/actions"
import { createClientSupabaseClient } from "@/lib/supabase"
import Image from "next/image"
import { AlertCircle } from "lucide-react"

export default function EditProduct() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  // جلب بيانات المنتج
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
      formData.append("id", params.id as string)

      const result = await updateProduct(formData)

      if (result.error) {
        setError(result.error)
      } else {
        setSuccess("تم تحديث المنتج بنجاح")
        // الانتقال إلى صفحة المنتجات بعد ثانية واحدة
        setTimeout(() => {
          router.push("/admin/products")
        }, 1000)
      }
    } catch (err: any) {
      setError(err.message || "حدث خطأ أثناء تحديث المنتج")
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDelete() {
    if (!confirm("هل أنت متأكد من حذف هذا المنتج؟")) return

    setIsSubmitting(true)
    setError(null)

    try {
      const result = await deleteProduct(params.id as string)

      if (result.error) {
        setError(result.error)
      } else {
        router.push("/admin/products")
      }
    } catch (err: any) {
      setError(err.message || "حدث خطأ أثناء حذف المنتج")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          لم يتم العثور على المنتج
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">تعديل المنتج</h1>

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
              defaultValue={product.name}
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
              defaultValue={product.description || ""}
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
              defaultValue={product.price || 0}
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
              defaultValue={product.quantity}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">الصورة الحالية</label>
            {product.image_url ? (
              <div className="relative h-40 w-40 mb-2">
                <Image
                  src={product.image_url || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover rounded-md"
                />
              </div>
            ) : (
              <p className="text-sm text-gray-500">لا توجد صورة</p>
            )}
          </div>

          <div className="mb-6">
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
              تغيير الصورة
            </label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="mt-1 text-sm text-gray-500">اترك هذا الحقل فارغًا إذا كنت لا ترغب في تغيير الصورة</p>

            {imagePreview && (
              <div className="mt-2">
                <p className="text-sm text-gray-700 mb-1">معاينة الصورة الجديدة:</p>
                <div className="relative h-40 w-40 border border-gray-200 rounded-md overflow-hidden">
                  <img src={imagePreview || "/placeholder.svg"} alt="معاينة" className="object-cover w-full h-full" />
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              حذف المنتج
            </button>

            <div className="flex items-center space-x-4 space-x-reverse">
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
                {isSubmitting ? "جاري الحفظ..." : "حفظ التغييرات"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
