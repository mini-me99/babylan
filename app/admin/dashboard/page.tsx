import { createServerSupabaseClient } from "@/lib/supabase"
import { formatDate } from "@/lib/utils"
import Link from "next/link"
import { Package, ShoppingBag, AlertCircle } from "lucide-react"

export default async function AdminDashboard() {
  const supabase = createServerSupabaseClient()

  // إحصائيات المنتجات
  const { data: productsData, error: productsError } = await supabase
    .from("products")
    .select("id, name, quantity, price")

  // إحصائيات الطلبات
  const { data: ordersData, error: ordersError } = await supabase
    .from("orders")
    .select("id, order_number, status, created_at")
    .order("created_at", { ascending: false })
    .limit(5)

  // حساب الإحصائيات
  const totalProducts = productsData?.length || 0
  const lowStockProducts = productsData?.filter((p) => p.quantity < 5).length || 0
  const outOfStockProducts = productsData?.filter((p) => p.quantity === 0).length || 0
  const totalOrders = ordersData?.length || 0
  const newOrders = ordersData?.filter((o) => o.status === "جديد").length || 0

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">لوحة التحكم</h1>

      {/* بطاقات الإحصائيات */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-500">
              <Package className="h-8 w-8" />
            </div>
            <div className="mr-4">
              <p className="text-gray-500 text-sm">إجمالي المنتجات</p>
              <p className="text-2xl font-bold">{totalProducts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-500">
              <AlertCircle className="h-8 w-8" />
            </div>
            <div className="mr-4">
              <p className="text-gray-500 text-sm">منتجات قليلة المخزون</p>
              <p className="text-2xl font-bold">{lowStockProducts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 text-red-500">
              <AlertCircle className="h-8 w-8" />
            </div>
            <div className="mr-4">
              <p className="text-gray-500 text-sm">منتجات نفذت من المخزون</p>
              <p className="text-2xl font-bold">{outOfStockProducts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-500">
              <ShoppingBag className="h-8 w-8" />
            </div>
            <div className="mr-4">
              <p className="text-gray-500 text-sm">طلبات جديدة</p>
              <p className="text-2xl font-bold">{newOrders}</p>
            </div>
          </div>
        </div>
      </div>

      {/* أحدث الطلبات */}
      <div className="bg-white rounded-lg shadow-md mb-8">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold">أحدث الطلبات</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  رقم الطلب
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  التاريخ
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  الحالة
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {ordersData?.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{order.order_number || order.id.substring(0, 8)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(order.created_at)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
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
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <Link href={`/admin/orders/${order.id}`} className="text-blue-600 hover:text-blue-900">
                      عرض التفاصيل
                    </Link>
                  </td>
                </tr>
              ))}

              {(!ordersData || ordersData.length === 0) && (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                    لا توجد طلبات حالياً
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-gray-200">
          <Link href="/admin/orders" className="text-blue-600 hover:text-blue-900 text-sm font-medium">
            عرض جميع الطلبات
          </Link>
        </div>
      </div>

      {/* منتجات قليلة المخزون */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold">منتجات قليلة المخزون</h2>
        </div>
        <div className="p-6">
          {lowStockProducts > 0 ? (
            <div>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div className="mr-3">
                    <p className="text-sm text-yellow-700">
                      يوجد {lowStockProducts} منتج بكمية قليلة في المخزون. يرجى التحقق من صفحة المنتجات لإعادة الطلب.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                {productsData
                  ?.filter((p) => p.quantity < 5 && p.quantity > 0)
                  .map((product) => (
                    <div key={product.id} className="flex justify-between items-center border-b border-gray-200 pb-2">
                      <div>
                        <Link href={`/admin/products/${product.id}`} className="text-blue-600 hover:text-blue-900">
                          {product.name}
                        </Link>
                      </div>
                      <div className="text-yellow-600 font-medium">المتبقي: {product.quantity} قطعة</div>
                    </div>
                  ))}
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500">جميع المنتجات متوفرة بكميات كافية في المخزون.</p>
          )}

          {outOfStockProducts > 0 && (
            <div className="mt-6">
              <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="mr-3">
                    <p className="text-sm text-red-700">
                      يوجد {outOfStockProducts} منتج نفذ من المخزون. يرجى إعادة تعبئة المخزون في أقرب وقت.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                {productsData
                  ?.filter((p) => p.quantity === 0)
                  .map((product) => (
                    <div key={product.id} className="flex justify-between items-center border-b border-gray-200 pb-2">
                      <div>
                        <Link href={`/admin/products/${product.id}`} className="text-blue-600 hover:text-blue-900">
                          {product.name}
                        </Link>
                      </div>
                      <div className="text-red-600 font-bold">نفذت الكمية</div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          <div className="mt-4">
            <Link href="/admin/products" className="text-blue-600 hover:text-blue-900 text-sm font-medium">
              إدارة المنتجات
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
