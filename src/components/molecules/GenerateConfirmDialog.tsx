"use client";

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
import { Download, Store } from "lucide-react";
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
                    <Label className="text-xs text-slate-700">Store Name</Label>
                    <Input
                      value={storeInfo.name}
                      onChange={(e) => updateStoreInfo("name", e.target.value)}
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
                      onChange={(e) => handleStorePhoneChange(e.target.value)}
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
  );
}
