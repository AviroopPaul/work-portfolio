"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useContent } from "@/lib/ContentContext";

const EASE = [0.16, 1, 0.3, 1] as const;
const CYCLE_INTERVAL = 2200; // shared by both the phrase cycle and the scramble

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const FRAMES = 22;   // animation frames total
const FPS    = 38;   // ms per frame  →  ~836ms scramble duration

/** Scrambles text character-by-character, resolving left-to-right. */
function useScramble(target: string) {
  const [display, setDisplay] = useState(() =>
    target.split("").map(ch =>
      ch === " " ? " " : CHARS[Math.floor(Math.random() * CHARS.length)]
    ).join("")
  );
  const frameRef = useRef(0);

  useEffect(() => {
    frameRef.current = 0;
    // Immediately scramble before the interval ticks
    setDisplay(
      target.split("").map(ch =>
        ch === " " ? " " : CHARS[Math.floor(Math.random() * CHARS.length)]
      ).join("")
    );

    const id = setInterval(() => {
      frameRef.current += 1;
      const f = frameRef.current;

      setDisplay(
        target.split("").map((ch, i) => {
          if (ch === " ") return " ";
          // Each character resolves at a staggered frame, left-to-right
          const resolveAt = Math.floor((i / target.length) * FRAMES * 0.65);
          if (f > resolveAt) return ch;
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        }).join("")
      );

      if (f >= FRAMES) {
        setDisplay(target);
        clearInterval(id);
      }
    }, FPS);

    return () => clearInterval(id);
  }, [target]);

  return { display };
}

export default function Hero() {
  const { hero } = useContent();
  const CYCLE_PHRASES = hero.cyclePhrases;
  const SLOT_ITEMS    = hero.slotItems;

  const lines = [
    { text: hero.headlineLine1 },
    { text: hero.headlineLine2 },
    { text: hero.headlineLine3 },
  ];

  const [phraseIndex, setPhraseIndex] = useState(0);
  const [slotCounter, setSlotCounter] = useState(0);

  // Single timer drives both the phrase cycle and the background scramble in lockstep
  useEffect(() => {
    const t = setInterval(() => {
      setPhraseIndex(i => (i + 1) % CYCLE_PHRASES.length);
      setSlotCounter(c => c + 1);
    }, CYCLE_INTERVAL);
    return () => clearInterval(t);
  }, [CYCLE_PHRASES.length]);

  const activeItem = SLOT_ITEMS[slotCounter % SLOT_ITEMS.length];
  const { display } = useScramble(activeItem);

  return (
    <section className="relative min-h-screen flex flex-col justify-center pt-16 pb-0 overflow-x-hidden">
      <div className="max-w-[95vw] mx-auto w-full py-20 md:py-32">

        {/* ── LEFT: headline + body + CTAs ── */}
        <div className="min-w-0">

          <h1 className="text-[clamp(2.4rem,6vw,8rem)] font-bold leading-[0.88] tracking-tighter uppercase mb-8 md:mb-12">
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

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.65, ease: EASE }}
            className="text-lg md:text-xl lg:text-2xl text-[#A1A1AA] max-w-2xl leading-tight mb-12 md:mb-16 font-normal"
          >
            {hero.body}
          </motion.p>

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
      </div>

      {/* ── Background scramble — right half only ── */}
      <div
        aria-hidden
        className="absolute right-0 top-0 bottom-0 w-[52%] flex items-center overflow-hidden select-none pointer-events-none px-[3vw]"
      >
        <p
          className="font-mono font-bold uppercase text-right w-full text-[#FAFAFA]"
          style={{
            fontSize: "clamp(1.8rem, 3.5vw, 4rem)",
            letterSpacing: "-0.03em",
            lineHeight: 1.05,
            opacity: 0.07,
          }}
        >
          {display}
        </p>
      </div>
    </section>
  );
}
