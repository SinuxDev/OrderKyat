"use client";

import { useState, useMemo, useCallback } from "react";
import { PDFViewer, pdf } from "@react-pdf/renderer";
import { ExtractedData } from "@/types/invoice";
import { StoreInfo } from "./StoreSettings";
import {
  Download,
  ZoomIn,
  ZoomOut,
  FileText,
  CheckCircle,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/organisms/PageHeader";
import { motion, AnimatePresence } from "framer-motion";
import SubtleBackground from "@/components/atoms/SubtleBackground";
import InvoicePDFDocument from "@/components/molecules/InvoicePDFDocument";
import { useConfetti } from "@/hooks/useConfetti";
import {
  generateFileName,
  generateSequentialInvoiceNumber,
} from "@/lib/invoiceUtils";

interface InvoicePDFPreviewProps {
  data: ExtractedData;
  storeInfo: StoreInfo;
  onBack?: () => void;
}

export default function InvoicePDFPreview({
  data,
  storeInfo,
  onBack,
}: InvoicePDFPreviewProps) {
  const [scale, setScale] = useState(1);
  const [timestamp] = useState(() => Date.now());
  const { showConfetti, confettiParticles } = useConfetti(3000);

  const [invoiceNumber, setInvoiceNumber] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const getOrGenerateInvoiceNumber = useCallback(() => {
    if (invoiceNumber) {
      return invoiceNumber;
    }
    const newNumber = generateSequentialInvoiceNumber();
    setInvoiceNumber(newNumber);
    return newNumber;
  }, [invoiceNumber]);

  const previewInvoiceNumber = invoiceNumber || "INV-2025-XXXX";

  const fileName = useMemo(
    () => generateFileName(storeInfo.name, data.customerName, timestamp),
    [data.customerName, storeInfo.name, timestamp]
  );

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const finalInvoiceNumber = getOrGenerateInvoiceNumber();

      const blob = await pdf(
        <InvoicePDFDocument
          data={data}
          storeInfo={storeInfo}
          invoiceNumber={finalInvoiceNumber}
        />
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden relative">
      <div className="fixed inset-0 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50" />

      <div className="fixed inset-0 opacity-30">
        <div className="absolute top-20 left-20 w-96 h-96 bg-green-400/25 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
        <div className="absolute top-20 right-20 w-96 h-96 bg-emerald-400/25 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-teal-400/25 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000" />
      </div>

      <div className="fixed inset-x-0 top-0 h-[500px] bg-gradient-radial from-green-100/40 via-transparent to-transparent" />

      <div
        className="fixed inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgb(16, 185, 129) 1px, transparent 1px),
            linear-gradient(to bottom, rgb(16, 185, 129) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      <div
        className="fixed inset-0 opacity-[0.015] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2310b981' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <SubtleBackground />

      {/* Confetti */}
      <AnimatePresence>
        {showConfetti &&
          confettiParticles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute w-3 h-3 rounded-full pointer-events-none z-50"
              style={{
                left: `${particle.left}%`,
                top: -20,
                backgroundColor: particle.color,
              }}
              initial={{ y: -20, opacity: 1, rotate: 0 }}
              animate={{
                y:
                  typeof window !== "undefined"
                    ? window.innerHeight + 20
                    : 1000,
                opacity: [1, 1, 0],
                rotate: particle.rotate,
                x: particle.xOffset,
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: particle.duration,
                delay: particle.delay,
                ease: "easeIn",
              }}
            />
          ))}
      </AnimatePresence>

      {/* Header */}
      <PageHeader
        showBack={true}
        onBack={onBack}
        icon={FileText}
        title="PDF Preview"
        subtitle="Review before downloading"
        hideMobileActions={true}
        actions={
          <>
            {/* Zoom Controls */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="hidden md:flex items-center gap-1 bg-slate-100 rounded-lg p-1"
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setScale((s) => Math.max(0.5, s - 0.1))}
                disabled={scale <= 0.5}
                className="h-8 px-2 hover:bg-white"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </Button>
              <span className="text-xs font-medium text-slate-700 px-2 min-w-[50px] text-center">
                {Math.round(scale * 100)}%
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setScale((s) => Math.min(2, s + 0.1))}
                disabled={scale >= 2}
                className="h-8 px-2 hover:bg-white"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </Button>
            </motion.div>

            {/* Download Button - Now uses custom handler */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, type: "spring" }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="sm"
                onClick={handleDownload}
                disabled={isDownloading}
                className="hidden sm:inline-flex bg-green-600 hover:bg-green-700 gap-1.5 shadow-sm h-8 sm:h-9"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="text-sm">
                  {isDownloading ? "Generating..." : "Download PDF"}
                </span>
              </Button>
            </motion.div>
          </>
        }
      />

      {/* PDF Preview Area */}
      <div className="flex-1 overflow-auto relative z-10 flex items-center justify-center">
        <div className="w-full p-4 md:p-8 lg:p-12">
          {/* Desktop: Full PDF Viewer */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="hidden md:block w-full max-w-5xl space-y-6 mx-auto"
          >
            {/* Success Banner */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4 lg:p-5 flex items-center gap-4 shadow-lg"
            >
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="flex-shrink-0 bg-green-500 text-white rounded-full p-3"
              >
                <CheckCircle className="w-6 h-6 lg:w-7 lg:h-7" />
              </motion.div>

              <div className="flex-1">
                <h3 className="text-base lg:text-lg font-bold text-green-900">
                  Invoice Generated Successfully!
                </h3>
                <p className="text-xs lg:text-sm text-green-700">
                  Your invoice is ready to download and share
                  {invoiceNumber && ` • ${invoiceNumber}`}
                  {!invoiceNumber &&
                    " • Invoice # will be assigned on download"}
                </p>
              </div>

              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex-shrink-0"
              >
                <span className="text-3xl lg:text-4xl">🎉</span>
              </motion.div>
            </motion.div>

            {/* PDF Viewer  */}
            <motion.div
              className="bg-white shadow-2xl rounded-lg overflow-hidden mx-auto"
              style={{
                transform: `scale(${scale})`,
                transformOrigin: "center center",
                transition: "transform 0.2s ease-out",
              }}
              whileHover={{
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              }}
            >
              <PDFViewer
                width="100%"
                height="1000px"
                showToolbar={false}
                className="border-0"
              >
                <InvoicePDFDocument
                  data={data}
                  storeInfo={storeInfo}
                  invoiceNumber={previewInvoiceNumber}
                />
              </PDFViewer>
            </motion.div>
          </motion.div>

          {/* Mobile */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="md:hidden w-full max-w-md mx-auto"
          >
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 space-y-6 border border-green-100">
              {/* Success Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                className="text-center"
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                  className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
                >
                  <CheckCircle className="w-10 h-10 text-white" />
                </motion.div>
                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-2xl font-bold text-slate-900 mb-2"
                >
                  Invoice Ready!
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-sm text-slate-600 flex items-center justify-center gap-1"
                >
                  Your invoice has been generated
                  <Sparkles className="w-4 h-4 text-yellow-500" />
                </motion.p>
              </motion.div>

              {/* Invoice Summary */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="border border-slate-200 rounded-xl p-4 space-y-3 bg-slate-50"
              >
                {[
                  { label: "Invoice #", value: previewInvoiceNumber },
                  { label: "Store", value: storeInfo.name || "OrderKyat" },
                  { label: "Customer", value: data.customerName },
                  { label: "Items", value: data.items.length.toString() },
                ].map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className="flex justify-between text-sm"
                  >
                    <span className="text-slate-600">{item.label}:</span>
                    <span className="font-medium text-slate-900">
                      {item.value}
                    </span>
                  </motion.div>
                ))}

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.1 }}
                  className="flex justify-between text-lg font-bold pt-3 border-t border-slate-200"
                >
                  <span className="text-slate-900">Total:</span>
                  <motion.span
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 1, repeat: 2 }}
                    className="text-green-600"
                  >
                    {data.totalPrice.toLocaleString()} Ks
                  </motion.span>
                </motion.div>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.3 }}
                className="text-xs text-center text-slate-500"
              >
                💡 Preview is available on desktop devices
              </motion.p>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
        className="fixed bottom-0 left-0 right-0 sm:hidden bg-white border-t border-slate-200 p-3 shadow-lg z-20"
      >
        <motion.div whileTap={{ scale: 0.97 }}>
          <Button
            onClick={handleDownload}
            disabled={isDownloading}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 h-12 text-base gap-2 shadow-md"
          >
            {isDownloading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <Download className="w-5 h-5" />
                </motion.div>
                Generating PDF...
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                Download Invoice
              </>
            )}
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}

export { InvoicePDFDocument };
