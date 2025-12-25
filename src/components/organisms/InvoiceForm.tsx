"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ExtractedData } from "@/types/invoice";
import { StoreInfo } from "@/components/organisms/StoreSettings";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Save, AlertCircle, FileEdit } from "lucide-react";
import PageHeader from "@/components/organisms/PageHeader";
import SubtleBackground from "@/components/atoms/SubtleBackground";
import CustomerDetailsSection from "@/components/molecules/CustomerDetailSection";
import InvoiceItemsSection from "@/components/molecules/InvoiceItemSection";
import GenerateConfirmDialog from "@/components/molecules/GenerateConfirmDialog";
import {
  useInvoiceForm,
  useStoreInfo,
  useAutoSave,
} from "@/hooks/useInvoiceForm";
import {
  useKeyboardShortcuts,
  useDraftLoader,
} from "@/hooks/useInvoiceEffects";

interface InvoiceFormProps {
  initialData: ExtractedData;
  onGenerate: (data: ExtractedData, storeInfo: StoreInfo) => void;
  onBack?: () => void;
  onSettings?: () => void;
}

export default function InvoiceForm({
  initialData,
  onGenerate,
  onBack,
  onSettings,
}: InvoiceFormProps) {
  const {
    formData,
    setFormData,
    hasUnsavedChanges,
    setHasUnsavedChanges,
    lastSaved,
    setLastSaved,
    isSaving,
    setIsSaving,
    updateField,
    updateItem,
    removeItem,
    addNewItem,
    calculateTotal,
  } = useInvoiceForm(initialData);

  const { storeInfo, setStoreInfo, updateStoreInfo } = useStoreInfo();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // ✅ NEW: Current time state for "X seconds ago" display
  const [currentTime, setCurrentTime] = useState(() => Date.now());

  // Auto-save hook
  useAutoSave(
    formData,
    hasUnsavedChanges,
    setLastSaved,
    setHasUnsavedChanges,
    setIsSaving
  );

  // Draft loader hook
  useDraftLoader(initialData, setFormData, setLastSaved);

  // Keyboard shortcuts hook
  useKeyboardShortcuts(
    formData,
    addNewItem,
    setShowConfirmDialog,
    setLastSaved,
    setHasUnsavedChanges
  );

  // ✅ NEW: Update current time every 10 seconds to refresh "X seconds ago"
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, []);

  // ✅ NEW: Calculate "last saved" text using useMemo (pure function)
  const lastSavedText = useMemo(() => {
    if (!lastSaved) return null;

    const seconds = Math.floor((currentTime - lastSaved.getTime()) / 1000);

    if (seconds < 10) return "Saved just now";
    if (seconds < 60) return `Saved ${seconds}s ago`;

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `Saved ${minutes}m ago`;

    const hours = Math.floor(minutes / 60);
    return `Saved ${hours}h ago`;
  }, [lastSaved, currentTime]);

  // Reload store info when dialog opens
  useEffect(() => {
    if (showConfirmDialog) {
      const saved = localStorage.getItem("orderkyat-store-info");
      if (saved) {
        try {
          setStoreInfo(JSON.parse(saved));
        } catch (error) {
          console.error("Failed to reload store info:", error);
        }
      }
    }
  }, [showConfirmDialog, setStoreInfo]);

  // Warn before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const handlePhoneChange = (value: string) => {
    const cleaned = value.replace(/[^\d\s+\-()]/g, "");
    updateField("phone", cleaned);
  };

  const handleStorePhoneChange = (value: string) => {
    const cleaned = value.replace(/[^\d\s+\-()]/g, "");
    updateStoreInfo("phone", cleaned);
  };

  const handleNumberInput = (
    id: string,
    field: "quantity" | "price",
    value: string
  ) => {
    const numValue = parseInt(value) || 0;
    if (numValue >= 0) {
      updateItem(id, field, numValue);
    }
  };

  const confirmGenerate = () => {
    localStorage.setItem("orderkyat-store-info", JSON.stringify(storeInfo));
    localStorage.removeItem("orderkyat-invoice-draft");
    setHasUnsavedChanges(false);
    onGenerate({ ...formData, totalPrice: calculateTotal() }, storeInfo);
    setShowConfirmDialog(false);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 relative">
      <SubtleBackground />

      <PageHeader
        showBack={true}
        onBack={onBack}
        showSettings={true}
        onSettings={onSettings}
        icon={FileEdit}
        title="Invoice Editor"
        subtitle={
          <>
            <kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-[10px] font-mono">
              ⌘↵
            </kbd>{" "}
            generate •{" "}
            <kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-[10px] font-mono">
              ⌘+
            </kbd>{" "}
            add item
          </>
        }
        hideMobileActions={true}
        actions={
          <>
            {/* ✅ Auto-save indicator using lastSavedText from useMemo */}
            <AnimatePresence>
              {(isSaving || lastSaved) && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="hidden lg:flex items-center gap-1.5 text-xs text-slate-500"
                >
                  {isSaving ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      >
                        <Save className="w-3.5 h-3.5 text-blue-500" />
                      </motion.div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5 text-green-500" />
                      <span>{lastSavedText}</span>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => setShowConfirmDialog(true)}
                disabled={formData.items.length === 0}
                size="sm"
                className="hidden sm:flex bg-green-600 hover:bg-green-700 gap-1.5 shadow-sm h-8 sm:h-9"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="text-sm">Generate</span>
              </Button>
            </motion.div>
          </>
        }
        banner={
          hasUnsavedChanges &&
          !isSaving && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mt-3"
            >
              <AlertCircle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
              <p className="text-xs text-amber-800">
                Unsaved changes • Auto-saving in a few seconds...
              </p>
            </motion.div>
          )
        }
      />

      {/* Form Content */}
      <div className="flex-1 overflow-y-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="min-h-full w-full pb-24 sm:pb-8 px-4 sm:px-6 lg:px-12 xl:px-16 py-6 lg:py-8 flex justify-center items-center"
        >
          <Card className="w-full max-w-6xl bg-white/95 backdrop-blur-sm shadow-xl border-slate-200">
            <CardContent className="space-y-5 sm:space-y-7 lg:space-y-8 px-4 sm:px-6 lg:px-10 xl:px-12 py-6 sm:py-8 lg:py-10">
              <CustomerDetailsSection
                formData={formData}
                updateField={updateField}
                handlePhoneChange={handlePhoneChange}
              />

              <InvoiceItemsSection
                items={formData.items}
                addNewItem={addNewItem}
                updateItem={updateItem}
                handleNumberInput={handleNumberInput}
                removeItem={removeItem}
              />

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex justify-between items-center pt-6 lg:pt-8 border-t-2 border-slate-300"
              >
                <span className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900">
                  Total Amount:
                </span>
                <motion.span
                  key={calculateTotal()}
                  initial={{ scale: 1.15, color: "#16a34a" }}
                  animate={{ scale: 1, color: "#16a34a" }}
                  className="text-2xl sm:text-3xl lg:text-4xl font-bold"
                >
                  {calculateTotal().toLocaleString()} Ks
                </motion.span>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Fixed Mobile Generate Button */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
        className="fixed bottom-0 left-0 right-0 sm:hidden bg-white border-t border-slate-200 p-3 shadow-lg z-20"
      >
        <motion.div whileTap={{ scale: 0.97 }}>
          <Button
            onClick={() => setShowConfirmDialog(true)}
            disabled={formData.items.length === 0}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold h-12 text-base shadow-md"
          >
            <Download className="w-5 h-5 mr-2" />
            Generate PDF Invoice
          </Button>
        </motion.div>
      </motion.div>

      <GenerateConfirmDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        formData={formData}
        storeInfo={storeInfo}
        updateStoreInfo={updateStoreInfo}
        handleStorePhoneChange={handleStorePhoneChange}
        calculateTotal={calculateTotal}
        confirmGenerate={confirmGenerate}
      />
    </div>
  );
}
