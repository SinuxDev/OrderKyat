"use client";

import { useState, useMemo } from "react";
import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";
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
import { generateFileName } from "@/lib/invoiceUtils";

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

  const fileName = useMemo(
    () => generateFileName(storeInfo.name, data.customerName, timestamp),
    [data.customerName, storeInfo.name, timestamp]
  );

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gradient-to-br from-green-50 via-emerald-50/30 to-teal-50/30 relative">
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

      {/* Success Badge */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", duration: 0.6, delay: 0.2 }}
        className="absolute top-20 right-8 z-40 hidden lg:block"
      >
        <motion.div
          animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="bg-green-500 text-white rounded-full p-4 shadow-xl"
        >
          <CheckCircle className="w-8 h-8" />
        </motion.div>
      </motion.div>

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

            {/* Download Button */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, type: "spring" }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <PDFDownloadLink
                document={
                  <InvoicePDFDocument data={data} storeInfo={storeInfo} />
                }
                fileName={fileName}
                className="hidden sm:inline-flex"
              >
                {({ loading }) => (
                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 gap-1.5 shadow-sm h-8 sm:h-9"
                    disabled={loading}
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span className="text-sm">
                      {loading ? "Preparing..." : "Download PDF"}
                    </span>
                  </Button>
                )}
              </PDFDownloadLink>
            </motion.div>
          </>
        }
      />

      {/* PDF Preview Area - ✅ BETTER CENTERED & TALLER */}
      <div className="flex-1 overflow-auto relative z-10">
        <div className="min-h-full flex items-center justify-center p-4 md:p-8 lg:p-12">
          {/* Desktop: Full PDF Viewer */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="hidden md:block w-full max-w-5xl"
          >
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
                <InvoicePDFDocument data={data} storeInfo={storeInfo} />
              </PDFViewer>
            </motion.div>
          </motion.div>

          {/* Mobile: Summary Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="md:hidden w-full max-w-md"
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

      {/* Fixed Mobile Download Button */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
        className="fixed bottom-0 left-0 right-0 sm:hidden bg-white border-t border-slate-200 p-3 shadow-lg z-20"
      >
        <PDFDownloadLink
          document={<InvoicePDFDocument data={data} storeInfo={storeInfo} />}
          fileName={fileName}
        >
          {({ loading }) => (
            <motion.div whileTap={{ scale: 0.97 }}>
              <Button
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 h-12 text-base gap-2 shadow-md"
                disabled={loading}
              >
                {loading ? (
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
                    Preparing PDF...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    Download Invoice
                  </>
                )}
              </Button>
            </motion.div>
          )}
        </PDFDownloadLink>
      </motion.div>
    </div>
  );
}

export { InvoicePDFDocument };
