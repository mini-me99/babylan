"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ShoppingCart, Menu, X, User } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { getCartItemsCount } from "@/lib/cart"

export function Navbar({ cartItemsCount = 0 }: { cartItemsCount?: number }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [localCartCount, setLocalCartCount] = useState(0)
  const pathname = usePathname()
  const router = useRouter()

  // التحقق من حالة المصادقة عند تحميل المكون
  useEffect(() => {
    const checkAuth = () => {
      const isAuth = document.cookie.includes("admin_authenticated=true")
      setIsAdmin(isAuth || pathname.startsWith("/admin"))
    }

    checkAuth()

    // إعادة التحقق عند تغيير المسار
    window.addEventListener("focus", checkAuth)
    return () => window.removeEventListener("focus", checkAuth)
  }, [pathname])

  // Update cart count when it changes
  useEffect(() => {
    // Initial cart count
    setLocalCartCount(getCartItemsCount())

    // Listen for cart updates
    const handleCartUpdate = () => {
      setLocalCartCount(getCartItemsCount())
    }

    window.addEventListener("cart-updated", handleCartUpdate)

    return () => {
      window.removeEventListener("cart-updated", handleCartUpdate)
    }
  }, [])

  const handleLogoClick = (e: React.MouseEvent) => {
    if (!isAdmin) {
      e.preventDefault()
      setShowLoginModal(true)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // التحقق من كلمة المرور مباشرة
      if (password === "1980") {
        // تعيين ملف تعريف ارتباط للمصادقة
        document.cookie = "admin_authenticated=true; path=/; max-age=86400"
        setIsAdmin(true)
        setShowLoginModal(false)

        // إعادة توجيه المستخدم إلى لوحة التحكم
        router.push("/admin/dashboard")
      } else {
        setError("كلمة المرور غير صحيحة")
      }
    } catch (err) {
      setError("حدث خطأ أثناء تسجيل الدخول")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <nav className="sticky top-0 z-50 w-full bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* الشعار */}
          <div className="flex-shrink-0">
            <Link href={isAdmin ? "/admin/dashboard" : "#"} className="flex items-center" onClick={handleLogoClick}>
              <div className="relative h-12 w-12 mr-2">
                <Image src="/babyland-logo.png" alt="بيبي لاند" fill className="object-contain" />
              </div>
              <span className="text-2xl font-bold text-blue-500">بيبي لاند</span>
            </Link>
          </div>

          {/* القائمة للشاشات الكبيرة */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-4 space-x-reverse">
              {!isAdmin && (
                <>
                  <Link
                    href="/"
                    className={cn(
                      "px-3 py-2 rounded-md text-sm font-medium",
                      pathname === "/"
                        ? "text-blue-500 bg-blue-50"
                        : "text-gray-700 hover:text-blue-500 hover:bg-blue-50",
                    )}
                  >
                    الرئيسية
                  </Link>
                  <Link
                    href="/products"
                    className={cn(
                      "px-3 py-2 rounded-md text-sm font-medium",
                      pathname === "/products"
                        ? "text-blue-500 bg-blue-50"
                        : "text-gray-700 hover:text-blue-500 hover:bg-blue-50",
                    )}
                  >
                    المنتجات
                  </Link>
                  <Link
                    href="/scanner"
                    className={cn(
                      "px-3 py-2 rounded-md text-sm font-medium",
                      pathname === "/scanner"
                        ? "text-blue-500 bg-blue-50"
                        : "text-gray-700 hover:text-blue-500 hover:bg-blue-50",
                    )}
                  >
                    مسح الباركود
                  </Link>
                </>
              )}

              {isAdmin && (
                <>
                  <Link
                    href="/admin/dashboard"
                    className={cn(
                      "px-3 py-2 rounded-md text-sm font-medium",
                      pathname === "/admin/dashboard"
                        ? "text-blue-500 bg-blue-50"
                        : "text-gray-700 hover:text-blue-500 hover:bg-blue-50",
                    )}
                  >
                    لوحة التحكم
                  </Link>
                  <Link
                    href="/admin/products"
                    className={cn(
                      "px-3 py-2 rounded-md text-sm font-medium",
                      pathname === "/admin/products"
                        ? "text-blue-500 bg-blue-50"
                        : "text-gray-700 hover:text-blue-500 hover:bg-blue-50",
                    )}
                  >
                    المنتجات
                  </Link>
                  <Link
                    href="/admin/orders"
                    className={cn(
                      "px-3 py-2 rounded-md text-sm font-medium",
                      pathname === "/admin/orders"
                        ? "text-blue-500 bg-blue-50"
                        : "text-gray-700 hover:text-blue-500 hover:bg-blue-50",
                    )}
                  >
                    الطلبات
                  </Link>
                  <Link
                    href="/admin/scanner"
                    className={cn(
                      "px-3 py-2 rounded-md text-sm font-medium",
                      pathname === "/admin/scanner"
                        ? "text-blue-500 bg-blue-50"
                        : "text-gray-700 hover:text-blue-500 hover:bg-blue-50",
                    )}
                  >
                    مسح الباركود
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* أيقونات */}
          <div className="flex items-center">
            {!isAdmin && (
              <Link href="/cart" className="relative p-2 text-gray-700 hover:text-blue-500">
                <ShoppingCart className="h-6 w-6" />
                {localCartCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-pink-500 rounded-full">
                    {localCartCount}
                  </span>
                )}
              </Link>
            )}

            {isAdmin && (
              <button
                onClick={() => {
                  document.cookie = "admin_authenticated=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
                  setIsAdmin(false)
                  router.push("/")
                }}
                className="p-2 text-gray-700 hover:text-blue-500"
              >
                <User className="h-6 w-6" />
              </button>
            )}

            {/* زر القائمة للشاشات الصغيرة */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-700 hover:text-blue-500 hover:bg-blue-50 focus:outline-none"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* القائمة للشاشات الصغيرة */}
        {isMenuOpen && (
          <div className="md:hidden py-2">
            <div className="flex flex-col space-y-2 px-2 pb-3 pt-2">
              {!isAdmin && (
                <>
                  <Link
                    href="/"
                    className={cn(
                      "px-3 py-2 rounded-md text-base font-medium",
                      pathname === "/"
                        ? "text-blue-500 bg-blue-50"
                        : "text-gray-700 hover:text-blue-500 hover:bg-blue-50",
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    الرئيسية
                  </Link>
                  <Link
                    href="/products"
                    className={cn(
                      "px-3 py-2 rounded-md text-base font-medium",
                      pathname === "/products"
                        ? "text-blue-500 bg-blue-50"
                        : "text-gray-700 hover:text-blue-500 hover:bg-blue-50",
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    المنتجات
                  </Link>
                  <Link
                    href="/scanner"
                    className={cn(
                      "px-3 py-2 rounded-md text-base font-medium",
                      pathname === "/scanner"
                        ? "text-blue-500 bg-blue-50"
                        : "text-gray-700 hover:text-blue-500 hover:bg-blue-50",
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    مسح الباركود
                  </Link>
                </>
              )}

              {isAdmin && (
                <>
                  <Link
                    href="/admin/dashboard"
                    className={cn(
                      "px-3 py-2 rounded-md text-base font-medium",
                      pathname === "/admin/dashboard"
                        ? "text-blue-500 bg-blue-50"
                        : "text-gray-700 hover:text-blue-500 hover:bg-blue-50",
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    لوحة التحكم
                  </Link>
                  <Link
                    href="/admin/products"
                    className={cn(
                      "px-3 py-2 rounded-md text-base font-medium",
                      pathname === "/admin/products"
                        ? "text-blue-500 bg-blue-50"
                        : "text-gray-700 hover:text-blue-500 hover:bg-blue-50",
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    المنتجات
                  </Link>
                  <Link
                    href="/admin/orders"
                    className={cn(
                      "px-3 py-2 rounded-md text-base font-medium",
                      pathname === "/admin/orders"
                        ? "text-blue-500 bg-blue-50"
                        : "text-gray-700 hover:text-blue-500 hover:bg-blue-50",
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    الطلبات
                  </Link>
                  <Link
                    href="/admin/scanner"
                    className={cn(
                      "px-3 py-2 rounded-md text-base font-medium",
                      pathname === "/admin/scanner"
                        ? "text-blue-500 bg-blue-50"
                        : "text-gray-700 hover:text-blue-500 hover:bg-blue-50",
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    مسح الباركود
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* نافذة تسجيل الدخول المنبثقة */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">تسجيل الدخول للوحة التحكم</h2>
              <button onClick={() => setShowLoginModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  كلمة المرور
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">{error}</div>
              )}

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowLoginModal(false)}
                  className="mr-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
                >
                  {isLoading ? "جاري التحميل..." : "تسجيل الدخول"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </nav>
  )
}
