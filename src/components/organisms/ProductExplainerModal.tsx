"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  MessageSquare,
  FileText,
  Download,
  Smartphone,
  CheckCircle2,
  Zap,
} from "lucide-react";

interface ProductExplainerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FEATURES = [
  {
    icon: MessageSquare,
    title: "Paste Chat Orders",
    description:
      "Copy messy orders from Facebook, Viber, or Messenger and paste directly into OrderKyat",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Zap,
    title: "AI-Powered Extraction",
    description:
      "Our smart AI automatically detects customer names, phone numbers, items, quantities, and prices",
    color: "from-indigo-500 to-purple-500",
  },
  {
    icon: FileText,
    title: "Edit & Customize",
    description:
      "Review and edit extracted data with an easy-to-use interface. Add, remove, or modify items instantly",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Download,
    title: "Generate PDF",
    description:
      "Create professional PDF invoices with your store branding in seconds. Download and share with customers",
    color: "from-pink-500 to-rose-500",
  },
];

const HOW_IT_WORKS = [
  {
    step: "1",
    title: "Copy Order Message",
    description:
      'Get order from customer chat: "Mg Mg, 09123456789, 2 shirts @ 15000"',
  },
  {
    step: "2",
    title: "Paste & Extract",
    description:
      "OrderKyat's AI extracts customer info, items, and prices automatically",
  },
  {
    step: "3",
    title: "Review & Edit",
    description:
      "Check details, add or modify items, adjust quantities and prices",
  },
  {
    step: "4",
    title: "Download Invoice",
    description:
      "Generate professional PDF invoice and share with your customer",
  },
];

export default function ProductExplainerModal({
  isOpen,
  onClose,
}: ProductExplainerModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
          >
            {/* Header - Fixed */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 sm:p-8 rounded-t-2xl flex-shrink-0 relative">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 hover:bg-white/20 rounded-lg transition-colors z-10"
                aria-label="Close modal"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              <div className="flex items-center gap-3 mb-3 pr-10">
                <Smartphone className="w-7 h-7 sm:w-8 sm:h-8 flex-shrink-0" />
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">
                  How OrderKyat Works
                </h2>
              </div>
              <p className="text-blue-100 text-sm sm:text-base">
                From messy chat messages to professional invoices in 30 seconds
              </p>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto flex-grow">
              <div className="p-6 sm:p-8">
                {/* Key Features Section */}
                <div className="mb-12">
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mb-6">
                    Key Features
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {FEATURES.map((feature, index) => (
                      <motion.div
                        key={feature.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex gap-4 p-4 rounded-xl border border-slate-200 hover:shadow-md transition-shadow"
                      >
                        <div
                          className={`flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center`}
                        >
                          <feature.icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-800 mb-1">
                            {feature.title}
                          </h4>
                          <p className="text-sm text-slate-600">
                            {feature.description}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* How It Works Section */}
                <div className="mb-8">
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mb-6">
                    Simple 4-Step Process
                  </h3>
                  <div className="space-y-6">
                    {HOW_IT_WORKS.map((item, index) => (
                      <motion.div
                        key={item.step}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        className="flex gap-4 items-start relative"
                      >
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center text-lg z-10">
                          {item.step}
                        </div>
                        <div className="flex-grow pt-1">
                          <h4 className="font-semibold text-slate-800 mb-1">
                            {item.title}
                          </h4>
                          <p className="text-sm text-slate-600">
                            {item.description}
                          </p>
                        </div>
                        {index < HOW_IT_WORKS.length - 1 && (
                          <div className="absolute left-[19px] top-12 w-0.5 h-10 bg-gradient-to-b from-blue-300 to-indigo-200" />
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Why Choose OrderKyat */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6">
                  <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-4">
                    Why Choose OrderKyat?
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {[
                      "100% Free for small sellers",
                      "No registration required to try",
                      "Works with Myanmar phone formats",
                      "Mobile-friendly interface",
                      "Secure - your data stays local",
                      "Perfect for Facebook sellers",
                    ].map((benefit, index) => (
                      <motion.div
                        key={benefit}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 + index * 0.05 }}
                        className="flex items-center gap-2"
                      >
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                        <span className="text-sm text-slate-700">
                          {benefit}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-slate-200 p-6 sm:p-8 bg-white rounded-b-2xl flex-shrink-0">
              <div className="flex flex-col sm:flex-row gap-3 justify-end">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="px-6 py-3 bg-white border-2 border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Close
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all"
                >
                  Try It Now
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
