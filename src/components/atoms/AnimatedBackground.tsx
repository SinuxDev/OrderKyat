"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  FileText,
  Receipt,
  MessageSquare,
  CheckCircle2,
  Package,
  Sparkles,
  DollarSign,
} from "lucide-react";

// Detect if device is mobile
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia("(max-width: 768px)").matches);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
};

// Reduced shapes for mobile
const FLOATING_SHAPES_MOBILE = [
  {
    id: 0,
    Icon: FileText,
    left: 15,
    top: 25,
    duration: 8,
    delay: 0,
    rotate: 15,
    color: "text-blue-400",
  },
  {
    id: 1,
    Icon: Receipt,
    left: 85,
    top: 20,
    duration: 9,
    delay: 1.5,
    rotate: -12,
    color: "text-purple-400",
  },
  {
    id: 2,
    Icon: CheckCircle2,
    left: 90,
    top: 70,
    duration: 7,
    delay: 1,
    rotate: -15,
    color: "text-green-400",
  },
  {
    id: 3,
    Icon: Package,
    left: 10,
    top: 65,
    duration: 8.5,
    delay: 2,
    rotate: 20,
    color: "text-indigo-400",
  },
];

// Full shapes for desktop
const FLOATING_SHAPES_DESKTOP = [
  {
    id: 0,
    Icon: FileText,
    left: 15,
    top: 20,
    duration: 7,
    delay: 0,
    rotate: 15,
    color: "text-blue-400",
  },
  {
    id: 1,
    Icon: Receipt,
    left: 85,
    top: 15,
    duration: 8,
    delay: 1,
    rotate: -12,
    color: "text-purple-400",
  },
  {
    id: 2,
    Icon: MessageSquare,
    left: 10,
    top: 70,
    duration: 9,
    delay: 2,
    rotate: 10,
    color: "text-cyan-400",
  },
  {
    id: 3,
    Icon: CheckCircle2,
    left: 90,
    top: 65,
    duration: 6,
    delay: 0.5,
    rotate: -15,
    color: "text-green-400",
  },
  {
    id: 4,
    Icon: Package,
    left: 50,
    top: 85,
    duration: 8.5,
    delay: 1.5,
    rotate: 20,
    color: "text-indigo-400",
  },
  {
    id: 5,
    Icon: DollarSign,
    left: 30,
    top: 45,
    duration: 8,
    delay: 3,
    rotate: 12,
    color: "text-emerald-400",
  },
];

// Reduced sparkles for mobile
const SPARKLE_PARTICLES_MOBILE = Array.from({ length: 4 }, (_, i) => ({
  id: i,
  left: (i * 25 + 15) % 90,
  top: (i * 20 + 10) % 80,
  duration: 4,
  delay: i * 1,
  scale: 0.6,
}));

// Full sparkles for desktop
const SPARKLE_PARTICLES_DESKTOP = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  left: (i * 12 + 10) % 95,
  top: (i * 15 + 5) % 90,
  duration: 3 + (i % 3),
  delay: i * 0.5,
  scale: 0.5 + (i % 3) * 0.2,
}));

export default function AnimatedBackground() {
  const isMobile = useIsMobile();

  // Use reduced animations on mobile
  const FLOATING_SHAPES = isMobile
    ? FLOATING_SHAPES_MOBILE
    : FLOATING_SHAPES_DESKTOP;
  const SPARKLE_PARTICLES = isMobile
    ? SPARKLE_PARTICLES_MOBILE
    : SPARKLE_PARTICLES_DESKTOP;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Gradient Orbs - Simplified on mobile */}
      <motion.div
        className="absolute -top-40 -right-40 w-80 sm:w-96 h-80 sm:h-96 bg-gradient-to-br from-blue-400/30 to-indigo-600/30 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: isMobile ? 10 : 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute -bottom-40 -left-40 w-80 sm:w-96 h-80 sm:h-96 bg-gradient-to-tr from-purple-400/30 to-pink-600/30 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: isMobile ? 12 : 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      {/* Remove center orb on mobile for performance */}
      {!isMobile && (
        <motion.div
          className="absolute top-1/2 left-1/2 w-72 h-72 bg-gradient-to-br from-cyan-400/20 to-blue-600/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.4, 1],
            x: [-20, 20, -20],
            y: [-20, 20, -20],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}

      {/* Floating Invoice-themed Icons */}
      {FLOATING_SHAPES.map((shape) => (
        <motion.div
          key={shape.id}
          className="absolute"
          style={{
            left: `${shape.left}%`,
            top: `${shape.top}%`,
            willChange: "transform, opacity",
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0.15, 0.25, 0.15],
            scale: [1, isMobile ? 1.1 : 1.15, 1],
            y: [0, isMobile ? -25 : -40, 0],
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
            className={`w-10 h-10 sm:w-14 sm:h-14 ${shape.color} drop-shadow-lg`}
            strokeWidth={1.5}
          />
        </motion.div>
      ))}

      {/* Sparkle Particles */}
      {SPARKLE_PARTICLES.map((particle) => (
        <motion.div
          key={`sparkle-${particle.id}`}
          className="absolute"
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            willChange: "transform, opacity",
          }}
          animate={{
            opacity: [0, 0.5, 0],
            scale: [0, particle.scale, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        >
          <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />
        </motion.div>
      ))}

      {/* Floating Document Cards - Reduced on mobile */}
      {(isMobile ? [0] : [0, 1, 2]).map((index) => {
        const docs = [
          {
            left: 25,
            top: 30,
            width: 45,
            height: 55,
            delay: 0,
            color: "from-blue-400/15 to-indigo-400/15",
            lines: 3,
          },
          {
            left: 60,
            top: 20,
            width: 42,
            height: 52,
            delay: 1.5,
            color: "from-purple-400/15 to-pink-400/15",
            lines: 3,
          },
          {
            left: 40,
            top: 65,
            width: 44,
            height: 54,
            delay: 3,
            color: "from-cyan-400/15 to-blue-400/15",
            lines: 3,
          },
        ];
        const doc = docs[index];

        return (
          <motion.div
            key={`doc-${index}`}
            className={`absolute bg-gradient-to-br ${doc.color} rounded-xl backdrop-blur-sm border border-white/20 shadow-lg overflow-hidden`}
            style={{
              left: `${doc.left}%`,
              top: `${doc.top}%`,
              width: `${doc.width}px`,
              height: `${doc.height}px`,
              willChange: "transform, opacity",
            }}
            animate={{
              y: [0, isMobile ? -20 : -30, 0],
              rotate: [-3, 3, -3],
              opacity: [0.2, 0.35, 0.2],
            }}
            transition={{
              duration: isMobile ? 10 : 8 + index * 1.5,
              repeat: Infinity,
              delay: doc.delay,
              ease: "easeInOut",
            }}
          >
            <div className="h-2 bg-gradient-to-r from-white/15 to-white/5" />
            <div className="p-2 space-y-1">
              {Array.from({ length: doc.lines }).map((_, i) => (
                <div
                  key={i}
                  className="h-0.5 bg-white/30 rounded"
                  style={{ width: i === doc.lines - 1 ? "60%" : "85%" }}
                />
              ))}
            </div>
          </motion.div>
        );
      })}

      {/* Floating Receipts - Desktop only for performance */}
      {!isMobile &&
        [
          { left: 80, top: 50, delay: 2, rotation: 10 },
          { left: 20, top: 55, delay: 3.5, rotation: -12 },
        ].map((receipt, index) => (
          <motion.div
            key={`receipt-${index}`}
            className="absolute"
            style={{
              left: `${receipt.left}%`,
              top: `${receipt.top}%`,
              willChange: "transform, opacity",
            }}
            animate={{
              y: [0, -30, 0],
              rotate: [
                receipt.rotation,
                receipt.rotation - 8,
                receipt.rotation,
              ],
              opacity: [0.15, 0.25, 0.15],
            }}
            transition={{
              duration: 9 + index,
              repeat: Infinity,
              delay: receipt.delay,
              ease: "easeInOut",
            }}
          >
            <svg width="50" height="60" viewBox="0 0 50 60" fill="none">
              <path
                d="M5 0 L45 0 L45 60 L40 55 L35 60 L30 55 L25 60 L20 55 L15 60 L10 55 L5 60 Z"
                fill="url(#receipt-gradient)"
                opacity="0.3"
                stroke="rgba(139, 92, 246, 0.3)"
                strokeWidth="1.5"
              />
              <defs>
                <linearGradient
                  id="receipt-gradient"
                  x1="0"
                  y1="0"
                  x2="1"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#818cf8" />
                  <stop offset="100%" stopColor="#c084fc" />
                </linearGradient>
              </defs>
              <line
                x1="10"
                y1="15"
                x2="40"
                y2="15"
                stroke="rgba(139, 92, 246, 0.4)"
                strokeWidth="1"
              />
              <line
                x1="10"
                y1="22"
                x2="40"
                y2="22"
                stroke="rgba(139, 92, 246, 0.4)"
                strokeWidth="1"
              />
              <line
                x1="10"
                y1="29"
                x2="30"
                y2="29"
                stroke="rgba(139, 92, 246, 0.4)"
                strokeWidth="1"
              />
            </svg>
          </motion.div>
        ))}

      {/* Currency Symbols - Desktop only */}
      {!isMobile &&
        [
          {
            symbol: "¥",
            left: 35,
            top: 15,
            delay: 1,
            color: "text-emerald-400",
          },
          {
            symbol: "$",
            left: 75,
            top: 75,
            delay: 2.5,
            color: "text-green-400",
          },
        ].map((currency, index) => (
          <motion.div
            key={`currency-${index}`}
            className={`absolute text-2xl font-bold ${currency.color} opacity-15`}
            style={{
              left: `${currency.left}%`,
              top: `${currency.top}%`,
              willChange: "transform, opacity",
            }}
            animate={{
              y: [0, -40, 0],
              rotate: [0, 360],
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              delay: currency.delay,
              ease: "easeInOut",
            }}
          >
            {currency.symbol}
          </motion.div>
        ))}
    </div>
  );
}
