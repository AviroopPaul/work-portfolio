"use client";

import { useState, useEffect } from "react";
import { Menu, X, Hammer } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useContent } from "@/lib/ContentContext";

const navLinks = [
  { label: "Clients",  href: "#clients"  },
  { label: "Services", href: "#services" },
  { label: "Tech",     href: "#tech"     },
  { label: "Contact",  href: "#contact"  },
];

const EASE = [0.16, 1, 0.3, 1];
const SPRING = { type: "spring", stiffness: 280, damping: 28 };

export default function Navigation() {
  const siteContent = useContent();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setIsOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <>
      {/* ── Desktop ── */}
      <div className="hidden md:flex fixed top-5 inset-x-0 z-[40] items-center justify-center pointer-events-none">

        {/* Logo — fades + scales out when scrolled */}
        <motion.a
          href="#"
          aria-label="Home"
          className="absolute left-6 lg:left-10"
          animate={{ opacity: scrolled ? 0 : 1, scale: scrolled ? 0.75 : 1 }}
          transition={{ duration: 0.4, ease: EASE }}
          style={{ pointerEvents: scrolled ? "none" : "auto" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/ap-favicon.png" alt="AP" className="h-9 w-9 object-contain" />
        </motion.a>

        {/* Pill — expands via layout animation to absorb logo + CTA */}
        <motion.div
          layout
          transition={SPRING}
          className="pointer-events-auto flex items-center bg-[#09090B]/80 backdrop-blur-md border-2 border-[#3F3F46]"
          style={{ borderRadius: 9999 }}
        >
          {/* Logo inside pill — appears when scrolled */}
          <AnimatePresence mode="popLayout">
            {scrolled && (
              <motion.a
                key="pill-logo"
                href="#"
                aria-label="Home"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 40 }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.35, ease: EASE }}
                className="flex items-center justify-center overflow-hidden shrink-0 pl-1"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/ap-favicon.png" alt="AP" className="h-7 w-7 object-contain" />
              </motion.a>
            )}
          </AnimatePresence>

          {/* Nav links — always visible */}
          <div className="flex items-center gap-1 px-2 py-2">
            {navLinks.map(({ label, href }) => (
              <a
                key={href}
                href={href}
                className="px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#A1A1AA] hover:text-[#FAFAFA] hover:bg-white/10 transition-all duration-200"
                style={{ borderRadius: 9999 }}
              >
                {label}
              </a>
            ))}
          </div>

          {/* CTA icon inside pill — appears when scrolled */}
          <AnimatePresence mode="popLayout">
            {scrolled && (
              <motion.a
                key="pill-cta"
                href="#contact"
                title={siteContent.nav.cta}
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 44 }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.35, ease: EASE }}
                className="flex items-center justify-center shrink-0 overflow-hidden mr-1.5"
                style={{ borderRadius: 9999, height: 36, backgroundColor: "#DFE104" }}
              >
                <Hammer size={15} className="text-black" />
              </motion.a>
            )}
          </AnimatePresence>
        </motion.div>

        {/* CTA button — fades + scales out when scrolled */}
        <motion.a
          href="#contact"
          className="absolute right-6 lg:right-10 h-10 px-6 inline-flex items-center text-sm font-bold uppercase tracking-widest bg-[#DFE104] text-black"
          animate={{ opacity: scrolled ? 0 : 1, scale: scrolled ? 0.75 : 1 }}
          transition={{ duration: 0.4, ease: EASE }}
          style={{ pointerEvents: scrolled ? "none" : "auto" }}
        >
          {siteContent.nav.cta}
        </motion.a>
      </div>

      {/* ── Mobile ── */}
      <nav className={`md:hidden fixed top-0 inset-x-0 z-[40] transition-colors duration-200 ${
        scrolled || isOpen ? "bg-[#09090B] border-b-2 border-[#3F3F46]" : "bg-transparent"
      }`}>
        <div className="max-w-[95vw] mx-auto h-14 flex items-center justify-between">
          <a href="#" aria-label="Home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/ap-favicon.png" alt="AP" className="h-8 w-8 object-contain" />
          </a>
          <button
            className="text-[#FAFAFA] p-1"
            onClick={() => setIsOpen((v) => !v)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        <div className={`overflow-hidden transition-all duration-300 bg-[#09090B] ${
          isOpen ? "max-h-screen border-b-2 border-[#3F3F46]" : "max-h-0"
        }`}>
          <div className="max-w-[95vw] mx-auto pb-6 pt-2 flex flex-col gap-1">
            {navLinks.map(({ label, href }) => (
              <a
                key={href}
                href={href}
                onClick={() => setIsOpen(false)}
                className="block py-4 text-base font-medium uppercase tracking-widest text-[#A1A1AA] hover:text-[#FAFAFA] border-b border-[#3F3F46]"
              >
                {label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setIsOpen(false)}
              className="mt-4 flex h-14 items-center justify-center text-sm font-bold uppercase tracking-widest bg-[#DFE104] text-black"
            >
              {siteContent.nav.cta}
            </a>
          </div>
        </div>
      </nav>
    </>
  );
}
