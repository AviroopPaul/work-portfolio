"use client";

import { useState, useEffect, useCallback } from "react";
import { siteContent } from "@/lib/content";

// ─── Types ────────────────────────────────────────────────────────────────────
type Content = typeof siteContent;
type Section = keyof Content;

// ─── Helpers ──────────────────────────────────────────────────────────────────
function copyText(text: string, onDone: () => void) {
  navigator.clipboard.writeText(text).then(onDone);
}

function generateContentTs(c: Content): string {
  return `// lib/content.ts
// Auto-generated from admin panel at /admin
// Copy this file, paste it into lib/content.ts, and redeploy.

export const siteContent = ${JSON.stringify(c, null, 2)};

export type SiteContent = typeof siteContent;
`;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Field({
  label,
  value,
  onChange,
  multiline = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () =>
    copyText(value, () => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-bold uppercase tracking-widest text-[#555]">
          {label}
        </label>
        <button
          onClick={handleCopy}
          className="text-[10px] font-mono px-2 py-0.5 border border-[#333] text-[#888] hover:text-[#DFE104] hover:border-[#DFE104] transition-colors duration-150"
        >
          {copied ? "✓ copied" : "copy"}
        </button>
      </div>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="w-full bg-[#1A1A1A] border border-[#2A2A2A] text-[#E5E5E5] text-sm px-3 py-2 resize-y focus:outline-none focus:border-[#DFE104] transition-colors"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-[#1A1A1A] border border-[#2A2A2A] text-[#E5E5E5] text-sm px-3 py-2 focus:outline-none focus:border-[#DFE104] transition-colors"
        />
      )}
    </div>
  );
}

function SectionWrap({
  id,
  title,
  onCopySection,
  children,
}: {
  id: string;
  title: string;
  onCopySection: (section: Section) => void;
  children: React.ReactNode;
}) {
  const [copied, setCopied] = useState(false);
  return (
    <section id={id} className="border border-[#222] p-6 flex flex-col gap-5">
      <div className="flex items-center justify-between border-b border-[#222] pb-3">
        <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-[#DFE104]">
          {title}
        </h2>
        <button
          onClick={() => {
            onCopySection(id as Section);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }}
          className="text-[10px] font-mono px-3 py-1 border border-[#333] text-[#888] hover:text-[#DFE104] hover:border-[#DFE104] transition-colors duration-150"
        >
          {copied ? "✓ section copied" : "copy section json"}
        </button>
      </div>
      {children}
    </section>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
const SECTIONS: { id: Section; label: string }[] = [
  { id: "nav",      label: "Navigation" },
  { id: "hero",     label: "Hero"       },
  { id: "stats",    label: "Stats"      },
  { id: "clients",  label: "Clients"    },
  { id: "services", label: "Services"   },
  { id: "tech",     label: "Tech Stack" },
  { id: "contact",  label: "Contact"    },
  { id: "footer",   label: "Footer"     },
];

export default function AdminPage() {
  const [c, setC] = useState<Content>(() =>
    JSON.parse(JSON.stringify(siteContent))
  );
  const [saved, setSaved] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [exportCopied, setExportCopied] = useState(false);

  // Load from API on mount
  useEffect(() => {
    fetch("/api/content")
      .then((r) => r.json())
      .then((data) => setC(data))
      .catch(() => {});
  }, []);

  // ── Updaters ──────────────────────────────────────────────────────────────
  const setNav = (field: keyof Content["nav"], val: string) =>
    setC((p) => ({ ...p, nav: { ...p.nav, [field]: val } }));

  const setHero = (field: keyof Content["hero"], val: string) =>
    setC((p) => ({ ...p, hero: { ...p.hero, [field]: val } }));

  const setStat = (i: number, field: "value" | "label", val: string) =>
    setC((p) => {
      const stats = [...p.stats];
      stats[i] = { ...stats[i], [field]: val };
      return { ...p, stats };
    });

  const setClientsHeading = (val: string) =>
    setC((p) => ({ ...p, clients: { ...p.clients, heading: val } }));

  const setClientLogo = (
    i: number,
    field: "name" | "file",
    val: string
  ) =>
    setC((p) => {
      const logos = [...p.clients.logos];
      logos[i] = { ...logos[i], [field]: val };
      return { ...p, clients: { ...p.clients, logos } };
    });

  const setServicesHeading = (field: keyof Omit<Content["services"], "items">, val: string) =>
    setC((p) => ({ ...p, services: { ...p.services, [field]: val } }));

  const setServiceItem = (
    i: number,
    field: "title" | "description",
    val: string
  ) =>
    setC((p) => {
      const items = [...p.services.items];
      items[i] = { ...items[i], [field]: val };
      return { ...p, services: { ...p.services, items } };
    });

  const setTechHeading = (field: keyof Omit<Content["tech"], "items">, val: string) =>
    setC((p) => ({ ...p, tech: { ...p.tech, [field]: val } }));

  const setTechItem = (i: number, val: string) =>
    setC((p) => {
      const items = [...p.tech.items];
      items[i] = val;
      return { ...p, tech: { ...p.tech, items } };
    });

  const addTechItem = () =>
    setC((p) => ({
      ...p,
      tech: { ...p.tech, items: [...p.tech.items, ""] },
    }));

  const removeTechItem = (i: number) =>
    setC((p) => ({
      ...p,
      tech: { ...p.tech, items: p.tech.items.filter((_, index) => index !== i) },
    }));

  const moveTechItem = (i: number, direction: "up" | "down") =>
    setC((p) => {
      const items = [...p.tech.items];
      const targetIndex = direction === "up" ? i - 1 : i + 1;

      if (targetIndex < 0 || targetIndex >= items.length) {
        return p;
      }

      [items[i], items[targetIndex]] = [items[targetIndex], items[i]];

      return { ...p, tech: { ...p.tech, items } };
    });

  const setContactField = (field: keyof Omit<Content["contact"], "links" | "cyclePhrases">, val: string) =>
    setC((p) => ({ ...p, contact: { ...p.contact, [field]: val } }));

  const setContactLink = (
    i: number,
    field: "label" | "sub" | "href",
    val: string
  ) =>
    setC((p) => {
      const links = [...p.contact.links];
      links[i] = { ...links[i], [field]: val };
      return { ...p, contact: { ...p.contact, links } };
    });

  const setFooter = (field: keyof Content["footer"], val: string) =>
    setC((p) => ({ ...p, footer: { ...p.footer, [field]: val } }));

  // ── Copy helpers ──────────────────────────────────────────────────────────
  const copySection = useCallback(
    (section: Section) => {
      copyText(JSON.stringify(c[section], null, 2), () => {});
    },
    [c]
  );

  const saveToServer = useCallback(async (content: Content) => {
    setSaved("saving");
    try {
      const res = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      if (!res.ok) throw new Error();
      setSaved("saved");
      setTimeout(() => setSaved("idle"), 2000);
    } catch {
      setSaved("error");
      setTimeout(() => setSaved("idle"), 3000);
    }
  }, []);

  const copyAll = () => {
    copyText(generateContentTs(c), () => {
      setExportCopied(true);
      setTimeout(() => setExportCopied(false), 2000);
    });
  };

  const resetToDefaults = async () => {
    const fresh = JSON.parse(JSON.stringify(siteContent));
    setC(fresh);
    await saveToServer(fresh);
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="flex min-h-screen">
      {/* ── Sidebar nav ── */}
      <aside className="sticky top-0 h-screen w-44 shrink-0 border-r border-[#222] flex flex-col overflow-y-auto">
        <div className="p-4 border-b border-[#222]">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#DFE104]">
            Admin
          </span>
        </div>
        <nav className="flex flex-col py-2">
          {SECTIONS.map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              className="px-4 py-2.5 text-xs font-medium uppercase tracking-widest text-[#888] hover:text-[#E5E5E5] hover:bg-[#1A1A1A] transition-colors duration-150"
            >
              {label}
            </a>
          ))}
        </nav>
        <div className="mt-auto p-4 flex flex-col gap-2">
          <a
            href="/"
            target="_blank"
            className="text-[10px] font-mono text-[#555] hover:text-[#888] transition-colors duration-150"
          >
            ↗ view site
          </a>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main className="flex-1 overflow-y-auto">
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-[#0F0F0F] border-b border-[#222] px-6 py-3 flex items-center justify-between">
          <span className="text-sm font-bold uppercase tracking-widest text-[#E5E5E5]">
            Portfolio Content
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={resetToDefaults}
              className="text-xs font-mono px-3 py-1.5 border border-[#333] text-[#888] hover:text-[#E5E5E5] hover:border-[#555] transition-colors"
            >
              Reset to defaults
            </button>
            <button
              onClick={copyAll}
              className="text-xs font-mono px-3 py-1.5 border border-[#333] text-[#888] hover:text-[#E5E5E5] hover:border-[#555] transition-colors"
            >
              {exportCopied ? "✓ copied!" : "Export JSON"}
            </button>
            <button
              onClick={() => saveToServer(c)}
              disabled={saved === "saving"}
              className="text-xs font-bold uppercase tracking-widest px-4 py-1.5 bg-[#DFE104] text-black hover:scale-105 active:scale-95 transition-transform duration-150 disabled:opacity-60 disabled:scale-100"
            >
              {saved === "saving" ? "Saving..." : saved === "saved" ? "✓ Saved!" : saved === "error" ? "Error" : "Save Changes"}
            </button>
          </div>
        </div>

        {/* Sections */}
        <div className="p-6 flex flex-col gap-6 max-w-3xl">

          {/* NAV */}
          <SectionWrap id="nav" title="Navigation" onCopySection={copySection}>
            <Field label="CTA Button" value={c.nav.cta} onChange={(v) => setNav("cta", v)} />
          </SectionWrap>

          {/* HERO */}
          <SectionWrap id="hero" title="Hero" onCopySection={copySection}>
            <Field label="Headline Line 1" value={c.hero.headlineLine1} onChange={(v) => setHero("headlineLine1", v)} />
            <Field label="Headline Line 2" value={c.hero.headlineLine2} onChange={(v) => setHero("headlineLine2", v)} />
            <Field label="Headline Line 3" value={c.hero.headlineLine3} onChange={(v) => setHero("headlineLine3", v)} />
            <Field label="Headline Accent (yellow)" value={c.hero.headlineAccent} onChange={(v) => setHero("headlineAccent", v)} />
            <div className="flex flex-col gap-3">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#555]">Cycling Phrases (one per line)</label>
              <textarea
                value={c.hero.cyclePhrases.join("\n")}
                onChange={(e) =>
                  setC((p) => ({ ...p, hero: { ...p.hero, cyclePhrases: e.target.value.split("\n").filter(Boolean) } }))
                }
                rows={3}
                className="w-full bg-[#1A1A1A] border border-[#2A2A2A] text-[#E5E5E5] text-sm px-3 py-2 resize-y focus:outline-none focus:border-[#DFE104] transition-colors font-mono"
              />
            </div>
            <div className="flex flex-col gap-3">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#555]">Background Scramble Items (one per line)</label>
              <textarea
                value={c.hero.slotItems.join("\n")}
                onChange={(e) =>
                  setC((p) => ({ ...p, hero: { ...p.hero, slotItems: e.target.value.split("\n").filter(Boolean) } }))
                }
                rows={5}
                className="w-full bg-[#1A1A1A] border border-[#2A2A2A] text-[#E5E5E5] text-sm px-3 py-2 resize-y focus:outline-none focus:border-[#DFE104] transition-colors font-mono"
              />
            </div>
            <Field label="Body Text" value={c.hero.body} onChange={(v) => setHero("body", v)} multiline />
            <Field label="CTA Primary" value={c.hero.ctaPrimary} onChange={(v) => setHero("ctaPrimary", v)} />
            <Field label="CTA Secondary" value={c.hero.ctaSecondary} onChange={(v) => setHero("ctaSecondary", v)} />
          </SectionWrap>

          {/* STATS */}
          <SectionWrap id="stats" title="Stats Marquee" onCopySection={copySection}>
            {c.stats.map((stat, i) => (
              <div key={i} className="grid grid-cols-2 gap-3">
                <Field label={`#${i + 1} Value`} value={stat.value} onChange={(v) => setStat(i, "value", v)} />
                <Field label={`#${i + 1} Label`} value={stat.label} onChange={(v) => setStat(i, "label", v)} />
              </div>
            ))}
          </SectionWrap>

          {/* CLIENTS */}
          <SectionWrap id="clients" title="Clients" onCopySection={copySection}>
            <Field label="Section Heading" value={c.clients.heading} onChange={setClientsHeading} />
            <div className="flex flex-col gap-3 mt-2">
              {c.clients.logos.map((logo, i) => (
                <div key={i} className="grid grid-cols-2 gap-3">
                  <Field label={`Client ${i + 1} Name`} value={logo.name} onChange={(v) => setClientLogo(i, "name", v)} />
                  <Field label={`Client ${i + 1} File`} value={logo.file} onChange={(v) => setClientLogo(i, "file", v)} />
                </div>
              ))}
            </div>
          </SectionWrap>

          {/* SERVICES */}
          <SectionWrap id="services" title="Services" onCopySection={copySection}>
            <Field label="Section Label" value={c.services.label} onChange={(v) => setServicesHeading("label", v)} />
            <Field label="Heading Line 1" value={c.services.headingLine1} onChange={(v) => setServicesHeading("headingLine1", v)} />
            <Field label="Heading Accent (yellow)" value={c.services.headingAccent} onChange={(v) => setServicesHeading("headingAccent", v)} />
            <div className="flex flex-col gap-5 mt-2">
              {c.services.items.map((item, i) => (
                <div key={i} className="border border-[#222] p-4 flex flex-col gap-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#555]">
                    Service {i + 1}
                  </span>
                  <Field label="Title" value={item.title} onChange={(v) => setServiceItem(i, "title", v)} />
                  <Field label="Description" value={item.description} onChange={(v) => setServiceItem(i, "description", v)} multiline />
                </div>
              ))}
            </div>
          </SectionWrap>

          {/* TECH */}
          <SectionWrap id="tech" title="Tech Stack" onCopySection={copySection}>
            <Field label="Section Label" value={c.tech.label} onChange={(v) => setTechHeading("label", v)} />
            <Field label="Heading Line 1" value={c.tech.headingLine1} onChange={(v) => setTechHeading("headingLine1", v)} />
            <Field label="Heading Accent (yellow)" value={c.tech.headingAccent} onChange={(v) => setTechHeading("headingAccent", v)} />
            <div className="flex flex-col gap-3">
              {c.tech.items.map((item, i) => (
                <div key={i} className="border border-[#222] p-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#555]">
                      Tech {i + 1}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => moveTechItem(i, "up")}
                        disabled={i === 0}
                        className="text-[10px] font-mono px-2 py-1 border border-[#333] text-[#888] hover:text-[#DFE104] hover:border-[#DFE104] transition-colors duration-150 disabled:opacity-40 disabled:hover:text-[#888] disabled:hover:border-[#333]"
                      >
                        ↑
                      </button>
                      <button
                        onClick={() => moveTechItem(i, "down")}
                        disabled={i === c.tech.items.length - 1}
                        className="text-[10px] font-mono px-2 py-1 border border-[#333] text-[#888] hover:text-[#DFE104] hover:border-[#DFE104] transition-colors duration-150 disabled:opacity-40 disabled:hover:text-[#888] disabled:hover:border-[#333]"
                      >
                        ↓
                      </button>
                      <button
                        onClick={() => removeTechItem(i)}
                        className="text-[10px] font-mono px-3 py-1 border border-[#333] text-[#888] hover:text-[#DFE104] hover:border-[#DFE104] transition-colors duration-150"
                      >
                        remove
                      </button>
                    </div>
                  </div>
                  <Field
                    label={`Tech ${i + 1} Name`}
                    value={item}
                    onChange={(v) => setTechItem(i, v)}
                  />
                </div>
              ))}
            </div>
            <div className="mt-2 flex justify-end">
              <button
                onClick={addTechItem}
                className="text-[10px] font-mono px-3 py-1 border border-[#333] text-[#888] hover:text-[#DFE104] hover:border-[#DFE104] transition-colors duration-150"
              >
                + add item
              </button>
            </div>
          </SectionWrap>

          {/* CONTACT */}
          <SectionWrap id="contact" title="Contact" onCopySection={copySection}>
            <Field label="Section Label" value={c.contact.label} onChange={(v) => setContactField("label", v)} />
            <Field label="Heading Line 1" value={c.contact.headingLine1} onChange={(v) => setContactField("headingLine1", v)} />
            <Field label="Heading Accent (yellow)" value={c.contact.headingAccent} onChange={(v) => setContactField("headingAccent", v)} />
            <Field label="Body Text" value={c.contact.body} onChange={(v) => setContactField("body", v)} multiline />
            <Field label="Email Row Label" value={c.contact.emailLabel} onChange={(v) => setContactField("emailLabel", v)} />
            <Field label="Email Row Subtitle" value={c.contact.emailSub} onChange={(v) => setContactField("emailSub", v)} />
            <div className="flex flex-col gap-5 mt-2">
              {c.contact.links.map((link, i) => (
                <div key={i} className="border border-[#222] p-4 flex flex-col gap-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#555]">
                    Contact Link {i + 1}
                  </span>
                  <Field label="Label" value={link.label} onChange={(v) => setContactLink(i, "label", v)} />
                  <Field label="Sub (url display)" value={link.sub} onChange={(v) => setContactLink(i, "sub", v)} />
                  <Field label="href" value={link.href} onChange={(v) => setContactLink(i, "href", v)} />
                </div>
              ))}
            </div>
          </SectionWrap>

          {/* FOOTER */}
          <SectionWrap id="footer" title="Footer" onCopySection={copySection}>
            <Field label="Tagline" value={c.footer.tagline} onChange={(v) => setFooter("tagline", v)} />
            <Field label="Name / Copyright" value={c.footer.name} onChange={(v) => setFooter("name", v)} />
          </SectionWrap>

          <p className="text-[10px] font-mono text-[#444] pb-10">
            Click &ldquo;Save Changes&rdquo; to publish edits live — no redeployment needed.
            &ldquo;Export JSON&rdquo; copies a backup of the current content.
          </p>
        </div>
      </main>
    </div>
  );
}
