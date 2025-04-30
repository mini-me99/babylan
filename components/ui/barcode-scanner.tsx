"use client"

import { useState, useRef, useEffect } from "react"
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode"
import { Camera, StopCircle } from "lucide-react"

interface BarcodeScannerProps {
  onScan: (barcode: string) => void
  onError?: (error: string) => void
}

export function BarcodeScanner({ onScan, onError }: BarcodeScannerProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // تنظيف الماسح عند إزالة المكون
  useEffect(() => {
    return () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch(console.error)
      }
    }
  }, [])

  const startScanning = async () => {
    setError(null)

    if (!containerRef.current) return

    try {
      const scanner = new Html5Qrcode("barcode-scanner")
      scannerRef.current = scanner

      await scanner.start(
        { facingMode: "environment" },
        {
          fps: 15,
          qrbox: { width: 300, height: 100 },
          aspectRatio: 1.0,
          formatsToSupport: [Html5QrcodeSupportedFormats.CODE_128],
          experimentalFeatures: {
            useBarCodeDetectorIfSupported: true,
          },
          disableFlip: false,
        },
        (decodedText) => {
          // تم مسح الباركود بنجاح
          onScan(decodedText)
          // إيقاف المسح مؤقتًا لتجنب المسح المتكرر للباركود نفسه
          setTimeout(() => {
            if (scannerRef.current && scannerRef.current.isScanning) {
              // استئناف المسح بعد ثانية واحدة
              console.log("جاهز للمسح مرة أخرى")
            }
          }, 1000)
        },
        (errorMessage) => {
          // تجاهل أخطاء المسح المستمرة
          console.log(errorMessage)
        },
      )

      setIsScanning(true)
    } catch (err: any) {
      setError(err.toString())
      if (onError) onError(err.toString())
    }
  }

  const stopScanning = () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      scannerRef.current
        .stop()
        .then(() => {
          setIsScanning(false)
        })
        .catch((err) => {
          console.error("Error stopping scanner:", err)
        })
    }
  }

  return (
    <div className="flex flex-col items-center">
      <div
        id="barcode-scanner"
        ref={containerRef}
        className="w-full max-w-md h-64 bg-gray-100 rounded-lg overflow-hidden"
      ></div>

      {error && <div className="mt-4 p-2 bg-red-100 text-red-700 rounded-md">{error}</div>}

      <div className="mt-4 flex space-x-4 space-x-reverse">
        {!isScanning ? (
          <button
            onClick={startScanning}
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            <Camera className="ml-2 h-5 w-5" />
            بدء المسح
          </button>
        ) : (
          <button
            onClick={stopScanning}
            className="flex items-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
          >
            <StopCircle className="ml-2 h-5 w-5" />
            إيقاف المسح
          </button>
        )}
      </div>
    </div>
  )
}
