"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { useInView, useAnimation } from "framer-motion";
import { Instagram, ArrowUpRight, Camera, User, Aperture } from "lucide-react";


const info = [
  {
    label: "About",
    body: "I'm Vedansh Devpura, from Udaipur, Rajasthan. My photographic journey began in 2023 — quietly, almost by accident, during my first year of college. I joined Fotografreaks, the college photography club, with no expectations and even less gear. What started as a way to walk around campus with a camera slowly became the way I started seeing the world. Eventually, I found myself leading the club — organizing photowalks, mentoring juniors, curating our exhibitions. Photography became less of a hobby and more of a way of holding on to fleeting moments, the kind that disappear before you can name them.",
  },
  {
    label: "Practice",
    body: "I've attended countless photowalks — through old city lanes of Udaipur, across crowded college fests, along lakes at sunrise, and into strangers' festivals I wasn't invited to. I've shot on a rotating cast of cameras: borrowed DSLRs, an aging mirrorless, an old film body that taught me patience, even a phone when nothing else was around. College fests taught me to chase light in low places; the streets taught me to wait. Each frame here is a small receipt from one of those days — kept because, for some reason, it stayed.",
  },
];

/**
 * Bento-style portrait composition.
 * - Large left tile: portrait of Vedansh (object-position top so head isn't cut)
 * - Top-right wide tile: with-the-camera landscape (overlaps large tile slightly)
 * - Bottom-right square: studio portrait
 * - Negative space on the right used by a vertical type-set "VEDANSH DEVPURA"
 *   that fades in/out with parallax — fills the gap creatively.
 */
type PortraitTile = {
  src: string;
  alt: string;
  caption: string;
  meta: string;
  icon: typeof Camera;
  // object-position CSS — defaults to center
  objectPosition?: string;
  // entrance reveal animation: "mask-wipe" | "scale" | "slide"
  reveal: "mask-wipe" | "scale" | "slide";
  revealDelay: number;
};

const tiles: PortraitTile[] = [
  {
    src: "/photos/portraits/vedansh-01.jpg",
    alt: "Vedansh Devpura — kurta portrait",
    caption: "Vedansh",
    meta: "Portrait",
    icon: User,
    // Keep the subject's head visible — push the focal point toward the top.
    objectPosition: "center 18%",
    reveal: "mask-wipe",
    revealDelay: 0,
  },
  {
    src: "/photos/portraits/vedansh-03.jpg",
    alt: "Vedansh Devpura — with the camera",
    caption: "With the camera",
    meta: "Frame",
    icon: Camera,
    objectPosition: "center",
    reveal: "scale",
    revealDelay: 0.15,
  },
  {
    src: "/photos/portraits/vedansh-02.jpg",
    alt: "Vedansh Devpura — studio portrait",
    caption: "Behind the lens",
    meta: "Studio",
    icon: Aperture,
    objectPosition: "center",
    reveal: "slide",
    revealDelay: 0.3,
  },
];

export default function InfoSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Subtle parallax for the vertical name strip
  const verticalY = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const verticalOpacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    [0, 1, 1, 0.5]
  );
  // Large tile drifts slightly slower than the others (depth illusion)
  const bigTileY = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const smallTilesY = useTransform(scrollYProgress, [0, 1], [80, -80]);

  return (
    <section
      id="info"
      ref={ref}
      className="relative bg-background py-24 sm:py-32"
    >
      <div className="absolute left-0 right-0 top-0 mx-auto h-px max-w-[1600px] bg-border/50" />

      <div className="mx-auto max-w-[1600px] px-6 sm:px-10 lg:px-16">
        {/* Header */}
        <motion.span
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="font-sans text-[10px] uppercase tracking-[0.4em] text-muted-foreground"
        >
          — Info
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mt-5 max-w-3xl font-serif text-3xl font-light leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:text-6xl"
        >
          A few words about
          <br />
          <span className="italic text-muted-foreground">the photographer.</span>
        </motion.h2>

        {/* === Bento portrait composition === */}
        <div className="mt-16 grid grid-cols-12 gap-3 sm:gap-4 lg:gap-5">
          {/* Large left tile — kurta portrait, 6 cols on desktop */}
          <motion.div
            style={{ y: bigTileY }}
            className="col-span-12 sm:col-span-6 lg:col-span-5"
          >
            <RevealTile
              tile={tiles[0]}
              aspect="3 / 4"
              large
            />
          </motion.div>

          {/* Right column — 2 stacked tiles + vertical name strip */}
          <div className="col-span-12 sm:col-span-6 lg:col-span-7">
            <div className="grid grid-cols-12 gap-3 sm:gap-4 lg:gap-5">
              {/* Top-right wide landscape tile */}
              <motion.div
                style={{ y: smallTilesY }}
                className="col-span-12 lg:col-span-8"
              >
                <RevealTile tile={tiles[1]} aspect="16 / 10" />
              </motion.div>

              {/* Vertical name strip — fills the rightmost column creatively */}
              <motion.div
                style={{ y: verticalY, opacity: verticalOpacity }}
                className="col-span-12 lg:col-span-4 hidden lg:flex lg:items-stretch lg:justify-center"
                aria-hidden
              >
                <div className="flex h-full min-h-[280px] flex-col items-center justify-between border-l border-border/60 pl-4">
                  {/* Top meta */}
                  <div className="font-sans text-[9px] uppercase tracking-[0.4em] text-muted-foreground [writing-mode:vertical-rl] rotate-180">
                    Photographer · Udaipur
                  </div>
                  {/* Big vertical name */}
                  <div className="font-serif text-5xl font-light tracking-[0.05em] text-foreground [writing-mode:vertical-rl] rotate-180">
                    Vedansh Devpura
                  </div>
                  {/* Bottom meta */}
                  <div className="font-sans text-[9px] uppercase tracking-[0.4em] text-primary [writing-mode:vertical-rl] rotate-180">
                    Est. 2023
                  </div>
                </div>
              </motion.div>

              {/* Bottom-right square tile */}
              <motion.div
                style={{ y: smallTilesY }}
                className="col-span-6 lg:col-span-8"
              >
                <RevealTile tile={tiles[2]} aspect="1 / 1" />
              </motion.div>

              {/* Mobile name strip */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="col-span-6 lg:hidden flex flex-col justify-end border-l border-border/60 pl-3"
              >
                <p className="font-serif text-2xl font-light leading-[1.05] text-foreground">
                  Vedansh
                  <br />
                  Devpura
                </p>
                <p className="mt-3 font-sans text-[9px] uppercase tracking-[0.3em] text-muted-foreground">
                  Udaipur, Rajasthan
                </p>
                <p className="mt-1 font-sans text-[9px] uppercase tracking-[0.3em] text-primary">
                  Est. 2023
                </p>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Info rows */}
        <div className="relative mt-20 flex flex-col">
          {/* Tripod+Camera doodle — sits in the top-right of the gap between bento and rows */}
          <div className="absolute -top-12 right-0 hidden lg:block" aria-hidden>
            <TripodCameraDoodle />
          </div>

          {info.map((row, i) => (
            <motion.div
              key={row.label}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: i * 0.1 }}
              className="grid grid-cols-1 gap-4 border-t border-border/60 py-10 sm:grid-cols-12 sm:gap-8"
            >
              <div className="relative sm:col-span-3">
                <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                  {String(i + 1).padStart(2, "0")} — {row.label}
                </p>
                {/* Light meter doodle beside first label */}
                {i === 0 && (
                  <div className="absolute -left-10 top-0 hidden lg:block" aria-hidden>
                    <LightMeterSmallDoodle />
                  </div>
                )}
              </div>
              <div className="sm:col-span-9">
                <p className="font-serif text-lg font-light leading-relaxed text-foreground/85 sm:text-xl">
                  {row.body}
                </p>
              </div>
            </motion.div>
          ))}
        </div>


        {/* Instagram CTA */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8 }}
          className="mt-20 grid grid-cols-1 gap-8 border-t border-border/60 py-12 sm:grid-cols-12 sm:items-center"
        >
          <div className="sm:col-span-7">
            <p className="font-serif text-2xl font-light leading-[1.2] text-foreground sm:text-4xl">
              If something here made you pause —
              <br />
              <span className="italic text-muted-foreground">
                come say hello on Instagram.
              </span>
            </p>
            <p className="mt-4 max-w-xl font-sans text-sm leading-relaxed text-muted-foreground">
              I post more frequently there — outtakes, frames that didn't make
              it here, photowalk announcements, and the occasional rant about
              light. Following the page is the easiest way to keep up with new
              work and walks.
            </p>
          </div>

          <div className="sm:col-span-5 sm:flex sm:justify-end">
            <a
              href="https://instagram.com/shhhhhhh._.14"
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="hover"
              data-cursor-label="Visit"
              className="group inline-flex items-center gap-4 rounded-full border border-border px-7 py-4 transition-colors hover:border-foreground/60"
            >
              <Instagram size={18} className="text-foreground" />
              <span className="font-sans text-xs uppercase tracking-[0.25em] text-foreground">
                @shhhhhhh._.14
              </span>
              <ArrowUpRight
                size={14}
                className="text-muted-foreground transition-transform duration-500 group-hover:rotate-45 group-hover:text-foreground"
              />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/**
 * A single bento tile with three possible reveal animations:
 * - mask-wipe: image wipes in from left to right via clip-path
 * - scale: image scales up from 0.92 with fade
 * - slide: image slides up from below with fade
 *
 * Each tile also has a hover zoom (image-zoom-container) and
 * an animated caption that fades in on hover.
 */
function RevealTile({
  tile,
  aspect,
  large = false,
}: {
  tile: PortraitTile;
  aspect: string;
  large?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const Icon = tile.icon;

  // Initial state per reveal type
  const initial =
    tile.reveal === "mask-wipe"
      ? { opacity: 1, clipPath: "inset(0 100% 0 0)" }
      : tile.reveal === "scale"
      ? { opacity: 0, scale: 0.92 }
      : { opacity: 0, y: 40 };

  const animate =
    tile.reveal === "mask-wipe"
      ? { opacity: 1, clipPath: "inset(0 0% 0 0)" }
      : tile.reveal === "scale"
      ? { opacity: 1, scale: 1 }
      : { opacity: 1, y: 0 };

  return (
    <motion.figure
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: tile.revealDelay }}
      className="group relative h-full overflow-hidden rounded-sm bg-card"
      style={{ aspectRatio: aspect }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-cursor="hover"
    >
      {/* Image with chosen reveal animation */}
      <motion.div
        initial={initial}
        whileInView={animate}
        viewport={{ once: true, margin: "-60px" }}
        transition={{
          duration: 1.1,
          delay: tile.revealDelay,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="image-zoom-container absolute inset-0 h-full w-full"
      >
        <img
          src={tile.src}
          alt={tile.alt}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
          style={{ objectPosition: tile.objectPosition || "center" }}
        />
      </motion.div>

      {/* Subtle vignette */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-background/20" />

      {/* Top meta row */}
      <div className="absolute left-3 top-3 z-10 flex items-center gap-2 sm:left-4 sm:top-4">
        <span className="flex h-7 w-7 items-center justify-center rounded-full border border-foreground/30 bg-background/30 backdrop-blur-sm sm:h-8 sm:w-8">
          <Icon size={12} className="text-foreground/90" />
        </span>
        <span className="font-sans text-[8px] uppercase tracking-[0.3em] text-foreground/80 sm:text-[9px]">
          {tile.meta}
        </span>
      </div>

      {/* Hover-revealed caption — sits at the very bottom with a short gradient */}
      <div
        className={`absolute bottom-0 left-0 right-0 z-10 flex items-end justify-between p-3 transition-all duration-500 sm:p-4 ${
          hovered ? "translate-y-0 opacity-100" : "translate-y-2 opacity-80"
        }`}
      >
        <p
          className={`font-serif ${
            large ? "text-2xl sm:text-3xl" : "text-lg sm:text-xl"
          } text-foreground`}
        >
          {tile.caption}
        </p>
        <span className="numeric font-sans text-[9px] text-foreground/50 sm:text-[10px]">
          0{tiles.indexOf(tile) + 1}
        </span>
      </div>
    </motion.figure>
  );
}

/* ─── Tripod + Camera Doodle ─── */
function TripodCameraDoodle() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const controls = useAnimation();
  useEffect(() => { if (isInView) controls.start("visible"); }, [isInView, controls]);

  const sp = { stroke: "oklch(0.88 0.004 260)", strokeOpacity: 0.13, fill: "none", strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const draw = (delay: number, dur = 1.1) => ({
    variants: { hidden: { pathLength: 0, opacity: 0 }, visible: { pathLength: 1, opacity: 1, transition: { duration: dur, delay, ease: "easeInOut" as const } } },
    initial: "hidden", animate: controls,
  });

  return (
    <div ref={ref} className="animate-float-slow">
      <svg viewBox="0 0 100 140" width="80" height="112" aria-hidden>
        {/* Camera body */}
        <motion.rect x={22} y={12} width={56} height={40} rx={5} strokeWidth="1.3" {...sp} {...draw(0)} />
        <motion.circle cx={50} cy={32} r={13} strokeWidth="1.2" {...sp} {...draw(0.15)} />
        <motion.circle cx={50} cy={32} r={7} strokeWidth="0.9" {...sp} {...draw(0.25)} />
        <motion.circle cx={50} cy={32} r={3} strokeWidth="0.7" {...sp} {...draw(0.35)} />
        {/* viewfinder */}
        <motion.rect x={30} y={5} width={16} height={9} rx={2.5} strokeWidth="1" {...sp} {...draw(0.1)} />
        {/* shutter button */}
        <motion.circle cx={70} cy={12} r={4} strokeWidth="0.9" {...sp} {...draw(0.12)} />
        {/* hot shoe */}
        <motion.rect x={62} y={5} width={14} height={6} rx={1.5} strokeWidth="0.8" {...sp} {...draw(0.08)} />

        {/* Tripod head plate */}
        <motion.rect x={28} y={52} width={44} height={10} rx={3} strokeWidth="1.1" {...sp} {...draw(0.4)} />
        {/* center column */}
        <motion.line x1={50} y1={62} x2={50} y2={90} strokeWidth="1.3" {...sp} {...draw(0.5, 0.7)} />
        {/* pan handle */}
        <motion.line x1={70} y1={57} x2={90} y2={50} strokeWidth="1" {...sp} {...draw(0.45, 0.6)} />
        <motion.circle cx={93} cy={49} r={4} strokeWidth="0.9" {...sp} {...draw(0.55, 0.4)} />
        {/* left leg */}
        <motion.line x1={46} y1={90} x2={26} y2={132} strokeWidth="1.2" {...sp} {...draw(0.6, 0.9)} />
        {/* center leg */}
        <motion.line x1={50} y1={90} x2={50} y2={132} strokeWidth="1.2" {...sp} {...draw(0.62, 0.9)} />
        {/* right leg */}
        <motion.line x1={54} y1={90} x2={74} y2={132} strokeWidth="1.2" {...sp} {...draw(0.64, 0.9)} />
        {/* spreader left */}
        <motion.line x1={30} y1={118} x2={50} y2={110} strokeWidth="0.7" strokeDasharray="3 3" {...sp} {...draw(0.75, 0.6)} />
        {/* spreader right */}
        <motion.line x1={70} y1={118} x2={50} y2={110} strokeWidth="0.7" strokeDasharray="3 3" {...sp} {...draw(0.75, 0.6)} />
        {/* feet */}
        <motion.circle cx={26} cy={135} r={3} strokeWidth="0.8" {...sp} {...draw(0.85, 0.3)} />
        <motion.circle cx={50} cy={135} r={3} strokeWidth="0.8" {...sp} {...draw(0.85, 0.3)} />
        <motion.circle cx={74} cy={135} r={3} strokeWidth="0.8" {...sp} {...draw(0.85, 0.3)} />

        {/* lens flare lines */}
        <motion.line x1={50} y1={32} x2={10} y2={10} strokeWidth="0.5" {...sp} strokeOpacity={0.06} {...draw(0.9, 0.8)} />
        <motion.line x1={50} y1={32} x2={90} y2={8} strokeWidth="0.5" {...sp} strokeOpacity={0.06} {...draw(0.92, 0.8)} />
        <motion.line x1={50} y1={32} x2={6} y2={50} strokeWidth="0.4" {...sp} strokeOpacity={0.04} {...draw(0.94, 0.7)} />
      </svg>
    </div>
  );
}

/* ─── Small Light Meter Doodle ─── */
function LightMeterSmallDoodle() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const controls = useAnimation();
  useEffect(() => { if (isInView) controls.start("visible"); }, [isInView, controls]);

  const sp = { stroke: "oklch(0.88 0.004 260)", strokeOpacity: 0.14, fill: "none", strokeLinecap: "round" as const };
  const draw = (delay: number, dur = 0.8) => ({
    variants: { hidden: { pathLength: 0, opacity: 0 }, visible: { pathLength: 1, opacity: 1, transition: { duration: dur, delay, ease: "easeInOut" as const } } },
    initial: "hidden", animate: controls,
  });

  const r = (n: number) => Number(n.toFixed(2));

  return (
    <div ref={ref} className="animate-drift-x">
      <svg viewBox="0 0 30 50" width="22" height="38" aria-hidden>
        {/* body */}
        <motion.rect x={2} y={2} width={26} height={46} rx={4} strokeWidth="1" {...sp} {...draw(0)} />
        {/* sensor window */}
        <motion.rect x={7} y={5} width={16} height={8} rx={2} strokeWidth="0.8" {...sp} {...draw(0.15)} />
        {/* gauge arc */}
        <motion.path d="M 6 35 A 10 10 0 0 1 24 35" strokeWidth="1" {...sp} {...draw(0.3, 0.7)} />
        {/* needle */}
        <motion.line x1={15} y1={35} x2={22} y2={24} strokeWidth="0.9" {...sp} {...draw(0.5)} />
        <motion.circle cx={15} cy={35} r={1.5} strokeWidth="0.7" {...sp} {...draw(0.45)} />
        {/* marks */}
        {[-35, -17, 0, 17, 35].map((deg, i) => {
          const rad = ((deg + 90) * Math.PI) / 180;
          return <motion.line key={i}
            x1={r(15 + 9 * Math.cos(rad))} y1={r(35 - 9 * Math.sin(rad))}
            x2={r(15 + 11 * Math.cos(rad))} y2={r(35 - 11 * Math.sin(rad))}
            strokeWidth="0.6" {...sp} {...draw(0.55 + i * 0.04, 0.3)} />;
        })}
        {/* brand lines */}
        <motion.line x1={6} y1={42} x2={20} y2={42} strokeWidth="0.6" {...sp} strokeOpacity={0.08} {...draw(0.7, 0.4)} />
        <motion.line x1={6} y1={45} x2={16} y2={45} strokeWidth="0.5" {...sp} strokeOpacity={0.06} {...draw(0.75, 0.3)} />
      </svg>
    </div>
  );
}
