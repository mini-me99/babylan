import Link from "next/link"

export default function ProductNotFound() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">لم يتم العثور على المنتج</h1>
        <p className="text-gray-600 mb-6">عذراً، المنتج الذي تبحث عنه غير موجود أو تم حذفه.</p>
        <Link
          href="/admin/products"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          العودة إلى قائمة المنتجات
        </Link>
      </div>
    </div>
  )
}
