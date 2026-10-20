"use client";

import Image from "next/image";
import { motion, useInView, useAnimation } from "framer-motion";
import { Mail, Instagram } from "lucide-react";
import { useRef, useEffect } from "react";

export default function Footer() {
  return (
    <footer
      id="contact"
      className="relative mt-auto overflow-hidden bg-background"
    >
      {/* ── Full-bleed camera photo break ── */}
      <CameraPhotoBreak />

      {/* ── Contact grid ── */}
      <div className="border-t border-border/60">
        <div className="mx-auto max-w-[1600px] px-6 py-16 sm:px-10 sm:py-24 lg:px-16">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">

            {/* Left — invitation to write */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="font-sans text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
                — Contact
              </span>
              <h2 className="mt-5 font-serif text-4xl font-light leading-[1.0] tracking-tight text-foreground sm:text-6xl">
                Say
                <br />
                <span className="italic text-muted-foreground">something.</span>
              </h2>
              <p className="mt-8 max-w-md font-sans text-sm leading-relaxed text-muted-foreground">
                No bookings, no commissions — but if you&apos;d like to write to me
                about a frame, or just to share something you saw, you&apos;re welcome
                to.
              </p>

              <a
                href="mailto:shootly.in@gmail.com"
                data-cursor="hover"
                data-cursor-label="Email"
                className="link-underline mt-10 inline-block font-serif text-2xl text-foreground sm:text-3xl"
              >
                shootly.in@gmail.com
              </a>
            </motion.div>

            {/* Right — Camera Gear Cutout Card + Socials & Coordinates */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="flex flex-col justify-between gap-10"
            >
              {/* Archival darkroom cutout card of camera photo */}
              <div className="relative group">
                <motion.div
                  whileHover={{ y: -4, rotate: -0.5 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="relative overflow-hidden rounded-xl border border-border/80 bg-muted/20 p-3 shadow-2xl backdrop-blur-sm"
                >
                  {/* Film rebate top strip */}
                  <div className="mb-2 flex items-center justify-between px-1 font-mono text-[9px] uppercase tracking-[0.25em] text-muted-foreground/70">
                    <span className="flex items-center gap-1.5">
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500/80 animate-pulse" />
                      Daily Rig · 01
                    </span>
                    <span>SONY α7 · FE 35mm F1.8</span>
                  </div>

                  {/* Cutout photo container */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg bg-black/60">
                    <Image
                      src="/camera-bw.png"
                      alt="Sony camera rig cutout — shhh.archive"
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                    />

                    {/* Subtle vignette & film grain gradient */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

                    {/* Darkroom technical specs overlay */}
                    <div className="absolute bottom-2.5 left-3 right-3 flex items-end justify-between font-mono text-[9px] text-foreground/80">
                      <div>
                        <p className="font-sans text-[11px] font-medium tracking-wide text-foreground">
                          Everyday Carry
                        </p>
                        <p className="text-[9px] text-muted-foreground">
                          35mm Prime · Variable ND · RAW ARW
                        </p>
                      </div>
                      <span className="rounded border border-border/60 bg-background/60 px-1.5 py-0.5 text-[8px] uppercase tracking-wider backdrop-blur-md">
                        Selected Frame
                      </span>
                    </div>

                    {/* Corner viewfinder marks */}
                    <div className="pointer-events-none absolute inset-2" aria-hidden>
                      <span className="absolute top-0 left-0 h-2 w-2 border-l border-t border-white/30" />
                      <span className="absolute top-0 right-0 h-2 w-2 border-r border-t border-white/30" />
                      <span className="absolute bottom-0 left-0 h-2 w-2 border-l border-b border-white/30" />
                      <span className="absolute bottom-0 right-0 h-2 w-2 border-r border-b border-white/30" />
                    </div>
                  </div>

                  {/* Film rebate bottom strip */}
                  <div className="mt-2 flex items-center justify-between px-1 font-mono text-[8px] tracking-[0.3em] text-muted-foreground/50">
                    <span>▲ SAFETY FILM ▲</span>
                    <span>ISO 100 · 1/250s</span>
                    <span>SHHH-ARCHIVE</span>
                  </div>
                </motion.div>
              </div>

              {/* Socials & Coordinates bottom bar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-2">
                {/* Social icons */}
                <div className="flex items-center gap-3">
                  {[
                    { icon: Mail, label: "Email", href: "mailto:shootly.in@gmail.com" },
                    { icon: Instagram, label: "Instagram", href: "https://instagram.com/shhhhhhh._.14" },
                  ].map((s) => (
                    <motion.a
                      key={s.label}
                      href={s.href}
                      aria-label={s.label}
                      data-cursor="hover"
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.94 }}
                      transition={{ type: "spring", stiffness: 350, damping: 22 }}
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground"
                    >
                      <s.icon size={14} />
                    </motion.a>
                  ))}
                  <span className="font-sans text-[11px] text-muted-foreground ml-2">
                    Connect or write
                  </span>
                </div>

                {/* Coordinates */}
                <div className="font-sans text-[10px] uppercase tracking-[0.3em] text-muted-foreground sm:text-right">
                  <p>Made slowly, somewhere quiet.</p>
                  <p className="mt-1 text-foreground/40">— Vol. 01 · MMXXVI</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Watermark at the last part of the page */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mt-14 mb-4 flex flex-col items-center justify-center text-center select-none"
            aria-hidden
          >
            <div className="relative h-32 w-32 sm:h-44 sm:w-44 opacity-50 hover:opacity-85 transition-opacity duration-700">
              <Image
                src="/watermark.png"
                alt="Shhhhhhh Photography Watermark"
                fill
                sizes="(max-width: 640px) 128px, 176px"
                className="object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.08)]"
              />
            </div>
            <p className="mt-2 font-sans text-[8px] uppercase tracking-[0.45em] text-muted-foreground/50">
              Shhhhhhh Photography · Archive Seal
            </p>
          </motion.div>

          {/* Bottom hairline */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-border/60 pt-8 sm:flex-row sm:items-center"
          >
            <div className="flex items-baseline gap-1">
              <span className="font-serif text-base text-foreground">shhh</span>
              <span className="font-sans text-[9px] uppercase tracking-[0.3em] text-muted-foreground">
                .archive
              </span>
            </div>
            <p className="font-sans text-[9px] uppercase tracking-[0.3em] text-muted-foreground">
              © {new Date().getFullYear()} — Personal use only
            </p>
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  window.dispatchEvent(new CustomEvent("open-owner-login"));
                }}
                className="font-sans text-[9px] uppercase tracking-[0.3em] text-muted-foreground/40 hover:text-foreground transition-colors"
                title="Owner Login (or press Ctrl+Shift+O)"
              >
                Owner
              </button>
              <motion.button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                data-cursor="hover"
                className="link-underline font-sans text-[9px] uppercase tracking-[0.3em] text-muted-foreground hover:text-foreground"
              >
                Back to top
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}

/* ─── Full-bleed camera photo section break ─── */
function CameraPhotoBreak() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div ref={ref} className="relative w-full overflow-hidden" style={{ height: "60vh", minHeight: 340, maxHeight: 620 }}>
      {/* Photo */}
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.06, opacity: 0 }}
        animate={isInView ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <Image
          src="/camera-bw.png"
          alt="Sony camera with lenses — shhh.archive"
          fill
          sizes="100vw"
          className="object-cover object-center"
          priority={false}
        />
      </motion.div>

      {/* Top gradient — blends into the section above */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-background to-transparent" />

      {/* Bottom gradient — blends into the contact section below */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />

      {/* Subtle dark scrim so text / doodles stay legible */}
      <div className="absolute inset-0 bg-background/30" />

      {/* Film-frame corner brackets overlaid */}
      <div className="absolute inset-6 pointer-events-none" aria-hidden>
        {/* Top-left */}
        <svg className="absolute top-0 left-0 opacity-30" width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="oklch(0.88 0.004 260)" strokeWidth="1.5" strokeLinecap="round">
          <path d="M 2 18 V 2 H 18" />
        </svg>
        {/* Top-right */}
        <svg className="absolute top-0 right-0 opacity-30" width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="oklch(0.88 0.004 260)" strokeWidth="1.5" strokeLinecap="round">
          <path d="M 22 2 H 38 V 18" />
        </svg>
        {/* Bottom-left */}
        <svg className="absolute bottom-0 left-0 opacity-30" width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="oklch(0.88 0.004 260)" strokeWidth="1.5" strokeLinecap="round">
          <path d="M 2 22 V 38 H 18" />
        </svg>
        {/* Bottom-right */}
        <svg className="absolute bottom-0 right-0 opacity-30" width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="oklch(0.88 0.004 260)" strokeWidth="1.5" strokeLinecap="round">
          <path d="M 22 38 H 38 V 22" />
        </svg>
      </div>

      {/* Centered caption */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center gap-3"
        initial={{ opacity: 0, y: 12 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1.0, delay: 0.5 }}
      >
        <span className="font-sans text-[9px] uppercase tracking-[0.5em] text-foreground/50">
          The tools behind the quiet
        </span>
        <span className="font-serif text-2xl font-light italic text-foreground/80 sm:text-3xl">
          shhh.archive
        </span>
        <span className="font-sans text-[9px] uppercase tracking-[0.3em] text-foreground/30 mt-1">
          Sony · 35mm f/1.8 · ARW
        </span>
      </motion.div>

      {/* RAW file metadata strip — top left, like a lightroom overlay */}
      <motion.div
        className="absolute top-4 left-4 font-mono text-[9px] text-foreground/25 leading-tight"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.9 }}
        aria-hidden
      >
        <div>FF_09209.ARW</div>
        <div>1616 × 3080 · 1.75MP</div>
        <div>f/1.8 · 1/350s · ISO100</div>
      </motion.div>
    </div>
  );
}

/* ─── Film strip repeating unit ─── */
function FilmStripRepeating({ count }: { count: number }) {
  return (
    <svg
      viewBox={`0 0 ${count * 60} 80`}
      height="80"
      width={count * 60}
      fill="none"
      stroke="oklch(0.88 0.004 260)"
      strokeLinecap="round"
    >
      <line x1={0} y1={8} x2={count * 60} y2={8} strokeWidth="1.5" />
      <line x1={0} y1={72} x2={count * 60} y2={72} strokeWidth="1.5" />
      {Array.from({ length: count }).map((_, i) => (
        <g key={i}>
          <rect x={i * 60 + 6} y={2} width={18} height={10} rx={2} strokeWidth="1" />
          <rect x={i * 60 + 6} y={68} width={18} height={10} rx={2} strokeWidth="1" />
          <rect x={i * 60 + 34} y={2} width={18} height={10} rx={2} strokeWidth="1" />
          <rect x={i * 60 + 34} y={68} width={18} height={10} rx={2} strokeWidth="1" />
          {i > 0 && <line x1={i * 60} y1={8} x2={i * 60} y2={72} strokeWidth="0.6" strokeOpacity={0.5} />}
        </g>
      ))}
    </svg>
  );
}
