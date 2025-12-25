"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExtractedData, InvoiceItem } from "@/types/invoice";
import { motion } from "framer-motion";
import { Download } from "lucide-react";

interface InvoiceFormProps {
  initialData: ExtractedData;
  onGenerate: (data: ExtractedData) => void;
}

export default function InvoiceForm({
  initialData,
  onGenerate,
}: InvoiceFormProps) {
  const [formData, setFormData] = useState<ExtractedData>(initialData);

  const updateField = (field: keyof ExtractedData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
  };

  const calculateTotal = () => {
    return formData.items.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <Card className="w-full max-w-2xl mx-auto bg-white shadow-lg border-slate-200">
        <CardHeader className="space-y-1 px-4 sm:px-6 pt-5 sm:pt-6">
          <CardTitle className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2 font-[family-name:var(--font-geist-sans)]">
            <Download className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
            <span>Review & Edit Invoice</span>
          </CardTitle>
          <p className="text-xs sm:text-sm text-slate-600">
            Verify details before generating PDF
          </p>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6 pb-5 sm:pb-6">
          {/* Customer Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-2">
              <Label className="text-slate-700 text-sm">Customer Name</Label>
              <Input
                value={formData.customerName}
                onChange={(e) => updateField("customerName", e.target.value)}
                className="bg-slate-50 border-slate-300 text-slate-900 focus:border-green-500 focus:ring-green-500/20 text-sm sm:text-base"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-700 text-sm">Phone</Label>
              <Input
                value={formData.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                className="bg-slate-50 border-slate-300 text-slate-900 focus:border-green-500 focus:ring-green-500/20 text-sm sm:text-base"
              />
            </div>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label className="text-slate-700 text-sm">Address</Label>
            <Input
              value={formData.address}
              onChange={(e) => updateField("address", e.target.value)}
              className="bg-slate-50 border-slate-300 text-slate-900 focus:border-green-500 focus:ring-green-500/20 text-sm sm:text-base"
            />
          </div>

          {/* Items */}
          <div className="space-y-2 sm:space-y-3">
            <Label className="text-slate-700 text-sm">Items</Label>
            {formData.items.map((item, index) => (
              <motion.div
                key={item.id}
                className="space-y-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {/* Mobile: Stack vertically */}
                <div className="sm:hidden space-y-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
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
                        updateItem(
                          item.id,
                          "quantity",
                          parseInt(e.target.value)
                        )
                      }
                      className="bg-white border-slate-300 text-slate-900 text-sm"
                    />
                    <Input
                      type="number"
                      placeholder="Price"
                      value={item.price}
                      onChange={(e) =>
                        updateItem(item.id, "price", parseInt(e.target.value))
                      }
                      className="bg-white border-slate-300 text-slate-900 text-sm"
                    />
                  </div>
                  <div className="flex justify-between items-center pt-1 border-t border-slate-200">
                    <span className="text-xs text-slate-600">Subtotal:</span>
                    <span className="text-sm font-semibold text-slate-900">
                      {item.quantity * item.price} Ks
                    </span>
                  </div>
                </div>

                {/* Desktop: Grid layout */}
                <div className="hidden sm:grid grid-cols-12 gap-2">
                  <Input
                    placeholder="Item name"
                    value={item.name}
                    onChange={(e) =>
                      updateItem(item.id, "name", e.target.value)
                    }
                    className="col-span-5 bg-slate-50 border-slate-300 text-slate-900 text-sm"
                  />
                  <Input
                    type="number"
                    placeholder="Qty"
                    value={item.quantity}
                    onChange={(e) =>
                      updateItem(item.id, "quantity", parseInt(e.target.value))
                    }
                    className="col-span-2 bg-slate-50 border-slate-300 text-slate-900 text-sm"
                  />
                  <Input
                    type="number"
                    placeholder="Price"
                    value={item.price}
                    onChange={(e) =>
                      updateItem(item.id, "price", parseInt(e.target.value))
                    }
                    className="col-span-3 bg-slate-50 border-slate-300 text-slate-900 text-sm"
                  />
                  <div className="col-span-2 flex items-center justify-end">
                    <span className="text-sm font-medium text-slate-700">
                      {item.quantity * item.price} Ks
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Total */}
          <div className="flex justify-between items-center pt-4 border-t border-slate-300">
            <span className="text-base sm:text-lg font-bold text-slate-900">
              Total:
            </span>
            <span className="text-xl sm:text-2xl font-bold text-green-600">
              {calculateTotal()} Ks
            </span>
          </div>

          {/* Generate Button */}
          <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
            <Button
              onClick={() =>
                onGenerate({ ...formData, totalPrice: calculateTotal() })
              }
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-5 sm:py-6 text-sm sm:text-base shadow-md"
            >
              <Download className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Generate PDF Invoice
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
