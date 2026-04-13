import CustomCursor from "@/components/CustomCursor";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import StatsMarquee from "@/components/StatsMarquee";
import Clients from "@/components/Clients";
import Services from "@/components/Services";
import TechStack from "@/components/TechStack";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      {/* Noise texture overlay */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[60] opacity-[0.025] mix-blend-overlay"
      >
        <svg width="100%" height="100%">
          <filter id="noise">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.8"
              numOctaves="4"
              stitchTiles="stitch"
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>
      </div>

      <CustomCursor />
      <Navigation />

      <main>
        <Hero />
        <StatsMarquee />
        <Clients />
        <Services />
        <TechStack />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
