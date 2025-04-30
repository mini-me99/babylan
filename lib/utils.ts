import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import JsBarcode from "jsbarcode"

// دمج الفئات لـ Tailwind CSS
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// إنشاء باركود فريد
export function generateBarcodeNumber() {
  // إنشاء رقم عشوائي مكون من 12 رقم
  const randomNum = Math.floor(Math.random() * 1000000000000)
    .toString()
    .padStart(12, "0")
  return randomNum
}

// تحويل باركود إلى صورة SVG
export function generateBarcodeSVG(barcodeValue: string): string {
  if (typeof window === "undefined") return ""

  const canvas = document.createElement("canvas")
  JsBarcode(canvas, barcodeValue, {
    format: "CODE128",
    lineColor: "#000",
    width: 3,
    height: 70,
    displayValue: true,
    fontSize: 16,
    margin: 15,
    flat: false,
    background: "#ffffff",
    valid: (valid) => {
      if (!valid) {
        console.error("الباركود غير صالح:", barcodeValue)
      }
    },
  })
  return canvas.toDataURL("image/png")
}

// تنسيق التاريخ بالعربية
export function formatDate(date: Date | string): string {
  if (!date) return ""
  const d = new Date(date)
  return new Intl.DateTimeFormat("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(d)
}

// تحويل حالة الطلب إلى لون
export function getStatusColor(status: string): string {
  switch (status) {
    case "جديد":
      return "bg-blue-100 text-blue-800"
    case "قيد المعالجة":
      return "bg-yellow-100 text-yellow-800"
    case "تم الشحن":
      return "bg-purple-100 text-purple-800"
    case "تم التسليم":
      return "bg-green-100 text-green-800"
    case "ملغي":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}
