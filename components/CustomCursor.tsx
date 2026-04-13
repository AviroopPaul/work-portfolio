"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue } from "framer-motion";

export default function CustomCursor() {
  const [visible, setVisible] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);

  useEffect(() => {
    // Only activate on mouse/pointer devices
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!mq.matches) return;
    setVisible(true);

    const onMove = (e: MouseEvent) => {
      x.set(e.clientX - 8);
      y.set(e.clientY - 8);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [x, y]);

  if (!visible) return null;

  return (
    <motion.div
      aria-hidden
      style={{ x, y }}
      className="pointer-events-none fixed z-[100] w-4 h-4 bg-[#FAFAFA] mix-blend-difference"
    />
  );
}
