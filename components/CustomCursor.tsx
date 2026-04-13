"use client";

import { useEffect, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useVelocity,
  useAnimationFrame,
} from "framer-motion";

const SIZE = 64;

export default function CustomCursor() {
  const [visible, setVisible] = useState(false);

  const mouseX = useMotionValue(-200);
  const mouseY = useMotionValue(-200);
  const x = useSpring(mouseX, { stiffness: 180, damping: 18, mass: 0.6 });
  const y = useSpring(mouseY, { stiffness: 180, damping: 18, mass: 0.6 });

  const vx = useVelocity(x);
  const vy = useVelocity(y);

  const scaleX = useMotionValue(1);
  const scaleY = useMotionValue(1);

  useAnimationFrame(() => {
    const speed = Math.sqrt(vx.get() ** 2 + vy.get() ** 2);
    const n = Math.min(speed / 900, 1);
    const angle = Math.atan2(vy.get(), vx.get());
    const stretch = 1 + n * 0.22;
    scaleX.set(1 + Math.abs(Math.cos(angle)) * (stretch - 1));
    scaleY.set(1 + Math.abs(Math.sin(angle)) * (stretch - 1));
  });

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
      style={{ x, y, scaleX, scaleY, width: SIZE, height: SIZE }}
      className="pointer-events-none fixed z-[100] origin-center"
    >
      {/* Glass bubble */}
      <div
        className="absolute inset-0 rounded-full overflow-hidden"
        style={{
          backdropFilter: "brightness(1.08) saturate(110%)",
          WebkitBackdropFilter: "brightness(1.08) saturate(110%)",
          background: "rgba(255,255,255,0.015)",
          boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08), inset 0 0 6px rgba(0,0,0,0.2)",
        }}
      >
        {/* Radial vignette — darkens curved rim */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, transparent 50%, rgba(0,0,0,0.15) 100%)",
          }}
        />
      </div>

      {/* Outer drop shadow for physical depth */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          boxShadow: "0 4px 24px rgba(0,0,0,0.6), 0 1px 4px rgba(0,0,0,0.4)",
        }}
      />
    </motion.div>
  );
}
