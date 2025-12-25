import { useState, useMemo, useEffect } from "react";

export function useConfetti(duration: number = 3000) {
  const [showConfetti, setShowConfetti] = useState(true);

  const confettiParticles = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        left: (i * 5.3 + 7) % 100,
        color: ["#10b981", "#3b82f6", "#8b5cf6", "#f59e0b", "#ef4444"][i % 5],
        duration: 3 + (i % 3) * 0.5,
        delay: (i % 10) * 0.05,
        rotate: ((i * 36) % 360) - 180,
        xOffset: ((i % 7) - 3) * 30,
      })),
    []
  );

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  return { showConfetti, confettiParticles };
}
