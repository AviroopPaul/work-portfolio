"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const SIZE = 24;

export default function CustomCursor() {
  const [visible, setVisible] = useState(false);

  const mouseX = useMotionValue(-200);
  const mouseY = useMotionValue(-200);
  const x = useSpring(mouseX, { stiffness: 180, damping: 18, mass: 0.6 });
  const y = useSpring(mouseY, { stiffness: 180, damping: 18, mass: 0.6 });

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!mq.matches) return;
    setVisible(true);

    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX - SIZE / 2);
      mouseY.set(e.clientY - SIZE / 2);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [mouseX, mouseY]);

  if (!visible) return null;

  return (
    <motion.div
      aria-hidden
      style={{ x, y, width: SIZE, height: SIZE }}
      className="pointer-events-none fixed z-[100] bg-white mix-blend-difference"
    />
  );
}
