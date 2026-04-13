import type { Metadata } from "next";
import CustomCursor from "@/components/CustomCursor";

export const metadata: Metadata = {
  title: "Admin — Portfolio Content",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0F0F0F] text-[#E5E5E5] font-sans">
      <CustomCursor />
      {children}
    </div>
  );
}
