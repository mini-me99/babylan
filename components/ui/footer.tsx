import Image from "next/image"

export function Footer() {
  return (
    <footer className="bg-white shadow-inner mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0 flex flex-col md:flex-row items-center">
            <div className="relative h-16 w-16 mb-3 md:mb-0 md:mr-3">
              <Image src="/babyland-logo.png" alt="بيبي لاند" fill className="object-contain" />
            </div>
            <div className="text-center md:text-right">
              <h2 className="text-2xl font-bold text-blue-500">بيبي لاند</h2>
              <p className="text-gray-600 mt-2">كل ما يحتاجه طفلك في مكان واحد</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-8 md:space-x-reverse">
            <div className="text-center md:text-right">
              <h3 className="text-lg font-semibold mb-2">تواصل معنا</h3>
              <p className="text-gray-600">هاتف: 01001608562</p>
              <p className="text-gray-600">البريد الإلكتروني: landbaby815@gmail.com</p>
            </div>

            <div className="text-center md:text-right">
              <h3 className="text-lg font-semibold mb-2">العنوان</h3>
              <p className="text-gray-600">حدائق الاهرام، الجيزة، مصر</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-6 text-center">
          <p className="text-gray-500">© {new Date().getFullYear()} بيبي لاند - جميع الحقوق محفوظة</p>
        </div>
      </div>
    </footer>
  )
}
