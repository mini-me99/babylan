"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { createClientSupabaseClient } from "@/lib/supabase"
import { generateBarcodeSVG } from "@/lib/utils"
import { Printer, Download } from "lucide-react"

export default function ProductBarcode() {
  const params = useParams()
  const [product, setProduct] = useState<any>(null)
  const [barcodeSVG, setBarcodeSVG] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProduct() {
      setIsLoading(true)
      setError(null)

      try {
        const supabase = createClientSupabaseClient()

        const { data, error } = await supabase.from("products").select("*").eq("id", params.id).single()

        if (error) throw error

        setProduct(data)

        // إنشاء الباركود
        if (data.barcode) {
          const svg = generateBarcodeSVG(data.barcode)
          setBarcodeSVG(svg)
        }
      } catch (err: any) {
        setError(err.message || "حدث خطأ أثناء جلب بيانات المنتج")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProduct()
  }, [params.id])

  // طباعة الباركود
  const handlePrint = () => {
    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    printWindow.document.write(`
      <html>
        <head>
          <title>باركود ${product?.name || ""}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              text-align: center;
              padding: 20px;
            }
            .barcode-container {
              margin: 20px auto;
              max-width: 300px;
            }
            .product-name {
              font-size: 18px;
              margin-bottom: 10px;
            }
            .barcode-number {
              font-size: 14px;
              margin-top: 10px;
            }
          </style>
        </head>
        <body>
          <div class="barcode-container">
            <div class="product-name">${product?.name || ""}</div>
            <img src="${barcodeSVG}" alt="Barcode" style="max-width: 100%;" />
            <div class="barcode-number">${product?.barcode || ""}</div>
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `)

    printWindow.document.close()
  }

  // تنزيل الباركود
  const handleDownload = () => {
    if (!barcodeSVG) return

    const link = document.createElement("a")
    link.href = barcodeSVG
    link.download = `barcode-${product?.barcode || "product"}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error || "لم يتم العثور على المنتج"}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">باركود المنتج</h1>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
          <p className="text-gray-600">رقم الباركود: {product.barcode}</p>
        </div>

        <div className="flex justify-center mb-8">
          {barcodeSVG ? (
            <div className="p-4 border border-gray-200 rounded-lg">
              <img src={barcodeSVG || "/placeholder.svg"} alt="Barcode" className="max-w-full h-auto" />
            </div>
          ) : (
            <p className="text-red-500">لا يمكن إنشاء الباركود</p>
          )}
        </div>

        <div className="flex justify-center space-x-4 space-x-reverse">
          <button
            onClick={handlePrint}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Printer className="ml-2 h-5 w-5" />
            طباعة الباركود
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            <Download className="ml-2 h-5 w-5" />
            تنزيل الباركود
          </button>
        </div>
      </div>
    </div>
  )
}
