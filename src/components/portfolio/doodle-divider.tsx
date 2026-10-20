"use client";

import React, { useRef, useEffect } from "react";
import { motion, useInView, useAnimation } from "framer-motion";

/* ─────────────────────────────────────────────────────────────
   DoodleDivider
   Full-width SVG band placed between sections.
   variant "hero-to-gallery"  → film strip + camera body + detached lens
   variant "gallery-to-info"  → tripod / aperture blades / light meter
   ───────────────────────────────────────────────────────────── */

type DoodleVariant = "hero-to-gallery" | "gallery-to-info";

interface DoodleDividerProps {
  variant: DoodleVariant;
  className?: string;
}

/* Reusable draw-on motion props factory */
function draw(controls: ReturnType<typeof useAnimation>, delay: number, dur = 1.6) {
  return {
    variants: {
      hidden: { pathLength: 0, opacity: 0 },
      visible: {
        pathLength: 1,
        opacity: 1,
        transition: { duration: dur, delay, ease: "easeInOut" as const },
      },
    } as const,
    initial: "hidden" as const,
    animate: controls,
  };
}

const r = (n: number) => Number(n.toFixed(2));

export default function DoodleDivider({ variant, className = "" }: DoodleDividerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) controls.start("visible");
  }, [isInView, controls]);

  return (
    <div ref={ref} className={`relative w-full overflow-hidden pointer-events-none select-none ${className}`} aria-hidden>
      {variant === "hero-to-gallery"
        ? <HeroToGalleryDoodle controls={controls} />
        : <GalleryToInfoDoodle controls={controls} />
      }
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   VARIANT A — Hero → Gallery
   Horizontal film strip with camera body left, detached lens right
   ───────────────────────────────────────────────────────────── */
function HeroToGalleryDoodle({ controls }: { controls: ReturnType<typeof useAnimation> }) {
  const S = "oklch(0.88 0.004 260)";
  const OP = 0.12;

  return (
    <svg
      viewBox="0 0 1440 160"
      preserveAspectRatio="xMidYMid meet"
      className="w-full h-auto"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* ── Film strip rails ── */}
      <motion.path d="M 220 60 H 1220" stroke={S} strokeOpacity={OP} strokeWidth="1.2" {...draw(controls, 0, 2.2)} />
      <motion.path d="M 220 100 H 1220" stroke={S} strokeOpacity={OP} strokeWidth="1.2" {...draw(controls, 0.1, 2.2)} />
      <motion.path d="M 220 55 V 105" stroke={S} strokeOpacity={OP} strokeWidth="1.2" {...draw(controls, 0.15, 0.8)} />
      <motion.path d="M 1220 55 V 105" stroke={S} strokeOpacity={OP} strokeWidth="1.2" {...draw(controls, 0.15, 0.8)} />

      {/* ── Sprocket holes top ── */}
      {[240, 295, 350, 405, 460, 515, 570, 625, 680, 735, 790, 845, 900, 955, 1010, 1065, 1120, 1175].map((x, i) => (
        <motion.rect key={`t${i}`} x={x} y={50} width={24} height={10} rx={2}
          stroke={S} strokeOpacity={OP} strokeWidth="0.9"
          {...draw(controls, 0.05 * i, 0.5)} />
      ))}
      {/* ── Sprocket holes bottom ── */}
      {[240, 295, 350, 405, 460, 515, 570, 625, 680, 735, 790, 845, 900, 955, 1010, 1065, 1120, 1175].map((x, i) => (
        <motion.rect key={`b${i}`} x={x} y={100} width={24} height={10} rx={2}
          stroke={S} strokeOpacity={OP} strokeWidth="0.9"
          {...draw(controls, 0.05 * i + 0.05, 0.5)} />
      ))}

      {/* ── Frame dividers ── */}
      {[318, 436, 554, 672, 790, 908, 1026, 1144].map((x, i) => (
        <motion.line key={`d${i}`} x1={x} y1={60} x2={x} y2={100}
          stroke={S} strokeOpacity={OP * 0.5} strokeWidth="0.6"
          {...draw(controls, 0.08 * i + 0.3, 0.6)} />
      ))}

      {/* ── Camera body (left) ── */}
      <motion.rect x={50} y={58} width={130} height={82} rx={6} stroke={S} strokeOpacity={OP} strokeWidth="1.5" {...draw(controls, 0.4, 1.4)} />
      <motion.circle cx={115} cy={99} r={28} stroke={S} strokeOpacity={OP} strokeWidth="1.4" {...draw(controls, 0.6, 1.2)} />
      <motion.circle cx={115} cy={99} r={18} stroke={S} strokeOpacity={OP} strokeWidth="1" {...draw(controls, 0.75, 1.0)} />
      <motion.circle cx={115} cy={99} r={8} stroke={S} strokeOpacity={OP} strokeWidth="0.8" {...draw(controls, 0.9, 0.7)} />
      <motion.rect x={65} y={50} width={28} height={10} rx={3} stroke={S} strokeOpacity={OP} strokeWidth="1" {...draw(controls, 0.55, 0.7)} />
      <motion.circle cx={158} cy={58} r={6} stroke={S} strokeOpacity={OP} strokeWidth="1" {...draw(controls, 0.65, 0.5)} />
      <motion.rect x={44} y={68} width={8} height={14} rx={2} stroke={S} strokeOpacity={OP} strokeWidth="0.8" {...draw(controls, 0.5, 0.5)} />
      <motion.rect x={178} y={68} width={8} height={14} rx={2} stroke={S} strokeOpacity={OP} strokeWidth="0.8" {...draw(controls, 0.5, 0.5)} />
      <motion.circle cx={158} cy={78} r={10} stroke={S} strokeOpacity={OP} strokeWidth="0.9" {...draw(controls, 0.72, 0.6)} />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        return (
          <motion.line key={`d${i}`}
            x1={r(158 + 8 * Math.cos(rad))} y1={r(78 + 8 * Math.sin(rad))}
            x2={r(158 + 10 * Math.cos(rad))} y2={r(78 + 10 * Math.sin(rad))}
            stroke={S} strokeOpacity={OP} strokeWidth="0.6"
            {...draw(controls, 0.78 + i * 0.02, 0.3)} />
        );
      })}

      {/* ── Detached lens (right) ── */}
      <motion.circle cx={1340} cy={80} r={42} stroke={S} strokeOpacity={OP} strokeWidth="1.4" {...draw(controls, 0.5, 1.4)} />
      <motion.circle cx={1340} cy={80} r={30} stroke={S} strokeOpacity={OP} strokeWidth="1.1" {...draw(controls, 0.65, 1.2)} />
      <motion.circle cx={1340} cy={80} r={18} stroke={S} strokeOpacity={OP} strokeWidth="0.9" {...draw(controls, 0.8, 1.0)} />
      <motion.circle cx={1340} cy={80} r={8} stroke={S} strokeOpacity={OP} strokeWidth="0.7" {...draw(controls, 0.9, 0.8)} />
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        return (
          <motion.line key={i}
            x1={r(1340 + 33 * Math.cos(rad))} y1={r(80 + 33 * Math.sin(rad))}
            x2={r(1340 + 42 * Math.cos(rad))} y2={r(80 + 42 * Math.sin(rad))}
            stroke={S} strokeOpacity={OP} strokeWidth="0.6"
            {...draw(controls, 0.7 + i * 0.015, 0.3)} />
        );
      })}

      {/* ── Annotation dashes center ── */}
      <motion.path d="M 660 72 H 700" stroke={S} strokeOpacity={OP * 0.6} strokeWidth="0.7" {...draw(controls, 1.2, 0.5)} />
      <motion.path d="M 660 80 H 688" stroke={S} strokeOpacity={OP * 0.4} strokeWidth="0.7" {...draw(controls, 1.3, 0.4)} />
      <motion.path d="M 660 88 H 694" stroke={S} strokeOpacity={OP * 0.4} strokeWidth="0.7" {...draw(controls, 1.35, 0.4)} />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────
   VARIANT B — Gallery → Info
   Tripod + 6-blade aperture + light meter + crosshair loupes
   ───────────────────────────────────────────────────────────── */
function GalleryToInfoDoodle({ controls }: { controls: ReturnType<typeof useAnimation> }) {
  const S = "oklch(0.88 0.004 260)";
  const OP = 0.11;

  return (
    <svg
      viewBox="0 0 1440 180"
      preserveAspectRatio="xMidYMid meet"
      className="w-full h-auto"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* ── Tripod (left) ── */}
      <motion.rect x={180} y={40} width={80} height={18} rx={4} stroke={S} strokeOpacity={OP} strokeWidth="1.3" {...draw(controls, 0.3, 1.0)} />
      <motion.line x1={220} y1={58} x2={220} y2={95} stroke={S} strokeOpacity={OP} strokeWidth="1.4" {...draw(controls, 0.4, 0.8)} />
      <motion.line x1={215} y1={95} x2={170} y2={162} stroke={S} strokeOpacity={OP} strokeWidth="1.2" {...draw(controls, 0.5, 1.0)} />
      <motion.line x1={225} y1={95} x2={270} y2={162} stroke={S} strokeOpacity={OP} strokeWidth="1.2" {...draw(controls, 0.5, 1.0)} />
      <motion.line x1={220} y1={95} x2={220} y2={162} stroke={S} strokeOpacity={OP} strokeWidth="1.2" {...draw(controls, 0.55, 1.0)} />
      <motion.line x1={183} y1={138} x2={220} y2={128} stroke={S} strokeOpacity={OP} strokeWidth="0.8" strokeDasharray="4 3" {...draw(controls, 0.65, 0.6)} />
      <motion.line x1={257} y1={138} x2={220} y2={128} stroke={S} strokeOpacity={OP} strokeWidth="0.8" strokeDasharray="4 3" {...draw(controls, 0.65, 0.6)} />
      <motion.line x1={258} y1={50} x2={292} y2={42} stroke={S} strokeOpacity={OP} strokeWidth="1" {...draw(controls, 0.45, 0.6)} />
      <motion.circle cx={296} cy={41} r={5} stroke={S} strokeOpacity={OP} strokeWidth="0.9" {...draw(controls, 0.55, 0.4)} />
      {[170, 220, 270].map((x, i) => (
        <motion.circle key={i} cx={x} cy={165} r={4} stroke={S} strokeOpacity={OP} strokeWidth="0.9" {...draw(controls, 0.75, 0.3)} />
      ))}
      {/* camera on tripod */}
      <motion.rect x={186} y={22} width={68} height={46} rx={5} stroke={S} strokeOpacity={OP} strokeWidth="1.2" {...draw(controls, 0.3, 1.0)} />
      <motion.circle cx={220} cy={45} r={14} stroke={S} strokeOpacity={OP} strokeWidth="1.1" {...draw(controls, 0.45, 0.9)} />
      <motion.circle cx={220} cy={45} r={7} stroke={S} strokeOpacity={OP} strokeWidth="0.8" {...draw(controls, 0.55, 0.7)} />
      <motion.rect x={196} y={15} width={18} height={9} rx={2} stroke={S} strokeOpacity={OP} strokeWidth="0.9" {...draw(controls, 0.38, 0.6)} />

      {/* ── Aperture — center ── */}
      <motion.circle cx={720} cy={90} r={54} stroke={S} strokeOpacity={OP} strokeWidth="1.3" {...draw(controls, 0.2, 1.5)} />
      <motion.circle cx={720} cy={90} r={40} stroke={S} strokeOpacity={OP} strokeWidth="1.0" {...draw(controls, 0.35, 1.2)} />
      {/* 6 aperture blades */}
      {[0, 60, 120, 180, 240, 300].map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        const x1 = r(720 + 40 * Math.cos(rad));
        const y1 = r(90 + 40 * Math.sin(rad));
        const x2 = r(720 + 28 * Math.cos(rad + 0.9));
        const y2 = r(90 + 28 * Math.sin(rad + 0.9));
        const x3 = r(720 + 12 * Math.cos(rad + 0.45));
        const y3 = r(90 + 12 * Math.sin(rad + 0.45));
        return (
          <motion.path key={i} d={`M ${x1} ${y1} Q ${x2} ${y2} ${x3} ${y3}`}
            stroke={S} strokeOpacity={OP} strokeWidth="1.0"
            {...draw(controls, 0.4 + i * 0.07, 0.8)} />
        );
      })}
      <motion.circle cx={720} cy={90} r={6} stroke={S} strokeOpacity={OP} strokeWidth="0.8" {...draw(controls, 0.9, 0.5)} />
      {/* f-stop ticks */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        return (
          <motion.line key={i}
            x1={r(720 + 46 * Math.cos(rad))} y1={r(90 + 46 * Math.sin(rad))}
            x2={r(720 + 54 * Math.cos(rad))} y2={r(90 + 54 * Math.sin(rad))}
            stroke={S} strokeOpacity={OP} strokeWidth="0.8"
            {...draw(controls, 0.6 + i * 0.04, 0.4)} />
        );
      })}

      {/* ── Light meter (right) ── */}
      <motion.rect x={1160} y={28} width={120} height={112} rx={8} stroke={S} strokeOpacity={OP} strokeWidth="1.3" {...draw(controls, 0.3, 1.2)} />
      <motion.path d="M 1186 112 A 40 40 0 0 1 1264 112" stroke={S} strokeOpacity={OP} strokeWidth="1.1" {...draw(controls, 0.5, 1.0)} />
      <motion.line x1={1220} y1={112} x2={1242} y2={78} stroke={S} strokeOpacity={OP} strokeWidth="1.2" {...draw(controls, 0.72, 0.8)} />
      <motion.circle cx={1220} cy={112} r={3} stroke={S} strokeOpacity={OP} strokeWidth="0.9" {...draw(controls, 0.68, 0.4)} />
      {[-40, -20, 0, 20, 40].map((deg, i) => {
        const rad = ((deg + 90) * Math.PI) / 180;
        return (
          <motion.line key={i}
            x1={r(1220 + 36 * Math.cos(rad))} y1={r(112 - 36 * Math.sin(rad))}
            x2={r(1220 + 40 * Math.cos(rad))} y2={r(112 - 40 * Math.sin(rad))}
            stroke={S} strokeOpacity={OP} strokeWidth="0.8"
            {...draw(controls, 0.75 + i * 0.04, 0.3)} />
        );
      })}
      <motion.path d="M 1175 55 H 1225" stroke={S} strokeOpacity={OP} strokeWidth="0.7" {...draw(controls, 0.4, 0.6)} />
      <motion.path d="M 1175 65 H 1215" stroke={S} strokeOpacity={OP * 0.5} strokeWidth="0.6" {...draw(controls, 0.45, 0.5)} />
      <motion.rect x={1195} y={28} width={50} height={12} rx={3} stroke={S} strokeOpacity={OP} strokeWidth="0.9" {...draw(controls, 0.35, 0.7)} />

      {/* ── Dashed guide lines across width ── */}
      <motion.path d="M 360 90 H 620" stroke={S} strokeOpacity={OP * 0.4} strokeWidth="0.6" strokeDasharray="6 8" {...draw(controls, 1.0, 1.2)} />
      <motion.path d="M 820 90 H 1100" stroke={S} strokeOpacity={OP * 0.4} strokeWidth="0.6" strokeDasharray="6 8" {...draw(controls, 1.0, 1.2)} />

      {/* ── Crosshair loupes ── */}
      {[480, 960].map((cx, ci) => (
        <g key={ci}>
          <motion.circle cx={cx} cy={90} r={16} stroke={S} strokeOpacity={OP * 0.55} strokeWidth="0.8" {...draw(controls, 0.9, 0.8)} />
          <motion.line x1={cx} y1={68} x2={cx} y2={112} stroke={S} strokeOpacity={OP * 0.4} strokeWidth="0.6" {...draw(controls, 0.95, 0.6)} />
          <motion.line x1={cx - 20} y1={90} x2={cx + 20} y2={90} stroke={S} strokeOpacity={OP * 0.4} strokeWidth="0.6" {...draw(controls, 0.95, 0.6)} />
        </g>
      ))}
    </svg>
  );
}
