import { useEffect } from "react";
import { ExtractedData } from "@/types/invoice";

export function useDraftLoader(
  initialData: ExtractedData,
  setFormData: (data: ExtractedData) => void,
  setLastSaved: (date: Date) => void
) {
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
}

export function useKeyboardShortcuts(
  formData: ExtractedData,
  addNewItem: () => void,
  setShowConfirmDialog: (value: boolean) => void,
  setLastSaved: (date: Date) => void,
  setHasUnsavedChanges: (value: boolean) => void
) {
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      // Ctrl/Cmd + Enter = Generate
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        if (formData.items.length > 0) {
          setShowConfirmDialog(true);
        }
      }

      // Ctrl/Cmd + Plus = Add Item
      if ((e.ctrlKey || e.metaKey) && (e.key === "=" || e.key === "+")) {
        e.preventDefault();
        addNewItem();
      }

      // Ctrl/Cmd + S = Save
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
  }, [
    formData,
    addNewItem,
    setShowConfirmDialog,
    setLastSaved,
    setHasUnsavedChanges,
  ]);
}
