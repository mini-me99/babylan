import { createServerSupabaseClient } from "@/lib/supabase"
import { Navbar } from "@/components/ui/navbar"
import { Footer } from "@/components/ui/footer"
import { ProductCard } from "@/components/ui/product-card"
import Link from "next/link"
import Image from "next/image"

export default async function Home() {
  const supabase = createServerSupabaseClient()

  // جلب أحدث المنتجات
  const { data: latestProducts } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(4)

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* قسم الترحيب */}
      <section className="baby-gradient text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center text-center">
            <div className="relative h-32 w-32 mb-6">
              <Image src="/babyland-logo.png" alt="بيبي لاند" fill className="object-contain" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">مرحباً بكم في بيبي لاند</h1>
            <p className="text-xl mb-6">كل ما يحتاجه طفلك في مكان واحد</p>
            <div className="flex space-x-4 space-x-reverse">
              <Link
                href="/products"
                className="bg-white text-blue-500 hover:bg-blue-100 px-6 py-3 rounded-md font-bold transition-colors"
              >
                تسوق الآن
              </Link>
              <Link
                href="/scanner"
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-500 px-6 py-3 rounded-md font-bold transition-colors"
              >
                مسح الباركود
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* قسم المنتجات */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">أحدث المنتجات</h2>
            <Link href="/products" className="text-blue-500 hover:text-blue-700 font-medium">
              عرض الكل
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {latestProducts?.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                description={product.description}
                imageUrl={product.image_url}
                price={product.price || 0}
                quantity={product.quantity}
              />
            ))}

            {(!latestProducts || latestProducts.length === 0) && (
              <p className="col-span-full text-center text-gray-500 py-8">لا توجد منتجات متاحة حالياً</p>
            )}
          </div>
        </div>
      </section>

      {/* قسم المميزات */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">لماذا بيبي لاند؟</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center hover-float">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-blue-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">جودة عالية</h3>
              <p className="text-gray-600">نقدم منتجات ذات جودة عالية وآمنة لطفلك</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center hover-float">
              <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-pink-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">توصيل سريع</h3>
              <p className="text-gray-600">نضمن وصول طلبك في أسرع وقت ممكن</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center hover-float">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-blue-500"
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
              </div>
              <h3 className="text-xl font-semibold mb-2">دفع آمن</h3>
              <p className="text-gray-600">طرق دفع متعددة وآمنة لراحتك</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
