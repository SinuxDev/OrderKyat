"use client";

import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";
import { InvoiceItem } from "@/types/invoice";

interface InvoiceItemRowProps {
  item: InvoiceItem;
  index: number;
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

export default function InvoiceItemRow({
  item,
  index,
  updateItem,
  handleNumberInput,
  removeItem,
}: InvoiceItemRowProps) {
  const subtotal = item.quantity * item.price;

  return (
    <motion.div
      key={item.id}
      className="space-y-2"
      initial={{ opacity: 0, x: -20, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 20, scale: 0.95 }}
      transition={{ delay: index * 0.03, duration: 0.2 }}
    >
      {/* Mobile Layout */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        className="sm:hidden space-y-2 p-3 bg-slate-50 rounded-lg border border-slate-200"
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
          onChange={(e) => updateItem(item.id, "name", e.target.value)}
          className="bg-white border-slate-300 text-slate-900 text-sm"
        />
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="number"
            placeholder="Qty"
            value={item.quantity}
            onChange={(e) =>
              handleNumberInput(item.id, "quantity", e.target.value)
            }
            className="bg-white border-slate-300 text-slate-900 text-sm"
          />
          <Input
            type="number"
            placeholder="Price"
            value={item.price}
            onChange={(e) =>
              handleNumberInput(item.id, "price", e.target.value)
            }
            className="bg-white border-slate-300 text-slate-900 text-sm"
          />
        </div>
        <div className="flex justify-between items-center pt-1 border-t border-slate-200">
          <span className="text-xs text-slate-600">Subtotal:</span>
          <motion.span
            key={subtotal}
            initial={{ scale: 1.2, color: "#10b981" }}
            animate={{ scale: 1, color: "#0f172a" }}
            className="text-sm font-semibold"
          >
            {subtotal.toLocaleString()} Ks
          </motion.span>
        </div>
      </motion.div>

      {/* Desktop Layout - OPTIMIZED SPACE USAGE */}
      <motion.div
        whileHover={{ scale: 1.002, backgroundColor: "#f8fafc" }}
        className="hidden sm:grid grid-cols-[1fr_100px_140px_140px_auto] gap-3 lg:gap-4 items-center p-2.5 lg:p-3 rounded-lg transition-all"
      >
        {/* Item Name - Takes all remaining space (1fr) */}
        <Input
          placeholder="Item name"
          value={item.name}
          onChange={(e) => updateItem(item.id, "name", e.target.value)}
          className="w-full bg-slate-50 border-slate-300 text-slate-900 text-sm lg:text-base h-10 lg:h-11"
        />

        {/* Quantity - Fixed 100px */}
        <Input
          type="number"
          placeholder="Qty"
          value={item.quantity}
          onChange={(e) =>
            handleNumberInput(item.id, "quantity", e.target.value)
          }
          className="w-full bg-slate-50 border-slate-300 text-slate-900 text-sm lg:text-base h-10 lg:h-11 text-center"
        />

        {/* Price - Fixed 140px */}
        <Input
          type="number"
          placeholder="Price"
          value={item.price}
          onChange={(e) => handleNumberInput(item.id, "price", e.target.value)}
          className="w-full bg-slate-50 border-slate-300 text-slate-900 text-sm lg:text-base h-10 lg:h-11 text-right"
        />

        {/* Subtotal - Fixed 140px, right-aligned */}
        <div className="text-right">
          <motion.span
            key={subtotal}
            initial={{ scale: 1.15, color: "#10b981" }}
            animate={{ scale: 1, color: "#334155" }}
            className="text-sm lg:text-base font-semibold whitespace-nowrap"
          >
            {subtotal.toLocaleString()} Ks
          </motion.span>
        </div>

        {/* Delete Button - Auto width */}
        <motion.button
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => removeItem(item.id)}
          className="p-2 lg:p-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors justify-self-center"
          title="Remove item"
        >
          <Trash2 className="w-4 h-4 lg:w-5 lg:h-5" />
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
