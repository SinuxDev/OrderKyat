import { useState, useEffect, useCallback } from "react";
import { ExtractedData, InvoiceItem } from "@/types/invoice";
import { StoreInfo } from "@/components/organisms/StoreSettings";
import { v4 as uuidv4 } from "uuid";

export function useInvoiceForm(initialData: ExtractedData) {
  const [formData, setFormData] = useState<ExtractedData>(initialData);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const updateField = (field: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
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

  return {
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
  };
}

export function useStoreInfo() {
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

  const updateStoreInfo = (field: keyof StoreInfo, value: string) => {
    setStoreInfo((prev) => ({ ...prev, [field]: value }));
  };

  return { storeInfo, setStoreInfo, updateStoreInfo };
}

export function useAutoSave(
  formData: ExtractedData,
  hasUnsavedChanges: boolean,
  setLastSaved: (date: Date) => void,
  setHasUnsavedChanges: (value: boolean) => void,
  setIsSaving: (value: boolean) => void
) {
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
  }, [
    formData,
    hasUnsavedChanges,
    setLastSaved,
    setHasUnsavedChanges,
    setIsSaving,
  ]);
}
