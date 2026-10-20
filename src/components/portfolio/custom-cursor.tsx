"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * Custom cursor — a small dot with a trailing ring that scales / morphs
 * when hovering interactive elements. Disabled on touch devices.
 */
export default function CustomCursor() {
  const [hovering, setHovering] = useState(false);
  const [hidden, setHidden] = useState(true);
  const [label, setLabel] = useState<string | null>(null);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 30, stiffness: 400, mass: 0.5 };
  const ringX = useSpring(cursorX, springConfig);
  const ringY = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Skip on touch devices
    if (window.matchMedia("(hover: none)").matches) return;

    const move = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      setHidden(false);
    };

    const over = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;
      const interactive = target.closest(
        "a, button, [data-cursor='hover'], input, textarea, select, label, [role='button']"
      );
      if (interactive) {
        setHovering(true);
        const customLabel = interactive.getAttribute("data-cursor-label");
        setLabel(customLabel);
      } else {
        setHovering(false);
        setLabel(null);
      }
    };

    const leave = () => setHidden(true);

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    document.documentElement.addEventListener("mouseleave", leave);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      document.documentElement.removeEventListener("mouseleave", leave);
    };
  }, [cursorX, cursorY]);

  if (typeof window !== "undefined" && window.matchMedia("(hover: none)").matches) {
    return null;
  }

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[10000] hidden md:block"
      style={{ opacity: hidden ? 0 : 1, transition: "opacity 0.2s" }}
    >
      {/* Center dot */}
      <motion.div
        className="fixed top-0 left-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary"
        style={{
          x: cursorX,
          y: cursorY,
        }}
      />
      {/* Trailing ring */}
      <motion.div
        className="fixed top-0 left-0 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-primary/60"
        style={{
          x: ringX,
          y: ringY,
          width: hovering ? 80 : 32,
          height: hovering ? 80 : 32,
        }}
        transition={{
          width: { duration: 0.25, ease: [0.16, 1, 0.3, 1] },
          height: { duration: 0.25, ease: [0.16, 1, 0.3, 1] },
        }}
      >
        {label && (
          <span className="font-sans text-[9px] uppercase tracking-[0.2em] text-primary">
            {label}
          </span>
        )}
      </motion.div>
    </div>
  );
}
