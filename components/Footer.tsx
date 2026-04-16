"use client";

import { useContent } from "@/lib/ContentContext";

export default function Footer() {
  const { footer } = useContent();
  return (
    <footer className="border-t-2 border-[#3F3F46] py-8">
      <div className="max-w-[95vw] mx-auto flex items-center justify-between gap-4 px-4 md:px-0">
        <span className="font-mono text-xs text-[#FAFAFA] uppercase tracking-widest">
          {footer.tagline}
        </span>
        <span className="font-mono text-xs text-[#FAFAFA] uppercase tracking-widest shrink-0">
          © {new Date().getFullYear()} {footer.name}
        </span>
      </div>
    </footer>
  );
}
