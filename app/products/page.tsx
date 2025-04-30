import { createServerSupabaseClient } from "@/lib/supabase"
import { Navbar } from "@/components/ui/navbar"
import { Footer } from "@/components/ui/footer"
import { ProductCard } from "@/components/ui/product-card"
import { Search } from "lucide-react"

export default async function ProductsPage() {
  const supabase = createServerSupabaseClient()

  // جلب جميع المنتجات
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false })

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center md:text-right">منتجاتنا</h1>

        {/* البحث */}
        <div className="mb-8">
          <div className="relative">
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full p-3 md:p-4 pr-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500"
              placeholder="ابحث عن منتج..."
            />
          </div>
        </div>

        {/* قائمة المنتجات */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products?.map((product) => (
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

          {(!products || products.length === 0) && (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">لا توجد منتجات متاحة حالياً</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
