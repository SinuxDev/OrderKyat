"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { ExtractedData } from "@/types/invoice";
import { StoreInfo } from "@/components/organisms/StoreSettings";

const ChatPasteForm = dynamic(
  () => import("@/components/organisms/ChatPasteForm"),
  {
    loading: () => (
      <div className="h-96 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    ),
  }
);

const InvoiceForm = dynamic(
  () => import("@/components/organisms/InvoiceForm"),
  {
    ssr: false,
  }
);

const InvoicePDFPreview = dynamic(
  () => import("@/components/organisms/InvoicePDFPreview"),
  {
    ssr: false,
  }
);

const PricingCards = dynamic(
  () => import("@/components/organisms/PricingCards"),
  {
    loading: () => <div className="h-96" />,
  }
);

const StoreSettings = dynamic(
  () => import("@/components/organisms/StoreSettings"),
  {
    ssr: false,
  }
);

const ProductExplainerModal = dynamic(
  () => import("@/components/organisms/ProductExplainerModal"),
  {
    ssr: false,
  }
);

const AnimatedBackground = dynamic(
  () => import("@/components/atoms/AnimatedBackground"),
  {
    ssr: false,
  }
);

import HeroSection from "@/components/organisms/HeroSection";
import TrustSection from "@/components/organisms/TrustSection";
import Footer from "@/components/organisms/Footer";

export default function Home() {
  const [step, setStep] = useState<"paste" | "review" | "preview">("paste");
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(
    null
  );
  const [showSettings, setShowSettings] = useState(false);
  const [showExplainer, setShowExplainer] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const chatFormRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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
    return { name: "", phone: "", address: "" };
  });

  const scrollToChatForm = () => {
    chatFormRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  const handleLearnMore = () => setShowExplainer(true);
  const handleExtract = (data: ExtractedData) => {
    setExtractedData(data);
    setStep("review");
  };

  const handleGenerate = async (data: ExtractedData, storeInfo: StoreInfo) => {
    setExtractedData(data);
    setStoreInfo(storeInfo);
    setStep("preview");
  };

  const handleStoreInfoSave = (info: StoreInfo) => {
    setStoreInfo(info);
    setShowSettings(false);
  };

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Simplified background for mobile */}
      {isMobile ? (
        <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-indigo-50" />
      ) : (
        <>
          <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50" />

          <div className="fixed inset-0 opacity-40">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-400/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
            <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-pink-400/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000" />
          </div>

          <div className="fixed inset-x-0 top-0 h-[600px] bg-gradient-radial from-blue-100/50 via-transparent to-transparent" />

          <div
            className="fixed inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgb(99, 102, 241) 1px, transparent 1px),
                linear-gradient(to bottom, rgb(99, 102, 241) 1px, transparent 1px)
              `,
              backgroundSize: "60px 60px",
            }}
          />

          <div
            className="fixed inset-0 opacity-[0.015] mix-blend-overlay"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            }}
          />
        </>
      )}

      {/* Settings Modal - Only loads when opened */}
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

      {/* Product Explainer Modal - Only loads when opened */}
      {showExplainer && (
        <ProductExplainerModal
          isOpen={showExplainer}
          onClose={() => {
            setShowExplainer(false);
            scrollToChatForm();
          }}
        />
      )}

      {/* Animated Background - Desktop only, lazy loaded */}
      {!isMobile && <AnimatedBackground />}

      {/* Main content */}
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Hero Section - Always visible, lightweight */}
          <AnimatePresence mode="wait">
            {step === "paste" && (
              <div id="hero-section">
                <HeroSection />
              </div>
            )}
          </AnimatePresence>

          {/* Form sections - Lazy loaded */}
          <AnimatePresence mode="wait">
            {step === "paste" && (
              <motion.div
                key="paste"
                ref={chatFormRef}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                className="flex justify-center mb-20 sm:mb-24 scroll-mt-24"
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
                  onBack={() => setStep("paste")}
                  onSettings={() => setShowSettings(true)}
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

          {/* Trust & Stats Section */}
          <AnimatePresence mode="wait">
            {step === "paste" && (
              <div id="trust-section">
                <TrustSection
                  onGetStarted={scrollToChatForm}
                  onLearnMore={handleLearnMore}
                />
              </div>
            )}
          </AnimatePresence>

          {/* Pricing Cards Section - Lazy loaded */}
          <AnimatePresence mode="wait">
            {step === "paste" && (
              <motion.div
                id="pricing-section"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: 0.3 }}
              >
                <div className="text-center mb-12">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-800 mb-4 px-4">
                    Simple,{" "}
                    <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
                      Transparent
                    </span>{" "}
                    Pricing
                  </h2>
                  <p className="text-sm sm:text-base md:text-lg text-slate-600 max-w-2xl mx-auto px-4">
                    Start free, upgrade when you need more power
                  </p>
                </div>
                <PricingCards onGetStarted={scrollToChatForm} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence mode="wait">
          {step === "paste" && <Footer />}
        </AnimatePresence>
      </div>
    </main>
  );
}
