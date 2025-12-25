"use client";

import { motion } from "framer-motion";
import AnimatedLogo from "@/components/atoms/AnimatedLogo";
import { FileText, Zap, Shield, Sparkles } from "lucide-react";

export default function HeroSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="text-center mb-12 sm:mb-16"
    >
      <div className="mb-6 sm:mb-8">
        <AnimatedLogo />
      </div>

      {/* Enhanced Headline with Gradient Text */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mb-6 sm:mb-8"
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold px-4 leading-tight">
          <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Myanmar&apos;s Smart
          </span>
          <br className="hidden sm:block" />
          <span className="text-slate-800"> Invoice Generator </span>
          <motion.span
            className="inline-block"
            animate={{
              rotate: [0, 14, -8, 14, -4, 10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3,
            }}
          >
            🇲🇲
          </motion.span>
        </h1>
      </motion.div>

      {/* Glassmorphism Subtitle Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="max-w-3xl mx-auto mb-8 sm:mb-10 px-4"
      >
        <div className="backdrop-blur-md bg-white/40 border border-white/60 rounded-2xl p-5 sm:p-7 shadow-xl">
          <p className="text-base sm:text-lg md:text-xl text-slate-700 font-medium leading-relaxed">
            Transform{" "}
            <span className="text-blue-600 font-semibold">
              messy chat messages
            </span>{" "}
            into{" "}
            <span className="text-indigo-600 font-semibold">
              professional PDF invoices
            </span>{" "}
            <span className="inline-flex items-center gap-1">
              in seconds
              <Sparkles className="w-5 h-5 text-yellow-500 inline" />
            </span>
          </p>
        </div>
      </motion.div>

      {/* Enhanced Feature Badges */}
      <motion.div
        className="flex flex-wrap justify-center gap-4 sm:gap-5 px-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        {[
          {
            icon: Zap,
            text: "AI Extract",
            gradient: "from-yellow-400 to-orange-500",
          },
          {
            icon: FileText,
            text: "PDF Ready",
            gradient: "from-blue-500 to-indigo-600",
          },
          {
            icon: Shield,
            text: "Free Forever",
            gradient: "from-purple-500 to-pink-600",
          },
        ].map((feature, index) => (
          <motion.div
            key={feature.text}
            className="group relative"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + index * 0.1 }}
            whileHover={{ y: -3 }}
          >
            <div
              className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-100 rounded-full blur-lg transition-opacity duration-300`}
            />
            <div className="relative flex items-center gap-2.5 px-5 sm:px-6 py-3 rounded-full bg-white/80 backdrop-blur-sm shadow-lg border border-white/60 group-hover:bg-white transition-all">
              <feature.icon className="w-5 h-5 sm:w-5 sm:h-5 text-slate-700 group-hover:scale-110 transition-transform" />
              <span className="text-sm sm:text-base text-slate-700 font-semibold">
                {feature.text}
              </span>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
