"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useContent } from "@/lib/ContentContext";

const EASE = [0.16, 1, 0.3, 1] as const;
const CYCLE_INTERVAL = 2200;

export default function Hero() {
  const { hero } = useContent();
  const CYCLE_PHRASES = hero.cyclePhrases;
  const lines = [
    { text: hero.headlineLine1 },
    { text: hero.headlineLine2 },
    { text: hero.headlineLine3 },
  ];
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setPhraseIndex((i) => (i + 1) % CYCLE_PHRASES.length);
    }, CYCLE_INTERVAL);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col justify-center pt-16 pb-0">
      <div className="max-w-[95vw] mx-auto w-full py-20 md:py-32">

        {/* Label */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <span className="inline-block text-xs md:text-sm font-bold uppercase tracking-[0.3em] text-[#A1A1AA] mb-8 md:mb-10 border-b border-[#3F3F46] pb-2">
            {hero.label}
          </span>
        </motion.div>

        {/* Headline — line reveal */}
        <h1 className="text-[clamp(2.8rem,8.5vw,10rem)] font-bold leading-[0.88] tracking-tighter uppercase mb-8 md:mb-12 max-w-[95vw]">
          {lines.map(({ text }, i) => (
            <span key={i} className="block overflow-hidden">
              <motion.span
                className="block text-[#FAFAFA]"
                initial={{ y: "110%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 0.75, delay: 0.1 + i * 0.12, ease: EASE }}
              >
                {text}
              </motion.span>
            </span>
          ))}

          {/* Cycling accent line */}
          <span className="block overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.span
                key={phraseIndex}
                className="block text-[#DFE104]"
                initial={{ y: "110%" }}
                animate={{ y: "0%" }}
                exit={{ y: "-110%" }}
                transition={{ duration: 0.55, ease: EASE }}
              >
                {CYCLE_PHRASES[phraseIndex]}
              </motion.span>
            </AnimatePresence>
          </span>
        </h1>

        {/* Body */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.65, ease: EASE }}
          className="text-lg md:text-xl lg:text-2xl text-[#A1A1AA] max-w-2xl leading-tight mb-12 md:mb-16 font-normal"
        >
          {hero.body}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8, ease: EASE }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <a
            href="#contact"
            className="h-14 px-10 inline-flex items-center justify-center text-sm font-bold uppercase tracking-widest bg-[#DFE104] text-black hover:scale-105 active:scale-95 transition-transform duration-200"
          >
            {hero.ctaPrimary}
          </a>
          <a
            href="#services"
            className="h-14 px-10 inline-flex items-center justify-center text-sm font-bold uppercase tracking-widest border-2 border-[#3F3F46] text-[#FAFAFA] hover:bg-[#FAFAFA] hover:text-black transition-colors duration-200"
          >
            {hero.ctaSecondary}
          </a>
        </motion.div>
      </div>

      {/* Decorative background favicon — full hero background */}
      <div
        aria-hidden
        className="absolute inset-0 flex items-center justify-center select-none pointer-events-none"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/ap-favicon.png"
          alt=""
          className="w-[200%] h-[200%] object-contain opacity-[0.06]"
        />
      </div>
    </section>
  );
}
