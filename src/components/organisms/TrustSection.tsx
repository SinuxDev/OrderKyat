"use client";

import { motion } from "framer-motion";
import { TrendingUp, Users, Clock, Zap, Sparkles } from "lucide-react";

interface TrustSectionProps {
  onGetStarted: () => void;
  onLearnMore: () => void;
}

export default function TrustSection({
  onGetStarted,
  onLearnMore,
}: TrustSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ delay: 0.8 }}
      className="mb-16 sm:mb-20"
    >
      {/* Social Proof Banner with Pulse Effect */}
      <div className="text-center mb-12">
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.9 }}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-lg mb-6 relative"
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          />
          <TrendingUp className="w-5 h-5 relative z-10" />
          <span className="font-semibold text-sm sm:text-base relative z-10">
            Trusted by Myanmar sellers
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-800 mb-4 px-4"
        >
          Why Small Businesses{" "}
          <span className="bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
            Love
          </span>{" "}
          OrderKyat
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="text-sm sm:text-base md:text-lg text-slate-600 max-w-2xl mx-auto px-4"
        >
          Stop wasting time on manual invoices. Start growing your business.
        </motion.p>
      </div>

      {/* Enhanced Stats Grid with Glassmorphism */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {[
          {
            icon: Clock,
            stat: "30 seconds",
            label: "Average invoice creation time",
            color: "from-blue-500 to-cyan-500",
          },
          {
            icon: Users,
            stat: "100%",
            label: "Free for small sellers",
            color: "from-indigo-500 to-purple-500",
          },
          {
            icon: Zap,
            stat: "AI-Powered",
            label: "Smart order extraction",
            color: "from-purple-500 to-pink-500",
          },
        ].map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 + index * 0.1 }}
            whileHover={{
              y: -8,
              scale: 1.02,
              transition: { duration: 0.2 },
            }}
            className="backdrop-blur-md bg-white/60 border border-white/80 rounded-2xl p-6 sm:p-8 shadow-xl text-center hover:shadow-2xl transition-all group"
          >
            <motion.div
              className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} mb-4 shadow-lg`}
              whileHover={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 0.5 }}
            >
              <item.icon className="w-8 h-8 text-white" />
            </motion.div>
            <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent mb-2">
              {item.stat}
            </div>
            <div className="text-sm sm:text-base text-slate-600 font-medium">
              {item.label}
            </div>
          </motion.div>
        ))}
      </div>

      {/* CTA Section with Enhanced Buttons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="text-center mt-12"
      >
        <p className="text-slate-600 text-sm sm:text-base mb-6 font-medium">
          Ready to streamline your order management?
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: "0 20px 40px rgba(79, 70, 229, 0.4)",
            }}
            whileTap={{ scale: 0.95 }}
            onClick={onGetStarted}
            className="group relative px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg overflow-hidden"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600"
              initial={{ x: "100%" }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.3 }}
            />
            <span className="relative z-10 flex items-center gap-2">
              Start Creating Invoices
              <Sparkles className="w-5 h-5" />
            </span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onLearnMore}
            className="px-8 py-3.5 backdrop-blur-md bg-white/80 border-2 border-slate-300 text-slate-700 font-semibold rounded-xl shadow-lg hover:bg-white hover:shadow-xl transition-all"
          >
            Learn More
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
