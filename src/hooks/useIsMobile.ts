import { useState, useEffect } from "react";

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const isSmallScreen = window.innerWidth < 768;
      const isTouchDevice =
        "ontouchstart" in window || navigator.maxTouchPoints > 0;
      const isLowPowered = navigator.hardwareConcurrency
        ? navigator.hardwareConcurrency <= 4
        : false;

      setIsMobile(isSmallScreen || (isTouchDevice && isLowPowered));
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
}
