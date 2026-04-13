"use client";

import { motion } from "framer-motion";
import { Bot, Rocket, Mic, Network, FileText, CreditCard } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useContent } from "@/lib/ContentContext";

// Icons are kept here — not in content.ts (functions can't be serialised)
const icons: LucideIcon[] = [Bot, Rocket, Mic, Network, FileText, CreditCard];

export default function Services() {
  const { services } = useContent();

  return (
    <section id="services" className="py-20 md:py-28 border-t-2 border-[#3F3F46]">
      {/* Heading */}
      <div className="max-w-[95vw] mx-auto mb-12 md:mb-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="block text-xs font-bold uppercase tracking-[0.3em] text-[#A1A1AA] mb-4">
            {services.label}
          </span>
          <h2 className="text-[clamp(2.5rem,7vw,7rem)] font-bold uppercase tracking-tighter leading-[0.88] text-[#FAFAFA]">
            {services.headingLine1}
            <br />
            <span className="text-[#DFE104]">{services.headingAccent}</span>
          </h2>
        </motion.div>
      </div>

      {/* Hairline grid */}
      <div className="border-t-2 border-[#3F3F46]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#3F3F46]">
          {services.items.map((service, i) => {
            const Icon = icons[i];
            const num = String(i + 1).padStart(2, "0");
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4, delay: (i % 3) * 0.08 }}
                className="group relative bg-[#09090B] p-8 md:p-10 hover:bg-[#DFE104] transition-colors duration-300 cursor-default overflow-hidden min-h-[280px] flex flex-col justify-between"
              >
                {/* Decorative background number */}
                <span
                  aria-hidden
                  className="absolute -top-3 -right-1 text-[7rem] md:text-[8rem] font-bold leading-none tracking-tighter text-[#27272A] group-hover:text-[rgba(0,0,0,0.07)] transition-colors duration-300 select-none pointer-events-none"
                >
                  {num}
                </span>

                <div className="relative z-10">
                  <Icon
                    size={28}
                    strokeWidth={1.75}
                    className="text-[#DFE104] group-hover:text-black transition-colors duration-300 mb-6"
                  />
                  <h3 className="text-xl md:text-2xl font-bold uppercase tracking-tighter text-[#FAFAFA] group-hover:text-black transition-colors duration-300 mb-3 leading-tight">
                    {service.title}
                  </h3>
                </div>

                <p className="relative z-10 text-base text-[#A1A1AA] group-hover:text-black/70 leading-relaxed opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all duration-300">
                  {service.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
