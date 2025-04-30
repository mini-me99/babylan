"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "./supabase"
import { generateBarcodeNumber } from "./utils"
import { cookies } from "next/headers"

// التحقق من صحة بيانات المسؤول
export async function adminLogin(formData: FormData) {
  const username = formData.get("username") as string
  const password = formData.get("password") as string

  if (password !== "1980") {
    return { error: "كلمة المرور غير صحيحة" }
  }

  // تعيين ملف تعريف ارتباط للمصادقة
  cookies().set("admin_authenticated", "true", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24, // يوم واحد
    path: "/",
  })

  redirect("/admin/dashboard")
}

// التحقق من حالة تسجيل الدخول
export async function checkAdminAuth() {
  const cookieStore = cookies()
  const isAuthenticated = cookieStore.get("admin_authenticated")?.value === "true"
  return isAuthenticated
}

// تسجيل الخروج
export async function adminLogout() {
  cookies().delete("admin_authenticated")
  redirect("/")
}

// إضافة منتج جديد
export async function addProduct(formData: FormData) {
  try {
    const supabase = createServerSupabaseClient()

    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const quantity = Number.parseInt(formData.get("quantity") as string)
    const price = Number.parseFloat((formData.get("price") as string) || "0")
    const imageFile = formData.get("image") as File

    // التحقق من صحة البيانات
    if (!name || isNaN(quantity)) {
      return { error: "بيانات غير صالحة" }
    }

    // إنشاء باركود فريد
    const barcode = generateBarcodeNumber()

    let imageUrl = ""

    // رفع الصورة إلى Supabase Storage إذا كانت موجودة
    if (imageFile && imageFile.size > 0) {
      try {
        // التحقق من وجود الـ bucket أو إنشاؤه
        const { data: buckets } = await supabase.storage.listBuckets()
        const bucketExists = buckets?.some((bucket) => bucket.name === "products")

        if (!bucketExists) {
          // إنشاء bucket جديد إذا لم يكن موجودًا
          const { error: createBucketError } = await supabase.storage.createBucket("products", {
            public: true,
            fileSizeLimit: 5242880, // 5MB
          })

          if (createBucketError) {
            console.error("خطأ في إنشاء bucket:", createBucketError)
            // المتابعة بدون صورة إذا فشل إنشاء الـ bucket
            imageUrl = ""
            return { error: "فشل في إنشاء مجلد التخزين. سيتم إضافة المنتج بدون صورة." }
          }
        }

        const fileExt = imageFile.name.split(".").pop()
        const fileName = `${Date.now()}.${fileExt}`

        // تحويل الملف إلى مصفوفة بايت
        const arrayBuffer = await imageFile.arrayBuffer()
        const buffer = new Uint8Array(arrayBuffer)

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("products")
          .upload(fileName, buffer, {
            contentType: imageFile.type,
          })

        if (uploadError) {
          console.error("خطأ في رفع الصورة:", uploadError)
          // المتابعة بدون صورة
          imageUrl = ""
        } else {
          // الحصول على URL العام للصورة
          const {
            data: { publicUrl },
          } = supabase.storage.from("products").getPublicUrl(fileName)

          imageUrl = publicUrl
        }
      } catch (err) {
        console.error("خطأ في معالجة الصورة:", err)
        // المتابعة بدون صورة
        imageUrl = ""
      }
    }

    // إضافة المنتج إلى قاعدة البيانات
    const { data, error } = await supabase
      .from("products")
      .insert([
        {
          name,
          description,
          quantity,
          price,
          image_url: imageUrl,
          barcode,
        },
      ])
      .select()

    if (error) {
      console.error("خطأ في إضافة المنتج:", error)
      return { error: "فشل في إضافة المنتج" }
    }

    revalidatePath("/admin/products")
    return { success: true, product: data[0] }
  } catch (err) {
    console.error("خطأ غير متوقع:", err)
    return { error: "حدث خطأ غير متوقع" }
  }
}

// تحديث منتج
export async function updateProduct(formData: FormData) {
  try {
    const supabase = createServerSupabaseClient()

    const id = formData.get("id") as string
    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const quantity = Number.parseInt(formData.get("quantity") as string)
    const price = Number.parseFloat((formData.get("price") as string) || "0")
    const imageFile = formData.get("image") as File

    const updateData: any = {
      name,
      description,
      quantity,
      price,
      updated_at: new Date().toISOString(),
    }

    // رفع الصورة الجديدة إذا تم تحديدها
    if (imageFile && imageFile.size > 0) {
      try {
        const fileExt = imageFile.name.split(".").pop()
        const fileName = `${Date.now()}.${fileExt}`

        // تحويل الملف إلى مصفوفة بايت
        const arrayBuffer = await imageFile.arrayBuffer()
        const buffer = new Uint8Array(arrayBuffer)

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("products")
          .upload(fileName, buffer, {
            contentType: imageFile.type,
          })

        if (uploadError) {
          console.error("خطأ في رفع الصورة:", uploadError)
        } else {
          // الحصول على URL العام للصورة
          const {
            data: { publicUrl },
          } = supabase.storage.from("products").getPublicUrl(fileName)

          updateData.image_url = publicUrl
        }
      } catch (err) {
        console.error("خطأ في معالجة الصورة:", err)
      }
    }

    // تحديث المنتج في قاعدة البيانات
    const { data, error } = await supabase.from("products").update(updateData).eq("id", id).select()

    if (error) {
      return { error: "فشل في تحديث المنتج" }
    }

    revalidatePath("/admin/products")
    return { success: true, product: data[0] }
  } catch (err) {
    console.error("خطأ غير متوقع:", err)
    return { error: "حدث خطأ غير متوقع" }
  }
}

// حذف منتج
export async function deleteProduct(id: string) {
  const supabase = createServerSupabaseClient()

  const { error } = await supabase.from("products").delete().eq("id", id)

  if (error) {
    return { error: "فشل في حذف المنتج" }
  }

  revalidatePath("/admin/products")
  return { success: true }
}

// إضافة طلب جديد
export async function createOrder(formData: FormData) {
  const supabase = createServerSupabaseClient()

  // استخراج بيانات العميل
  const customerName = formData.get("customerName") as string
  const storeName = formData.get("storeName") as string
  const phone = formData.get("phone") as string
  const address = formData.get("address") as string
  const deposit = Number.parseFloat((formData.get("deposit") as string) || "0")
  const shippingCompany = formData.get("shippingCompany") as string
  const deliveryDate = formData.get("deliveryDate") as string
  const paymentMethod = formData.get("paymentMethod") as string

  // استخراج بيانات سلة التسوق
  const cartItems = JSON.parse(formData.get("cartItems") as string)

  let paymentScreenshotUrl = ""

  // رفع صورة إيصال الدفع إذا كانت طريقة الدفع هي إنستا باي
  if (paymentMethod === "إنستا باي") {
    const paymentScreenshot = formData.get("paymentScreenshot") as File

    if (paymentScreenshot && paymentScreenshot.size > 0) {
      try {
        // التحقق من وجود الـ bucket أو إنشاؤه
        const { data: buckets } = await supabase.storage.listBuckets()
        const bucketExists = buckets?.some((bucket) => bucket.name === "payments")

        if (!bucketExists) {
          // إنشاء bucket جديد إذا لم يكن موجودًا
          await supabase.storage.createBucket("payments", {
            public: true,
            fileSizeLimit: 5242880, // 5MB
          })
        }

        const fileExt = paymentScreenshot.name.split(".").pop()
        const fileName = `payment_${Date.now()}.${fileExt}`

        // تحويل الملف إلى مصفوفة بايت
        const arrayBuffer = await paymentScreenshot.arrayBuffer()
        const buffer = new Uint8Array(arrayBuffer)

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("payments")
          .upload(fileName, buffer, {
            contentType: paymentScreenshot.type,
          })

        if (!uploadError) {
          // الحصول على URL العام للصورة
          const {
            data: { publicUrl },
          } = supabase.storage.from("payments").getPublicUrl(fileName)

          paymentScreenshotUrl = publicUrl
        }
      } catch (err) {
        console.error("خطأ في رفع صورة إيصال الدفع:", err)
      }
    }
  }

  // إنشاء الطلب في قاعدة البيانات
  const { data: orderData, error: orderError } = await supabase
    .from("orders")
    .insert([
      {
        customer_name: customerName,
        store_name: storeName,
        phone,
        address,
        deposit,
        shipping_company: shippingCompany,
        delivery_date: deliveryDate,
        payment_method: paymentMethod,
        payment_screenshot_url: paymentScreenshotUrl,
        status: "جديد",
      },
    ])
    .select()

  if (orderError || !orderData || orderData.length === 0) {
    return { error: "فشل في إنشاء الطلب" }
  }

  const orderId = orderData[0].id
  const orderNumber = orderData[0].order_number

  // إضافة عناصر الطلب
  const orderItems = cartItems.map((item: any) => ({
    order_id: orderId,
    product_id: item.id,
    quantity: item.quantity,
    price: item.price || 0,
  }))

  const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

  if (itemsError) {
    // حذف الطلب إذا فشلت إضافة العناصر
    await supabase.from("orders").delete().eq("id", orderId)
    return { error: "فشل في إضافة عناصر الطلب" }
  }

  // تحديث المخزون لكل منتج
  for (const item of cartItems) {
    // جلب الكمية الحالية للمنتج
    const { data: productData, error: productError } = await supabase
      .from("products")
      .select("quantity")
      .eq("id", item.id)
      .single()

    if (!productError && productData) {
      const newQuantity = Math.max(0, productData.quantity - item.quantity)

      // تحديث كمية المنتج
      await supabase
        .from("products")
        .update({ quantity: newQuantity, updated_at: new Date().toISOString() })
        .eq("id", item.id)
    }
  }

  revalidatePath("/cart")
  revalidatePath("/admin/products")
  return { success: true, orderId, orderNumber }
}

// تحديث حالة الطلب
export async function updateOrderStatus(id: string, formData: FormData) {
  const supabase = createServerSupabaseClient()
  const status = formData.get("status") as string

  const { error } = await supabase.from("orders").update({ status, updated_at: new Date().toISOString() }).eq("id", id)

  if (error) {
    return { error: "فشل في تحديث حالة الطلب" }
  }

  revalidatePath("/admin/orders")
  return { success: true }
}
