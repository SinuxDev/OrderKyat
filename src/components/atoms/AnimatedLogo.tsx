"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function AnimatedLogo() {
  return (
    <motion.div
      className="inline-flex items-center justify-center relative"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 15,
      }}
    >
      {/* Main Logo Text */}
      <motion.h1
        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent bg-300% animate-gradient"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        OrderKyat
      </motion.h1>

      {/* Floating Sparkle - Top Right */}
      <motion.div
        className="absolute -top-4 -right-6 sm:-top-6 sm:-right-8"
        animate={{
          y: [0, -8, 0],
          rotate: [0, 12, -12, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500 drop-shadow-lg" />
      </motion.div>

      {/* Shimmer Effect Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
    </motion.div>
  );
}
