"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useExtractData } from "@/hooks/useExtractData";
import { ExtractedData } from "@/types/invoice";
import {
  Loader2,
  Sparkles,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Crown,
  Edit3,
  AlertCircle,
  CheckCircle2,
  ShieldAlert,
} from "lucide-react";

interface ChatPasteFormProps {
  onExtract: (data: ExtractedData) => void;
}

type FormatStatus =
  | "empty"
  | "good"
  | "warning"
  | "missing-phone"
  | "missing-items"
  | "invalid-format";

export default function ChatPasteForm({ onExtract }: ChatPasteFormProps) {
  const [chatText, setChatText] = useState("");
  const [copied, setCopied] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [previewData, setPreviewData] = useState<ExtractedData | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [formatStatus, setFormatStatus] = useState<FormatStatus>("empty");
  const { extract, isExtracting } = useExtractData();

  const sanitizeInput = (text: string): string => {
    let clean = text.replace(/<[^>]*>/g, "");
    clean = clean.replace(/(<script|javascript:|onerror=|onclick=)/gi, "");
    clean = clean.replace(/[^\w\s,@.\-+()\/\u1000-\u109F]/gi, "");
    return clean.slice(0, 1000);
  };

  const validateFormat = (text: string) => {
    if (!text.trim()) {
      setFormatStatus("empty");
      return;
    }

    const hasSuspiciousChars = /<|>|{|}|\[|\]|script|function|eval|alert/.test(
      text.toLowerCase()
    );
    if (hasSuspiciousChars) {
      setFormatStatus("invalid-format");
      return;
    }

    const hasPhone = /(\+?959\d{7,9}|09\d{7,9})/.test(text);
    const hasPrice = /@\s*\d+/.test(text);
    const hasItems = /\d+\s+[a-zA-Z\u1000-\u109F]+/.test(text);
    const hasName = /^[a-zA-Z\s\u1000-\u109F]+/.test(text.trim());

    if (!hasPhone) {
      setFormatStatus("missing-phone");
    } else if (!hasItems || !hasPrice) {
      setFormatStatus("missing-items");
    } else if (hasPhone && hasPrice && hasItems && hasName) {
      setFormatStatus("good");
    } else {
      setFormatStatus("warning");
    }
  };

  const handleTextChange = (value: string) => {
    const sanitized = sanitizeInput(value);
    setChatText(sanitized);
    validateFormat(sanitized);
    setShowPreview(false);
  };

  const handleSubmit = () => {
    if (!chatText.trim()) return;

    if (formatStatus === "invalid-format") {
      return;
    }

    const data = extract(chatText);

    if (data) {
      setPreviewData(data);
      setShowPreview(true);
    }
  };

  const confirmExtract = () => {
    if (previewData) {
      onExtract(previewData);
    }
  };

  const copyTemplate = async () => {
    const text =
      "Mg Mg, 09123456789, 2 shirts @ 15000 and 3 bags @ 10000, Yangon";

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.left = "-9999px";
      document.body.appendChild(textarea);
      textarea.select();

      try {
        document.execCommand("copy");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        alert(`Please copy manually:\n\n${text}`);
      } finally {
        document.body.removeChild(textarea);
      }
    }
  };

  const getValidationMessage = () => {
    switch (formatStatus) {
      case "good":
        return {
          icon: <CheckCircle2 className="w-3.5 h-3.5" />,
          text: "Format looks good!",
          className: "text-green-600 bg-green-50 border-green-200",
        };
      case "invalid-format":
        return {
          icon: <ShieldAlert className="w-3.5 h-3.5" />,
          text: "Invalid characters detected. Please use plain text orders only.",
          className: "text-red-600 bg-red-50 border-red-200",
        };
      case "missing-phone":
        return {
          icon: <AlertCircle className="w-3.5 h-3.5" />,
          text: "Missing phone number (09xxxxxxxx)",
          className: "text-amber-600 bg-amber-50 border-amber-200",
        };
      case "missing-items":
        return {
          icon: <AlertCircle className="w-3.5 h-3.5" />,
          text: "Missing items or prices (e.g., 2 shirts @ 15000)",
          className: "text-amber-600 bg-amber-50 border-amber-200",
        };
      case "warning":
        return {
          icon: <AlertCircle className="w-3.5 h-3.5" />,
          text: "Check format - click 'Format Help' above",
          className: "text-amber-600 bg-amber-50 border-amber-200",
        };
      default:
        return null;
    }
  };

  const validation = getValidationMessage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      {/* ✅ CHANGED: Increased max-width from max-w-2xl to max-w-3xl */}
      <Card className="w-full max-w-3xl mx-auto bg-white/95 backdrop-blur-sm shadow-xl border-slate-200">
        <CardHeader className="space-y-1 px-4 sm:px-6 lg:px-8 pt-5 sm:pt-6 lg:pt-8">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <CardTitle className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-blue-600" />
                <span>Paste Order Message</span>
              </CardTitle>
            </motion.div>

            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowHelp(!showHelp)}
              className="flex items-center gap-1.5 text-xs sm:text-sm lg:text-base text-blue-600 hover:text-blue-700 font-medium transition-colors bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg"
            >
              <HelpCircle className="w-4 h-4 lg:w-5 lg:h-5" />
              <span className="hidden sm:inline">Format Help</span>
              {showHelp ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </motion.button>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-start gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2.5 lg:px-4 lg:py-3"
          >
            <Edit3 className="w-4 h-4 lg:w-5 lg:h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <p className="text-xs sm:text-sm lg:text-base text-green-800">
              <span className="font-semibold">Don&apos;t worry!</span> You can
              add, edit, or remove items on the next screen.
            </p>
          </motion.div>
        </CardHeader>

        {/* ✅ CHANGED: Increased padding */}
        <CardContent className="space-y-4 lg:space-y-5 px-4 sm:px-6 lg:px-8 pb-5 sm:pb-6 lg:pb-8">
          {/* Format Guide */}
          <AnimatePresence>
            {showHelp && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 lg:p-6">
                  <p className="text-xs sm:text-sm lg:text-base font-semibold text-blue-900 mb-3">
                    📝 Format Guide:
                  </p>
                  <code className="text-xs sm:text-sm lg:text-base text-blue-800 bg-blue-100 px-3 py-2 rounded block mb-4">
                    Name, Phone, Qty Item @ Price and Qty Item @ Price, City
                  </code>

                  <div className="bg-white rounded-lg p-3 lg:p-4 mb-4">
                    <p className="text-xs sm:text-sm lg:text-base text-blue-700 mb-2 font-medium">
                      Example:
                    </p>
                    <p className="text-xs sm:text-sm lg:text-base text-slate-700 font-mono">
                      Mg Mg, 09123456789, 2 shirts @ 15000 and 3 bags @ 10000,
                      Yangon
                    </p>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={copyTemplate}
                    className="flex items-center gap-2 text-xs sm:text-sm lg:text-base text-blue-600 hover:text-blue-700 font-medium bg-blue-100 hover:bg-blue-200 px-3 py-2 rounded-lg transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy Example
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Input Area - ✅ CHANGED: Increased rows for desktop */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="relative space-y-2"
          >
            <Textarea
              placeholder="Example: Mg Mg, 09123456789, 2 shirts @ 15000 and 3 bags @ 10000, Yangon"
              value={chatText}
              onChange={(e) => handleTextChange(e.target.value)}
              rows={8} // ✅ Increased from 6 to 8
              maxLength={1000}
              className="resize-none bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20 text-sm sm:text-base lg:text-lg transition-all"
            />

            {/* Character count */}
            <div className="flex justify-between items-center text-xs sm:text-sm text-slate-500">
              <span>Plain text only (no HTML/code)</span>
              <span>{chatText.length}/1000</span>
            </div>

            {/* Real-time format validation indicator */}
            <AnimatePresence>
              {validation && chatText.length > 5 && !showPreview && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className={`flex items-center gap-2 text-xs sm:text-sm px-3 py-2 lg:py-2.5 rounded-lg border ${validation.className}`}
                >
                  {validation.icon}
                  <span>{validation.text}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Extraction Preview */}
          <AnimatePresence>
            {showPreview && previewData && (
              <motion.div
                initial={{ height: 0, opacity: 0, scale: 0.95 }}
                animate={{ height: "auto", opacity: 1, scale: 1 }}
                exit={{ height: 0, opacity: 0, scale: 0.95 }}
                className="overflow-hidden"
              >
                {previewData.items.length > 0 ? (
                  <div className="flex items-start gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-3 lg:px-4 lg:py-3.5">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm lg:text-base text-green-800">
                        <span className="font-semibold">Found:</span>{" "}
                        {previewData.customerName || "No name"},{" "}
                        {previewData.phone || "No phone"},{" "}
                        {previewData.items.length} item(s), Total:{" "}
                        {previewData.totalPrice.toLocaleString()} Ks
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-3 lg:px-4 lg:py-3.5">
                    <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm lg:text-base text-amber-800">
                        <span className="font-semibold">No items found.</span>{" "}
                        Check your format or click &quot;Format Help&quot;
                        above.
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Pro Tip */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-2 text-xs sm:text-sm lg:text-base text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2.5 lg:px-4 lg:py-3"
          >
            <Crown className="w-4 h-4 lg:w-5 lg:h-5 flex-shrink-0" />
            <p>
              <span className="font-semibold">Premium:</span> Paste any messy
              format with AI extraction
            </p>
          </motion.div>

          {/* Submit Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-2 lg:space-y-3"
          >
            {!showPreview ? (
              <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <Button
                  onClick={handleSubmit}
                  disabled={
                    !chatText.trim() ||
                    isExtracting ||
                    formatStatus === "invalid-format"
                  }
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-5 sm:py-6 lg:py-7 text-sm sm:text-base lg:text-lg shadow-lg disabled:opacity-50 transition-all"
                >
                  {isExtracting ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      >
                        <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 mr-2" />
                      </motion.div>
                      Extracting...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 mr-2" />
                      Extract & Preview
                    </>
                  )}
                </Button>
              </motion.div>
            ) : (
              <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:gap-4">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="outline"
                    onClick={() => setShowPreview(false)}
                    className="w-full text-sm sm:text-base lg:text-lg py-5 sm:py-6 lg:py-7 border-2"
                  >
                    Edit Again
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={confirmExtract}
                    disabled={!previewData || previewData.items.length === 0}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold text-sm sm:text-base lg:text-lg py-5 sm:py-6 lg:py-7 shadow-lg"
                  >
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 mr-1.5" />
                    <span className="hidden xs:inline">Continue to Edit</span>
                    <span className="xs:hidden">Continue</span>
                  </Button>
                </motion.div>
              </div>
            )}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
