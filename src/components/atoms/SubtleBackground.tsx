"use client";

import { motion } from "framer-motion";
import { FileText, Receipt, CheckCircle2 } from "lucide-react";

// Minimal shapes for internal pages
const MINIMAL_SHAPES = [
  {
    id: 0,
    Icon: FileText,
    left: 10,
    top: 15,
    duration: 12,
    delay: 0,
    rotate: 15,
    color: "text-blue-400/40",
  },
  {
    id: 1,
    Icon: Receipt,
    left: 88,
    top: 20,
    duration: 14,
    delay: 2,
    rotate: -12,
    color: "text-purple-400/40",
  },
  {
    id: 2,
    Icon: CheckCircle2,
    left: 85,
    top: 75,
    duration: 13,
    delay: 4,
    rotate: -10,
    color: "text-green-400/40",
  },
];

export default function SubtleBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-60">
      {" "}
      {/* Single subtle gradient orb - MORE VISIBLE */}
      <motion.div
        className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-blue-300/40 to-indigo-400/40 rounded-full blur-3xl" // Increased size and opacity
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
          x: [-15, 15, -15],
          y: [-15, 15, -15],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      {/* Minimal floating icons - MORE VISIBLE */}
      {MINIMAL_SHAPES.map((shape) => (
        <motion.div
          key={shape.id}
          className="absolute"
          style={{
            left: `${shape.left}%`,
            top: `${shape.top}%`,
          }}
          animate={{
            opacity: [0.2, 0.35, 0.2],
            y: [0, -35, 0],
            rotate: [shape.rotate, shape.rotate + 8, shape.rotate],
          }}
          transition={{
            duration: shape.duration,
            repeat: Infinity,
            delay: shape.delay,
            ease: "easeInOut",
          }}
        >
          <shape.Icon
            className={`w-14 h-14 sm:w-20 sm:h-20 ${shape.color}`}
            strokeWidth={1.5}
          />{" "}
          {/* Bigger, thicker stroke */}
        </motion.div>
      ))}
      {/* Subtle document shape - MORE VISIBLE */}
      <motion.div
        className="absolute left-[15%] top-[45%] w-14 h-20 bg-gradient-to-br from-cyan-300/20 to-blue-300/20 rounded-lg border border-white/20 shadow-lg" // Increased size, opacity, added shadow
        animate={{
          y: [0, -25, 0], // More movement
          rotate: [-5, 5, -5], // More rotation
          opacity: [0.2, 0.35, 0.2], // More visible
        }}
        transition={{
          duration: 10, // Faster
          repeat: Infinity,
          delay: 1,
          ease: "easeInOut",
        }}
      >
        <div className="p-2 space-y-1.5">
          <div className="h-0.5 bg-white/30 rounded w-3/4" />
          <div className="h-0.5 bg-white/30 rounded w-full" />
          <div className="h-0.5 bg-white/30 rounded w-1/2" />
        </div>
      </motion.div>
      {/* Additional floating sparkles for more life */}
      {[
        { left: 30, top: 25, delay: 1 },
        { left: 70, top: 50, delay: 3 },
        { left: 50, top: 80, delay: 5 },
      ].map((sparkle, index) => (
        <motion.div
          key={`sparkle-${index}`}
          className="absolute w-2 h-2 bg-yellow-400/40 rounded-full"
          style={{
            left: `${sparkle.left}%`,
            top: `${sparkle.top}%`,
          }}
          animate={{
            opacity: [0, 0.6, 0],
            scale: [0, 1.5, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: sparkle.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
