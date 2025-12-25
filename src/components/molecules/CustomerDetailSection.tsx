"use client";

import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles } from "lucide-react";
import { ExtractedData } from "@/types/invoice";

interface CustomerDetailsSectionProps {
  formData: ExtractedData;
  updateField: (field: keyof ExtractedData, value: string | number) => void;
  handlePhoneChange: (value: string) => void;
}

export default function CustomerDetailsSection({
  formData,
  updateField,
  handlePhoneChange,
}: CustomerDetailsSectionProps) {
  return (
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
        <motion.div whileFocus={{ scale: 1.01 }} className="space-y-2">
          <Label className="text-sm lg:text-base">Customer Name</Label>
          <Input
            value={formData.customerName}
            onChange={(e) => updateField("customerName", e.target.value)}
            placeholder="Enter customer name"
            className="bg-slate-50 border-slate-300 text-slate-900 focus:border-green-500 focus:ring-green-500/20 text-sm sm:text-base lg:text-lg h-11 lg:h-12 transition-all"
          />
        </motion.div>
        <motion.div whileFocus={{ scale: 1.01 }} className="space-y-2">
          <Label className="text-sm lg:text-base">Phone</Label>
          <Input
            value={formData.phone}
            onChange={(e) => handlePhoneChange(e.target.value)}
            placeholder="+95 9 XXX XXX XXX"
            className="bg-slate-50 border-slate-300 text-slate-900 focus:border-green-500 focus:ring-green-500/20 text-sm sm:text-base lg:text-lg h-11 lg:h-12 transition-all"
          />
        </motion.div>
      </div>
      <motion.div whileFocus={{ scale: 1.01 }} className="space-y-2">
        <Label className="text-sm lg:text-base">Address</Label>
        <Input
          value={formData.address}
          onChange={(e) => updateField("address", e.target.value)}
          placeholder="Customer address"
          className="bg-slate-50 border-slate-300 text-slate-900 focus:border-green-500 focus:ring-green-500/20 text-sm sm:text-base lg:text-lg h-11 lg:h-12 transition-all"
        />
      </motion.div>
    </motion.div>
  );
}
