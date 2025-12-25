"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Plus, Sparkles } from "lucide-react";
import { InvoiceItem } from "@/types/invoice";
import InvoiceItemRow from "./InvoiceItemRow";

interface InvoiceItemsSectionProps {
  items: InvoiceItem[];
  addNewItem: () => void;
  updateItem: (
    id: string,
    field: keyof InvoiceItem,
    value: string | number
  ) => void;
  handleNumberInput: (
    id: string,
    field: "quantity" | "price",
    value: string
  ) => void;
  removeItem: (id: string) => void;
}

export default function InvoiceItemsSection({
  items,
  addNewItem,
  updateItem,
  handleNumberInput,
  removeItem,
}: InvoiceItemsSectionProps) {
  return (
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
            key={items.length}
            initial={{ scale: 1.3 }}
            animate={{ scale: 1 }}
            className="text-xs text-slate-500"
          >
            ({items.length})
          </motion.span>
        </div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
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

      {items.length === 0 ? (
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
          {items.map((item, index) => (
            <InvoiceItemRow
              key={item.id}
              item={item}
              index={index}
              updateItem={updateItem}
              handleNumberInput={handleNumberInput}
              removeItem={removeItem}
            />
          ))}
        </AnimatePresence>
      )}
    </motion.div>
  );
}
