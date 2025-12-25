"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ChatPasteForm from "@/components/organisms/ChatPasteForm";
import InvoiceForm from "@/components/organisms/InvoiceForm";
import InvoicePDFPreview from "@/components/organisms/InvoicePDFPreview";
import StoreSettings from "@/components/organisms/StoreSettings";
import AnimatedLogo from "@/components/atoms/AnimatedLogo";
import { ExtractedData } from "@/types/invoice";
import { StoreInfo } from "@/components/organisms/StoreSettings";
import { FileText, Zap, Shield } from "lucide-react";

export default function Home() {
  const [step, setStep] = useState<"paste" | "review" | "preview">("paste");
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(
    null
  );
  const [showSettings, setShowSettings] = useState(false);

  const [storeInfo, setStoreInfo] = useState<StoreInfo>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("orderkyat-store-info");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (error) {
          console.error("Failed to parse store info:", error);
        }
      }
    }

    return {
      name: "",
      phone: "",
      address: "",
    };
  });

  const handleExtract = (data: ExtractedData) => {
    setExtractedData(data);
    setStep("review");
  };

  const handleGenerate = async (data: ExtractedData, storeInfo: StoreInfo) => {
    console.log("🔍 Received in page.tsx:", { data, storeInfo });
    setExtractedData(data);
    setStoreInfo(storeInfo);
    setStep("preview");
  };

  const handleStoreInfoSave = (info: StoreInfo) => {
    setStoreInfo(info);
    setShowSettings(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* ❌ REMOVED - Settings button now in PageHeader */}

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowSettings(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <StoreSettings
                onSave={handleStoreInfoSave}
                initialData={storeInfo}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] pointer-events-none" />

      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Hero Section */}
        <AnimatePresence mode="wait">
          {step === "paste" && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-8 sm:mb-12"
            >
              <div className="mb-4 sm:mb-6">
                <AnimatedLogo />
              </div>

              <motion.p
                className="text-lg sm:text-xl md:text-2xl text-slate-700 mb-2 sm:mb-3 font-semibold px-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Myanmar&apos;s Smart Invoice Generator{" "}
                <span className="inline-block animate-float">🇲🇲</span>
              </motion.p>

              <motion.p
                className="text-sm sm:text-base md:text-lg text-slate-600 max-w-2xl mx-auto mb-6 sm:mb-8 px-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Transform chat messages into professional PDF invoices instantly
              </motion.p>

              <motion.div
                className="flex flex-wrap justify-center gap-3 sm:gap-4 px-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {[
                  { icon: Zap, text: "AI Extract", color: "blue" },
                  { icon: FileText, text: "PDF Ready", color: "indigo" },
                  { icon: Shield, text: "Free Forever", color: "purple" },
                ].map((feature, index) => (
                  <motion.div
                    key={feature.text}
                    className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-white shadow-sm border border-slate-200"
                    whileHover={{ scale: 1.05, y: -2 }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    <feature.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="text-xs sm:text-sm text-slate-700 font-medium">
                      {feature.text}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form sections */}
        <AnimatePresence mode="wait">
          {step === "paste" && (
            <motion.div
              key="paste"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className="flex justify-center"
            >
              <ChatPasteForm onExtract={handleExtract} />
            </motion.div>
          )}

          {step === "review" && extractedData && (
            <motion.div
              key="review"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="fixed inset-0 z-50 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50"
            >
              <InvoiceForm
                initialData={extractedData}
                onGenerate={handleGenerate}
                onBack={() => setStep("paste")} // ← Add back handler
                onSettings={() => setShowSettings(true)} // ← Add settings handler
              />
            </motion.div>
          )}

          {step === "preview" && extractedData && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 bg-white"
            >
              <InvoicePDFPreview
                data={extractedData}
                storeInfo={storeInfo}
                onBack={() => setStep("review")}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
