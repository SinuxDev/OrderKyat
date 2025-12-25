"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Store, Save } from "lucide-react";

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

  const handleSave = () => {
    localStorage.setItem("orderkyat-store-info", JSON.stringify(storeInfo));
    onSave(storeInfo);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Store className="w-5 h-5 text-blue-600" />
          Store Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Store Name</Label>
          <Input
            value={storeInfo.name}
            onChange={(e) =>
              setStoreInfo({ ...storeInfo, name: e.target.value })
            }
          />
        </div>
        <div className="space-y-2">
          <Label>Phone</Label>
          <Input
            value={storeInfo.phone}
            onChange={(e) =>
              setStoreInfo({ ...storeInfo, phone: e.target.value })
            }
          />
        </div>
        <div className="space-y-2">
          <Label>Address</Label>
          <Input
            value={storeInfo.address}
            onChange={(e) =>
              setStoreInfo({ ...storeInfo, address: e.target.value })
            }
          />
        </div>
        <Button onClick={handleSave} className="w-full">
          <Save className="w-4 h-4 mr-2" />
          Save Store Info
        </Button>
      </CardContent>
    </Card>
  );
}
