"use client";

import { motion } from "framer-motion";
import { Truck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DeliveryType } from "@/types/invoice";

interface DeliverySectionProps {
  deliveryType?: DeliveryType;
  deliveryFee?: number;
  updateField: (field: string, value: unknown) => void;
}

const DELIVERY_OPTIONS: {
  value: DeliveryType;
  label: string;
  suggestedFee: number;
}[] = [
  {
    value: "Cash on Delivery",
    label: "Cash on Delivery (COD)",
    suggestedFee: 4500,
  },
  {
    value: "Prepaid",
    label: "Prepaid (Online Payment)",
    suggestedFee: 1500,
  },
  {
    value: "Self Pickup",
    label: "Self Pickup (Free)",
    suggestedFee: 0,
  },
  {
    value: "Free Delivery",
    label: "Free Delivery",
    suggestedFee: 0,
  },
];

export default function DeliverySection({
  deliveryType,
  deliveryFee,
  updateField,
}: DeliverySectionProps) {
  const isFreeDelivery =
    deliveryType === "Free Delivery" || deliveryType === "Self Pickup";

  const handleDeliveryTypeChange = (value: DeliveryType) => {
    updateField("deliveryType", value);

    const selected = DELIVERY_OPTIONS.find((opt) => opt.value === value);
    if (selected) {
      updateField("deliveryFee", selected.suggestedFee);
    }
  };

  const handleDeliveryFeeChange = (value: string) => {
    if (isFreeDelivery) return;

    const numValue = parseInt(value) || 0;
    if (numValue >= 0) {
      updateField("deliveryFee", numValue);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="space-y-4 pt-6 border-t border-slate-200"
    >
      <div className="flex items-center gap-2 mb-4">
        <Truck className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg sm:text-xl font-bold text-slate-900">
          Delivery Information
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Delivery Type */}
        <div className="space-y-2">
          <Label
            htmlFor="deliveryType"
            className="text-sm font-medium text-slate-700"
          >
            Delivery Type
          </Label>
          <Select value={deliveryType} onValueChange={handleDeliveryTypeChange}>
            <SelectTrigger
              id="deliveryType"
              className="bg-slate-50 border-slate-300 text-slate-900 w-full !h-11 !min-h-11 !max-h-11" // ✅ Force exact height
            >
              <SelectValue placeholder="Select delivery type" />
            </SelectTrigger>
            <SelectContent>
              {DELIVERY_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Delivery Fee */}
        <div className="space-y-2">
          <Label
            htmlFor="deliveryFee"
            className="text-sm font-medium text-slate-700"
          >
            Delivery Fee (Ks)
          </Label>
          <Input
            id="deliveryFee"
            type="number"
            min="0"
            value={deliveryFee || 0}
            onChange={(e) => handleDeliveryFeeChange(e.target.value)}
            disabled={isFreeDelivery}
            className={`border-slate-300 text-slate-900 w-full !h-11 ${
              isFreeDelivery
                ? "bg-slate-100 cursor-not-allowed opacity-60"
                : "bg-slate-50"
            }`} // ✅ Force exact height
            placeholder={isFreeDelivery ? "Free" : "0"}
          />
        </div>
      </div>

      {/* Info Message */}
      {deliveryType && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex items-center gap-2 border rounded-lg px-3 py-2 text-xs ${
            isFreeDelivery
              ? "bg-green-50 border-green-200 text-green-700"
              : "bg-blue-50 border-blue-200 text-blue-700"
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>
            Selected: <strong>{deliveryType}</strong>
            {isFreeDelivery ? (
              <>
                {" "}
                • <strong className="text-green-600">FREE!</strong>
              </>
            ) : (
              deliveryFee !== undefined &&
              deliveryFee > 0 && (
                <>
                  {" "}
                  • Fee: <strong>{deliveryFee.toLocaleString()} Ks</strong>
                </>
              )
            )}
          </span>
        </motion.div>
      )}
    </motion.div>
  );
}
