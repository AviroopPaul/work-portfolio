"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Marquee from "react-fast-marquee";
import { useContent } from "@/lib/ContentContext";

export default function TechStack() {
  const { tech } = useContent();
  const reversed = [...tech.items].reverse();
  const [pausedRow, setPausedRow] = useState<0 | 1 | null>(null);

  return (
    <section id="tech" className="py-20 md:py-28 border-t-2 border-[#3F3F46]">
      <div className="max-w-[95vw] mx-auto mb-12 md:mb-16 px-4 md:px-0">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="block text-xs font-bold uppercase tracking-[0.3em] text-[#A1A1AA] mb-4">
            {tech.label}
          </span>
          <h2 className="text-[clamp(2.5rem,7vw,7rem)] font-bold uppercase tracking-tighter leading-[0.88] text-[#FAFAFA]">
            {tech.headingLine1}
            <br />
            <span className="text-[#DFE104]">{tech.headingAccent}</span>
          </h2>
        </motion.div>
      </div>

      <div className="flex flex-col gap-3">
        <div
          onMouseEnter={() => setPausedRow(0)}
          onMouseLeave={() => setPausedRow(null)}
        >
          <Marquee speed={60} gradient={false} autoFill direction="left" play={pausedRow !== 0}>
            {tech.items.map((t) => (
              <span
                key={t}
                className="inline-flex items-center h-10 px-6 mr-3 border-2 border-[#3F3F46] text-sm font-bold uppercase tracking-widest text-[#A1A1AA] hover:bg-[#DFE104] hover:border-[#DFE104] hover:text-black transition-colors duration-200"
              >
                {t}
              </span>
            ))}
          </Marquee>
        </div>

        <div
          onMouseEnter={() => setPausedRow(1)}
          onMouseLeave={() => setPausedRow(null)}
        >
          <Marquee speed={50} gradient={false} autoFill direction="right" play={pausedRow !== 1}>
            {reversed.map((t) => (
              <span
                key={t}
                className="inline-flex items-center h-10 px-6 mr-3 border-2 border-[#3F3F46] text-sm font-bold uppercase tracking-widest text-[#A1A1AA] hover:bg-[#DFE104] hover:border-[#DFE104] hover:text-black transition-colors duration-200"
              >
                {t}
              </span>
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  );
}
