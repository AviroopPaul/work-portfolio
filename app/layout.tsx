import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import { getContent } from "@/lib/getContent";
import { ContentProvider } from "@/components/ContentProvider";

export const dynamic = "force-dynamic";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "build? build.",
  description:
    "I design, build, and ship production-grade products for early-stage founders — from AI chatbots to full-stack MVPs with real deployment links.",
  icons: {
    icon: [{ url: "/ap-favicon.png", type: "image/png" }],
    apple: [{ url: "/ap-favicon.png", type: "image/png" }],
    shortcut: ["/ap-favicon.png"],
  },
  authors: [{ name: "Aviroop Paul" }],
  openGraph: {
    title: "Aviroop Paul — Full Stack & AI Engineer",
    description:
      "Your technical co-founder, without the equity. I build MVPs, AI chatbots, and voice-enabled apps for early-stage founders.",
    type: "website",
    locale: "en_IN",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const content = await getContent();

  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${geistMono.variable} antialiased`}
    >
      <body className="min-h-screen bg-[#09090B] text-[#FAFAFA]">
        <ContentProvider content={content}>
          {children}
        </ContentProvider>
      </body>
    </html>
  );
}
