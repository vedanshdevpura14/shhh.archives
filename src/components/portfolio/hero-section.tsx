"use client";

import { motion, useScroll, useTransform, useInView, useAnimation } from "framer-motion";
import { useRef, useEffect } from "react";

/**
 * Quiet hero for shhh.archive — a single full-screen image, breathing slowly.
 * Headline reveals word-by-word. No CTAs, no booking button.
 * Enhanced with photography doodle accents in negative space corners.
 */
const heroImage = "/photos/full/photo-36.jpg";

export default function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const textY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const imageY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const doodleOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative h-[100svh] w-full overflow-hidden bg-background"
    >
      {/* Background image — slow Ken Burns */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ scale: imageScale, y: imageY }}
      >
        <motion.div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
          animate={{ scale: [1.05, 1.14, 1.05] }}
          transition={{
            duration: 22,
            ease: "linear",
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        {/* Quiet overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/15 to-background" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-transparent to-background/20" />
      </motion.div>

      {/* ── DOODLE: Aperture ring — top-right corner ── */}
      <motion.div
        style={{ opacity: doodleOpacity }}
        className="absolute right-4 top-16 z-10 sm:right-10 lg:right-14"
        aria-hidden
      >
        <ApertureDoodle />
      </motion.div>

      {/* ── DOODLE: Film frame corners — bottom-left ── */}
      <motion.div
        style={{ opacity: doodleOpacity }}
        className="absolute bottom-20 left-4 z-10 sm:left-10 lg:left-14"
        aria-hidden
      >
        <FilmFrameCorners />
      </motion.div>

      {/* ── DOODLE: Shutter count — top-left corner ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.8, duration: 1 }}
        style={{ opacity: doodleOpacity }}
        className="absolute left-4 top-16 z-10 sm:left-10 lg:left-14"
        aria-hidden
      >
        <ShutterCountDoodle />
      </motion.div>

      {/* Top meta strip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 0.7 }}
        className="absolute left-0 right-0 top-24 z-10 mx-auto flex max-w-[1600px] items-center justify-between px-6 sm:px-10 lg:px-16"
      >
        <span className="font-sans text-[9px] uppercase tracking-[0.4em] text-foreground/50">
          Personal · Ongoing
        </span>
        <span className="hidden font-sans text-[9px] uppercase tracking-[0.4em] text-foreground/50 sm:block">
          Vol. 01 — Light &amp; Stillness
        </span>
      </motion.div>

      {/* Centered hero text */}
      <motion.div
        style={{ y: textY, opacity: textOpacity }}
        className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center"
      >
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.1, duration: 0.7 }}
          className="mb-6 font-sans text-[10px] uppercase tracking-[0.5em] text-foreground/60"
        >
          — A Photography Archive —
        </motion.p>

        {/* Headline with staggered word reveal */}
        <h1 className="font-serif text-[13vw] font-light leading-[0.92] tracking-tight text-foreground sm:text-[10vw] lg:text-[8vw]">
          <Word text="quiet" delay={2.3} />
          <br />
          <Word text="frames," delay={2.5} />
          <br />
          <Word text="loud" delay={2.7} italic />
          <Word text=" light." delay={2.9} italic />
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.2, duration: 0.7 }}
          className="mt-10 max-w-md font-sans text-sm leading-relaxed text-foreground/70"
        >
          A growing collection of photographs made in passing —
          on walks, between cities, without commission or brief.
        </motion.p>
      </motion.div>

      {/* Bottom corners */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.4, duration: 0.7 }}
        style={{ opacity: textOpacity }}
        className="absolute bottom-8 left-6 z-10 flex items-center gap-3 sm:left-10 sm:bottom-10 lg:left-16"
      >
        <span className="h-px w-8 bg-foreground/40" />
        <span className="font-sans text-[9px] uppercase tracking-[0.4em] text-foreground/60">
          Scroll to enter
        </span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.4, duration: 0.7 }}
        style={{ opacity: textOpacity }}
        className="absolute bottom-8 right-6 z-10 text-right sm:bottom-10 sm:right-10 lg:right-16"
      >
        <span className="font-sans text-[9px] uppercase tracking-[0.4em] text-foreground/50">
          MMXXVI
        </span>
      </motion.div>
    </section>
  );
}

function Word({
  text,
  delay = 0,
  italic = false,
}: {
  text: string;
  delay?: number;
  italic?: boolean;
}) {
  return (
    <span className="inline-block overflow-hidden align-bottom">
      <motion.span
        initial={{ y: "110%" }}
        animate={{ y: 0 }}
        transition={{ delay, duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
        className={`inline-block ${italic ? "italic text-foreground/80" : ""}`}
      >
        {text}
      </motion.span>
    </span>
  );
}

/* ─── Doodle sub-components ─── */

function ApertureDoodle() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) controls.start("visible");
  }, [isInView, controls]);

  const strokeProps = {
    stroke: "oklch(0.88 0.004 260)",
    strokeOpacity: 0.18,
    fill: "none",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  const draw = (delay: number) => ({
    variants: {
      hidden: { pathLength: 0, opacity: 0 },
      visible: { pathLength: 1, opacity: 1, transition: { duration: 1.8, delay, ease: "easeInOut" as const } },
    },
    initial: "hidden",
    animate: controls,
  });

  const r = (n: number) => Number(n.toFixed(2));

  return (
    <div ref={ref} className="animate-float-slow">
      <svg
        viewBox="0 0 120 120"
        width="90"
        height="90"
        className="opacity-100"
        aria-hidden
      >
        {/* outer ring */}
        <motion.circle cx={60} cy={60} r={52} strokeWidth="1.2" {...strokeProps} {...draw(3.6)} />
        {/* middle ring */}
        <motion.circle cx={60} cy={60} r={40} strokeWidth="1" {...strokeProps} {...draw(3.75)} />
        {/* aperture blades (6) */}
        {[0, 60, 120, 180, 240, 300].map((deg, i) => {
          const rad = (deg * Math.PI) / 180;
          const x1 = r(60 + 40 * Math.cos(rad));
          const y1 = r(60 + 40 * Math.sin(rad));
          const x2 = r(60 + 28 * Math.cos(rad + 0.8));
          const y2 = r(60 + 28 * Math.sin(rad + 0.8));
          const x3 = r(60 + 14 * Math.cos(rad + 0.4));
          const y3 = r(60 + 14 * Math.sin(rad + 0.4));
          return (
            <motion.path
              key={i}
              d={`M ${x1} ${y1} Q ${x2} ${y2} ${x3} ${y3}`}
              strokeWidth="1"
              {...strokeProps}
              {...draw(3.8 + i * 0.07)}
            />
          );
        })}
        {/* inner dot */}
        <motion.circle cx={60} cy={60} r={6} strokeWidth="0.9" {...strokeProps} {...draw(4.3)} />
        {/* f-stop tick marks on outer ring */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => {
          const rad = (deg * Math.PI) / 180;
          return (
            <motion.line
              key={i}
              x1={r(60 + 44 * Math.cos(rad))}
              y1={r(60 + 44 * Math.sin(rad))}
              x2={r(60 + 52 * Math.cos(rad))}
              y2={r(60 + 52 * Math.sin(rad))}
              strokeWidth="0.7"
              {...strokeProps}
              {...draw(4.0 + i * 0.03)}
            />
          );
        })}
      </svg>
    </div>
  );
}

function FilmFrameCorners() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) controls.start("visible");
  }, [isInView, controls]);

  const sp = {
    stroke: "oklch(0.88 0.004 260)",
    strokeOpacity: 0.2,
    fill: "none",
    strokeLinecap: "round" as const,
  };

  const draw = (delay: number) => ({
    variants: {
      hidden: { pathLength: 0, opacity: 0 },
      visible: { pathLength: 1, opacity: 1, transition: { duration: 1.2, delay, ease: "easeInOut" as const } },
    },
    initial: "hidden",
    animate: controls,
  });

  return (
    <div ref={ref}>
      <svg viewBox="0 0 80 80" width="72" height="72" aria-hidden>
        {/* top-left corner */}
        <motion.path d="M 4 24 V 4 H 24" strokeWidth="1.4" {...sp} {...draw(3.5)} />
        {/* top-right corner */}
        <motion.path d="M 56 4 H 76 V 24" strokeWidth="1.4" {...sp} {...draw(3.6)} />
        {/* bottom-left corner */}
        <motion.path d="M 4 56 V 76 H 24" strokeWidth="1.4" {...sp} {...draw(3.7)} />
        {/* bottom-right corner */}
        <motion.path d="M 56 76 H 76 V 56" strokeWidth="1.4" {...sp} {...draw(3.8)} />
        {/* sprocket holes — top */}
        <motion.rect x={12} y={-2} width={10} height={6} rx={1.5} strokeWidth="0.9" {...sp} {...draw(3.65)} />
        <motion.rect x={56} y={-2} width={10} height={6} rx={1.5} strokeWidth="0.9" {...sp} {...draw(3.7)} />
        {/* sprocket holes — bottom */}
        <motion.rect x={12} y={76} width={10} height={6} rx={1.5} strokeWidth="0.9" {...sp} {...draw(3.85)} />
        <motion.rect x={56} y={76} width={10} height={6} rx={1.5} strokeWidth="0.9" {...sp} {...draw(3.9)} />
        {/* center cross */}
        <motion.line x1={40} y1={30} x2={40} y2={50} strokeWidth="0.6" {...sp} strokeOpacity={0.1} {...draw(4.0)} />
        <motion.line x1={30} y1={40} x2={50} y2={40} strokeWidth="0.6" {...sp} strokeOpacity={0.1} {...draw(4.0)} />
      </svg>
    </div>
  );
}

function ShutterCountDoodle() {
  return (
    <div className="flex flex-col gap-1 animate-shutter-blink">
      <svg viewBox="0 0 90 30" width="80" height="24" fill="none" aria-hidden>
        <text
          x="0" y="20"
          fontFamily="ui-monospace, monospace"
          fontSize="10"
          fill="oklch(0.88 0.004 260)"
          fillOpacity="0.2"
          letterSpacing="2"
        >
          FRAME 001/∞
        </text>
        <line x1="0" y1="25" x2="86" y2="25" stroke="oklch(0.88 0.004 260)" strokeOpacity="0.12" strokeWidth="0.6" />
      </svg>
    </div>
  );
}
