"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, ArrowUpRight, Globe, Send, X } from "lucide-react";
import { useContent } from "@/lib/ContentContext";

function LinkedInIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

type IconComp = React.ComponentType<{ size?: number }>;
const linkIcons: IconComp[] = [LinkedInIcon, Globe];

function ContactForm({ emailLabel, emailSub }: { emailLabel: string; emailSub: string }) {
  const [open, setOpen] = useState(true);
  const [from, setFrom] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSend() {
    if (!message.trim()) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, from }),
      });
      if (!res.ok) throw new Error();
      setStatus("sent");
      setMessage("");
      setFrom("");
      setTimeout(() => { setOpen(false); setStatus("idle"); }, 2500);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: linkIcons.length * 0.08 }}
      className="border-b-2 border-[#3F3F46]"
    >
      {/* Row trigger */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="group w-full flex items-center justify-between py-7 md:py-9 hover:bg-[#DFE104] hover:border-[#DFE104] hover:px-6 transition-all duration-300"
      >
        <div className="max-w-[95vw] mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-5">
            <span className="text-[#A1A1AA] group-hover:text-black transition-colors duration-300 shrink-0">
              <Mail size={22} />
            </span>
            <span className="text-xl md:text-3xl lg:text-4xl font-bold uppercase tracking-tighter text-[#FAFAFA] group-hover:text-black transition-colors duration-300">
              {emailLabel}
            </span>
          </div>
          <div className="flex items-center gap-4 md:gap-6 shrink-0">
            <span className="hidden md:block text-sm font-mono text-[#A1A1AA] group-hover:text-black/60 transition-colors duration-300">
              {emailSub}
            </span>
            {open
              ? <X size={22} className="text-[#A1A1AA] group-hover:text-black transition-colors duration-200" />
              : <ArrowUpRight size={22} className="text-[#A1A1AA] group-hover:text-black group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-200" />
            }
          </div>
        </div>
      </button>

      {/* Inline form */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="form"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="max-w-[95vw] mx-auto py-6 md:py-8 flex flex-col gap-4">
              <input
                type="text"
                placeholder="Your name or email (optional)"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="w-full bg-transparent border-2 border-[#3F3F46] px-4 py-3 text-[#FAFAFA] placeholder-[#52525B] font-mono text-sm focus:outline-none focus:border-[#DFE104] transition-colors duration-200"
              />
              <textarea
                rows={4}
                placeholder="Your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-transparent border-2 border-[#3F3F46] px-4 py-3 text-[#FAFAFA] placeholder-[#52525B] font-mono text-sm focus:outline-none focus:border-[#DFE104] transition-colors duration-200 resize-none"
              />
              <div className="flex items-center gap-4">
                <button
                  onClick={handleSend}
                  disabled={status === "sending" || status === "sent"}
                  className="inline-flex items-center gap-2 h-12 px-8 bg-[#DFE104] text-black text-sm font-bold uppercase tracking-widest hover:scale-105 active:scale-95 transition-transform duration-200 disabled:opacity-60 disabled:scale-100"
                >
                  <Send size={16} />
                  {status === "sending" ? "Sending..." : status === "sent" ? "Sent!" : "Send"}
                </button>
                {status === "error" && (
                  <span className="text-sm font-mono text-red-400">Something went wrong. Try again.</span>
                )}
                {status === "sent" && (
                  <span className="text-sm font-mono text-[#DFE104]">Message delivered.</span>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function Contact() {
  const { contact } = useContent();
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  // Only the non-email links (LinkedIn, Portfolio)
  const externalLinks = contact.links.filter((l) => l.href !== "mailto:apavirooppaul10@gmail.com");

  return (
    <section id="contact" className="pt-20 pb-0 md:pt-28 border-t-2 border-[#3F3F46]">
      <div className="max-w-[95vw] mx-auto mb-12 md:mb-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="block text-xs font-bold uppercase tracking-[0.3em] text-[#A1A1AA] mb-4">
            {contact.label}
          </span>
          <h2 className="text-[clamp(2.5rem,7vw,7rem)] font-bold uppercase tracking-tighter leading-[0.88] text-[#FAFAFA]">
            {contact.headingLine1}
            <br />
            <span className="text-[#DFE104]">{contact.headingAccent}</span>
          </h2>
          <p className="text-lg md:text-xl text-[#A1A1AA] max-w-xl mt-6 leading-tight">
            {contact.body}
          </p>
        </motion.div>
      </div>

      <div className="border-t-2 border-[#3F3F46]">
        {externalLinks.map(({ label, sub, href, external }, i) => {
          const Icon = linkIcons[i];
          // LinkedIn (i=0) is always yellow; other rows activate on hover
          const isLinkedIn = i === 0;
          const isActive = isLinkedIn || hoveredIdx === i;
          return (
            <motion.a
              key={href}
              href={href}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.08 }}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
              className={`group flex items-center justify-between py-7 md:py-9 border-b-2 transition-all duration-300 ${
                isActive
                  ? "bg-[#DFE104] border-[#DFE104] px-6"
                  : "border-[#3F3F46] hover:bg-[#DFE104] hover:border-[#DFE104] hover:px-6"
              }`}
            >
              <div className="max-w-[95vw] mx-auto w-full flex items-center justify-between">
                <div className="flex items-center gap-5">
                  <span className={`transition-colors duration-300 shrink-0 ${isActive ? "text-black" : "text-[#A1A1AA] group-hover:text-black"}`}>
                    <Icon size={22} />
                  </span>
                  <span className={`text-xl md:text-3xl lg:text-4xl font-bold uppercase tracking-tighter transition-colors duration-300 ${isActive ? "text-black" : "text-[#FAFAFA] group-hover:text-black"}`}>
                    {label}
                  </span>
                </div>
                <div className="flex items-center gap-4 md:gap-6 shrink-0">
                  <span className={`hidden md:block text-sm font-mono transition-colors duration-300 ${isActive ? "text-black/60" : "text-[#A1A1AA] group-hover:text-black/60"}`}>
                    {sub}
                  </span>
                  <ArrowUpRight
                    size={22}
                    className={`transition-all duration-200 ${isActive ? "text-black translate-x-1 -translate-y-1" : "text-[#A1A1AA] group-hover:text-black group-hover:translate-x-1 group-hover:-translate-y-1"}`}
                  />
                </div>
              </div>
            </motion.a>
          );
        })}

        {/* Email contact form */}
        <ContactForm emailLabel={contact.emailLabel} emailSub={contact.emailSub} />
      </div>

    </section>
  );
}
