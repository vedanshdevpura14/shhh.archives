"use client";

import dynamic from "next/dynamic";
import Navigation from "@/components/portfolio/navigation";
import HeroSection from "@/components/portfolio/hero-section";
import GallerySection from "@/components/portfolio/gallery-section";
import InfoSection from "@/components/portfolio/info-section";
import Footer from "@/components/portfolio/footer";
import ScrollProgress from "@/components/portfolio/scroll-progress";
import CustomCursor from "@/components/portfolio/custom-cursor";
import DoodleDivider from "@/components/portfolio/doodle-divider";
import Image from "next/image";
import { motion } from "framer-motion";

const PageLoader = dynamic(
  () => import("@/components/portfolio/page-loader"),
  { ssr: false }
);

function MiddleWatermark() {
  return (
    <div className="relative py-14 flex flex-col items-center justify-center overflow-hidden pointer-events-none select-none" aria-hidden>
      {/* Soft radial glow */}
      <div className="absolute h-64 w-64 rounded-full bg-foreground/[0.02] blur-3xl" />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        className="relative h-44 w-44 sm:h-56 sm:w-56 opacity-60 hover:opacity-90 transition-opacity animate-float-slow"
      >
        <Image
          src="/watermark.png"
          alt="Shhhhhhh Photography Watermark"
          fill
          sizes="(max-width: 640px) 176px, 224px"
          className="object-contain drop-shadow-[0_0_25px_rgba(255,255,255,0.08)]"
        />
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="mt-3 font-sans text-[8px] uppercase tracking-[0.5em] text-muted-foreground/50"
      >
        Shhhhhhh Photography · Archive Mark
      </motion.p>
    </div>
  );
}

export default function Home() {
  return (
    <main className="relative min-h-screen flex flex-col bg-background">
      {/* Film grain overlay */}
      <div className="film-grain" aria-hidden />

      {/* Quiet intro */}
      <PageLoader />

      {/* Custom cursor */}
      <CustomCursor />

      {/* Scroll progress bar */}
      <ScrollProgress />

      {/* Sticky navigation */}
      <Navigation />

      {/* Sections with doodle dividers in between */}
      <HeroSection />

      {/* Film strip + camera doodle divider between Hero and Gallery */}
      <DoodleDivider variant="hero-to-gallery" className="-mt-4 -mb-2" />

      <GallerySection />

      {/* Middle Watermark — transition mark between Gallery and Info */}
      <MiddleWatermark />

      {/* Aperture + tripod + light meter doodle divider between Gallery and Info */}
      <DoodleDivider variant="gallery-to-info" className="-mt-4 -mb-2 max-h-[160px] overflow-hidden" />

      <InfoSection />

      {/* Footer */}
      <Footer />
    </main>
  );
}
