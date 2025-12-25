"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ExtractedData, InvoiceItem } from "@/types/invoice";
import { StoreInfo } from "@/components/organisms/StoreSettings";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  Trash2,
  Plus,
  Save,
  AlertCircle,
  Store,
  FileEdit,
  Sparkles,
} from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import PageHeader from "@/components/organisms/PageHeader";
import SubtleBackground from "@/components/atoms/SubtleBackground";

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
  const [formData, setFormData] = useState<ExtractedData>(initialData);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Store Info State - Load from localStorage
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

  const updateField = (field: keyof ExtractedData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
  };

  const updateStoreInfo = (field: keyof StoreInfo, value: string) => {
    setStoreInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handlePhoneChange = (value: string, field: "phone" | "storePhone") => {
    const cleaned = value.replace(/[^\d\s+\-()]/g, "");

    if (field === "phone") {
      updateField("phone", cleaned);
    } else {
      updateStoreInfo("phone", cleaned);
    }
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

  const updateItem = (
    id: string,
    field: keyof InvoiceItem,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
    setHasUnsavedChanges(true);
  };

  const removeItem = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== id),
    }));
    setHasUnsavedChanges(true);
  };

  const addNewItem = useCallback(() => {
    const newItem: InvoiceItem = {
      id: uuidv4(),
      name: "",
      quantity: 1,
      price: 0,
    };
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, newItem],
    }));
    setHasUnsavedChanges(true);
  }, []);

  const calculateTotal = useCallback(() => {
    return formData.items.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );
  }, [formData.items]);

  // Actual generation logic
  const confirmGenerate = useCallback(() => {
    console.log("🔍 Store Info being sent:", storeInfo);
    localStorage.setItem("orderkyat-store-info", JSON.stringify(storeInfo));
    localStorage.removeItem("orderkyat-invoice-draft");
    setHasUnsavedChanges(false);
    onGenerate({ ...formData, totalPrice: calculateTotal() }, storeInfo);
    setShowConfirmDialog(false);
  }, [formData, storeInfo, calculateTotal, onGenerate]);

  const handleGenerate = () => {
    setShowConfirmDialog(true);
  };

  // Auto-save to localStorage every 3 seconds
  useEffect(() => {
    if (!hasUnsavedChanges) return;

    const timer = setTimeout(() => {
      setIsSaving(true);
      try {
        localStorage.setItem(
          "orderkyat-invoice-draft",
          JSON.stringify(formData)
        );
        setLastSaved(new Date());
        setHasUnsavedChanges(false);
      } catch (error) {
        console.error("Failed to save draft:", error);
      } finally {
        setTimeout(() => setIsSaving(false), 500);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [formData, hasUnsavedChanges]);

  // Load draft on mount
  useEffect(() => {
    const draft = localStorage.getItem("orderkyat-invoice-draft");
    if (draft) {
      try {
        const parsedDraft = JSON.parse(draft);
        if (initialData.items.length === 0 || initialData.customerName === "") {
          const confirmed = window.confirm(
            "Found a saved draft from your previous session. Would you like to restore it?"
          );
          if (confirmed) {
            setFormData(parsedDraft);
            setLastSaved(new Date());
          } else {
            localStorage.removeItem("orderkyat-invoice-draft");
          }
        }
      } catch (error) {
        console.error("Failed to load draft:", error);
        localStorage.removeItem("orderkyat-invoice-draft");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        if (formData.items.length > 0) {
          setShowConfirmDialog(true);
        }
      }

      if ((e.ctrlKey || e.metaKey) && (e.key === "=" || e.key === "+")) {
        e.preventDefault();
        addNewItem();
      }

      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        localStorage.setItem(
          "orderkyat-invoice-draft",
          JSON.stringify(formData)
        );
        setLastSaved(new Date());
        setHasUnsavedChanges(false);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [formData, addNewItem]);

  useEffect(() => {
    if (showConfirmDialog) {
      const saved = localStorage.getItem("orderkyat-store-info");
      if (saved) {
        try {
          const parsedInfo = JSON.parse(saved);
          setStoreInfo(parsedInfo);
          console.log("✅ Store info reloaded:", parsedInfo);
        } catch (error) {
          console.error("Failed to reload store info:", error);
        }
      }
    }
  }, [showConfirmDialog]);

  const getLastSavedText = () => {
    if (!lastSaved) return null;
    const now = new Date();
    const seconds = Math.floor((now.getTime() - lastSaved.getTime()) / 1000);

    if (seconds < 10) return "Saved just now";
    if (seconds < 60) return `Saved ${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    return `Saved ${minutes}m ago`;
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 relative">
      {/* Subtle animated background */}
      <SubtleBackground />

      {/* Header */}
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
            {/* Auto-save indicator with smoother animation */}
            <AnimatePresence>
              {(isSaving || lastSaved) && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -10 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
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
                      <span>{getLastSavedText()}</span>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Generate Button with hover effect */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={handleGenerate}
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
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full pb-24 sm:pb-6 px-4 sm:px-6 py-4"
        >
          <Card className="w-full max-w-2xl mx-auto bg-white/95 backdrop-blur-sm shadow-lg border-slate-200 mt-4 sm:mt-6">
            <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6 py-5 sm:py-6">
              {/* Customer Info Section */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
                className="space-y-3"
              >
                <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                  <Sparkles className="w-4 h-4 text-green-600" />
                  <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">
                    Customer Details
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <motion.div
                    whileFocus={{ scale: 1.01 }}
                    className="space-y-2"
                  >
                    <Label className="text-slate-700 text-sm">
                      Customer Name
                    </Label>
                    <Input
                      value={formData.customerName}
                      onChange={(e) =>
                        updateField("customerName", e.target.value)
                      }
                      placeholder="Enter customer name"
                      className="bg-slate-50 border-slate-300 text-slate-900 focus:border-green-500 focus:ring-green-500/20 text-sm sm:text-base transition-all"
                    />
                  </motion.div>
                  <motion.div
                    whileFocus={{ scale: 1.01 }}
                    className="space-y-2"
                  >
                    <Label className="text-slate-700 text-sm">Phone</Label>
                    <Input
                      value={formData.phone}
                      onChange={(e) =>
                        handlePhoneChange(e.target.value, "phone")
                      }
                      placeholder="+95 9 XXX XXX XXX"
                      className="bg-slate-50 border-slate-300 text-slate-900 focus:border-green-500 focus:ring-green-500/20 text-sm sm:text-base transition-all"
                    />
                  </motion.div>
                </div>
                <motion.div whileFocus={{ scale: 1.01 }} className="space-y-2">
                  <Label className="text-slate-700 text-sm">Address</Label>
                  <Input
                    value={formData.address}
                    onChange={(e) => updateField("address", e.target.value)}
                    placeholder="Customer address"
                    className="bg-slate-50 border-slate-300 text-slate-900 focus:border-green-500 focus:ring-green-500/20 text-sm sm:text-base transition-all"
                  />
                </motion.div>
              </motion.div>

              {/* Items Section */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className="space-y-3"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-green-600" />
                    <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">
                      Invoice Items
                    </h2>
                    <motion.span
                      key={formData.items.length}
                      initial={{ scale: 1.3 }}
                      animate={{ scale: 1 }}
                      className="text-xs text-slate-500"
                    >
                      ({formData.items.length})
                    </motion.span>
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      type="button"
                      onClick={addNewItem}
                      size="sm"
                      variant="outline"
                      className="text-xs text-blue-600 border-blue-600 hover:bg-blue-50"
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Add Item
                    </Button>
                  </motion.div>
                </div>

                {formData.items.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12 text-slate-500 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200"
                  >
                    <Plus className="w-10 h-10 mx-auto mb-3 text-slate-400" />
                    <p className="text-sm font-medium mb-1">No items yet</p>
                    <p className="text-xs text-slate-400">
                      Click &quot;Add Item&quot; to start building your invoice
                    </p>
                  </motion.div>
                ) : (
                  <AnimatePresence>
                    {formData.items.map((item, index) => (
                      <motion.div
                        key={item.id}
                        className="space-y-2"
                        initial={{ opacity: 0, x: -20, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 20, scale: 0.95 }}
                        transition={{ delay: index * 0.03, duration: 0.2 }}
                      >
                        {/* Mobile: Stack vertically */}
                        <motion.div
                          whileHover={{ scale: 1.01 }}
                          className="sm:hidden space-y-2 p-3 bg-slate-50 rounded-lg border border-slate-200 relative"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium text-slate-600">
                              Item {index + 1}
                            </span>
                            <motion.button
                              whileHover={{ scale: 1.1, rotate: 5 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => removeItem(item.id)}
                              className="p-1.5 text-red-600 hover:bg-red-100 rounded-md transition-colors"
                              title="Remove item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </motion.button>
                          </div>

                          <Input
                            placeholder="Item name"
                            value={item.name}
                            onChange={(e) =>
                              updateItem(item.id, "name", e.target.value)
                            }
                            className="bg-white border-slate-300 text-slate-900 text-sm"
                          />
                          <div className="grid grid-cols-2 gap-2">
                            <Input
                              type="number"
                              placeholder="Qty"
                              value={item.quantity}
                              onChange={(e) =>
                                handleNumberInput(
                                  item.id,
                                  "quantity",
                                  e.target.value
                                )
                              }
                              className="bg-white border-slate-300 text-slate-900 text-sm"
                            />
                            <Input
                              type="number"
                              placeholder="Price"
                              value={item.price}
                              onChange={(e) =>
                                handleNumberInput(
                                  item.id,
                                  "price",
                                  e.target.value
                                )
                              }
                              className="bg-white border-slate-300 text-slate-900 text-sm"
                            />
                          </div>
                          <div className="flex justify-between items-center pt-1 border-t border-slate-200">
                            <span className="text-xs text-slate-600">
                              Subtotal:
                            </span>
                            <motion.span
                              key={item.quantity * item.price}
                              initial={{ scale: 1.2, color: "#10b981" }}
                              animate={{ scale: 1, color: "#0f172a" }}
                              className="text-sm font-semibold"
                            >
                              {(item.quantity * item.price).toLocaleString()} Ks
                            </motion.span>
                          </div>
                        </motion.div>

                        {/* Desktop: Grid layout */}
                        <motion.div
                          whileHover={{
                            scale: 1.005,
                            backgroundColor: "#f8fafc",
                          }}
                          className="hidden sm:grid grid-cols-12 gap-2 items-center p-2 rounded-lg transition-colors"
                        >
                          <Input
                            placeholder="Item name"
                            value={item.name}
                            onChange={(e) =>
                              updateItem(item.id, "name", e.target.value)
                            }
                            className="col-span-4 bg-slate-50 border-slate-300 text-slate-900 text-sm"
                          />
                          <Input
                            type="number"
                            placeholder="Qty"
                            value={item.quantity}
                            onChange={(e) =>
                              handleNumberInput(
                                item.id,
                                "quantity",
                                e.target.value
                              )
                            }
                            className="col-span-2 bg-slate-50 border-slate-300 text-slate-900 text-sm"
                          />
                          <Input
                            type="number"
                            placeholder="Price"
                            value={item.price}
                            onChange={(e) =>
                              handleNumberInput(
                                item.id,
                                "price",
                                e.target.value
                              )
                            }
                            className="col-span-3 bg-slate-50 border-slate-300 text-slate-900 text-sm"
                          />
                          <div className="col-span-2 flex items-center justify-end">
                            <motion.span
                              key={item.quantity * item.price}
                              initial={{ scale: 1.2, color: "#10b981" }}
                              animate={{ scale: 1, color: "#334155" }}
                              className="text-sm font-medium"
                            >
                              {(item.quantity * item.price).toLocaleString()} Ks
                            </motion.span>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => removeItem(item.id)}
                            className="col-span-1 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </motion.button>
                        </motion.div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </motion.div>

              {/* Total */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.3 }}
                className="flex justify-between items-center pt-4 border-t-2 border-slate-300"
              >
                <span className="text-base sm:text-lg font-bold text-slate-900">
                  Total Amount:
                </span>
                <motion.span
                  key={calculateTotal()}
                  initial={{ scale: 1.15, color: "#16a34a" }}
                  animate={{ scale: 1, color: "#16a34a" }}
                  className="text-xl sm:text-2xl font-bold"
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
            onClick={handleGenerate}
            disabled={formData.items.length === 0}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold h-12 text-base shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-5 h-5 mr-2" />
            Generate PDF Invoice
          </Button>
        </motion.div>
      </motion.div>

      {/* Confirmation Dialog remains the same */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Download className="w-5 h-5 text-green-600" />
              Confirm Invoice Details
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-4">
                {/* Store Information Section */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Store className="w-5 h-5 text-blue-600" />
                    <h3 className="font-semibold text-slate-900">
                      Your Store Information
                    </h3>
                  </div>
                  <p className="text-xs text-slate-600 mb-3">
                    This will appear at the top of your invoice
                  </p>
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs text-slate-700">
                        Store Name
                      </Label>
                      <Input
                        value={storeInfo.name}
                        onChange={(e) =>
                          updateStoreInfo("name", e.target.value)
                        }
                        placeholder="Your Store Name"
                        className="text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-slate-700">
                        Store Phone
                      </Label>
                      <Input
                        value={storeInfo.phone}
                        onChange={(e) =>
                          handlePhoneChange(e.target.value, "storePhone")
                        }
                        placeholder="+95 9 XXX XXX XXX"
                        className="text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-slate-700">
                        Store Address
                      </Label>
                      <Input
                        value={storeInfo.address}
                        onChange={(e) =>
                          updateStoreInfo("address", e.target.value)
                        }
                        placeholder="Your Store Address"
                        className="text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Invoice Summary */}
                <div className="bg-slate-50 p-4 rounded-lg space-y-2 text-sm">
                  <h3 className="font-semibold text-slate-900 mb-2">
                    Invoice Summary
                  </h3>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Customer:</span>
                    <span className="font-medium text-slate-900">
                      {formData.customerName || "Not specified"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Items:</span>
                    <span className="font-medium text-slate-900">
                      {formData.items.length}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-slate-200">
                    <span className="text-slate-600">Total Amount:</span>
                    <span className="font-bold text-green-600">
                      {calculateTotal().toLocaleString()} Ks
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-500">
                  💡 Your store information will be saved for future invoices
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmGenerate}
              className="bg-green-600 hover:bg-green-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Generate PDF
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
