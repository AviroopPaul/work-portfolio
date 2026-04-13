"use client";

import { ContentContext } from "@/lib/ContentContext";
import { SiteContent } from "@/lib/content";

export function ContentProvider({
  content,
  children,
}: {
  content: SiteContent;
  children: React.ReactNode;
}) {
  return (
    <ContentContext.Provider value={content}>
      {children}
    </ContentContext.Provider>
  );
}
