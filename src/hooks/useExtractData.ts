"use client";

import { useState } from "react";
import { extractInvoiceData } from "@/lib/extractors";
import { ExtractedData } from "@/types/invoice";

export function useExtractData() {
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(
    null
  );
  const [isExtracting, setIsExtracting] = useState(false);

  const extract = (text: string) => {
    setIsExtracting(true);
    try {
      const data = extractInvoiceData(text);
      setExtractedData(data);
      return data;
    } catch (error) {
      console.error("Extraction failed:", error);
      return null;
    } finally {
      setIsExtracting(false);
    }
  };

  return { extractedData, isExtracting, extract, setExtractedData };
}
