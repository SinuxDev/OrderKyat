"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useExtractData } from "@/hooks/useExtractData";
import { ExtractedData } from "@/types/invoice";
import { Loader2, Sparkles } from "lucide-react";

interface ChatPasteFormProps {
  onExtract: (data: ExtractedData) => void;
}

export default function ChatPasteForm({ onExtract }: ChatPasteFormProps) {
  const [chatText, setChatText] = useState("");
  const { extract, isExtracting } = useExtractData();

  const handleSubmit = () => {
    if (!chatText.trim()) return;
    const data = extract(chatText);
    if (data) {
      onExtract(data);
    }
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
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            <span>Paste Order Message</span>
          </CardTitle>
          <p className="text-xs sm:text-sm text-slate-600">
            Copy from Facebook, Viber, or Messenger
          </p>
        </CardHeader>
        <CardContent className="space-y-4 px-4 sm:px-6 pb-5 sm:pb-6">
          <Textarea
            placeholder='Example: "Mg Mg, 09123456789, 2 blue shirts and 1 red bag, send to Yangon, 50000 ks"'
            value={chatText}
            onChange={(e) => setChatText(e.target.value)}
            rows={6}
            className="resize-none bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20 text-sm sm:text-base"
          />
          <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
            <Button
              onClick={handleSubmit}
              disabled={!chatText.trim() || isExtracting}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-5 sm:py-6 text-sm sm:text-base shadow-md"
            >
              {isExtracting ? (
                <>
                  <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" />
                  Extracting...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Extract Order Details
                </>
              )}
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
