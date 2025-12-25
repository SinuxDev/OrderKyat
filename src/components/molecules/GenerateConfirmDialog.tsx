"use client";

import { motion } from "framer-motion";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, Store, Lightbulb } from "lucide-react";
import { ExtractedData } from "@/types/invoice";
import { StoreInfo } from "@/components/organisms/StoreSettings";

interface GenerateConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: ExtractedData;
  storeInfo: StoreInfo;
  updateStoreInfo: (field: keyof StoreInfo, value: string) => void;
  handleStorePhoneChange: (value: string) => void;
  calculateTotal: () => number;
  confirmGenerate: () => void;
}

export default function GenerateConfirmDialog({
  open,
  onOpenChange,
  formData,
  storeInfo,
  updateStoreInfo,
  handleStorePhoneChange,
  calculateTotal,
  confirmGenerate,
}: GenerateConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <AlertDialogHeader className="space-y-3">
          <AlertDialogTitle className="flex items-center gap-2.5 text-xl lg:text-2xl">
            <Download className="w-6 h-6 text-green-600" />
            Confirm Invoice Details
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-5 lg:space-y-6"
            >
              {/* Store Information Section */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 lg:p-6">
                <div className="flex items-center gap-2.5 mb-4">
                  <Store className="w-5 h-5 lg:w-6 lg:h-6 text-blue-600" />
                  <h3 className="text-base lg:text-lg font-semibold text-slate-900">
                    Your Store Information
                  </h3>
                </div>
                <p className="text-xs lg:text-sm text-slate-600 mb-4">
                  This will appear at the top of your invoice
                </p>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm lg:text-base text-slate-700 font-medium">
                      Store Name
                    </Label>
                    <Input
                      value={storeInfo.name}
                      onChange={(e) => updateStoreInfo("name", e.target.value)}
                      placeholder="Your Store Name"
                      className="text-sm lg:text-base h-11 lg:h-12 bg-white"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm lg:text-base text-slate-700 font-medium">
                        Store Phone
                      </Label>
                      <Input
                        value={storeInfo.phone}
                        onChange={(e) => handleStorePhoneChange(e.target.value)}
                        placeholder="+95 9 XXX XXX XXX"
                        className="text-sm lg:text-base h-11 lg:h-12 bg-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm lg:text-base text-slate-700 font-medium">
                        Store Address
                      </Label>
                      <Input
                        value={storeInfo.address}
                        onChange={(e) =>
                          updateStoreInfo("address", e.target.value)
                        }
                        placeholder="Your Store Address"
                        className="text-sm lg:text-base h-11 lg:h-12 bg-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Invoice Summary */}
              <div className="bg-slate-50 border border-slate-200 p-5 lg:p-6 rounded-xl space-y-3">
                <h3 className="text-base lg:text-lg font-semibold text-slate-900 mb-3">
                  Invoice Summary
                </h3>
                <div className="space-y-2.5">
                  <div className="flex justify-between items-center text-sm lg:text-base">
                    <span className="text-slate-600">Customer:</span>
                    <span className="font-medium text-slate-900">
                      {formData.customerName || "Not specified"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm lg:text-base">
                    <span className="text-slate-600">Items:</span>
                    <span className="font-medium text-slate-900">
                      {formData.items.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t-2 border-slate-300">
                    <span className="text-base lg:text-lg font-semibold text-slate-900">
                      Total Amount:
                    </span>
                    <span className="text-xl lg:text-2xl font-bold text-green-600">
                      {calculateTotal().toLocaleString()} Ks
                    </span>
                  </div>
                </div>
              </div>

              {/* Info Note */}
              <div className="flex items-start gap-2 text-xs lg:text-sm text-slate-600 bg-amber-50 border border-amber-200 rounded-lg p-3 lg:p-4">
                <Lightbulb className="w-4 h-4 lg:w-5 lg:h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <p>Your store information will be saved for future invoices</p>
              </div>
            </motion.div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2 sm:gap-3">
          <AlertDialogCancel className="text-sm lg:text-base h-10 lg:h-11">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={confirmGenerate}
            className="bg-green-600 hover:bg-green-700 text-sm lg:text-base h-10 lg:h-11"
          >
            <Download className="w-4 h-4 mr-2" />
            Generate PDF
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
