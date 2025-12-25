"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Store, Save, Building2, Phone, MapPin } from "lucide-react";

export interface StoreInfo {
  name: string;
  phone: string;
  address: string;
  logo?: string;
}

interface StoreSettingsProps {
  onSave: (info: StoreInfo) => void;
  initialData?: StoreInfo;
}

export default function StoreSettings({
  onSave,
  initialData,
}: StoreSettingsProps) {
  const [storeInfo, setStoreInfo] = useState<StoreInfo>(() => {
    if (initialData) {
      return initialData;
    }

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
      name: "OrderKyat",
      phone: "+95 9 123 456 789",
      address: "Yangon, Myanmar",
    };
  });

  const handlePhoneChange = (value: string) => {
    const cleaned = value.replace(/[^\d\s+\-()]/g, "");
    setStoreInfo({ ...storeInfo, phone: cleaned });
  };

  const handleSave = () => {
    localStorage.setItem("orderkyat-store-info", JSON.stringify(storeInfo));
    onSave(storeInfo);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-3xl"
    >
      <Card className="w-full border-slate-200 shadow-xl">
        <CardHeader className="space-y-3 pb-6 lg:pb-8">
          <CardTitle className="flex items-center gap-3 text-xl lg:text-2xl">
            <div className="p-2.5 bg-blue-100 rounded-lg">
              <Store className="w-6 h-6 lg:w-7 lg:h-7 text-blue-600" />
            </div>
            Store Information
          </CardTitle>
          <p className="text-sm lg:text-base text-slate-600">
            This information will appear on your invoices
          </p>
        </CardHeader>

        <CardContent className="space-y-6 lg:space-y-8 px-6 lg:px-8 pb-6 lg:pb-8">
          {/* Store Name */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-3"
          >
            <Label
              htmlFor="store-name"
              className="text-sm lg:text-base font-medium flex items-center gap-2"
            >
              <Building2 className="w-4 h-4 text-slate-500" />
              Store Name
            </Label>
            <Input
              id="store-name"
              value={storeInfo.name}
              onChange={(e) =>
                setStoreInfo({ ...storeInfo, name: e.target.value })
              }
              placeholder="Your Store Name"
              maxLength={50}
              className="h-12 lg:h-14 text-sm lg:text-base bg-slate-50 border-slate-300 focus:border-blue-500 focus:ring-blue-500/20"
            />
            <p className="text-xs lg:text-sm text-slate-500">
              Maximum 50 characters
            </p>
          </motion.div>

          {/* Store Phone */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-3"
          >
            <Label
              htmlFor="store-phone"
              className="text-sm lg:text-base font-medium flex items-center gap-2"
            >
              <Phone className="w-4 h-4 text-slate-500" />
              Phone Number
            </Label>
            <Input
              id="store-phone"
              type="tel"
              value={storeInfo.phone}
              onChange={(e) => handlePhoneChange(e.target.value)}
              placeholder="+95 9 XXX XXX XXX"
              maxLength={20}
              className="h-12 lg:h-14 text-sm lg:text-base bg-slate-50 border-slate-300 focus:border-blue-500 focus:ring-blue-500/20"
            />
            <p className="text-xs lg:text-sm text-slate-500">
              Only numbers and + - ( ) symbols allowed
            </p>
          </motion.div>

          {/* Store Address */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-3"
          >
            <Label
              htmlFor="store-address"
              className="text-sm lg:text-base font-medium flex items-center gap-2"
            >
              <MapPin className="w-4 h-4 text-slate-500" />
              Store Address
            </Label>
            <Input
              id="store-address"
              value={storeInfo.address}
              onChange={(e) =>
                setStoreInfo({ ...storeInfo, address: e.target.value })
              }
              placeholder="Your Store Address"
              maxLength={100}
              className="h-12 lg:h-14 text-sm lg:text-base bg-slate-50 border-slate-300 focus:border-blue-500 focus:ring-blue-500/20"
            />
            <p className="text-xs lg:text-sm text-slate-500">
              Maximum 100 characters
            </p>
          </motion.div>

          {/* Info Box */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-blue-50 border border-blue-200 rounded-xl p-4 lg:p-5"
          >
            <p className="text-xs lg:text-sm text-blue-800">
              💡 <strong>Tip:</strong> Your store information will be saved and
              automatically filled in future invoices.
            </p>
          </motion.div>

          {/* Save Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              onClick={handleSave}
              className="w-full h-12 lg:h-14 text-sm lg:text-base bg-green-600 hover:bg-green-700 shadow-md"
            >
              <Save className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
              Save Store Information
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
