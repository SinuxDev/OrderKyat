"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Sparkles, Check } from "lucide-react";

const FREE_FEATURES = [
  "Unlimited invoices",
  "PDF export",
  "Store information storage",
  "Mobile-friendly interface",
  "Basic invoice templates",
];

const PREMIUM_FEATURES = [
  "AI-powered invoice generation",
  "Everything in Free",
  "Custom invoice templates",
  "Brand logo & colors",
  "Advanced analytics",
  "Customer database",
  "Multi-currency support",
  "Priority support",
  "Export to Excel/CSV",
];

interface PricingCardsProps {
  onGetStarted?: () => void;
}

export default function PricingCards({ onGetStarted }: PricingCardsProps) {
  const [activePlan, setActivePlan] = useState<"free" | "premium">("free");

  const handleGetStarted = () => {
    if (onGetStarted) {
      onGetStarted();
    }
  };

  return (
    <div className="mb-12">
      {/* Mobile Tab Switcher */}
      <div className="md:hidden mb-6 flex gap-2 p-1 bg-slate-200 rounded-lg max-w-md mx-auto">
        <button
          onClick={() => setActivePlan("free")}
          className={`flex-1 py-3 px-4 rounded-md font-semibold transition-all ${
            activePlan === "free"
              ? "bg-white text-blue-600 shadow-md"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Shield className="w-5 h-5" />
            <span>Free</span>
          </div>
        </button>
        <button
          onClick={() => setActivePlan("premium")}
          className={`flex-1 py-3 px-4 rounded-md font-semibold transition-all ${
            activePlan === "premium"
              ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5" />
            <span>Premium</span>
          </div>
        </button>
      </div>

      {/* Desktop: Side by Side */}
      <div className="hidden md:grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {/* Free Plan Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 sm:p-8 hover:shadow-xl transition-shadow flex flex-col"
        >
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-6 h-6 text-blue-600" />
            <h3 className="text-2xl font-bold text-slate-800">Free</h3>
          </div>

          <div className="mb-6">
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold text-slate-900">0</span>
              <span className="text-xl text-slate-600">MMK</span>
            </div>
            <p className="text-sm text-slate-500 mt-1">Forever free</p>
          </div>

          <p className="text-slate-600 mb-6">
            Perfect for small sellers starting out
          </p>

          <ul className="space-y-3 mb-8 flex-grow">
            {FREE_FEATURES.map((feature) => (
              <li key={feature} className="flex items-start gap-2">
                <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-slate-700">{feature}</span>
              </li>
            ))}
          </ul>

          <button
            onClick={handleGetStarted}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Get Started Free
          </button>
        </motion.div>

        {/* Premium Plan Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl shadow-xl border-2 border-indigo-400 p-6 sm:p-8 relative overflow-hidden hover:shadow-2xl transition-shadow flex flex-col"
        >
          <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full">
            COMING SOON
          </div>

          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-white" />
            <h3 className="text-2xl font-bold text-white">Premium</h3>
          </div>

          <div className="mb-6">
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold text-white">TBA</span>
            </div>
            <p className="text-sm text-indigo-100 mt-1">
              Pricing announced soon
            </p>
          </div>

          <p className="text-indigo-100 mb-6">
            Advanced features for growing businesses
          </p>

          <ul className="space-y-3 mb-8 flex-grow">
            {PREMIUM_FEATURES.map((feature) => (
              <li key={feature} className="flex items-start gap-2">
                <Check className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                <span className="text-sm text-white">{feature}</span>
              </li>
            ))}
          </ul>

          <button
            disabled
            className="w-full py-3 px-4 bg-white/20 text-white font-medium rounded-lg cursor-not-allowed backdrop-blur-sm"
          >
            Coming Soon
          </button>
        </motion.div>
      </div>

      {/* Mobile: Tab Content */}
      <div className="md:hidden max-w-md mx-auto">
        <AnimatePresence mode="wait">
          {activePlan === "free" && (
            <motion.div
              key="free"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 flex flex-col"
            >
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-6 h-6 text-blue-600" />
                <h3 className="text-2xl font-bold text-slate-800">Free</h3>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-slate-900">0</span>
                  <span className="text-xl text-slate-600">MMK</span>
                </div>
                <p className="text-sm text-slate-500 mt-1">Forever free</p>
              </div>

              <p className="text-slate-600 mb-6">
                Perfect for small sellers starting out
              </p>

              <ul className="space-y-3 mb-8">
                {FREE_FEATURES.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={handleGetStarted}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                Get Started Free
              </button>
            </motion.div>
          )}

          {activePlan === "premium" && (
            <motion.div
              key="premium"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl shadow-xl border-2 border-indigo-400 p-6 relative overflow-hidden flex flex-col"
            >
              <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full">
                COMING SOON
              </div>

              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-6 h-6 text-white" />
                <h3 className="text-2xl font-bold text-white">Premium</h3>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-white">TBA</span>
                </div>
                <p className="text-sm text-indigo-100 mt-1">
                  Pricing announced soon
                </p>
              </div>

              <p className="text-indigo-100 mb-6">
                Advanced features for growing businesses
              </p>

              <ul className="space-y-3 mb-8">
                {PREMIUM_FEATURES.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-white">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                disabled
                className="w-full py-3 px-4 bg-white/20 text-white font-medium rounded-lg cursor-not-allowed backdrop-blur-sm"
              >
                Coming Soon
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
