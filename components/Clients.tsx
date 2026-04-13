"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Marquee from "react-fast-marquee";
import { useContent } from "@/lib/ContentContext";

function ClientLogo({ name, file }: { name: string; file: string }) {
  const [errored, setErrored] = useState(false);
  const needsWhiteBg = name === "Think41";

  if (errored) {
    return (
      <span className="text-sm font-bold uppercase tracking-widest text-[#A1A1AA]">
        {name}
      </span>
    );
  }

  return (
    <div
      className={`inline-flex items-center justify-center h-20 min-w-[130px] ${
        needsWhiteBg ? "bg-white border border-gray-200 p-3" : "p-1"
      }`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/${file}`}
        alt={`${name} logo`}
        className="h-14 w-auto max-w-[160px] object-contain"
        onError={() => setErrored(true)}
      />
    </div>
  );
}

export default function Clients() {
  const { clients } = useContent();
  return (
    <section id="clients" className="py-20 md:py-28 border-t-2 border-[#3F3F46]">
      <div className="max-w-[95vw] mx-auto mb-12 md:mb-16">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-xs font-bold uppercase tracking-[0.3em] text-[#A1A1AA]"
        >
          {clients.heading}
        </motion.p>
      </div>

      <Marquee speed={25} gradient={false} autoFill>
        {clients.logos.map((client) => (
          <div key={client.name} className="mx-8 md:mx-14 flex items-center h-20">
            <ClientLogo {...client} />
          </div>
        ))}
      </Marquee>
    </section>
  );
}
