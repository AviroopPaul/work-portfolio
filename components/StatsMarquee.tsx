"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useContent } from "@/lib/ContentContext";

const INTERVAL = 2500;
const EASE = [0.16, 1, 0.3, 1] as const;

export default function StatsMarquee() {
  const { stats } = useContent();
  const [active, setActive] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (isHovering) return;
    const t = setInterval(() => setActive((i) => (i + 1) % stats.length), INTERVAL);
    return () => clearInterval(t);
  }, [stats.length, isHovering]);

  return (
    <section
      className="bg-[#DFE104] overflow-hidden relative z-0"
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="flex items-center w-full">
        {stats.map(({ value, label }, i) => {
          const isActive = i === active;
          return (
            <motion.div
              key={value + label}
              animate={{ flex: isActive ? 3 : 1 }}
              transition={{ duration: 0.6, ease: EASE }}
              className="flex flex-col items-center justify-center overflow-hidden py-5 md:py-6 cursor-default select-none"
              onClick={() => setActive(i)}
              onMouseEnter={() => { setIsHovering(true); setActive(i); }}
            >
              <motion.span
                animate={{
                  scale: isActive ? 1 : 0.45,
                  opacity: isActive ? 1 : 0.45,
                }}
                transition={{ duration: 0.5, ease: EASE }}
                className="font-bold uppercase tracking-tighter text-black leading-none tabular-nums text-[clamp(3.5rem,8vw,7.5rem)] origin-center"
              >
                {value}
              </motion.span>
              <motion.span
                animate={{ opacity: isActive ? 0.6 : 0.25 }}
                transition={{ duration: 0.5, ease: EASE }}
                className="font-bold uppercase tracking-widest text-black text-[0.7rem] mt-1"
              >
                {label}
              </motion.span>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
