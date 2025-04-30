import Link from "next/link"
import Image from "next/image"

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="relative h-32 w-32 mb-6">
        <Image src="/babyland-logo.png" alt="بيبي لاند" fill className="object-contain" />
      </div>
      <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-700 mb-6">الصفحة غير موجودة</h2>
      <p className="text-gray-600 mb-8 text-center">عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها.</p>
      <Link href="/" className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
        العودة إلى الصفحة الرئيسية
      </Link>
    </div>
  )
}
