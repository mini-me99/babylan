"use client"

import { useState } from "react"
import { formatDate } from "@/lib/utils"
import { updateOrderStatus } from "@/lib/actions"
import Image from "next/image"
import { Printer, ZoomIn } from "lucide-react"

interface OrderDetailsClientProps {
  order: any
  orderItems: any[]
  totalAmount: number
}

export default function OrderDetailsClient({ order, orderItems, totalAmount }: OrderDetailsClientProps) {
  const [showPaymentImage, setShowPaymentImage] = useState(false)

  // استخراج رقم الطلب من المعرف
  const orderNumber = order.order_number || "غير محدد"

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">تفاصيل الطلب #{orderNumber}</h1>
        <button
          onClick={() => window.print()}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 print:hidden"
        >
          <Printer className="ml-2 h-5 w-5" />
          طباعة الفاتورة
        </button>
      </div>

      {/* قسم الطباعة - سيظهر فقط عند الطباعة */}
      <div className="hidden print:block mb-8 border-b-2 border-gray-300 pb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">فاتورة</h1>
            <p className="text-lg">بيبي لاند - متجر منتجات الأطفال</p>
          </div>
          <div className="text-left">
            <p className="font-bold">رقم الطلب: #{orderNumber}</p>
            <p>التاريخ: {formatDate(order.created_at)}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* معلومات العميل */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">معلومات العميل</h2>
          <div className="space-y-3">
            <div>
              <span className="text-gray-600">الاسم:</span>
              <span className="font-medium mr-2">{order.customer_name}</span>
            </div>
            <div>
              <span className="text-gray-600">اسم المحل:</span>
              <span className="font-medium mr-2">{order.store_name || "غير محدد"}</span>
            </div>
            <div>
              <span className="text-gray-600">رقم الهاتف:</span>
              <span className="font-medium mr-2">{order.phone}</span>
            </div>
            <div>
              <span className="text-gray-600">العنوان:</span>
              <span className="font-medium mr-2">{order.address}</span>
            </div>
          </div>
        </div>

        {/* معلومات الشحن */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">معلومات الشحن</h2>
          <div className="space-y-3">
            <div>
              <span className="text-gray-600">شركة الشحن:</span>
              <span className="font-medium mr-2">{order.shipping_company || "غير محدد"}</span>
            </div>
            <div>
              <span className="text-gray-600">تاريخ التسليم:</span>
              <span className="font-medium mr-2">
                {order.delivery_date ? formatDate(order.delivery_date) : "غير محدد"}
              </span>
            </div>
            <div>
              <span className="text-gray-600">العربون:</span>
              <span className="font-medium mr-2">{order.deposit ? `${order.deposit} جنيه` : "لا يوجد"}</span>
            </div>
          </div>
        </div>

        {/* معلومات الدفع */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">معلومات الدفع</h2>
          <div className="space-y-3">
            <div>
              <span className="text-gray-600">طريقة الدفع:</span>
              <span className="font-medium mr-2">{order.payment_method}</span>
            </div>
            <div>
              <span className="text-gray-600">تاريخ الطلب:</span>
              <span className="font-medium mr-2">{formatDate(order.created_at)}</span>
            </div>
            <div>
              <span className="text-gray-600">حالة الطلب:</span>
              <span
                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mr-2 ${
                  order.status === "جديد"
                    ? "bg-blue-100 text-blue-800"
                    : order.status === "قيد المعالجة"
                      ? "bg-yellow-100 text-yellow-800"
                      : order.status === "تم الشحن"
                        ? "bg-purple-100 text-purple-800"
                        : order.status === "تم التسليم"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                }`}
              >
                {order.status}
              </span>
            </div>

            {order.payment_method === "إنستا باي" && order.payment_screenshot_url && (
              <div>
                <span className="text-gray-600 block mb-2">صورة إيصال الدفع:</span>
                <div className="relative h-40 w-full cursor-pointer" onClick={() => setShowPaymentImage(true)}>
                  <Image
                    src={order.payment_screenshot_url || "/placeholder.svg"}
                    alt="إيصال الدفع"
                    fill
                    className="object-contain rounded-md"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 opacity-0 hover:opacity-100 transition-opacity">
                    <ZoomIn className="h-8 w-8 text-white" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* تغيير حالة الطلب */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8 print:hidden">
        <h2 className="text-xl font-semibold mb-4">تغيير حالة الطلب</h2>
        <form action={updateOrderStatus.bind(null, order.id)}>
          <div className="flex flex-wrap gap-4">
            <button
              type="submit"
              name="status"
              value="جديد"
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                order.status === "جديد"
                  ? "bg-blue-100 text-blue-800 border-2 border-blue-500"
                  : "bg-blue-50 text-blue-600 hover:bg-blue-100"
              }`}
            >
              جديد
            </button>
            <button
              type="submit"
              name="status"
              value="قيد المعالجة"
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                order.status === "قيد المعالجة"
                  ? "bg-yellow-100 text-yellow-800 border-2 border-yellow-500"
                  : "bg-yellow-50 text-yellow-600 hover:bg-yellow-100"
              }`}
            >
              قيد المعالجة
            </button>
            <button
              type="submit"
              name="status"
              value="تم الشحن"
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                order.status === "تم الشحن"
                  ? "bg-purple-100 text-purple-800 border-2 border-purple-500"
                  : "bg-purple-50 text-purple-600 hover:bg-purple-100"
              }`}
            >
              تم الشحن
            </button>
            <button
              type="submit"
              name="status"
              value="تم التسليم"
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                order.status === "تم التسليم"
                  ? "bg-green-100 text-green-800 border-2 border-green-500"
                  : "bg-green-50 text-green-600 hover:bg-green-100"
              }`}
            >
              تم التسليم
            </button>
            <button
              type="submit"
              name="status"
              value="ملغي"
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                order.status === "ملغي"
                  ? "bg-red-100 text-red-800 border-2 border-red-500"
                  : "bg-red-50 text-red-600 hover:bg-red-100"
              }`}
            >
              ملغي
            </button>
          </div>
        </form>
      </div>

      {/* عناصر الطلب */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold">عناصر الطلب</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  المنتج
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  الباركود
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  الكمية
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  السعر
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  الإجمالي
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orderItems.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-20 w-20 relative flex-shrink-0 print:h-24 print:w-24">
                        <Image
                          src={item.product?.image_url || "/placeholder-product.jpg"}
                          alt={item.product?.name || "منتج"}
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>
                      <div className="mr-4">
                        <div className="text-sm font-medium text-gray-900">
                          {item.product?.name || "منتج غير متوفر"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.product?.barcode || "غير متوفر"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.quantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.price} جنيه</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                    {(item.price * item.quantity).toFixed(2)} جنيه
                  </td>
                </tr>
              ))}

              {orderItems.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                    لا توجد عناصر في هذا الطلب
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot className="bg-gray-50">
              <tr>
                <td colSpan={4} className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                  الإجمالي
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">
                  {totalAmount.toFixed(2)} جنيه
                </td>
              </tr>
              {order.deposit > 0 && (
                <>
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                      العربون
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">
                      {order.deposit.toFixed(2)} جنيه
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                      المتبقي
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">
                      {(totalAmount - order.deposit).toFixed(2)} جنيه
                    </td>
                  </tr>
                </>
              )}
            </tfoot>
          </table>
        </div>
      </div>

      {/* معلومات المتجر للطباعة فقط */}
      <div className="hidden print:block mt-12 text-center text-sm text-gray-500">
        <p>بيبي لاند - متجر منتجات الأطفال</p>
        <p>هاتف: 01001608562 - البريد الإلكتروني: landbaby815@gmail.com</p>
        <p>حدائق الاهرام، الجيزة، مصر</p>
      </div>

      {/* نافذة منبثقة لعرض صورة إثبات الدفع بشكل أكبر */}
      {showPaymentImage && order.payment_screenshot_url && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setShowPaymentImage(false)}
        >
          <div className="relative w-full max-w-3xl h-auto max-h-[80vh] bg-white rounded-lg overflow-hidden">
            <div className="absolute top-2 right-2 z-10">
              <button onClick={() => setShowPaymentImage(false)} className="bg-white rounded-full p-2 shadow-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="relative w-full h-[70vh]">
              <Image
                src={order.payment_screenshot_url || "/placeholder.svg"}
                alt="إثبات الدفع"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
